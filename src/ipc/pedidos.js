const { ipcMain } = require("electron");
const PedidoController = require("../controllers/PedidoController");

ipcMain.handle("pedidos:listar", async () => {
    return await PedidoController.listar();
});

ipcMain.handle("pedidos:buscarPorId", async (event, id) => {
    return await PedidoController.buscarPorId(id);
});

ipcMain.handle("pedidos:salvar", async (event, dados) => {
    return await PedidoController.salvar(dados);
});

ipcMain.handle("pedidos:atualizar", async (event, dados) => {
    return await PedidoController.atualizar(dados);
});

ipcMain.handle("pedidos:atualizarStatus", async (event, dados) => {
    return await PedidoController.atualizarStatus(dados);
});

ipcMain.handle("pedidos:cancelar", async (event, id) => {
    return await PedidoController.cancelar(id);
});