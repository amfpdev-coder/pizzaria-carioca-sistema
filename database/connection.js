const path = require("path");
const fs = require("fs");
const { app } = require("electron");
const sqlite3 = require("sqlite3").verbose();

const pastaDados = app.isPackaged ? app.getPath("userData") : __dirname;

if (!fs.existsSync(pastaDados)) {
    fs.mkdirSync(pastaDados, { recursive: true });
}

const caminhoBanco = path.join(pastaDados, "pizzaria.db");

console.log("Banco utilizado:", caminhoBanco);

const db = new sqlite3.Database(caminhoBanco, (erro) => {
    if (erro) {
        console.error("Erro ao conectar ao banco:", erro.message);
        return;
    }

    console.log("Banco conectado com sucesso.");
});

module.exports = db;