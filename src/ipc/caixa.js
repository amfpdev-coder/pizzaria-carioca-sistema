const { ipcMain } = require("electron");
const CaixaController = require("../controllers/CaixaController");

ipcMain.handle("caixa:status", async () => {
    return await CaixaController.obterStatusAtual();
});

ipcMain.handle("caixa:abrir", async (event, dados) => {
    return await CaixaController.abrir(dados);
});

ipcMain.handle("caixa:fechar", async (event, dados) => {
    return await CaixaController.fechar(dados);
});

ipcMain.handle("caixa:registrarMovimentacao", async (event, dados) => {
    return await CaixaController.registrarMovimentacao(dados);
});

ipcMain.handle("caixa:excluirMovimentacao", async (event, id) => {
    return await CaixaController.excluirMovimentacao(id);
});

ipcMain.handle("caixa:listarHistorico", async () => {
    return await CaixaController.listarHistorico();
});

ipcMain.handle("caixa:buscarDetalheHistorico", async (event, id) => {
    return await CaixaController.buscarDetalheHistorico(id);
});