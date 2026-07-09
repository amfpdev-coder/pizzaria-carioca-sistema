const CaixaRepository = require("../repositories/CaixaRepository");
const { obterDataHoraLocal } = require("../../database/dataHoraLocal");

class CaixaService {
    calcularTotais(movimentacoes) {
        const totalEntradas = movimentacoes
            .filter((m) => m.tipo === "Entrada")
            .reduce((soma, m) => soma + Number(m.valor), 0);

        const totalSaidas = movimentacoes
            .filter((m) => m.tipo === "Saída")
            .reduce((soma, m) => soma + Number(m.valor), 0);

        return { totalEntradas, totalSaidas };
    }

    async obterStatusAtual() {
        const caixaAberto = await CaixaRepository.buscarCaixaAberto();

        if (!caixaAberto) {
            return { aberto: false };
        }

        const movimentacoes = await CaixaRepository.listarMovimentacoes(caixaAberto.id);
        const { totalEntradas, totalSaidas } = this.calcularTotais(movimentacoes);

        return {
            aberto: true,
            caixa: caixaAberto,
            movimentacoes,
            totalEntradas: Number(totalEntradas.toFixed(2)),
            totalSaidas: Number(totalSaidas.toFixed(2)),
            saldoAtual: Number((Number(caixaAberto.valor_inicial) + totalEntradas - totalSaidas).toFixed(2)),
        };
    }

    async abrir(dados) {
        const caixaJaAberto = await CaixaRepository.buscarCaixaAberto();

        if (caixaJaAberto) {
            return { sucesso: false, mensagem: "Já existe um caixa aberto. Feche-o antes de abrir outro." };
        }

        if (dados.valor_inicial === undefined || dados.valor_inicial === null || Number(dados.valor_inicial) < 0) {
            return { sucesso: false, mensagem: "Informe um valor inicial válido." };
        }

        const caixa = await CaixaRepository.abrir({
            usuario_abertura_id: Number(dados.usuario_abertura_id),
            valor_inicial: Number(dados.valor_inicial),
            observacao: dados.observacao || "",
            data_abertura: obterDataHoraLocal(),
        });

        return { sucesso: true, mensagem: "Caixa aberto com sucesso.", caixa };
    }

    async fechar(id, dados) {
        const status = await this.obterStatusAtual();

        if (!status.aberto || Number(status.caixa.id) !== Number(id)) {
            return { sucesso: false, mensagem: "Este caixa não está mais aberto." };
        }

        if (dados.valor_final === undefined || dados.valor_final === null || Number(dados.valor_final) < 0) {
            return { sucesso: false, mensagem: "Informe o valor final contado." };
        }

        const saldoEsperado = status.saldoAtual;
        const valorFinal = Number(dados.valor_final);
        const divergencia = Number((valorFinal - saldoEsperado).toFixed(2));

        const observacaoExistente = status.caixa.observacao || "";
        const observacaoFechamento = dados.observacao
            ? `${observacaoExistente ? observacaoExistente + " | " : ""}Fechamento: ${dados.observacao}`
            : observacaoExistente;

        await CaixaRepository.fechar(id, {
            valor_final: valorFinal,
            usuario_fechamento_id: Number(dados.usuario_fechamento_id),
            observacao: observacaoFechamento,
            data_fechamento: obterDataHoraLocal(),
        });

        let mensagem = "Caixa fechado com sucesso.";

        if (divergencia !== 0) {
            const tipoDivergencia = divergencia > 0 ? "sobra" : "falta";
            mensagem += ` Atenção: ${tipoDivergencia} de ${formatarMoedaServidor(Math.abs(divergencia))} em relação ao saldo esperado.`;
        }

        return { sucesso: true, mensagem, divergencia };
    }

    async registrarMovimentacao(dados) {
        const status = await this.obterStatusAtual();

        if (!status.aberto) {
            return { sucesso: false, mensagem: "Abra o caixa antes de registrar movimentações." };
        }

        if (!dados.descricao || dados.descricao.trim() === "") {
            return { sucesso: false, mensagem: "Informe uma descrição." };
        }

        if (!dados.valor || Number(dados.valor) <= 0) {
            return { sucesso: false, mensagem: "Informe um valor válido." };
        }

        const movimentacao = await CaixaRepository.criarMovimentacao({
            caixa_id: status.caixa.id,
            pedido_id: dados.pedido_id || null,
            tipo: dados.tipo,
            descricao: dados.descricao.trim(),
            valor: Number(dados.valor),
            forma_pagamento: dados.forma_pagamento || null,
            criado_em: obterDataHoraLocal(),
        });

        return { sucesso: true, mensagem: "Movimentação registrada.", movimentacao };
    }

    async registrarVendaPedido(pedido) {
        if (!pedido || !pedido.id) {
            return { sucesso: false, mensagem: "Pedido inválido para registrar venda no caixa." };
        }

        // Pedido não finalizado — remove qualquer movimentação existente
        if (pedido.status !== "Finalizado") {
            await CaixaRepository.excluirMovimentacaoPorPedidoId(Number(pedido.id));
            return { sucesso: true, mensagem: "Pedido não finalizado. Movimentação removida, se existia." };
        }

        const status = await this.obterStatusAtual();

        if (!status.aberto) {
            return {
                sucesso: false,
                mensagem: "Pedido finalizado, mas não foi lançado no caixa porque não há caixa aberto.",
            };
        }

        const pedidoId = Number(pedido.id);
        const forma = pedido.forma_pagamento || "";
        const ehMisto = forma.includes("+");

        // Sempre apaga e recria — garante consistência em edições
        await CaixaRepository.excluirMovimentacaoPorPedidoId(pedidoId);

        if (ehMisto) {
            // Pagamento misto: cria uma movimentação para cada meio
            const partes = forma.split("+");

            const mapaValores = {
                Pix: Number(pedido.valor_pix) || 0,
                Dinheiro: Number(pedido.valor_dinheiro) || 0,
                Cartão: Number(pedido.valor_cartao) || 0,
            };

            for (const parte of partes) {
                const valor = mapaValores[parte] || 0;

                if (valor <= 0) continue;

                await CaixaRepository.criarMovimentacao({
                    caixa_id: status.caixa.id,
                    pedido_id: pedidoId,
                    tipo: "Entrada",
                    descricao: `Venda Pedido #${pedidoId} (${parte})`,
                    valor,
                    forma_pagamento: parte,
                    criado_em: obterDataHoraLocal(),
                });
            }
        } else {
            // Pagamento único
            const valor = Number(pedido.total) || 0;

            if (valor <= 0) {
                return { sucesso: false, mensagem: "Pedido finalizado, mas o valor total é inválido." };
            }

            await CaixaRepository.criarMovimentacao({
                caixa_id: status.caixa.id,
                pedido_id: pedidoId,
                tipo: "Entrada",
                descricao: `Venda Pedido #${pedidoId}`,
                valor,
                forma_pagamento: forma || null,
                criado_em: obterDataHoraLocal(),
            });
        }

        return { sucesso: true, mensagem: "Venda do pedido registrada no caixa." };
    }

    async excluirMovimentacao(id) {
        await CaixaRepository.excluirMovimentacao(id);
        return { sucesso: true, mensagem: "Movimentação excluída." };
    }

    async listarHistorico() {
        return await CaixaRepository.listarHistorico();
    }

    async buscarDetalheHistorico(id) {
        return await CaixaRepository.buscarDetalheHistorico(Number(id));
    }
}

function formatarMoedaServidor(valor) {
    return Number(valor || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

module.exports = new CaixaService();