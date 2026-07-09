const db = require("../connection");

function executarMigracao(sql, descricao) {
    return new Promise((resolve) => {
        db.run(sql, (erro) => {
            if (erro && !erro.message.includes("duplicate column")) {
                console.warn(`Migração ignorada (${descricao}):`, erro.message);
            } else {
                console.log(`Migração OK: ${descricao}`);
            }
            resolve();
        });
    });
}

async function migrarPagamentoMisto() {
    console.log("Iniciando migração: pagamento misto...");

    // Colunas novas em pedidos
    await executarMigracao(
        `ALTER TABLE pedidos ADD COLUMN valor_pix REAL DEFAULT 0`,
        "pedidos.valor_pix"
    );

    await executarMigracao(
        `ALTER TABLE pedidos ADD COLUMN valor_dinheiro REAL DEFAULT 0`,
        "pedidos.valor_dinheiro"
    );

    await executarMigracao(
        `ALTER TABLE pedidos ADD COLUMN valor_cartao REAL DEFAULT 0`,
        "pedidos.valor_cartao"
    );

    await executarMigracao(
        `ALTER TABLE pedidos ADD COLUMN valor_recebido REAL DEFAULT 0`,
        "pedidos.valor_recebido"
    );

    await executarMigracao(
        `ALTER TABLE pedidos ADD COLUMN troco REAL DEFAULT 0`,
        "pedidos.troco"
    );

    // SQLite não permite alterar CHECK constraint diretamente.
    // Recriamos a tabela com o novo CHECK preservando todos os dados.
    await new Promise((resolve) => {
        db.get(
            `SELECT sql FROM sqlite_master WHERE type='table' AND name='pedidos'`,
            (erro, row) => {
                if (erro || !row) { resolve(); return; }

                // Verifica se o CHECK já foi atualizado
                if (row.sql.includes("Pix+Cartão") || row.sql.includes("Pix+Dinheiro")) {
                    console.log("Migração OK: CHECK de forma_pagamento já atualizado");
                    resolve();
                    return;
                }

                db.serialize(() => {
                    db.run("PRAGMA foreign_keys = OFF");

                    db.run(`
                        CREATE TABLE IF NOT EXISTS pedidos_nova (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            cliente_id INTEGER,
                            usuario_id INTEGER NOT NULL,
                            status TEXT NOT NULL DEFAULT 'Aberto' CHECK (
                                status IN ('Aberto','Em Produção','Finalizado','Cancelado')
                            ),
                            forma_pagamento TEXT CHECK (
                                forma_pagamento IN (
                                    'Dinheiro','Pix','Cartão',
                                    'Pix+Dinheiro','Pix+Cartão','Dinheiro+Cartão'
                                )
                            ),
                            taxa_entrega REAL DEFAULT 0,
                            subtotal REAL DEFAULT 0,
                            total REAL DEFAULT 0,
                            valor_pix REAL DEFAULT 0,
                            valor_dinheiro REAL DEFAULT 0,
                            valor_cartao REAL DEFAULT 0,
                            valor_recebido REAL DEFAULT 0,
                            troco REAL DEFAULT 0,
                            observacao TEXT,
                            descricao_complementar TEXT,
                            criado_em TEXT DEFAULT CURRENT_TIMESTAMP,
                            finalizado_em TEXT,
                            FOREIGN KEY (cliente_id) REFERENCES clientes(id),
                            FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
                        )
                    `, (erro) => {
                        if (erro) {
                            console.warn("Erro ao criar pedidos_nova:", erro.message);
                            db.run("PRAGMA foreign_keys = ON");
                            resolve();
                            return;
                        }

                        db.run(`
                            INSERT INTO pedidos_nova
                                (id, cliente_id, usuario_id, status, forma_pagamento,
                                taxa_entrega, subtotal, total,
                                valor_pix, valor_dinheiro, valor_cartao,
                                valor_recebido, troco,
                                observacao, descricao_complementar,
                                criado_em, finalizado_em)
                            SELECT
                                id, cliente_id, usuario_id, status, forma_pagamento,
                                taxa_entrega, subtotal, total,
                                COALESCE(valor_pix, 0),
                                COALESCE(valor_dinheiro, 0),
                                COALESCE(valor_cartao, 0),
                                COALESCE(valor_recebido, 0),
                                COALESCE(troco, 0),
                                observacao, descricao_complementar,
                                criado_em, finalizado_em
                            FROM pedidos
                        `, (erro) => {
                            if (erro) {
                                console.warn("Erro ao copiar dados para pedidos_nova:", erro.message);
                                db.run("DROP TABLE IF EXISTS pedidos_nova");
                                db.run("PRAGMA foreign_keys = ON");
                                resolve();
                                return;
                            }

                            db.run("DROP TABLE pedidos", (erro) => {
                                if (erro) {
                                    console.warn("Erro ao dropar pedidos:", erro.message);
                                    db.run("DROP TABLE IF EXISTS pedidos_nova");
                                    db.run("PRAGMA foreign_keys = ON");
                                    resolve();
                                    return;
                                }

                                db.run("ALTER TABLE pedidos_nova RENAME TO pedidos", (erro) => {
                                    if (erro) {
                                        console.warn("Erro ao renomear pedidos_nova:", erro.message);
                                    } else {
                                        console.log("Migração OK: CHECK de forma_pagamento atualizado");
                                    }
                                    db.run("PRAGMA foreign_keys = ON");
                                    resolve();
                                });
                            });
                        });
                    });
                });
            }
        );
    });

    console.log("Migração: pagamento misto concluída.");
}

module.exports = migrarPagamentoMisto;