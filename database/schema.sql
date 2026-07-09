PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    usuario TEXT NOT NULL UNIQUE,
    senha TEXT NOT NULL,
    tipo TEXT NOT NULL CHECK (tipo IN ('admin', 'atendente')),
    ativo INTEGER NOT NULL DEFAULT 1,
    criado_em TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS clientes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome_completo TEXT NOT NULL,
    telefone TEXT,
    endereco TEXT,
    numero TEXT,
    complemento TEXT,
    bairro TEXT,
    ponto_referencia TEXT,
    ativo INTEGER NOT NULL DEFAULT 1,
    criado_em TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sabores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    categoria TEXT NOT NULL CHECK (
        categoria IN (
            'Tradicional',
            'Gourmet Salgada',
            'Gourmet Doce'
        )
    ),
    descricao TEXT,
    imagem TEXT,
    preco_pix REAL,
    ativo INTEGER NOT NULL DEFAULT 1,
    criado_em TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tamanhos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    diametro_cm INTEGER,
    fatias INTEGER,
    ativo INTEGER NOT NULL DEFAULT 1
);



CREATE TABLE IF NOT EXISTS bebidas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    categoria TEXT,
    volume TEXT,
    preco REAL NOT NULL DEFAULT 0,
    imagem TEXT,
    ativo INTEGER NOT NULL DEFAULT 1,
    criado_em TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS adicionais (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    preco REAL NOT NULL,
    imagem TEXT,
    ativo INTEGER NOT NULL DEFAULT 1,
    criado_em TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS combos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    descricao TEXT,
    preco_pix_dinheiro REAL NOT NULL,
    preco_cartao REAL,
    imagem TEXT,
    ativo INTEGER NOT NULL DEFAULT 1,
    criado_em TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pedidos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cliente_id INTEGER,
    usuario_id INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'Aberto' CHECK (
        status IN (
            'Aberto',
            'Em Produção',
            'Finalizado',
            'Cancelado'
        )
    ),
    forma_pagamento TEXT CHECK (
        forma_pagamento IN (
            'Dinheiro',
            'Pix',
            'Cartão',
            'Pix+Dinheiro',
            'Pix+Cartão',
            'Dinheiro+Cartão'
        )
    ),
    taxa_entrega REAL DEFAULT 0,
    subtotal REAL DEFAULT 0,
    total REAL DEFAULT 0,
    observacao TEXT,
    descricao_complementar TEXT,
    criado_em TEXT DEFAULT CURRENT_TIMESTAMP,
    finalizado_em TEXT,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE IF NOT EXISTS itens_pedido (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pedido_id INTEGER NOT NULL,
    tipo_item TEXT NOT NULL CHECK (
        tipo_item IN (
            'Pizza',
            'Bebida',
            'Adicional',
            'Combo'
        )
    ),
    tipo_pizza TEXT CHECK (
        tipo_pizza IN (
            '1 Sabor',
            'Meio a Meio',
            '3 Sabores'
        )
    ),
    tamanho_id INTEGER,
    sabor_1_id INTEGER,
    sabor_2_id INTEGER,
    sabor_3_id INTEGER,
    bebida_id INTEGER,
    adicional_id INTEGER,
    combo_id INTEGER,
    regra_cobranca TEXT,
    quantidade INTEGER NOT NULL DEFAULT 1,
    valor_unitario REAL NOT NULL,
    valor_total REAL NOT NULL,
    observacao TEXT,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
    FOREIGN KEY (tamanho_id) REFERENCES tamanhos(id),
    FOREIGN KEY (sabor_1_id) REFERENCES sabores(id),
    FOREIGN KEY (sabor_2_id) REFERENCES sabores(id),
    FOREIGN KEY (sabor_3_id) REFERENCES sabores(id),
    FOREIGN KEY (bebida_id) REFERENCES bebidas(id),
    FOREIGN KEY (adicional_id) REFERENCES adicionais(id),
    FOREIGN KEY (combo_id) REFERENCES combos(id)
);

CREATE TABLE IF NOT EXISTS caixa (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_abertura_id INTEGER NOT NULL,
    usuario_fechamento_id INTEGER,
    data_abertura TEXT DEFAULT CURRENT_TIMESTAMP,
    data_fechamento TEXT,
    valor_inicial REAL DEFAULT 0,
    valor_final REAL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'Aberto' CHECK (
        status IN ('Aberto', 'Fechado')
    ),
    observacao TEXT,
    FOREIGN KEY (usuario_abertura_id) REFERENCES usuarios(id),
    FOREIGN KEY (usuario_fechamento_id) REFERENCES usuarios(id)
);

CREATE TABLE IF NOT EXISTS movimentacoes_caixa (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    caixa_id INTEGER NOT NULL,
    pedido_id INTEGER,
    tipo TEXT NOT NULL CHECK (
        tipo IN (
            'Entrada',
            'Saída'
        )
    ),
    descricao TEXT NOT NULL,
    valor REAL NOT NULL,
    forma_pagamento TEXT CHECK (
        forma_pagamento IN (
            'Dinheiro',
            'Pix',
            'Cartão'
        )
    ),
    criado_em TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (caixa_id) REFERENCES caixa(id),
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id)
);

CREATE TABLE IF NOT EXISTS historico_backup (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tipo TEXT NOT NULL CHECK (
        tipo IN (
            'Automático',
            'Manual',
            'Restauração'
        )
    ),
    caminho_arquivo TEXT NOT NULL,
    criado_em TEXT DEFAULT CURRENT_TIMESTAMP
);

-- precos_categoria: preço fixo da pizza TRADICIONAL por tamanho + quantidade
-- de sabores (1 Sabor / Meio a Meio / 3 Sabores). Não depende de qual sabor
-- tradicional foi escolhido — todo tradicional tem o mesmo preço no mesmo
-- tamanho. Pizza Gourmet usa o preco_pix do próprio sabor (coluna nova em
-- "sabores"), não essa tabela.
CREATE TABLE IF NOT EXISTS precos_categoria (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tamanho_id INTEGER NOT NULL,
    tipo_pizza TEXT NOT NULL CHECK (
        tipo_pizza IN ('1 Sabor', 'Meio a Meio', '3 Sabores')
    ),
    preco_pix REAL NOT NULL,
    ativo INTEGER DEFAULT 1,
    FOREIGN KEY (tamanho_id) REFERENCES tamanhos(id),
    UNIQUE (tamanho_id, tipo_pizza)
);

CREATE TABLE IF NOT EXISTS configuracoes (
    chave TEXT PRIMARY KEY,
    valor TEXT NOT NULL
);

INSERT OR IGNORE INTO configuracoes (chave, valor) VALUES ('acrescimo_cartao', '2.00');

CREATE TABLE IF NOT EXISTS taxas_entrega (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bairro TEXT NOT NULL UNIQUE,
    valor REAL NOT NULL,
    ativo INTEGER DEFAULT 1
);