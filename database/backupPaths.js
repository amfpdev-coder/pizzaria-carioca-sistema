const path = require("path");
const fs = require("fs");
const { app } = require("electron");

function obterPastaDados() {
    return app.isPackaged ? app.getPath("userData") : __dirname;
}

function obterCaminhoBanco() {
    return path.join(obterPastaDados(), "pizzaria.db");
}

function obterPastaBackups() {
    const pasta = path.join(obterPastaDados(), "backups");

    if (!fs.existsSync(pasta)) {
        fs.mkdirSync(pasta, { recursive: true });
    }

    return pasta;
}

module.exports = {
    obterPastaDados,
    obterCaminhoBanco,
    obterPastaBackups,
};