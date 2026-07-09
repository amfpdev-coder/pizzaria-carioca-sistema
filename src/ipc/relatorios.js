const { ipcMain, dialog, shell } = require("electron");
const fs = require("fs");
const path = require("path");
const RelatorioController = require("../controllers/RelatorioController");

ipcMain.handle("relatorios:diario", async (event, data) => {
    return await RelatorioController.relatorioDiario(data);
});

ipcMain.handle("relatorios:mensal", async (event, dados) => {
    return await RelatorioController.relatorioMensal(dados);
});

// Handler genérico de PDF — usado tanto pelo diário quanto pelo mensal
async function exportarPdf(event, nomeArquivoSugerido) {
    try {
        const janela = require("electron").BrowserWindow.fromWebContents(event.sender);

        const { canceled, filePath } = await dialog.showSaveDialog(janela, {
            title: "Salvar relatório",
            defaultPath: path.join(
                require("electron").app.getPath("documents"),
                nomeArquivoSugerido || "relatorio.pdf"
            ),
            filters: [{ name: "PDF", extensions: ["pdf"] }],
        });

        if (canceled || !filePath) {
            return { sucesso: false, cancelado: true };
        }

        const bufferPdf = await event.sender.printToPDF({
            printBackground: true,
            landscape: false,
            pageSize: "A4",
            margins: { marginType: "default" },
        });

        fs.writeFileSync(filePath, bufferPdf);
        shell.openPath(filePath);

        return { sucesso: true, caminho: filePath };
    } catch (erro) {
        console.error("Erro ao exportar PDF do relatório:", erro.message);
        return { sucesso: false, mensagem: "Erro ao gerar o arquivo PDF." };
    }
}

ipcMain.handle("relatorios:exportarPdfMensal", exportarPdf);
ipcMain.handle("relatorios:exportarPdfDiario", exportarPdf);