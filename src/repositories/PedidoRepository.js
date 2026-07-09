const db = require("../../database/connection");

function inserirItens(pedidoId, itens) {
    return new Promise((resolve, reject) => {
        if (!itens || itens.length === 0) {
            resolve();
            return;
        }

        const sql = `
            INSERT INTO itens_pedido (
                pedido_id, tipo_item, tipo_pizza, tamanho_id,
                sabor_1_id, sabor_2_id, sabor_3_id,
                bebida_id, adicional_id, combo_id,
                regra_cobranca, quantidade, valor_unitario, valor_total, observacao
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        let pendentes = itens.length;
        let falhou = false;

        itens.forEach((item) => {
            db.run(sql, [
                pedidoId,
                item.tipo_item,
                item.tipo_pizza || null,
                item.tamanho_id || null,
                item.sabor_1_id || null,
                item.sabor_2_id || null,
                item.sabor_3_id || null,
                item.bebida_id || null,
                item.adicional_id || null,
                item.combo_id || null,
                item.regra_cobranca || null,
                item.quantidade,
                item.valor_unitario,
                item.valor_total,
                item.observacao || null,
            ], (erro) => {
                if (erro && !falhou) {
                    falhou = true;
                    reject(erro);
                    return;
                }

                pendentes--;

                if (pendentes === 0 && !falhou) {
                    resolve();
                }
            });
        });
    });
}

class PedidoRepository {
    listar() {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT
                    pedidos.id,
                    pedidos.cliente_id,
                    pedidos.usuario_id,
                    pedidos.status,
                    pedidos.forma_pagamento,
                    pedidos.taxa_entrega,
                    pedidos.subtotal,
                    pedidos.total,
                    pedidos.valor_pix,
                    pedidos.valor_dinheiro,
                    pedidos.valor_cartao,
                    pedidos.valor_recebido,
                    pedidos.troco,
                    pedidos.observacao,
                    pedidos.descricao_complementar,
                    pedidos.criado_em,
                    pedidos.finalizado_em,
                    clientes.nome_completo AS cliente_nome,
                    clientes.telefone AS cliente_telefone,
                    (SELECT COUNT(*) FROM itens_pedido WHERE itens_pedido.pedido_id = pedidos.id) AS total_itens
                FROM pedidos
                LEFT JOIN clientes ON clientes.id = pedidos.cliente_id
                ORDER BY pedidos.criado_em DESC
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

    buscarPorId(id) {
        return new Promise((resolve, reject) => {
            const sqlPedido = `
                SELECT
                    pedidos.*,
                    clientes.nome_completo AS cliente_nome,
                    clientes.telefone AS cliente_telefone,
                    clientes.endereco AS cliente_endereco,
                    clientes.numero AS cliente_numero,
                    clientes.complemento AS cliente_complemento,
                    clientes.bairro AS cliente_bairro,
                    clientes.ponto_referencia AS cliente_ponto_referencia
                FROM pedidos
                LEFT JOIN clientes ON clientes.id = pedidos.cliente_id
                WHERE pedidos.id = ?
            `;

            db.get(sqlPedido, [id], (erro, pedido) => {
                if (erro) {
                    reject(erro);
                    return;
                }

                if (!pedido) {
                    resolve(null);
                    return;
                }

                const sqlItens = `
                    SELECT
                        itens_pedido.*,
                        tamanhos.nome AS tamanho_nome,
                        s1.nome AS sabor_1_nome,
                        s2.nome AS sabor_2_nome,
                        s3.nome AS sabor_3_nome,
                        bebidas.nome AS bebida_nome,
                        adicionais.nome AS adicional_nome,
                        combos.nome AS combo_nome
                    FROM itens_pedido
                    LEFT JOIN tamanhos ON tamanhos.id = itens_pedido.tamanho_id
                    LEFT JOIN sabores s1 ON s1.id = itens_pedido.sabor_1_id
                    LEFT JOIN sabores s2 ON s2.id = itens_pedido.sabor_2_id
                    LEFT JOIN sabores s3 ON s3.id = itens_pedido.sabor_3_id
                    LEFT JOIN bebidas ON bebidas.id = itens_pedido.bebida_id
                    LEFT JOIN adicionais ON adicionais.id = itens_pedido.adicional_id
                    LEFT JOIN combos ON combos.id = itens_pedido.combo_id
                    WHERE itens_pedido.pedido_id = ?
                    ORDER BY itens_pedido.id ASC
                `;

                db.all(sqlItens, [id], (erro2, itens) => {
                    if (erro2) {
                        reject(erro2);
                        return;
                    }

                    resolve({ ...pedido, itens });
                });
            });
        });
    }

    criar(pedido, itens) {
        return new Promise((resolve, reject) => {
            const sql = `
                INSERT INTO pedidos (
                    cliente_id, usuario_id, status, forma_pagamento,
                    taxa_entrega, subtotal, total,
                    valor_pix, valor_dinheiro, valor_cartao,
                    valor_recebido, troco,
                    observacao, descricao_complementar, criado_em
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            db.run(sql, [
                pedido.cliente_id,
                pedido.usuario_id,
                pedido.status,
                pedido.forma_pagamento,
                pedido.taxa_entrega,
                pedido.subtotal,
                pedido.total,
                pedido.valor_pix || 0,
                pedido.valor_dinheiro || 0,
                pedido.valor_cartao || 0,
                pedido.valor_recebido || 0,
                pedido.troco || 0,
                pedido.observacao,
                pedido.descricao_complementar,
                pedido.criado_em,
            ], function (erro) {
                if (erro) {
                    reject(erro);
                    return;
                }

                const pedidoId = this.lastID;

                inserirItens(pedidoId, itens)
                    .then(() => resolve({ id: pedidoId, ...pedido }))
                    .catch(reject);
            });
        });
    }

    atualizar(pedido, itens) {
        return new Promise((resolve, reject) => {
            const sql = `
                UPDATE pedidos
                SET cliente_id = ?, status = ?, forma_pagamento = ?,
                    taxa_entrega = ?, subtotal = ?, total = ?,
                    valor_pix = ?, valor_dinheiro = ?, valor_cartao = ?,
                    valor_recebido = ?, troco = ?,
                    observacao = ?, descricao_complementar = ?,
                    finalizado_em = ?
                WHERE id = ?
            `;

            db.run(sql, [
                pedido.cliente_id,
                pedido.status,
                pedido.forma_pagamento,
                pedido.taxa_entrega,
                pedido.subtotal,
                pedido.total,
                pedido.valor_pix || 0,
                pedido.valor_dinheiro || 0,
                pedido.valor_cartao || 0,
                pedido.valor_recebido || 0,
                pedido.troco || 0,
                pedido.observacao,
                pedido.descricao_complementar,
                pedido.finalizado_em || null,
                pedido.id,
            ], (erro) => {
                if (erro) {
                    reject(erro);
                    return;
                }

                db.run("DELETE FROM itens_pedido WHERE pedido_id = ?", [pedido.id], (erro2) => {
                    if (erro2) {
                        reject(erro2);
                        return;
                    }

                    inserirItens(pedido.id, itens)
                        .then(() => resolve(pedido))
                        .catch(reject);
                });
            });
        });
    }

    atualizarStatus(id, status, finalizadoEm) {
        return new Promise((resolve, reject) => {
            const sql = `
                UPDATE pedidos
                SET status = ?, finalizado_em = ?
                WHERE id = ?
            `;

            db.run(sql, [status, finalizadoEm || null, id], (erro) => {
                if (erro) {
                    reject(erro);
                    return;
                }

                resolve(true);
            });
        });
    }

    buscarPorData(data) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT
                    pedidos.*,
                    clientes.nome_completo AS cliente_nome,
                    clientes.telefone AS cliente_telefone
                FROM pedidos
                LEFT JOIN clientes ON clientes.id = pedidos.cliente_id
                WHERE substr(pedidos.criado_em, 1, 10) = ?
                ORDER BY pedidos.criado_em DESC
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

    buscarRelatorioPorPeriodo(dataInicio, dataFim) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT
                    substr(criado_em, 1, 10) AS dia,
                    COUNT(*) AS total_pedidos,
                    SUM(total) AS faturamento,
                    SUM(valor_pix) AS total_pix,
                    SUM(valor_dinheiro) AS total_dinheiro,
                    SUM(valor_cartao) AS total_cartao,
                    SUM(taxa_entrega) AS total_entregas
                FROM pedidos
                WHERE substr(criado_em, 1, 10) BETWEEN ? AND ?
                    AND status != 'Cancelado'
                GROUP BY dia
                ORDER BY dia ASC
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
}

module.exports = new PedidoRepository();