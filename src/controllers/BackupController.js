const { shell } = require("electron");
const BackupService = require("../services/BackupService");

class BackupController {
    async listar() {
        try {
            return { sucesso: true, backups: await BackupService.listar() };
        } catch (erro) {
            console.error("Erro ao listar backups:", erro.message);
            return { sucesso: false, mensagem: "Erro ao listar backups.", backups: [] };
        }
    }

    async criarManual() {
        try {
            return await BackupService.criarBackupManual();
        } catch (erro) {
            console.error("Erro ao criar backup manual:", erro.message);
            return { sucesso: false, mensagem: "Erro ao criar backup manual." };
        }
    }

    async restaurar(id) {
        try {
            return await BackupService.restaurar(id);
        } catch (erro) {
            console.error("Erro ao restaurar backup:", erro.message);
            return { sucesso: false, mensagem: "Erro ao restaurar backup." };
        }
    }

    async abrirPasta() {
        try {
            await shell.openPath(BackupService.obterPastaBackupsPublica());
            return { sucesso: true };
        } catch (erro) {
            console.error("Erro ao abrir pasta de backups:", erro.message);
            return { sucesso: false, mensagem: "Erro ao abrir pasta de backups." };
        }
    }
}

module.exports = new BackupController();