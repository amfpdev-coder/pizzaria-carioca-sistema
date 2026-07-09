const CaixaService = require("../services/CaixaService");

class CaixaController {
    async obterStatusAtual() {
        try {
            return { sucesso: true, ...(await CaixaService.obterStatusAtual()) };
        } catch (erro) {
            console.error("Erro ao obter status do caixa:", erro.message);
            return { sucesso: false, mensagem: "Erro ao obter status do caixa." };
        }
    }

    async abrir(dados) {
        try {
            return await CaixaService.abrir(dados);
        } catch (erro) {
            console.error("Erro ao abrir caixa:", erro.message);
            return { sucesso: false, mensagem: "Erro ao abrir caixa." };
        }
    }

    async fechar(dados) {
        try {
            return await CaixaService.fechar(dados.id, dados);
        } catch (erro) {
            console.error("Erro ao fechar caixa:", erro.message);
            return { sucesso: false, mensagem: "Erro ao fechar caixa." };
        }
    }

    async registrarMovimentacao(dados) {
        try {
            return await CaixaService.registrarMovimentacao(dados);
        } catch (erro) {
            console.error("Erro ao registrar movimentação:", erro.message);
            return { sucesso: false, mensagem: "Erro ao registrar movimentação." };
        }
    }

    async excluirMovimentacao(id) {
        try {
            return await CaixaService.excluirMovimentacao(id);
        } catch (erro) {
            console.error("Erro ao excluir movimentação:", erro.message);
            return { sucesso: false, mensagem: "Erro ao excluir movimentação." };
        }
    }

    async listarHistorico() {
        try {
            return { sucesso: true, historico: await CaixaService.listarHistorico() };
        } catch (erro) {
            console.error("Erro ao listar histórico do caixa:", erro.message);
            return { sucesso: false, mensagem: "Erro ao listar histórico.", historico: [] };
        }
    }

    async buscarDetalheHistorico(id) {
        try {
            const detalhe = await CaixaService.buscarDetalheHistorico(id);

            if (!detalhe) {
                return { sucesso: false, mensagem: "Registro não encontrado." };
            }

            return { sucesso: true, detalhe };
        } catch (erro) {
            console.error("Erro ao buscar detalhe do histórico:", erro.message);
            return { sucesso: false, mensagem: "Erro ao buscar detalhe do histórico." };
        }
    }
}

module.exports = new CaixaController();