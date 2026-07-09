const db = require("../connection");

function seedProdutos() {
    const sqls = [
        // TAMANHOS
        `INSERT OR IGNORE INTO tamanhos (id, nome, diametro_cm, fatias, ativo) VALUES (1, 'Família 35cm', NULL, 8, 1)`,
        `INSERT OR IGNORE INTO tamanhos (id, nome, diametro_cm, fatias, ativo) VALUES (2, 'Brotinho 20 cm', NULL, 4, 1)`,

        // SABORES — Tradicional Salgada
        `INSERT OR IGNORE INTO sabores (id, nome, categoria, descricao, imagem, preco_pix, ativo) VALUES (3, 'Frango com Catupiry ou Cheddar', 'Tradicional', '', '', 0.0, 1)`,
        `INSERT OR IGNORE INTO sabores (id, nome, categoria, descricao, imagem, preco_pix, ativo) VALUES (4, 'Lombo', 'Tradicional', '', '', 0.0, 1)`,
        `INSERT OR IGNORE INTO sabores (id, nome, categoria, descricao, imagem, preco_pix, ativo) VALUES (5, 'Calabresa', 'Tradicional', '', '', 0.0, 1)`,
        `INSERT OR IGNORE INTO sabores (id, nome, categoria, descricao, imagem, preco_pix, ativo) VALUES (6, 'Portuguesa', 'Tradicional', '', '', 0.0, 1)`,
        `INSERT OR IGNORE INTO sabores (id, nome, categoria, descricao, imagem, preco_pix, ativo) VALUES (7, 'Mussarela', 'Tradicional', '', '', 0.0, 1)`,
        `INSERT OR IGNORE INTO sabores (id, nome, categoria, descricao, imagem, preco_pix, ativo) VALUES (8, 'Carne Seca com Catupiry', 'Tradicional', '', '', 0.0, 1)`,
        `INSERT OR IGNORE INTO sabores (id, nome, categoria, descricao, imagem, preco_pix, ativo) VALUES (9, 'Quatro Queijos', 'Tradicional', '', '', 0.0, 1)`,
        `INSERT OR IGNORE INTO sabores (id, nome, categoria, descricao, imagem, preco_pix, ativo) VALUES (10, 'Frango', 'Tradicional', '', '', 0.0, 1)`,
        `INSERT OR IGNORE INTO sabores (id, nome, categoria, descricao, imagem, preco_pix, ativo) VALUES (11, 'Calabresa com Catupiry ou Cheddar', 'Tradicional', '', '', 0.0, 1)`,
        `INSERT OR IGNORE INTO sabores (id, nome, categoria, descricao, imagem, preco_pix, ativo) VALUES (12, 'Presunto', 'Tradicional', '', '', 0.0, 1)`,
        `INSERT OR IGNORE INTO sabores (id, nome, categoria, descricao, imagem, preco_pix, ativo) VALUES (13, 'Queijo Cremoso', 'Tradicional', '', '', 0.0, 1)`,
        `INSERT OR IGNORE INTO sabores (id, nome, categoria, descricao, imagem, preco_pix, ativo) VALUES (14, 'Calábria', 'Tradicional', '', '', 0.0, 1)`,

        // SABORES — Tradicional Doce
        `INSERT OR IGNORE INTO sabores (id, nome, categoria, descricao, imagem, preco_pix, ativo) VALUES (15, 'Brigadeiro', 'Tradicional', '', '', 0.0, 1)`,
        `INSERT OR IGNORE INTO sabores (id, nome, categoria, descricao, imagem, preco_pix, ativo) VALUES (16, 'Banana com Canela', 'Tradicional', '', '', 0.0, 1)`,
        `INSERT OR IGNORE INTO sabores (id, nome, categoria, descricao, imagem, preco_pix, ativo) VALUES (17, 'Chocolate com M&M', 'Tradicional', '', '', 0.0, 1)`,
        `INSERT OR IGNORE INTO sabores (id, nome, categoria, descricao, imagem, preco_pix, ativo) VALUES (18, 'Romeu e Julieta', 'Tradicional', '', '', 0.0, 1)`,

        // SABORES — Gourmet Salgada
        `INSERT OR IGNORE INTO sabores (id, nome, categoria, descricao, imagem, preco_pix, ativo) VALUES (19, 'Camarão', 'Gourmet Salgada', '', '', 40.0, 1)`,
        `INSERT OR IGNORE INTO sabores (id, nome, categoria, descricao, imagem, preco_pix, ativo) VALUES (20, 'Carne de Sol com Cream Cheese', 'Gourmet Salgada', '', '', 37.0, 1)`,
        `INSERT OR IGNORE INTO sabores (id, nome, categoria, descricao, imagem, preco_pix, ativo) VALUES (21, 'Frango com Cream Cheese', 'Gourmet Salgada', '', '', 35.0, 1)`,
        `INSERT OR IGNORE INTO sabores (id, nome, categoria, descricao, imagem, preco_pix, ativo) VALUES (22, 'Atum', 'Gourmet Salgada', '', '', 30.0, 1)`,
        `INSERT OR IGNORE INTO sabores (id, nome, categoria, descricao, imagem, preco_pix, ativo) VALUES (23, 'Franbacon', 'Gourmet Salgada', '', '', 37.0, 1)`,

        // SABORES — Gourmet Doce
        `INSERT OR IGNORE INTO sabores (id, nome, categoria, descricao, imagem, preco_pix, ativo) VALUES (24, 'Chocolate Branco com M&M', 'Gourmet Doce', '', '', 27.0, 1)`,
        `INSERT OR IGNORE INTO sabores (id, nome, categoria, descricao, imagem, preco_pix, ativo) VALUES (25, 'Chocolate Mesclado', 'Gourmet Doce', '', '', 27.0, 1)`,
        `INSERT OR IGNORE INTO sabores (id, nome, categoria, descricao, imagem, preco_pix, ativo) VALUES (26, 'Chocolate Branco com Paçoca', 'Gourmet Doce', '', '', 27.0, 1)`,
        `INSERT OR IGNORE INTO sabores (id, nome, categoria, descricao, imagem, preco_pix, ativo) VALUES (27, 'Nutella', 'Gourmet Doce', '', '', 40.0, 1)`,
        `INSERT OR IGNORE INTO sabores (id, nome, categoria, descricao, imagem, preco_pix, ativo) VALUES (28, 'Amor Carioca', 'Gourmet Doce', '', '', 25.0, 1)`,

        // BEBIDAS
        `INSERT OR IGNORE INTO bebidas (id, nome, categoria, volume, preco, imagem, ativo) VALUES (1, 'Guaraná Antártica', 'Refrigerante', '1L', 8.0, '', 1)`,
        `INSERT OR IGNORE INTO bebidas (id, nome, categoria, volume, preco, imagem, ativo) VALUES (2, 'Pitchulinha', 'Refrigerante', '200ml', 3.0, '', 1)`,
        `INSERT OR IGNORE INTO bebidas (id, nome, categoria, volume, preco, imagem, ativo) VALUES (3, 'Coca-Cola Lata', 'Refrigerante', '350ml', 6.0, '', 1)`,
        `INSERT OR IGNORE INTO bebidas (id, nome, categoria, volume, preco, imagem, ativo) VALUES (4, 'Pepsi', 'Refrigerante', '1L', 9.0, '', 1)`,
        `INSERT OR IGNORE INTO bebidas (id, nome, categoria, volume, preco, imagem, ativo) VALUES (5, 'Coca-Cola', 'Refrigerante', '1L', 12.0, '', 1)`,

        // ADICIONAIS
        `INSERT OR IGNORE INTO adicionais (id, nome, preco, imagem, ativo) VALUES (1, 'Borda Catupiry', 5.0, '', 1)`,
        `INSERT OR IGNORE INTO adicionais (id, nome, preco, imagem, ativo) VALUES (2, 'Borda Cheddar', 5.0, '', 1)`,
        `INSERT OR IGNORE INTO adicionais (id, nome, preco, imagem, ativo) VALUES (3, 'Borda Chocolate', 5.0, '', 1)`,

        // PREÇOS POR CATEGORIA
        `INSERT OR IGNORE INTO precos_categoria (id, tamanho_id, tipo_pizza, preco_pix, ativo) VALUES (1, 1, '1 Sabor', 23.0, 1)`,
        `INSERT OR IGNORE INTO precos_categoria (id, tamanho_id, tipo_pizza, preco_pix, ativo) VALUES (2, 1, '3 Sabores', 35.0, 1)`,
        `INSERT OR IGNORE INTO precos_categoria (id, tamanho_id, tipo_pizza, preco_pix, ativo) VALUES (3, 1, 'Meio a Meio', 23.0, 1)`,
        `INSERT OR IGNORE INTO precos_categoria (id, tamanho_id, tipo_pizza, preco_pix, ativo) VALUES (4, 2, '1 Sabor', 12.0, 1)`,

        // CONFIGURAÇÕES
        `INSERT OR IGNORE INTO configuracoes (chave, valor) VALUES ('acrescimo_cartao', '2')`,
    ];

    sqls.forEach((sql) => {
        db.run(sql, (erro) => {
            if (erro) {
                console.error("Erro no seed de produtos:", erro.message);
            }
        });
    });

    console.log("Seed de produtos executado com sucesso.");
}

module.exports = seedProdutos;