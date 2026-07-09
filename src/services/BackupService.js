const fs = require("fs");
const path = require("path");
const BackupRepository = require("../repositories/BackupRepository");
const { obterCaminhoBanco, obterPastaBackups } = require("../../database/backupPaths");
const { obterDataHoraLocal } = require("../../database/dataHoraLocal");

class BackupService {
    gerarNomeArquivo(tipo) {
        const agora = new Date();
        const pad = (n) => String(n).padStart(2, "0");

        const timestamp =
            `${agora.getFullYear()}${pad(agora.getMonth() + 1)}${pad(agora.getDate())}` +
            `_${pad(agora.getHours())}${pad(agora.getMinutes())}${pad(agora.getSeconds())}`;

        const prefixos = {
            "Automático": "auto",
            "Manual": "manual",
            "Restauração": "seguranca",
        };

        return `${prefixos[tipo] || "backup"}_${timestamp}.db`;
    }

    async criarBackup(tipo) {
        const nomeArquivo = this.gerarNomeArquivo(tipo);
        const caminhoDestino = path.join(obterPastaBackups(), nomeArquivo);

        fs.copyFileSync(obterCaminhoBanco(), caminhoDestino);

        return await BackupRepository.registrar(tipo, caminhoDestino, obterDataHoraLocal());
    }

    async executarBackupAutomaticoSeNecessario() {
        try {
            const jaExisteHoje = await BackupRepository.buscarUltimoAutomaticoHoje();

            if (jaExisteHoje) {
                return;
            }

            await this.criarBackup("Automático");
            console.log("Backup automático criado com sucesso.");
        } catch (erro) {
            console.error("Erro ao criar backup automático:", erro.message);
        }
    }

    async criarBackupManual() {
        const backup = await this.criarBackup("Manual");
        return { sucesso: true, mensagem: "Backup manual criado com sucesso.", backup };
    }

    async listar() {
        const lista = await BackupRepository.listar();

        return lista.map((item) => ({
            ...item,
            nome_arquivo: path.basename(item.caminho_arquivo),
        }));
    }

    async restaurar(id) {
        const registro = await BackupRepository.buscarPorId(id);

        if (!registro) {
            return { sucesso: false, mensagem: "Backup não encontrado." };
        }

        if (!fs.existsSync(registro.caminho_arquivo)) {
            return { sucesso: false, mensagem: "Arquivo de backup não encontrado no disco." };
        }

        // Cria um backup de segurança do estado atual antes de sobrescrever
        await this.criarBackup("Restauração");

        fs.copyFileSync(registro.caminho_arquivo, obterCaminhoBanco());

        return {
            sucesso: true,
            mensagem: "Backup restaurado com sucesso. Reinicie o sistema para aplicar as mudanças.",
        };
    }

    obterPastaBackupsPublica() {
        return obterPastaBackups();
    }
}

module.exports = new BackupService();