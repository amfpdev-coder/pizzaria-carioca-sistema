const bcrypt = require("bcryptjs");
const UsuarioRepository = require("../repositories/UsuarioRepository");

class UsuarioService {
    async listar() {
        return await UsuarioRepository.listar();
    }

    async criar(dados) {
        if (!dados.nome?.trim())
            return { sucesso: false, mensagem: "Informe o nome do usuário." };

        if (!dados.usuario?.trim())
            return { sucesso: false, mensagem: "Informe o login do usuário." };

        if (!dados.senha || dados.senha.length < 4)
            return { sucesso: false, mensagem: "A senha deve ter pelo menos 4 caracteres." };

        if (!["admin", "atendente"].includes(dados.tipo))
            return { sucesso: false, mensagem: "Tipo de usuário inválido." };

        const existente = await UsuarioRepository.buscarPorUsuario(dados.usuario.trim());
        if (existente)
            return { sucesso: false, mensagem: "Já existe um usuário com esse login." };

        const senhaHash = await bcrypt.hash(dados.senha, 10);

        await UsuarioRepository.criar({
            nome: dados.nome.trim(),
            usuario: dados.usuario.trim().toLowerCase(),
            senha: senhaHash,
            tipo: dados.tipo,
        });

        return { sucesso: true, mensagem: "Usuário cadastrado com sucesso." };
    }

    async atualizar(dados) {
        if (!dados.nome?.trim())
            return { sucesso: false, mensagem: "Informe o nome do usuário." };

        if (!dados.usuario?.trim())
            return { sucesso: false, mensagem: "Informe o login do usuário." };

        if (!["admin", "atendente"].includes(dados.tipo))
            return { sucesso: false, mensagem: "Tipo de usuário inválido." };

        const usuario = await UsuarioRepository.buscarPorId(Number(dados.id));
        if (!usuario)
            return { sucesso: false, mensagem: "Usuário não encontrado." };

        const existente = await UsuarioRepository.buscarPorUsuario(dados.usuario.trim());
        if (existente && Number(existente.id) !== Number(dados.id))
            return { sucesso: false, mensagem: "Já existe um usuário com esse login." };

        if (usuario.tipo === "admin" && dados.tipo === "atendente") {
            const totalAdmins = await UsuarioRepository.contarAdminsAtivos();
            if (totalAdmins <= 1)
                return { sucesso: false, mensagem: "Não é possível rebaixar o único administrador ativo." };
        }

        await UsuarioRepository.atualizar({
            id: Number(dados.id),
            nome: dados.nome.trim(),
            usuario: dados.usuario.trim().toLowerCase(),
            tipo: dados.tipo,
        });

        return { sucesso: true, mensagem: "Usuário atualizado com sucesso." };
    }

    async trocarSenha(id, novaSenha) {
        if (!novaSenha || novaSenha.length < 4)
            return { sucesso: false, mensagem: "A nova senha deve ter pelo menos 4 caracteres." };

        const senhaHash = await bcrypt.hash(novaSenha, 10);
        await UsuarioRepository.atualizarSenha(Number(id), senhaHash);

        return { sucesso: true, mensagem: "Senha alterada com sucesso." };
    }

    async inativar(id, adminId) {
        if (Number(id) === Number(adminId))
            return { sucesso: false, mensagem: "Você não pode inativar sua própria conta." };

        const usuario = await UsuarioRepository.buscarPorId(Number(id));
        if (!usuario)
            return { sucesso: false, mensagem: "Usuário não encontrado." };

        if (usuario.tipo === "admin") {
            const totalAdmins = await UsuarioRepository.contarAdminsAtivos();
            if (totalAdmins <= 1)
                return { sucesso: false, mensagem: "Não é possível inativar o único administrador ativo." };
        }

        await UsuarioRepository.inativar(Number(id));
        return { sucesso: true, mensagem: "Usuário inativado com sucesso." };
    }

    async reativar(id) {
        await UsuarioRepository.reativar(Number(id));
        return { sucesso: true, mensagem: "Usuário reativado com sucesso." };
    }
}

module.exports = new UsuarioService();