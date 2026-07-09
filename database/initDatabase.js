const fs = require("fs");
const path = require("path");
const db = require("./connection");
const criarUsuarioAdministrador = require("./seeds/createAdminUser");
const seedProdutos = require("./seeds/seedProdutos");
const migrarPagamentoMisto = require("./migrations/migrarPagamentoMisto");

const caminhoSchema = path.join(__dirname, "schema.sql");

function inicializarBanco() {
    const schema = fs.readFileSync(caminhoSchema, "utf8");

    db.exec(schema, async (erro) => {
        if (erro) {
            console.error("Erro ao criar tabelas:", erro.message);
            return;
        }

        console.log("Tabelas criadas/verificadas com sucesso.");

        criarUsuarioAdministrador();
        seedProdutos();

        await migrarPagamentoMisto();
    });
}

module.exports = inicializarBanco;