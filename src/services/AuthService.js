const bcrypt = require("bcryptjs");
const UsuarioRepository = require("../repositories/UsuarioRepository");

class AuthService {
    async login(dadosLogin) {
        const { usuario, senha } = dadosLogin;

        if (!usuario || !senha) {
            return {
                sucesso: false,
                mensagem: "Informe usuário e senha.",
            };
        }

        const usuarioEncontrado = await UsuarioRepository.buscarPorUsuario(usuario);

        if (!usuarioEncontrado) {
            return {
                sucesso: false,
                mensagem: "Usuário ou senha inválidos.",
            };
        }

        if (usuarioEncontrado.ativo !== 1) {
            return {
                sucesso: false,
                mensagem: "Usuário inativo. Procure o administrador.",
            };
        }

        const senhaValida = await bcrypt.compare(senha, usuarioEncontrado.senha);

        if (!senhaValida) {
            return {
                sucesso: false,
                mensagem: "Usuário ou senha inválidos.",
            };
        }

        return {
            sucesso: true,
            mensagem: "Login realizado com sucesso.",
            usuario: {
                id: usuarioEncontrado.id,
                nome: usuarioEncontrado.nome,
                usuario: usuarioEncontrado.usuario,
                tipo: usuarioEncontrado.tipo,
            },
        };
    }

    async validarSenhaAdmin(senha) {
        if (!senha) {
            return { sucesso: false, mensagem: "Informe a senha administrativa." };
        }

        const admins = await UsuarioRepository.buscarAdmins();

        for (const admin of admins) {
            const senhaValida = await bcrypt.compare(senha, admin.senha);

            if (senhaValida) {
                return { sucesso: true, mensagem: "Senha administrativa válida." };
            }
        }

        return { sucesso: false, mensagem: "Senha administrativa incorreta." };
    }
}

module.exports = new AuthService();