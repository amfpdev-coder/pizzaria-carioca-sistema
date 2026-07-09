const db = require("../../database/connection");

class UsuarioRepository {
    buscarPorUsuario(usuario) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT id, nome, usuario, senha, tipo, ativo
                FROM usuarios
                WHERE usuario = ?
                LIMIT 1
            `;
            db.get(sql, [usuario], (erro, row) => {
                if (erro) { reject(erro); return; }
                resolve(row);
            });
        });
    }

    buscarAdmins() {
        return new Promise((resolve, reject) => {
            const sql = `SELECT id, nome, usuario, senha FROM usuarios WHERE tipo = 'admin' AND ativo = 1`;
            db.all(sql, [], (erro, rows) => {
                if (erro) { reject(erro); return; }
                resolve(rows);
            });
        });
    }

    listar() {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT id, nome, usuario, tipo, ativo, criado_em
                FROM usuarios
                ORDER BY tipo ASC, nome ASC
            `;
            db.all(sql, [], (erro, rows) => {
                if (erro) { reject(erro); return; }
                resolve(rows);
            });
        });
    }

    buscarPorId(id) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT id, nome, usuario, tipo, ativo FROM usuarios WHERE id = ?`;
            db.get(sql, [id], (erro, row) => {
                if (erro) { reject(erro); return; }
                resolve(row);
            });
        });
    }

    criar(usuario) {
        return new Promise((resolve, reject) => {
            const sql = `
                INSERT INTO usuarios (nome, usuario, senha, tipo, ativo)
                VALUES (?, ?, ?, ?, 1)
            `;
            db.run(sql, [usuario.nome, usuario.usuario, usuario.senha, usuario.tipo], function (erro) {
                if (erro) { reject(erro); return; }
                resolve({ id: this.lastID, ...usuario });
            });
        });
    }

    atualizar(usuario) {
        return new Promise((resolve, reject) => {
            const sql = `UPDATE usuarios SET nome = ?, usuario = ?, tipo = ? WHERE id = ?`;
            db.run(sql, [usuario.nome, usuario.usuario, usuario.tipo, usuario.id], (erro) => {
                if (erro) { reject(erro); return; }
                resolve(true);
            });
        });
    }

    atualizarSenha(id, senhaHash) {
        return new Promise((resolve, reject) => {
            const sql = `UPDATE usuarios SET senha = ? WHERE id = ?`;
            db.run(sql, [senhaHash, id], (erro) => {
                if (erro) { reject(erro); return; }
                resolve(true);
            });
        });
    }

    inativar(id) {
        return new Promise((resolve, reject) => {
            db.run(`UPDATE usuarios SET ativo = 0 WHERE id = ?`, [id], (erro) => {
                if (erro) { reject(erro); return; }
                resolve(true);
            });
        });
    }

    reativar(id) {
        return new Promise((resolve, reject) => {
            db.run(`UPDATE usuarios SET ativo = 1 WHERE id = ?`, [id], (erro) => {
                if (erro) { reject(erro); return; }
                resolve(true);
            });
        });
    }

    contarAdminsAtivos() {
        return new Promise((resolve, reject) => {
            db.get(`SELECT COUNT(*) as total FROM usuarios WHERE tipo = 'admin' AND ativo = 1`, [], (erro, row) => {
                if (erro) { reject(erro); return; }
                resolve(row.total);
            });
        });
    }
}

module.exports = new UsuarioRepository();