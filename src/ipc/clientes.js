const { ipcMain } = require("electron");
const ClienteController = require("../controllers/ClienteController");

ipcMain.handle("clientes:listar", async () => {
    return await ClienteController.listar();
});

ipcMain.handle("clientes:salvar", async (event, cliente) => {
    return await ClienteController.salvar(cliente);
});

ipcMain.handle("clientes:atualizar", async (event, cliente) => {
    return await ClienteController.atualizar(cliente);
});

ipcMain.handle("clientes:inativar", async (event, id) => {
    return await ClienteController.inativar(id);
});

ipcMain.handle("clientes:excluir", async (event, id) => {
    return await ClienteController.excluir(id);
});