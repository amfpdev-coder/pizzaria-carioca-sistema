const PedidoRepository = require("../repositories/PedidoRepository");
const CaixaService = require("./CaixaService");
const { obterDataHoraLocal } = require("../../database/dataHoraLocal");

class PedidoService {
    async listar() {
        return await PedidoRepository.listar();
    }

    async buscarPorId(id) {
        return await PedidoRepository.buscarPorId(Number(id));
    }

    validarPedido(pedido, itens) {
        if (!pedido.cliente_id) {
            return { valido: false, mensagem: "Selecione um cliente para o pedido." };
        }

        if (!itens || itens.length === 0) {
            return { valido: false, mensagem: "Adicione pelo menos um item ao pedido." };
        }

        if (!pedido.forma_pagamento) {
            return { valido: false, mensagem: "Selecione a forma de pagamento." };
        }

        const forma = pedido.forma_pagamento;

        if (forma.includes("+")) {
            const partes = forma.split("+");

            const mapaValores = {
                Pix: Number(pedido.valor_pix) || 0,
                Dinheiro: Number(pedido.valor_dinheiro) || 0,
                Cartão: Number(pedido.valor_cartao) || 0,
            };

            for (const parte of partes) {
                if (!mapaValores[parte] || mapaValores[parte] <= 0) {
                    return { valido: false, mensagem: `Informe o valor pago em ${parte}.` };
                }
            }
        }

        return { valido: true };
    }

    calcularTotais(itens, taxaEntrega) {
        const subtotal = itens.reduce((soma, item) => soma + Number(item.valor_total), 0);
        const total = subtotal + Number(taxaEntrega || 0);

        return {
            subtotal: Number(subtotal.toFixed(2)),
            total: Number(total.toFixed(2)),
        };
    }

    calcularPagamentos(pedido, total) {
        const forma = pedido.forma_pagamento || "";
        const ehMisto = forma.includes("+");

        let valor_pix = 0;
        let valor_dinheiro = 0;
        let valor_cartao = 0;
        const valor_recebido = Number(pedido.valor_recebido) || 0;
        let troco = 0;

        if (ehMisto) {
            valor_pix = Number(pedido.valor_pix) || 0;
            valor_dinheiro = Number(pedido.valor_dinheiro) || 0;
            valor_cartao = Number(pedido.valor_cartao) || 0;

            if (forma.includes("Dinheiro") && valor_recebido > 0) {
                troco = Math.max(0, Number((valor_recebido - valor_dinheiro).toFixed(2)));
            }
        } else {
            if (forma === "Pix") valor_pix = total;
            if (forma === "Dinheiro") {
                valor_dinheiro = total;
                if (valor_recebido > 0) {
                    troco = Math.max(0, Number((valor_recebido - total).toFixed(2)));
                }
            }
            if (forma === "Cartão") valor_cartao = total;
        }

        return {
            valor_pix: Number(valor_pix.toFixed(2)),
            valor_dinheiro: Number(valor_dinheiro.toFixed(2)),
            valor_cartao: Number(valor_cartao.toFixed(2)),
            valor_recebido: Number(valor_recebido.toFixed(2)),
            troco,
        };
    }

    async sincronizarVendaComCaixa(pedido) {
        const resposta = await CaixaService.registrarVendaPedido(pedido);

        if (!resposta.sucesso) {
            return resposta.mensagem;
        }

        return null;
    }

    async salvar(pedido, itens) {
        const validacao = this.validarPedido(pedido, itens);

        if (!validacao.valido) {
            return { sucesso: false, mensagem: validacao.mensagem };
        }

        const totais = this.calcularTotais(itens, pedido.taxa_entrega);
        const pagamentos = this.calcularPagamentos(pedido, totais.total);

        const pedidoPreparado = {
            cliente_id: Number(pedido.cliente_id),
            usuario_id: Number(pedido.usuario_id),
            status: pedido.status || "Aberto",
            forma_pagamento: pedido.forma_pagamento,
            taxa_entrega: Number(pedido.taxa_entrega) || 0,
            subtotal: totais.subtotal,
            total: totais.total,
            valor_pix: pagamentos.valor_pix,
            valor_dinheiro: pagamentos.valor_dinheiro,
            valor_cartao: pagamentos.valor_cartao,
            valor_recebido: pagamentos.valor_recebido,
            troco: pagamentos.troco,
            observacao: pedido.observacao || "",
            descricao_complementar: pedido.descricao_complementar || "",
            criado_em: obterDataHoraLocal(),
        };

        const pedidoSalvo = await PedidoRepository.criar(pedidoPreparado, itens);

        let avisoCaixa = null;

        if (pedidoSalvo.status === "Finalizado") {
            avisoCaixa = await this.sincronizarVendaComCaixa(pedidoSalvo);
        }

        return {
            sucesso: true,
            mensagem: avisoCaixa
                ? `Pedido criado com sucesso. ${avisoCaixa}`
                : "Pedido criado com sucesso.",
            pedido: pedidoSalvo,
        };
    }

    async atualizar(pedido, itens) {
        const validacao = this.validarPedido(pedido, itens);

        if (!validacao.valido) {
            return { sucesso: false, mensagem: validacao.mensagem };
        }

        const pedidoAnterior = await PedidoRepository.buscarPorId(Number(pedido.id));

        if (!pedidoAnterior) {
            return { sucesso: false, mensagem: "Pedido não encontrado." };
        }

        const totais = this.calcularTotais(itens, pedido.taxa_entrega);
        const pagamentos = this.calcularPagamentos(pedido, totais.total);

        const pedidoPreparado = {
            id: Number(pedido.id),
            cliente_id: Number(pedido.cliente_id),
            status: pedido.status || "Aberto",
            forma_pagamento: pedido.forma_pagamento,
            taxa_entrega: Number(pedido.taxa_entrega) || 0,
            subtotal: totais.subtotal,
            total: totais.total,
            valor_pix: pagamentos.valor_pix,
            valor_dinheiro: pagamentos.valor_dinheiro,
            valor_cartao: pagamentos.valor_cartao,
            valor_recebido: pagamentos.valor_recebido,
            troco: pagamentos.troco,
            observacao: pedido.observacao || "",
            descricao_complementar: pedido.descricao_complementar || "",
            finalizado_em: pedido.status === "Finalizado"
                ? (pedidoAnterior.finalizado_em || obterDataHoraLocal())
                : null,
        };

        await PedidoRepository.atualizar(pedidoPreparado, itens);

        let avisoCaixa = null;

        if (pedidoPreparado.status === "Finalizado") {
            avisoCaixa = await this.sincronizarVendaComCaixa(pedidoPreparado);
        } else {
            await CaixaService.registrarVendaPedido(pedidoPreparado);
        }

        return {
            sucesso: true,
            mensagem: avisoCaixa
                ? `Pedido atualizado com sucesso. ${avisoCaixa}`
                : "Pedido atualizado com sucesso.",
            pedido: pedidoPreparado,
        };
    }

    async atualizarStatus(id, status) {
        const pedidoAnterior = await PedidoRepository.buscarPorId(Number(id));

        if (!pedidoAnterior) {
            return { sucesso: false, mensagem: "Pedido não encontrado." };
        }

        const finalizadoEm = status === "Finalizado"
            ? (pedidoAnterior.finalizado_em || obterDataHoraLocal())
            : null;

        await PedidoRepository.atualizarStatus(Number(id), status, finalizadoEm);

        const pedidoAtualizado = {
            ...pedidoAnterior,
            status,
            finalizado_em: finalizadoEm,
        };

        let avisoCaixa = null;

        if (status === "Finalizado") {
            avisoCaixa = await this.sincronizarVendaComCaixa(pedidoAtualizado);
        } else {
            await CaixaService.registrarVendaPedido(pedidoAtualizado);
        }

        return {
            sucesso: true,
            mensagem: avisoCaixa
                ? `Pedido atualizado para "${status}". ${avisoCaixa}`
                : `Pedido atualizado para "${status}".`,
        };
    }

    async cancelar(id) {
        await PedidoRepository.atualizarStatus(Number(id), "Cancelado", null);

        await CaixaService.registrarVendaPedido({
            id: Number(id),
            status: "Cancelado",
        });

        return {
            sucesso: true,
            mensagem: "Pedido cancelado.",
        };
    }
}

module.exports = new PedidoService();