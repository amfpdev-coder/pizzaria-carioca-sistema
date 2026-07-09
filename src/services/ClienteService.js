const ClienteRepository = require("../repositories/ClienteRepository");

class ClienteService {
    async listar() {
        return await ClienteRepository.listar();
    }

    validar(cliente) {
        if (!cliente.nome_completo || cliente.nome_completo.trim() === "") {
            return {
                valido: false,
                mensagem: "Informe o nome completo do cliente.",
            };
        }

        return {
            valido: true,
        };
    }

    prepararDados(cliente) {
        return {
            nome_completo: cliente.nome_completo?.trim() || "",
            telefone: cliente.telefone?.trim() || "",
            endereco: cliente.endereco?.trim() || "",
            numero: cliente.numero?.trim() || "",
            complemento: cliente.complemento?.trim() || "",
            bairro: cliente.bairro?.trim() || "",
            ponto_referencia: cliente.ponto_referencia?.trim() || "",
            ativo: Number(cliente.ativo),
        };
    }

    async salvar(cliente) {
        const validacao = this.validar(cliente);

        if (!validacao.valido) {
            return {
                sucesso: false,
                mensagem: validacao.mensagem,
            };
        }

        const clienteSalvo = await ClienteRepository.salvar(
            this.prepararDados(cliente)
        );

        return {
            sucesso: true,
            mensagem: "Cliente cadastrado com sucesso.",
            cliente: clienteSalvo,
        };
    }

    async atualizar(cliente) {
        if (!cliente.id) {
            return {
                sucesso: false,
                mensagem: "Cliente não identificado para edição.",
            };
        }

        const validacao = this.validar(cliente);

        if (!validacao.valido) {
            return {
                sucesso: false,
                mensagem: validacao.mensagem,
            };
        }

        const clienteAtualizado = await ClienteRepository.atualizar({
            id: Number(cliente.id),
            ...this.prepararDados(cliente),
        });

        return {
            sucesso: true,
            mensagem: "Cliente atualizado com sucesso.",
            cliente: clienteAtualizado,
        };
    }

    async inativar(id) {
        if (!id) {
            return {
                sucesso: false,
                mensagem: "Cliente não identificado.",
            };
        }

        await ClienteRepository.inativar(Number(id));

        return {
            sucesso: true,
            mensagem: "Cliente inativado com sucesso.",
        };
    }

    async excluir(id) {
        if (!id) {
            return {
                sucesso: false,
                mensagem: "Cliente não identificado.",
            };
        }

        const totalPedidos = await ClienteRepository.contarPedidos(Number(id));

        if (totalPedidos > 0) {
            return {
                sucesso: false,
                mensagem: "Este cliente já possui pedidos registrados e não pode ser excluído. Use Inativar.",
            };
        }

        await ClienteRepository.excluir(Number(id));

        return {
            sucesso: true,
            mensagem: "Cliente excluído com sucesso.",
        };
    }
}

module.exports = new ClienteService();