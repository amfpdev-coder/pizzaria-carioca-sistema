const bcrypt = require("bcryptjs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const caminhoBanco = path.join(__dirname, "pizzaria.db");
const db = new sqlite3.Database(caminhoBanco);

const nome = "Atendente Teste";
const usuario = "atendente";
const senha = "123456";
const tipo = "atendente";

bcrypt.hash(senha, 10, (erro, hash) => {
    if (erro) {
        console.error("Erro ao gerar hash da senha:", erro.message);
        db.close();
        return;
    }

    const sql = `
        INSERT INTO usuarios (nome, usuario, senha, tipo, ativo)
        VALUES (?, ?, ?, ?, 1)
    `;

    db.run(sql, [nome, usuario, hash, tipo], function (erro2) {
        if (erro2) {
            console.error("Erro ao criar usuário de teste:", erro2.message);
            db.close();
            return;
        }

        console.log(`Usuário criado com sucesso! ID: ${this.lastID}`);
        console.log(`Login: ${usuario}`);
        console.log(`Senha: ${senha}`);
        db.close();
    });
});