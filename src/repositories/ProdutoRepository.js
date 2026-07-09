const db = require("../../database/connection");

class ProdutoRepository {
    listarSabores() {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT id, nome, categoria, descricao, imagem, preco_pix, ativo
                FROM sabores
                ORDER BY id DESC
            `;

            db.all(sql, [], (erro, rows) => {
                if (erro) reject(erro);
                else resolve(rows);
            });
        });
    }

    salvarSabor(sabor) {
        return new Promise((resolve, reject) => {
            const sql = `
                INSERT INTO sabores (nome, categoria, descricao, imagem, preco_pix, ativo)
                VALUES (?, ?, ?, ?, ?, ?)
            `;

            db.run(sql, [
                sabor.nome,
                sabor.categoria,
                sabor.descricao,
                sabor.imagem,
                sabor.preco_pix,
                sabor.ativo,
            ], function (erro) {
                if (erro) reject(erro);
                else resolve({ id: this.lastID, ...sabor });
            });
        });
    }

    atualizarSabor(sabor) {
        return new Promise((resolve, reject) => {
            const sql = `
                UPDATE sabores
                SET nome = ?, categoria = ?, descricao = ?, imagem = ?, preco_pix = ?, ativo = ?
                WHERE id = ?
            `;

            db.run(sql, [
                sabor.nome,
                sabor.categoria,
                sabor.descricao,
                sabor.imagem,
                sabor.preco_pix,
                sabor.ativo,
                sabor.id,
            ], (erro) => {
                if (erro) reject(erro);
                else resolve(sabor);
            });
        });
    }

    inativarSabor(id) {
        return new Promise((resolve, reject) => {
            db.run("UPDATE sabores SET ativo = 0 WHERE id = ?", [id], (erro) => {
                if (erro) reject(erro);
                else resolve(true);
            });
        });
    }

    excluirSabor(id) {
        return new Promise((resolve, reject) => {
            db.run("DELETE FROM sabores WHERE id = ?", [id], (erro) => {
                if (erro) reject(erro);
                else resolve(true);
            });
        });
    }

/* ==========================================================
    COMBOS
========================================================== */

    listarCombos() {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT
                    id,
                    nome,
                    descricao,
                    preco_pix_dinheiro,
                    preco_cartao,
                    imagem,
                    ativo
                FROM combos
                ORDER BY id DESC
            `;

            db.all(sql, [], (erro, rows) => {
                if (erro) reject(erro);
                else resolve(rows);
            });
        });
    }

    salvarCombo(combo) {
        return new Promise((resolve, reject) => {
            const sql = `
                INSERT INTO combos (
                    nome,
                    descricao,
                    preco_pix_dinheiro,
                    imagem,
                    ativo
                )
                VALUES (?, ?, ?, ?, ?)
            `;

            db.run(
                sql,
                [
                    combo.nome,
                    combo.descricao,
                    combo.preco_pix_dinheiro,
                    combo.imagem,
                    combo.ativo,
                ],
                function (erro) {
                    if (erro) reject(erro);
                    else resolve({ id: this.lastID, ...combo });
                }
            );
        });
    }

    atualizarCombo(combo) {
        return new Promise((resolve, reject) => {
            const sql = `
                UPDATE combos
                SET
                    nome = ?,
                    descricao = ?,
                    preco_pix_dinheiro = ?,
                    imagem = ?,
                    ativo = ?
                WHERE id = ?
            `;

            db.run(
                sql,
                [
                    combo.nome,
                    combo.descricao,
                    combo.preco_pix_dinheiro,
                    combo.imagem,
                    combo.ativo,
                    combo.id,
                ],
                (erro) => {
                    if (erro) reject(erro);
                    else resolve(combo);
                }
            );
        });
    }

    inativarCombo(id) {
        return new Promise((resolve, reject) => {
            db.run(
                "UPDATE combos SET ativo = 0 WHERE id = ?",
                [id],
                (erro) => {
                    if (erro) reject(erro);
                    else resolve(true);
                }
            );
        });
    }

    excluirCombo(id) {
        return new Promise((resolve, reject) => {
            db.run(
                "DELETE FROM combos WHERE id = ?",
                [id],
                (erro) => {
                    if (erro) reject(erro);
                    else resolve(true);
                }
            );
        });
    }

    contarUsosCombo(id) {
        return new Promise((resolve, reject) => {
            db.get(
                "SELECT COUNT(*) AS total FROM itens_pedido WHERE combo_id = ?",
                [id],
                (erro, row) => {
                    if (erro) reject(erro);
                    else resolve(row.total);
                }
            );
        });
    }

    listarTamanhos() {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT id, nome, fatias, ativo
                FROM tamanhos
                ORDER BY id DESC
            `;

            db.all(sql, [], (erro, rows) => {
                if (erro) reject(erro);
                else resolve(rows);
            });
        });
    }

    salvarTamanho(tamanho) {
        return new Promise((resolve, reject) => {
            const sql = `
                INSERT INTO tamanhos (nome, fatias, ativo)
                VALUES (?, ?, ?)
            `;

            db.run(sql, [
                tamanho.nome,
                tamanho.fatias,
                tamanho.ativo,
            ], function (erro) {
                if (erro) reject(erro);
                else resolve({ id: this.lastID, ...tamanho });
            });
        });
    }

    atualizarTamanho(tamanho) {
        return new Promise((resolve, reject) => {
            const sql = `
                UPDATE tamanhos
                SET nome = ?, fatias = ?, ativo = ?
                WHERE id = ?
            `;

            db.run(sql, [
                tamanho.nome,
                tamanho.fatias,
                tamanho.ativo,
                tamanho.id,
            ], (erro) => {
                if (erro) reject(erro);
                else resolve(tamanho);
            });
        });
    }

    inativarTamanho(id) {
        return new Promise((resolve, reject) => {
            db.run("UPDATE tamanhos SET ativo = 0 WHERE id = ?", [id], (erro) => {
                if (erro) reject(erro);
                else resolve(true);
            });
        });
    }

    excluirTamanho(id) {
        return new Promise((resolve, reject) => {
            db.run("DELETE FROM tamanhos WHERE id = ?", [id], (erro) => {
                if (erro) reject(erro);
                else resolve(true);
            });
        });
    }

    listarBebidas() {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT
                id,
                nome,
                categoria,
                volume,
                preco,
                ativo
            FROM bebidas
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

    salvarBebida(bebida) {
    return new Promise((resolve, reject) => {
        const sql = `
            INSERT INTO bebidas (
                nome,
                categoria,
                volume,
                preco,
                ativo
            ) VALUES (?, ?, ?, ?, ?)
        `;

        db.run(sql, [
            bebida.nome,
            bebida.categoria,
            bebida.volume,
            bebida.preco,
            bebida.ativo,
        ], function (erro) {
            if (erro) {
                reject(erro);
                return;
            }

            resolve({
                id: this.lastID,
                ...bebida,
            });
        });
    });
}

    atualizarBebida(bebida) {
    return new Promise((resolve, reject) => {
        const sql = `
            UPDATE bebidas
            SET
                nome = ?,
                categoria = ?,
                volume = ?,
                preco = ?,
                ativo = ?
            WHERE id = ?
        `;

        db.run(sql, [
            bebida.nome,
            bebida.categoria,
            bebida.volume,
            bebida.preco,
            bebida.ativo,
            bebida.id,
        ], (erro) => {
            if (erro) {
                reject(erro);
                return;
            }

            resolve(bebida);
        });
    });
}

    inativarBebida(id) {
        return new Promise((resolve, reject) => {
            db.run("UPDATE bebidas SET ativo = 0 WHERE id = ?", [id], (erro) => {
                if (erro) reject(erro);
                else resolve(true);
            });
        });
    }

        excluirBebida(id) {
        return new Promise((resolve, reject) => {
            db.run("DELETE FROM bebidas WHERE id = ?", [id], (erro) => {
                if (erro) reject(erro);
                else resolve(true);
            });
        });
    }

    listarAdicionais() {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT id, nome, preco, ativo
                FROM adicionais
                ORDER BY id DESC
            `;

            db.all(sql, [], (erro, rows) => {
                if (erro) reject(erro);
                else resolve(rows);
            });
        });
    }

    salvarAdicional(adicional) {
        return new Promise((resolve, reject) => {
            const sql = `
                INSERT INTO adicionais (nome, preco, ativo)
                VALUES (?, ?, ?)
            `;

            db.run(sql, [
                adicional.nome,
                adicional.preco,
                adicional.ativo,
            ], function (erro) {
                if (erro) reject(erro);
                else resolve({ id: this.lastID, ...adicional });
            });
        });
    }

    atualizarAdicional(adicional) {
        return new Promise((resolve, reject) => {
            const sql = `
                UPDATE adicionais
                SET nome = ?, preco = ?, ativo = ?
                WHERE id = ?
            `;

            db.run(sql, [
                adicional.nome,
                adicional.preco,
                adicional.ativo,
                adicional.id,
            ], (erro) => {
                if (erro) reject(erro);
                else resolve(adicional);
            });
        });
    }

    inativarAdicional(id) {
        return new Promise((resolve, reject) => {
            db.run("UPDATE adicionais SET ativo = 0 WHERE id = ?", [id], (erro) => {
                if (erro) reject(erro);
                else resolve(true);
            });
        });
    }

    excluirAdicional(id) {
        return new Promise((resolve, reject) => {
            db.run("DELETE FROM adicionais WHERE id = ?", [id], (erro) => {
                if (erro) reject(erro);
                else resolve(true);
            });
        });
    }

    contarUsosSabor(id) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT COUNT(*) AS total FROM itens_pedido
                WHERE sabor_1_id = ? OR sabor_2_id = ? OR sabor_3_id = ?
            `;

            db.get(sql, [id, id, id], (erro, row) => {
                if (erro) reject(erro);
                else resolve(row.total);
            });
        });
    }

    contarUsosTamanho(id) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT
                    (SELECT COUNT(*) FROM precos_categoria WHERE tamanho_id = ?) +
                    (SELECT COUNT(*) FROM itens_pedido WHERE tamanho_id = ?) AS total
            `;

            db.get(sql, [id, id], (erro, row) => {
                if (erro) reject(erro);
                else resolve(row.total);
            });
        });
    }

    contarUsosBebida(id) {
        return new Promise((resolve, reject) => {
            db.get("SELECT COUNT(*) AS total FROM itens_pedido WHERE bebida_id = ?", [id], (erro, row) => {
                if (erro) reject(erro);
                else resolve(row.total);
            });
        });
    }

    contarUsosAdicional(id) {
        return new Promise((resolve, reject) => {
            db.get("SELECT COUNT(*) AS total FROM itens_pedido WHERE adicional_id = ?", [id], (erro, row) => {
                if (erro) reject(erro);
                else resolve(row.total);
            });
        });
    }

    /* ==========================================================
        PREÇOS POR CATEGORIA (pizza Tradicional)
       ========================================================== */

    listarPrecosCategoria() {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT
                    precos_categoria.id,
                    precos_categoria.tamanho_id,
                    precos_categoria.tipo_pizza,
                    precos_categoria.preco_pix,
                    tamanhos.nome AS tamanho_nome
                FROM precos_categoria
                INNER JOIN tamanhos ON tamanhos.id = precos_categoria.tamanho_id
                ORDER BY tamanhos.nome ASC, precos_categoria.tipo_pizza ASC
            `;

            db.all(sql, [], (erro, rows) => {
                if (erro) reject(erro);
                else resolve(rows);
            });
        });
    }

    salvarPrecoCategoria(preco) {
        return new Promise((resolve, reject) => {
            const sql = `
                INSERT INTO precos_categoria (tamanho_id, tipo_pizza, preco_pix)
                VALUES (?, ?, ?)
            `;

            db.run(sql, [preco.tamanho_id, preco.tipo_pizza, preco.preco_pix], function (erro) {
                if (erro) reject(erro);
                else resolve({ id: this.lastID, ...preco });
            });
        });
    }

    atualizarPrecoCategoria(preco) {
        return new Promise((resolve, reject) => {
            const sql = `
                UPDATE precos_categoria
                SET tamanho_id = ?, tipo_pizza = ?, preco_pix = ?
                WHERE id = ?
            `;

            db.run(sql, [preco.tamanho_id, preco.tipo_pizza, preco.preco_pix, preco.id], (erro) => {
                if (erro) reject(erro);
                else resolve(preco);
            });
        });
    }

    excluirPrecoCategoria(id) {
        return new Promise((resolve, reject) => {
            db.run("DELETE FROM precos_categoria WHERE id = ?", [id], (erro) => {
                if (erro) reject(erro);
                else resolve(true);
            });
        });
    }

    /* ==========================================================
        CONFIGURAÇÕES
       ========================================================== */

    obterConfiguracao(chave) {
        return new Promise((resolve, reject) => {
            db.get("SELECT valor FROM configuracoes WHERE chave = ?", [chave], (erro, row) => {
                if (erro) reject(erro);
                else resolve(row ? row.valor : null);
            });
        });
    }

    salvarConfiguracao(chave, valor) {
        return new Promise((resolve, reject) => {
            const sql = `
                INSERT INTO configuracoes (chave, valor) VALUES (?, ?)
                ON CONFLICT(chave) DO UPDATE SET valor = excluded.valor
            `;

            db.run(sql, [chave, valor], (erro) => {
                if (erro) reject(erro);
                else resolve(true);
            });
        });
    }
}

module.exports = new ProdutoRepository();