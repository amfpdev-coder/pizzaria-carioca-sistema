const AuthService = require("../services/AuthService");

class AuthController {
    async login(dadosLogin) {
        try {
            return await AuthService.login(dadosLogin);
        } catch (erro) {
            console.error("Erro no login:", erro.message);

            return {
                sucesso: false,
                mensagem: "Erro interno ao tentar fazer login.",
            };
        }
    }

    async validarSenhaAdmin(senha) {
        try {
            return await AuthService.validarSenhaAdmin(senha);
        } catch (erro) {
            console.error("Erro ao validar senha administrativa:", erro.message);

            return {
                sucesso: false,
                mensagem: "Erro ao validar senha administrativa.",
            };
        }
    }
}

module.exports = new AuthController();