const UsuarioService = require("../services/UsuarioService");

class UsuarioController {
    async listar() {
        try {
            return { sucesso: true, usuarios: await UsuarioService.listar() };
        } catch (erro) {
            console.error("Erro ao listar usuários:", erro.message);
            return { sucesso: false, mensagem: "Erro ao listar usuários.", usuarios: [] };
        }
    }

    async criar(dados) {
        try {
            return await UsuarioService.criar(dados);
        } catch (erro) {
            console.error("Erro ao criar usuário:", erro.message);
            return { sucesso: false, mensagem: "Erro ao criar usuário." };
        }
    }

    async atualizar(dados) {
        try {
            return await UsuarioService.atualizar(dados);
        } catch (erro) {
            console.error("Erro ao atualizar usuário:", erro.message);
            return { sucesso: false, mensagem: "Erro ao atualizar usuário." };
        }
    }

    async trocarSenha(dados) {
        try {
            return await UsuarioService.trocarSenha(dados.id, dados.novaSenha);
        } catch (erro) {
            console.error("Erro ao trocar senha:", erro.message);
            return { sucesso: false, mensagem: "Erro ao trocar senha." };
        }
    }

    async inativar(dados) {
        try {
            return await UsuarioService.inativar(dados.id, dados.adminId);
        } catch (erro) {
            console.error("Erro ao inativar usuário:", erro.message);
            return { sucesso: false, mensagem: "Erro ao inativar usuário." };
        }
    }

    async reativar(id) {
        try {
            return await UsuarioService.reativar(id);
        } catch (erro) {
            console.error("Erro ao reativar usuário:", erro.message);
            return { sucesso: false, mensagem: "Erro ao reativar usuário." };
        }
    }
}

module.exports = new UsuarioController();