const db = require("../../database/connection");
const { obterDataLocalISO } = require("../../database/dataHoraLocal");

class BackupRepository {
    listar() {
        return new Promise((resolve, reject) => {
            db.all("SELECT * FROM historico_backup ORDER BY criado_em DESC", [], (erro, rows) => {
                if (erro) {
                    reject(erro);
                    return;
                }

                resolve(rows);
            });
        });
    }

    registrar(tipo, caminhoArquivo, criadoEm) {
        return new Promise((resolve, reject) => {
            const sql = "INSERT INTO historico_backup (tipo, caminho_arquivo, criado_em) VALUES (?, ?, ?)";

            db.run(sql, [tipo, caminhoArquivo, criadoEm], function (erro) {
                if (erro) {
                    reject(erro);
                    return;
                }

                resolve({ id: this.lastID, tipo, caminho_arquivo: caminhoArquivo });
            });
        });
    }

    buscarUltimoAutomaticoHoje() {
        return new Promise((resolve, reject) => {
            const hoje = obterDataLocalISO();
            const sql = `
                SELECT * FROM historico_backup
                WHERE tipo = 'Automático' AND substr(criado_em, 1, 10) = ?
                LIMIT 1
            `;

            db.get(sql, [hoje], (erro, row) => {
                if (erro) {
                    reject(erro);
                    return;
                }

                resolve(row || null);
            });
        });
    }

    buscarPorId(id) {
        return new Promise((resolve, reject) => {
            db.get("SELECT * FROM historico_backup WHERE id = ?", [id], (erro, row) => {
                if (erro) {
                    reject(erro);
                    return;
                }

                resolve(row || null);
            });
        });
    }
}

module.exports = new BackupRepository();