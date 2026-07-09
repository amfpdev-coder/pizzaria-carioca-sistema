const db = require("../../database/connection");

class CaixaRepository {
    buscarCaixaAberto() {
        return new Promise((resolve, reject) => {
            db.get(
                "SELECT * FROM caixa WHERE status = 'Aberto' ORDER BY id DESC LIMIT 1",
                [],
                (erro, row) => {
                    if (erro) {
                        reject(erro);
                        return;
                    }

                    resolve(row || null);
                },
            );
        });
    }

    abrir(caixa) {
        return new Promise((resolve, reject) => {
            const sql = `
                INSERT INTO caixa (usuario_abertura_id, valor_inicial, observacao, status, data_abertura)
                VALUES (?, ?, ?, 'Aberto', ?)
            `;

            db.run(
                sql,
                [
                    caixa.usuario_abertura_id,
                    caixa.valor_inicial,
                    caixa.observacao,
                    caixa.data_abertura,
                ],
                function (erro) {
                    if (erro) {
                        reject(erro);
                        return;
                    }

                    resolve({ id: this.lastID, ...caixa, status: "Aberto" });
                },
            );
        });
    }

    fechar(id, dados) {
        return new Promise((resolve, reject) => {
            const sql = `
                UPDATE caixa
                SET status = 'Fechado',
                    data_fechamento = ?,
                    valor_final = ?,
                    usuario_fechamento_id = ?,
                    observacao = ?
                WHERE id = ?
            `;

            db.run(
                sql,
                [
                    dados.data_fechamento,
                    dados.valor_final,
                    dados.usuario_fechamento_id,
                    dados.observacao,
                    id,
                ],
                (erro) => {
                    if (erro) {
                        reject(erro);
                        return;
                    }

                    resolve(true);
                },
            );
        });
    }

    listarMovimentacoes(caixaId) {
        return new Promise((resolve, reject) => {
            db.all(
                "SELECT * FROM movimentacoes_caixa WHERE caixa_id = ? ORDER BY criado_em DESC",
                [caixaId],
                (erro, rows) => {
                    if (erro) {
                        reject(erro);
                        return;
                    }

                    resolve(rows);
                },
            );
        });
    }

    listarMovimentacoesPorData(data) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT * FROM movimentacoes_caixa
                WHERE substr(criado_em, 1, 10) = ?
                ORDER BY criado_em DESC
            `;

            db.all(sql, [data], (erro, rows) => {
                if (erro) {
                    reject(erro);
                    return;
                }

                resolve(rows);
            });
        });
    }

    listarMovimentacoesPorPeriodo(dataInicio, dataFim) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT * FROM movimentacoes_caixa
                WHERE substr(criado_em, 1, 10) BETWEEN ? AND ?
                ORDER BY criado_em ASC
            `;

            db.all(sql, [dataInicio, dataFim], (erro, rows) => {
                if (erro) {
                    reject(erro);
                    return;
                }

                resolve(rows);
            });
        });
    }

    buscarMovimentacaoPorPedidoId(pedidoId) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT *
                FROM movimentacoes_caixa
                WHERE pedido_id = ?
                    AND tipo = 'Entrada'
                ORDER BY id DESC
                LIMIT 1
            `;

            db.get(sql, [pedidoId], (erro, row) => {
                if (erro) {
                    reject(erro);
                    return;
                }

                resolve(row || null);
            });
        });
    }

    criarMovimentacao(mov) {
        return new Promise((resolve, reject) => {
            const sql = `
                INSERT INTO movimentacoes_caixa (caixa_id, pedido_id, tipo, descricao, valor, forma_pagamento, criado_em)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;

            db.run(
                sql,
                [
                    mov.caixa_id,
                    mov.pedido_id || null,
                    mov.tipo,
                    mov.descricao,
                    mov.valor,
                    mov.forma_pagamento || null,
                    mov.criado_em,
                ],
                function (erro) {
                    if (erro) {
                        reject(erro);
                        return;
                    }

                    resolve({ id: this.lastID, ...mov });
                },
            );
        });
    }

    atualizarMovimentacaoVendaPedido(pedidoId, dados) {
        return new Promise((resolve, reject) => {
            const sql = `
                UPDATE movimentacoes_caixa
                SET descricao = ?,
                    valor = ?,
                    forma_pagamento = ?
                WHERE pedido_id = ?
                    AND tipo = 'Entrada'
            `;

            db.run(
                sql,
                [
                    dados.descricao,
                    Number(dados.valor),
                    dados.forma_pagamento || null,
                    pedidoId,
                ],
                (erro) => {
                    if (erro) {
                        reject(erro);
                        return;
                    }

                    resolve(true);
                },
            );
        });
    }

    excluirMovimentacao(id) {
        return new Promise((resolve, reject) => {
            db.run(
                "DELETE FROM movimentacoes_caixa WHERE id = ?",
                [id],
                (erro) => {
                    if (erro) {
                        reject(erro);
                        return;
                    }

                    resolve(true);
                },
            );
        });
    }

    excluirMovimentacaoPorPedidoId(pedidoId) {
        return new Promise((resolve, reject) => {
            const sql = `
                DELETE FROM movimentacoes_caixa
                WHERE pedido_id = ?
                    AND tipo = 'Entrada'
            `;

            db.run(sql, [pedidoId], (erro) => {
                if (erro) {
                    reject(erro);
                    return;
                }

                resolve(true);
            });
        });
    }

    listarHistorico() {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT
                    caixa.*,
                    ua.nome AS operador_abertura,
                    uf.nome AS operador_fechamento,
                    (SELECT COALESCE(SUM(valor), 0) FROM movimentacoes_caixa WHERE caixa_id = caixa.id AND tipo = 'Entrada') AS total_entradas,
                    (SELECT COALESCE(SUM(valor), 0) FROM movimentacoes_caixa WHERE caixa_id = caixa.id AND tipo = 'Saída') AS total_saidas
                FROM caixa
                LEFT JOIN usuarios ua ON ua.id = caixa.usuario_abertura_id
                LEFT JOIN usuarios uf ON uf.id = caixa.usuario_fechamento_id
                WHERE caixa.status = 'Fechado'
                ORDER BY caixa.data_abertura DESC
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

    buscarDetalheHistorico(id) {
        return new Promise((resolve, reject) => {
            const sqlCaixa = `
                SELECT
                    caixa.*,
                    ua.nome AS operador_abertura,
                    uf.nome AS operador_fechamento
                FROM caixa
                LEFT JOIN usuarios ua ON ua.id = caixa.usuario_abertura_id
                LEFT JOIN usuarios uf ON uf.id = caixa.usuario_fechamento_id
                WHERE caixa.id = ?
            `;

            db.get(sqlCaixa, [id], (erro, caixaRow) => {
                if (erro) {
                    reject(erro);
                    return;
                }

                if (!caixaRow) {
                    resolve(null);
                    return;
                }

                this.listarMovimentacoes(id)
                    .then((movimentacoes) =>
                        resolve({ ...caixaRow, movimentacoes }),
                    )
                    .catch(reject);
            });
        });
    }
}

module.exports = new CaixaRepository();
