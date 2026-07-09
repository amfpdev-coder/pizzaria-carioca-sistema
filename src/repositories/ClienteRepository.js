const db = require("../../database/connection");

class ClienteRepository {
    listar() {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT
                    id,
                    nome_completo,
                    telefone,
                    endereco,
                    numero,
                    complemento,
                    bairro,
                    ponto_referencia,
                    ativo
                FROM clientes
                ORDER BY id DESC
            `;

            db.all(sql, [], (erro, rows) => {
                if (erro) {
                    reject(erro);
                    return;
                }

                resolve(rows);
            });
        });
    }

    salvar(cliente) {
        return new Promise((resolve, reject) => {
            const sql = `
                INSERT INTO clientes (
                    nome_completo,
                    telefone,
                    endereco,
                    numero,
                    complemento,
                    bairro,
                    ponto_referencia,
                    ativo
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const parametros = [
                cliente.nome_completo,
                cliente.telefone,
                cliente.endereco,
                cliente.numero,
                cliente.complemento,
                cliente.bairro,
                cliente.ponto_referencia,
                cliente.ativo,
            ];

            db.run(sql, parametros, function (erro) {
                if (erro) {
                    reject(erro);
                    return;
                }

                resolve({
                    id: this.lastID,
                    ...cliente,
                });
            });
        });
    }

    atualizar(cliente) {
        return new Promise((resolve, reject) => {
            const sql = `
                UPDATE clientes
                SET
                    nome_completo = ?,
                    telefone = ?,
                    endereco = ?,
                    numero = ?,
                    complemento = ?,
                    bairro = ?,
                    ponto_referencia = ?,
                    ativo = ?
                WHERE id = ?
            `;

            const parametros = [
                cliente.nome_completo,
                cliente.telefone,
                cliente.endereco,
                cliente.numero,
                cliente.complemento,
                cliente.bairro,
                cliente.ponto_referencia,
                cliente.ativo,
                cliente.id,
            ];

            db.run(sql, parametros, function (erro) {
                if (erro) {
                    reject(erro);
                    return;
                }

                resolve(cliente);
            });
        });
    }

    inativar(id) {
        return new Promise((resolve, reject) => {
            const sql = `
                UPDATE clientes
                SET ativo = 0
                WHERE id = ?
            `;

            db.run(sql, [id], function (erro) {
                if (erro) {
                    reject(erro);
                    return;
                }

                resolve(true);
            });
        });
    }

    contarPedidos(id) {
        return new Promise((resolve, reject) => {
            db.get("SELECT COUNT(*) AS total FROM pedidos WHERE cliente_id = ?", [id], (erro, row) => {
                if (erro) {
                    reject(erro);
                    return;
                }

                resolve(row.total);
            });
        });
    }

    excluir(id) {
        return new Promise((resolve, reject) => {
            db.run("DELETE FROM clientes WHERE id = ?", [id], (erro) => {
                if (erro) {
                    reject(erro);
                    return;
                }

                resolve(true);
            });
        });
    }
}

module.exports = new ClienteRepository();