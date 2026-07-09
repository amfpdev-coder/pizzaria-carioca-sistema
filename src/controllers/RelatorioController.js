const RelatorioService = require("../services/RelatorioService");

class RelatorioController {
    async relatorioDiario(data) {
        try {
            return { sucesso: true, ...(await RelatorioService.relatorioDiario(data)) };
        } catch (erro) {
            console.error("Erro ao gerar relatório diário:", erro.message);
            return { sucesso: false, mensagem: "Erro ao gerar relatório diário." };
        }
    }

    async relatorioMensal(mes) {
        try {
            return { sucesso: true, ...(await RelatorioService.relatorioMensal(mes)) };
        } catch (erro) {
            console.error("Erro ao gerar relatório mensal:", erro.message);
            return { sucesso: false, mensagem: "Erro ao gerar relatório mensal." };
        }
    }
}

module.exports = new RelatorioController();