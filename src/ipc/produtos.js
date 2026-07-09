const { ipcMain, app } = require("electron");
const fs = require("fs");
const path = require("path");
const { pathToFileURL } = require("url");
const ProdutoController = require("../controllers/ProdutoController");

ipcMain.handle("produtos:salvarImagemSabor", async (event, caminhoOrigem) => {
    try {
        const pastaDestino = path.join(app.getPath("userData"), "uploads", "sabores");

        if (!fs.existsSync(pastaDestino)) {
            fs.mkdirSync(pastaDestino, { recursive: true });
        }

        const extensao = path.extname(caminhoOrigem) || ".jpg";
        const nomeArquivo = `sabor_${Date.now()}${extensao}`;
        const caminhoDestino = path.join(pastaDestino, nomeArquivo);

        fs.copyFileSync(caminhoOrigem, caminhoDestino);

        return { sucesso: true, caminho: pathToFileURL(caminhoDestino).href };
    } catch (erro) {
        console.error("Erro ao salvar imagem do sabor:", erro.message);
        return { sucesso: false, mensagem: "Erro ao salvar a imagem selecionada." };
    }
});

ipcMain.handle("produtos:salvarImagemCombo", async (event, caminhoOrigem) => {
    try {
        const pastaDestino = path.join(app.getPath("userData"), "uploads", "combos");

        if (!fs.existsSync(pastaDestino)) {
            fs.mkdirSync(pastaDestino, { recursive: true });
        }

        const extensao = path.extname(caminhoOrigem) || ".jpg";
        const nomeArquivo = `combo_${Date.now()}${extensao}`;
        const caminhoDestino = path.join(pastaDestino, nomeArquivo);

        fs.copyFileSync(caminhoOrigem, caminhoDestino);

        return { sucesso: true, caminho: pathToFileURL(caminhoDestino).href };
    } catch (erro) {
        console.error("Erro ao salvar imagem do combo:", erro.message);
        return { sucesso: false, mensagem: "Erro ao salvar a imagem selecionada." };
    }
});

/* SABORES */

ipcMain.handle("sabores:listar", async () => {
    return await ProdutoController.listarSabores();
});

ipcMain.handle("sabores:salvar", async (event, sabor) => {
    return await ProdutoController.salvarSabor(sabor);
});

ipcMain.handle("sabores:atualizar", async (event, sabor) => {
    return await ProdutoController.atualizarSabor(sabor);
});

ipcMain.handle("sabores:inativar", async (event, id) => {
    return await ProdutoController.inativarSabor(id);
});

ipcMain.handle("sabores:excluir", async (event, id) => {
    return await ProdutoController.excluirSabor(id);
});

/* COMBOS */

ipcMain.handle("combos:listar", async () => {
    return await ProdutoController.listarCombos();
});

ipcMain.handle("combos:salvar", async (event, combo) => {
    return await ProdutoController.salvarCombo(combo);
});

ipcMain.handle("combos:atualizar", async (event, combo) => {
    return await ProdutoController.atualizarCombo(combo);
});

ipcMain.handle("combos:inativar", async (event, id) => {
    return await ProdutoController.inativarCombo(id);
});

ipcMain.handle("combos:excluir", async (event, id) => {
    return await ProdutoController.excluirCombo(id);
});

/* TAMANHOS */

ipcMain.handle("tamanhos:listar", async () => {
    return await ProdutoController.listarTamanhos();
});

ipcMain.handle("tamanhos:salvar", async (event, tamanho) => {
    return await ProdutoController.salvarTamanho(tamanho);
});

ipcMain.handle("tamanhos:atualizar", async (event, tamanho) => {
    return await ProdutoController.atualizarTamanho(tamanho);
});

ipcMain.handle("tamanhos:inativar", async (event, id) => {
    return await ProdutoController.inativarTamanho(id);
});

ipcMain.handle("tamanhos:excluir", async (event, id) => {
    return await ProdutoController.excluirTamanho(id);
});

/* BEBIDAS */

ipcMain.handle("bebidas:listar", async () => {
    return await ProdutoController.listarBebidas();
});

ipcMain.handle("bebidas:salvar", async (event, bebida) => {
    return await ProdutoController.salvarBebida(bebida);
});

ipcMain.handle("bebidas:atualizar", async (event, bebida) => {
    return await ProdutoController.atualizarBebida(bebida);
});

ipcMain.handle("bebidas:inativar", async (event, id) => {
    return await ProdutoController.inativarBebida(id);
});

ipcMain.handle("bebidas:excluir", async (event, id) => {
    return await ProdutoController.excluirBebida(id);
});

/* ADICIONAIS */

ipcMain.handle("adicionais:listar", async () => {
    return await ProdutoController.listarAdicionais();
});

ipcMain.handle("adicionais:salvar", async (event, adicional) => {
    return await ProdutoController.salvarAdicional(adicional);
});

ipcMain.handle("adicionais:atualizar", async (event, adicional) => {
    return await ProdutoController.atualizarAdicional(adicional);
});

ipcMain.handle("adicionais:inativar", async (event, id) => {
    return await ProdutoController.inativarAdicional(id);
});

ipcMain.handle("adicionais:excluir", async (event, id) => {
    return await ProdutoController.excluirAdicional(id);
});

/* PREÇOS CATEGORIA */

ipcMain.handle("precosCategoria:listar", async () => {
    return await ProdutoController.listarPrecosCategoria();
});

ipcMain.handle("precosCategoria:salvar", async (event, preco) => {
    return await ProdutoController.salvarPrecoCategoria(preco);
});

ipcMain.handle("precosCategoria:atualizar", async (event, preco) => {
    return await ProdutoController.atualizarPrecoCategoria(preco);
});

ipcMain.handle("precosCategoria:excluir", async (event, id) => {
    return await ProdutoController.excluirPrecoCategoria(id);
});

/* CONFIGURAÇÕES ACRÉSCIMO */

ipcMain.handle("configuracoes:obterAcrescimoCartao", async () => {
    return await ProdutoController.obterAcrescimoCartao();
});

ipcMain.handle("configuracoes:salvarAcrescimoCartao", async (event, valor) => {
    return await ProdutoController.salvarAcrescimoCartao(valor);
});