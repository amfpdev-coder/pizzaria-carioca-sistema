const { ipcMain } = require("electron");
const UsuarioController = require("../controllers/UsuarioController");

ipcMain.handle("usuarios:listar", async () => {
    return await UsuarioController.listar();
});

ipcMain.handle("usuarios:criar", async (event, dados) => {
    return await UsuarioController.criar(dados);
});

ipcMain.handle("usuarios:atualizar", async (event, dados) => {
    return await UsuarioController.atualizar(dados);
});

ipcMain.handle("usuarios:trocarSenha", async (event, dados) => {
    return await UsuarioController.trocarSenha(dados);
});

ipcMain.handle("usuarios:inativar", async (event, dados) => {
    return await UsuarioController.inativar(dados);
});

ipcMain.handle("usuarios:reativar", async (event, id) => {
    return await UsuarioController.reativar(id);
});