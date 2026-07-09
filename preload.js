const { contextBridge, ipcRenderer, webUtils } = require("electron");

contextBridge.exposeInMainWorld("api", {
    login: (dadosLogin) => ipcRenderer.invoke("auth:login", dadosLogin),
    validarSenhaAdmin: (senha) => ipcRenderer.invoke("auth:validarSenhaAdmin", senha),

    /* ARQUIVOS */
    obterCaminhoArquivo: (arquivo) => webUtils.getPathForFile(arquivo),
    salvarImagemSabor: (caminhoOrigem) => ipcRenderer.invoke("produtos:salvarImagemSabor", caminhoOrigem),
    salvarImagemCombo: (caminhoOrigem) => ipcRenderer.invoke("produtos:salvarImagemCombo", caminhoOrigem),

    /* CLIENTES */
    listarClientes: () => ipcRenderer.invoke("clientes:listar"),
    salvarCliente: (cliente) => ipcRenderer.invoke("clientes:salvar", cliente),
    atualizarCliente: (cliente) => ipcRenderer.invoke("clientes:atualizar", cliente),
    inativarCliente: (id) => ipcRenderer.invoke("clientes:inativar", id),
    excluirCliente: (id) => ipcRenderer.invoke("clientes:excluir", id),

    /* SABORES */
    listarSabores: () => ipcRenderer.invoke("sabores:listar"),
    salvarSabor: (sabor) => ipcRenderer.invoke("sabores:salvar", sabor),
    atualizarSabor: (sabor) => ipcRenderer.invoke("sabores:atualizar", sabor),
    inativarSabor: (id) => ipcRenderer.invoke("sabores:inativar", id),
    excluirSabor: (id) => ipcRenderer.invoke("sabores:excluir", id),

    /* COMBOS */
    listarCombos: () => ipcRenderer.invoke("combos:listar"),
    salvarCombo: (combo) => ipcRenderer.invoke("combos:salvar", combo),
    atualizarCombo: (combo) => ipcRenderer.invoke("combos:atualizar", combo),
    inativarCombo: (id) => ipcRenderer.invoke("combos:inativar", id),
    excluirCombo: (id) => ipcRenderer.invoke("combos:excluir", id),

    /* TAMANHOS */
    listarTamanhos: () => ipcRenderer.invoke("tamanhos:listar"),
    salvarTamanho: (tamanho) => ipcRenderer.invoke("tamanhos:salvar", tamanho),
    atualizarTamanho: (tamanho) => ipcRenderer.invoke("tamanhos:atualizar", tamanho),
    inativarTamanho: (id) => ipcRenderer.invoke("tamanhos:inativar", id),
    excluirTamanho: (id) => ipcRenderer.invoke("tamanhos:excluir", id),

    /* BEBIDAS */
    listarBebidas: () => ipcRenderer.invoke("bebidas:listar"),
    salvarBebida: (bebida) => ipcRenderer.invoke("bebidas:salvar", bebida),
    atualizarBebida: (bebida) => ipcRenderer.invoke("bebidas:atualizar", bebida),
    inativarBebida: (id) => ipcRenderer.invoke("bebidas:inativar", id),
    excluirBebida: (id) => ipcRenderer.invoke("bebidas:excluir", id),

    /* ADICIONAIS */
    listarAdicionais: () => ipcRenderer.invoke("adicionais:listar"),
    salvarAdicional: (adicional) => ipcRenderer.invoke("adicionais:salvar", adicional),
    atualizarAdicional: (adicional) => ipcRenderer.invoke("adicionais:atualizar", adicional),
    inativarAdicional: (id) => ipcRenderer.invoke("adicionais:inativar", id),
    excluirAdicional: (id) => ipcRenderer.invoke("adicionais:excluir", id),

    /* PREÇOS POR CATEGORIA (pizza Tradicional) */
    listarPrecosCategoria: () => ipcRenderer.invoke("precosCategoria:listar"),
    salvarPrecoCategoria: (preco) => ipcRenderer.invoke("precosCategoria:salvar", preco),
    atualizarPrecoCategoria: (preco) => ipcRenderer.invoke("precosCategoria:atualizar", preco),
    excluirPrecoCategoria: (id) => ipcRenderer.invoke("precosCategoria:excluir", id),

    /* CONFIGURAÇÕES */
    obterAcrescimoCartao: () => ipcRenderer.invoke("configuracoes:obterAcrescimoCartao"),
    salvarAcrescimoCartao: (valor) => ipcRenderer.invoke("configuracoes:salvarAcrescimoCartao", valor),

    /* IMPRESSÃO */
    imprimirComanda: (html) => ipcRenderer.invoke("impressao:imprimir", html),

    /* PEDIDOS */
    listarPedidos: () => ipcRenderer.invoke("pedidos:listar"),
    buscarPedidoPorId: (id) => ipcRenderer.invoke("pedidos:buscarPorId", id),
    salvarPedido: (dados) => ipcRenderer.invoke("pedidos:salvar", dados),
    atualizarPedido: (dados) => ipcRenderer.invoke("pedidos:atualizar", dados),
    atualizarStatusPedido: (dados) => ipcRenderer.invoke("pedidos:atualizarStatus", dados),
    cancelarPedido: (id) => ipcRenderer.invoke("pedidos:cancelar", id),

    /* CAIXA */
    obterStatusCaixa: () => ipcRenderer.invoke("caixa:status"),
    abrirCaixa: (dados) => ipcRenderer.invoke("caixa:abrir", dados),
    fecharCaixa: (dados) => ipcRenderer.invoke("caixa:fechar", dados),
    registrarMovimentacao: (dados) => ipcRenderer.invoke("caixa:registrarMovimentacao", dados),
    excluirMovimentacao: (id) => ipcRenderer.invoke("caixa:excluirMovimentacao", id),
    listarHistoricoCaixa: () => ipcRenderer.invoke("caixa:listarHistorico"),
    buscarDetalheHistoricoCaixa: (id) => ipcRenderer.invoke("caixa:buscarDetalheHistorico", id),

    /* RELATÓRIOS */
    relatorioDiario: (data) => ipcRenderer.invoke("relatorios:diario", data),
    relatorioMensal: (dados) => ipcRenderer.invoke("relatorios:mensal", dados),
    exportarRelatorioMensalPdf: (nomeArquivo) => ipcRenderer.invoke("relatorios:exportarPdfMensal", nomeArquivo),
    exportarRelatorioDiarioPdf: (nomeArquivo) => ipcRenderer.invoke("relatorios:exportarPdfDiario", nomeArquivo),

    /* BACKUP */
    listarBackups: () => ipcRenderer.invoke("backup:listar"),
    criarBackupManual: () => ipcRenderer.invoke("backup:criarManual"),
    restaurarBackup: (id) => ipcRenderer.invoke("backup:restaurar", id),
    abrirPastaBackups: () => ipcRenderer.invoke("backup:abrirPasta"),

    /* USUÁRIOS */
    listarUsuarios: () => ipcRenderer.invoke("usuarios:listar"),
    criarUsuario: (dados) => ipcRenderer.invoke("usuarios:criar", dados),
    atualizarUsuario: (dados) => ipcRenderer.invoke("usuarios:atualizar", dados),
    trocarSenhaUsuario: (dados) => ipcRenderer.invoke("usuarios:trocarSenha", dados),
    inativarUsuario: (dados) => ipcRenderer.invoke("usuarios:inativar", dados),
    reativarUsuario: (id) => ipcRenderer.invoke("usuarios:reativar", id),

    /* IMPRESSÃO TÉRMICA */
    imprimirComanda: (html, salvarPdf = false) => ipcRenderer.invoke("impressao:imprimir", html, salvarPdf),
});