const { ipcMain } = require("electron");
const AuthController = require("../controllers/AuthController");

ipcMain.handle("auth:login", async (event, dadosLogin) => {
    return await AuthController.login(dadosLogin);
});

ipcMain.handle("auth:validarSenhaAdmin", async (event, senha) => {
    return await AuthController.validarSenhaAdmin(senha);
});