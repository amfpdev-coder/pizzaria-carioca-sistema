const { app, BrowserWindow, ipcMain, webContents } = require("electron");
const path = require("path");
const inicializarBanco = require("./database/initDatabase");
const BackupService = require("./src/services/BackupService");

require("./src/ipc/auth");
require("./src/ipc/clientes");
require("./src/ipc/produtos");
require("./src/ipc/pedidos");
require("./src/ipc/caixa");
require("./src/ipc/relatorios");
require("./src/ipc/backup");
require("./src/ipc/usuarios");

let janelaApp = null;

function criarJanela() {
    janelaApp = new BrowserWindow({
        width: 1440,
        height: 900,
        minWidth: 1280,
        minHeight: 720,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });

    janelaApp.loadFile(path.join(__dirname, "src", "pages", "login.html"));
}

/* ==========================================================
    IMPRESSÃO TÉRMICA — abre janela invisível, injeta o HTML
    da comanda e imprime diretamente na impressora padrão
    (MP-4200 HS, 80mm) sem mostrar diálogo.
   ========================================================== */
ipcMain.handle("impressao:imprimir", async (event, htmlComanda, salvarPdf = false) => {
    return new Promise((resolve) => {
        const janelaImpressao = new BrowserWindow({
            show: false,
            webPreferences: {
                contextIsolation: true,
                nodeIntegration: false,
            },
        });

        const htmlCompleto = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
    width: 72mm;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 14px;
    line-height: 1.6;
    color: black;
    background: white;
    padding: 4mm 3mm;
}
.comanda-cabecalho {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-bottom: 10px;
    padding-bottom: 10px;
    border-bottom: 1px dashed #000;
}
.comanda-cabecalho strong { font-size: 18px; font-weight: bold; }
.comanda-cabecalho span  { font-size: 13px; }
.comanda-secao {
    margin-bottom: 10px;
    padding-bottom: 10px;
    border-bottom: 1px dashed #000;
}
.comanda-secao:last-child { border-bottom: none; }
.comanda-secao h4 {
    font-size: 14px;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 4px;
}
.comanda-secao p { margin: 2px 0; font-size: 14px; }
.comanda-item-linha { margin-top: 6px; }
.comanda-item-linha strong { font-weight: bold; font-size: 15px; }
.comanda-item-sabores { font-size: 13px; margin-left: 4px; }
.comanda-totais p {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
}
.comanda-total-final {
    margin-top: 6px;
    font-size: 16px;
    font-weight: bold;
}
.comanda-quebra-pagina { page-break-after: always; }
</style>
</head>
<body>${htmlComanda}</body>
</html>`;

        janelaImpressao.loadURL("data:text/html;charset=utf-8," + encodeURIComponent(htmlCompleto));

        janelaImpressao.webContents.once("did-finish-load", () => {
            janelaImpressao.webContents.print(
                {
                    silent: !salvarPdf,          // sem diálogo
                    printBackground: false,
                    // Deixe deviceName vazio para usar a impressora padrão do Windows.
                    // Se quiser forçar a MP-4200 HS, coloque o nome exato aqui:
                    // deviceName: "MP-4200 TH",
                    pageSize: {
                        width: 80000,   // 80mm em mícrons
                        height: 170000, // altura suficiente; a térmica corta o papel
                    },
                    margins: {
                        marginType: "custom",
                        top: 0,
                        bottom: 0,
                        left: 3,
                        right: 3,
                    },
                },
                (sucesso, errorType) => {
                    janelaImpressao.destroy();
                    resolve({ sucesso, errorType: errorType || null });
                }
            );
        });
    });
});

app.whenReady().then(() => {
    inicializarBanco();
    BackupService.executarBackupAutomaticoSeNecessario();
    criarJanela();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            criarJanela();
        }
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});