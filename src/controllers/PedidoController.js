const PedidoService = require("../services/PedidoService");

class PedidoController {
    async listar() {
        try {
            return {
                sucesso: true,
                pedidos: await PedidoService.listar(),
            };
        } catch (erro) {
            console.error("Erro ao listar pedidos:", erro.message);
            return { sucesso: false, mensagem: "Erro ao listar pedidos.", pedidos: [] };
        }
    }

    async buscarPorId(id) {
        try {
            const pedido = await PedidoService.buscarPorId(id);

            if (!pedido) {
                return { sucesso: false, mensagem: "Pedido não encontrado." };
            }

            return { sucesso: true, pedido };
        } catch (erro) {
            console.error("Erro ao buscar pedido:", erro.message);
            return { sucesso: false, mensagem: "Erro ao buscar pedido." };
        }
    }

    async salvar(dados) {
        try {
            return await PedidoService.salvar(dados.pedido, dados.itens);
        } catch (erro) {
            console.error("Erro ao salvar pedido:", erro.message);
            return { sucesso: false, mensagem: "Erro ao salvar pedido." };
        }
    }

    async atualizar(dados) {
        try {
            return await PedidoService.atualizar(dados.pedido, dados.itens);
        } catch (erro) {
            console.error("Erro ao atualizar pedido:", erro.message);
            return { sucesso: false, mensagem: "Erro ao atualizar pedido." };
        }
    }

    async atualizarStatus(dados) {
        try {
            return await PedidoService.atualizarStatus(dados.id, dados.status);
        } catch (erro) {
            console.error("Erro ao atualizar status do pedido:", erro.message);
            return { sucesso: false, mensagem: "Erro ao atualizar status do pedido." };
        }
    }

    async cancelar(id) {
        try {
            return await PedidoService.cancelar(id);
        } catch (erro) {
            console.error("Erro ao cancelar pedido:", erro.message);
            return { sucesso: false, mensagem: "Erro ao cancelar pedido." };
        }
    }
}

module.exports = new PedidoController();