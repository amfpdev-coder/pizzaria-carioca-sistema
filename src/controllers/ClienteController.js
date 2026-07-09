const ClienteService = require("../services/ClienteService");

class ClienteController {
    async listar() {
        try {
            const clientes = await ClienteService.listar();

            return {
                sucesso: true,
                clientes,
            };
        } catch (erro) {
            console.error("Erro ao listar clientes:", erro.message);

            return {
                sucesso: false,
                mensagem: "Erro ao listar clientes.",
                clientes: [],
            };
        }
    }

    async salvar(cliente) {
        try {
            return await ClienteService.salvar(cliente);
        } catch (erro) {
            console.error("Erro ao salvar cliente:", erro.message);

            return {
                sucesso: false,
                mensagem: "Erro ao salvar cliente.",
            };
        }
    }

    async atualizar(cliente) {
        try {
            return await ClienteService.atualizar(cliente);
        } catch (erro) {
            console.error("Erro ao atualizar cliente:", erro.message);

            return {
                sucesso: false,
                mensagem: "Erro ao atualizar cliente.",
            };
        }
    }

    async inativar(id) {
        try {
            return await ClienteService.inativar(id);
        } catch (erro) {
            console.error("Erro ao inativar cliente:", erro.message);

            return {
                sucesso: false,
                mensagem: "Erro ao inativar cliente.",
            };
        }
    }

    async excluir(id) {
        try {
            return await ClienteService.excluir(id);
        } catch (erro) {
            console.error("Erro ao excluir cliente:", erro.message);

            return {
                sucesso: false,
                mensagem: "Erro ao excluir cliente.",
            };
        }
    }
}

module.exports = new ClienteController();