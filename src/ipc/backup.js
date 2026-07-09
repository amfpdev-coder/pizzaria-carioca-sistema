const { ipcMain } = require("electron");
const BackupController = require("../controllers/BackupController");

ipcMain.handle("backup:listar", async () => {
    return await BackupController.listar();
});

ipcMain.handle("backup:criarManual", async () => {
    return await BackupController.criarManual();
});

ipcMain.handle("backup:restaurar", async (event, id) => {
    return await BackupController.restaurar(id);
});

ipcMain.handle("backup:abrirPasta", async () => {
    return await BackupController.abrirPasta();
});