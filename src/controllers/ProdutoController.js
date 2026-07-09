const ProdutoService = require("../services/ProdutoService");

class ProdutoController {
    async listarSabores() {
        try {
            return {
                sucesso: true,
                sabores: await ProdutoService.listarSabores(),
            };
        } catch (erro) {
            console.error("Erro ao listar sabores:", erro.message);
            return { sucesso: false, mensagem: "Erro ao listar sabores.", sabores: [] };
        }
    }

    async salvarSabor(sabor) {
        try {
            return await ProdutoService.salvarSabor(sabor);
        } catch (erro) {
            console.error("Erro ao salvar sabor:", erro.message);
            return { sucesso: false, mensagem: "Erro ao salvar sabor." };
        }
    }

    async atualizarSabor(sabor) {
        try {
            return await ProdutoService.atualizarSabor(sabor);
        } catch (erro) {
            console.error("Erro ao atualizar sabor:", erro.message);
            return { sucesso: false, mensagem: "Erro ao atualizar sabor." };
        }
    }

    async inativarSabor(id) {
        try {
            return await ProdutoService.inativarSabor(id);
        } catch (erro) {
            console.error("Erro ao inativar sabor:", erro.message);
            return { sucesso: false, mensagem: "Erro ao inativar sabor." };
        }
    }

    async excluirSabor(id) {
        try {
            return await ProdutoService.excluirSabor(id);
        } catch (erro) {
            console.error("Erro ao excluir sabor:", erro.message);
            return { sucesso: false, mensagem: "Erro ao excluir sabor." };
        }
    }

    async listarCombos() {
        try {
            return {
                sucesso: true,
                combos: await ProdutoService.listarCombos(),
            };
        } catch (erro) {
            console.error("Erro ao listar combos:", erro.message);
            return { sucesso: false, mensagem: "Erro ao listar combos.", combos: [] };
        }
    }

    async salvarCombo(combo) {
        try {
            return await ProdutoService.salvarCombo(combo);
        } catch (erro) {
            console.error("Erro ao salvar combo:", erro.message);
            return { sucesso: false, mensagem: "Erro ao salvar combo." };
        }
    }

    async atualizarCombo(combo) {
        try {
            return await ProdutoService.atualizarCombo(combo);
        } catch (erro) {
            console.error("Erro ao atualizar combo:", erro.message);
            return { sucesso: false, mensagem: "Erro ao atualizar combo." };
        }
    }

    async inativarCombo(id) {
        try {
            return await ProdutoService.inativarCombo(id);
        } catch (erro) {
            console.error("Erro ao inativar combo:", erro.message);
            return { sucesso: false, mensagem: "Erro ao inativar combo." };
        }
    }

    async excluirCombo(id) {
        try {
            return await ProdutoService.excluirCombo(id);
        } catch (erro) {
            console.error("Erro ao excluir combo:", erro.message);
            return { sucesso: false, mensagem: "Erro ao excluir combo." };
        }
    }

    async listarTamanhos() {
        try {
            return {
                sucesso: true,
                tamanhos: await ProdutoService.listarTamanhos(),
            };
        } catch (erro) {
            console.error("Erro ao listar tamanhos:", erro.message);
            return { sucesso: false, mensagem: "Erro ao listar tamanhos.", tamanhos: [] };
        }
    }

    async salvarTamanho(tamanho) {
        try {
            return await ProdutoService.salvarTamanho(tamanho);
        } catch (erro) {
            console.error("Erro ao salvar tamanho:", erro.message);
            return { sucesso: false, mensagem: "Erro ao salvar tamanho." };
        }
    }

    async atualizarTamanho(tamanho) {
        try {
            return await ProdutoService.atualizarTamanho(tamanho);
        } catch (erro) {
            console.error("Erro ao atualizar tamanho:", erro.message);
            return { sucesso: false, mensagem: "Erro ao atualizar tamanho." };
        }
    }

    async inativarTamanho(id) {
        try {
            return await ProdutoService.inativarTamanho(id);
        } catch (erro) {
            console.error("Erro ao inativar tamanho:", erro.message);
            return { sucesso: false, mensagem: "Erro ao inativar tamanho." };
        }
    }

    async excluirTamanho(id) {
        try {
            return await ProdutoService.excluirTamanho(id);
        } catch (erro) {
            console.error("Erro ao excluir tamanho:", erro.message);
            return { sucesso: false, mensagem: "Erro ao excluir tamanho." };
        }
    }

    async listarBebidas() {
        try {
            return {
                sucesso: true,
                bebidas: await ProdutoService.listarBebidas(),
            };
        } catch (erro) {
            console.error("Erro ao listar bebidas:", erro.message);
            return { sucesso: false, mensagem: "Erro ao listar bebidas.", bebidas: [] };
        }
    }

    async salvarBebida(bebida) {
        try {
            return await ProdutoService.salvarBebida(bebida);
        } catch (erro) {
            console.error("Erro ao salvar bebida:", erro.message);
            return { sucesso: false, mensagem: "Erro ao salvar bebida." };
        }
    }

    async atualizarBebida(bebida) {
        try {
            return await ProdutoService.atualizarBebida(bebida);
        } catch (erro) {
            console.error("Erro ao atualizar bebida:", erro.message);
            return { sucesso: false, mensagem: "Erro ao atualizar bebida." };
        }
    }

    async inativarBebida(id) {
        try {
            return await ProdutoService.inativarBebida(id);
        } catch (erro) {
            console.error("Erro ao inativar bebida:", erro.message);
            return { sucesso: false, mensagem: "Erro ao inativar bebida." };
        }
    }

    async excluirBebida(id) {
        try {
            return await ProdutoService.excluirBebida(id);
        } catch (erro) {
            console.error("Erro ao excluir bebida:", erro.message);
            return { sucesso: false, mensagem: "Erro ao excluir bebida." };
        }
    }

    async listarAdicionais() {
        try {
            return {
                sucesso: true,
                adicionais: await ProdutoService.listarAdicionais(),
            };
        } catch (erro) {
            console.error("Erro ao listar adicionais:", erro.message);

            return {
                sucesso: false,
                mensagem: "Erro ao listar adicionais.",
                adicionais: [],
            };
        }
    }

    async salvarAdicional(adicional) {
        try {
            return await ProdutoService.salvarAdicional(adicional);
        } catch (erro) {
            console.error("Erro ao salvar adicional:", erro.message);

            return {
                sucesso: false,
                mensagem: "Erro ao salvar adicional.",
            };
        }
    }

    async atualizarAdicional(adicional) {
        try {
            return await ProdutoService.atualizarAdicional(adicional);
        } catch (erro) {
            console.error("Erro ao atualizar adicional:", erro.message);

            return {
                sucesso: false,
                mensagem: "Erro ao atualizar adicional.",
            };
        }
    }

    async inativarAdicional(id) {
        try {
            return await ProdutoService.inativarAdicional(id);
        } catch (erro) {
            console.error("Erro ao inativar adicional:", erro.message);

            return {
                sucesso: false,
                mensagem: "Erro ao inativar adicional.",
            };
        }
    }

    async excluirAdicional(id) {
        try {
            return await ProdutoService.excluirAdicional(id);
        } catch (erro) {
            console.error("Erro ao excluir adicional:", erro.message);

            return {
                sucesso: false,
                mensagem: "Erro ao excluir adicional.",
            };
        }
    }

    async listarPrecosCategoria() {
        try {
            return {
                sucesso: true,
                precos: await ProdutoService.listarPrecosCategoria(),
            };
        } catch (erro) {
            console.error("Erro ao listar preços por categoria:", erro.message);
            return { sucesso: false, mensagem: "Erro ao listar preços por categoria.", precos: [] };
        }
    }

    async salvarPrecoCategoria(preco) {
        try {
            return await ProdutoService.salvarPrecoCategoria(preco);
        } catch (erro) {
            console.error("Erro ao salvar preço por categoria:", erro.message);
            return { sucesso: false, mensagem: "Erro ao salvar preço por categoria." };
        }
    }

    async atualizarPrecoCategoria(preco) {
        try {
            return await ProdutoService.atualizarPrecoCategoria(preco);
        } catch (erro) {
            console.error("Erro ao atualizar preço por categoria:", erro.message);
            return { sucesso: false, mensagem: "Erro ao atualizar preço por categoria." };
        }
    }

    async excluirPrecoCategoria(id) {
        try {
            return await ProdutoService.excluirPrecoCategoria(id);
        } catch (erro) {
            console.error("Erro ao excluir preço por categoria:", erro.message);
            return { sucesso: false, mensagem: "Erro ao excluir preço por categoria." };
        }
    }

    async obterAcrescimoCartao() {
        try {
            return await ProdutoService.obterAcrescimoCartao();
        } catch (erro) {
            console.error("Erro ao obter acréscimo do cartão:", erro.message);
            return { sucesso: false, mensagem: "Erro ao obter acréscimo do cartão." };
        }
    }

    async salvarAcrescimoCartao(valor) {
        try {
            return await ProdutoService.salvarAcrescimoCartao(valor);
        } catch (erro) {
            console.error("Erro ao salvar acréscimo do cartão:", erro.message);
            return { sucesso: false, mensagem: "Erro ao salvar acréscimo do cartão." };
        }
    }
}

module.exports = new ProdutoController();