/* ==========================================================
    REFERÊNCIAS DO DOM
   ========================================================== */

const btnSair = document.getElementById("btnSair");
const btnAbrirCaixa = document.getElementById("btnAbrirCaixa");
const btnFecharCaixa = document.getElementById("btnFecharCaixa");

const avisoCaixaFechado = document.getElementById("avisoCaixaFechado");
const blocoCaixaAberto = document.getElementById("blocoCaixaAberto");

const statusDataAbertura = document.getElementById("statusDataAbertura");
const statusValorInicial = document.getElementById("statusValorInicial");
const statusTotalEntradas = document.getElementById("statusTotalEntradas");
const statusTotalSaidas = document.getElementById("statusTotalSaidas");
const statusSaldoAtual = document.getElementById("statusSaldoAtual");

const txtPesquisarMovimentacao = document.getElementById(
    "txtPesquisarMovimentacao",
);
const selectFiltroTipoMovimentacao = document.getElementById(
    "selectFiltroTipoMovimentacao",
);
const btnNovaEntrada = document.getElementById("btnNovaEntrada");
const btnNovaSaida = document.getElementById("btnNovaSaida");
const tbodyMovimentacoes = document.getElementById("tbodyMovimentacoes");

const filtroDataInicioHistorico = document.getElementById(
    "filtroDataInicioHistorico",
);
const filtroDataFimHistorico = document.getElementById(
    "filtroDataFimHistorico",
);
const tbodyHistoricoCaixa = document.getElementById("tbodyHistoricoCaixa");

const modalAbrirCaixa = document.getElementById("modalAbrirCaixa");
const btnFecharModalAbrirCaixa = document.getElementById(
    "btnFecharModalAbrirCaixa",
);
const formAbrirCaixa = document.getElementById("formAbrirCaixa");
const txtValorInicialCaixa = document.getElementById("txtValorInicialCaixa");
const txtObservacaoAbertura = document.getElementById("txtObservacaoAbertura");
const mensagemAbrirCaixa = document.getElementById("mensagemAbrirCaixa");
const btnCancelarAbrirCaixa = document.getElementById("btnCancelarAbrirCaixa");

const modalFecharCaixa = document.getElementById("modalFecharCaixa");
const btnFecharModalFecharCaixa = document.getElementById(
    "btnFecharModalFecharCaixa",
);
const formFecharCaixa = document.getElementById("formFecharCaixa");
const resumoValorInicial = document.getElementById("resumoValorInicial");
const resumoTotalEntradas = document.getElementById("resumoTotalEntradas");
const resumoTotalSaidas = document.getElementById("resumoTotalSaidas");
const resumoSaldoEsperado = document.getElementById("resumoSaldoEsperado");
const txtValorFinalCaixa = document.getElementById("txtValorFinalCaixa");
const txtObservacaoFechamento = document.getElementById(
    "txtObservacaoFechamento",
);
const mensagemFecharCaixa = document.getElementById("mensagemFecharCaixa");
const btnCancelarFecharCaixa = document.getElementById(
    "btnCancelarFecharCaixa",
);

const modalMovimentacao = document.getElementById("modalMovimentacao");
const tituloModalMovimentacao = document.getElementById(
    "tituloModalMovimentacao",
);
const btnFecharModalMovimentacao = document.getElementById(
    "btnFecharModalMovimentacao",
);
const formMovimentacao = document.getElementById("formMovimentacao");
const tipoMovimentacao = document.getElementById("tipoMovimentacao");
const txtDescricaoMovimentacao = document.getElementById(
    "txtDescricaoMovimentacao",
);
const txtValorMovimentacao = document.getElementById("txtValorMovimentacao");
const selectFormaPagamentoMovimentacao = document.getElementById(
    "selectFormaPagamentoMovimentacao",
);
const mensagemMovimentacao = document.getElementById("mensagemMovimentacao");
const btnCancelarMovimentacao = document.getElementById(
    "btnCancelarMovimentacao",
);

const modalDetalheHistorico = document.getElementById("modalDetalheHistorico");
const btnFecharModalDetalheHistorico = document.getElementById(
    "btnFecharModalDetalheHistorico",
);
const btnFecharDetalheHistorico = document.getElementById(
    "btnFecharDetalheHistorico",
);
const detalheOperadorAbertura = document.getElementById(
    "detalheOperadorAbertura",
);
const detalheOperadorFechamento = document.getElementById(
    "detalheOperadorFechamento",
);
const detalheValorInicial = document.getElementById("detalheValorInicial");
const detalheValorFinal = document.getElementById("detalheValorFinal");
const tbodyDetalheMovimentacoes = document.getElementById(
    "tbodyDetalheMovimentacoes",
);

/* ==========================================================
    ESTADO
   ========================================================== */

let statusAtual = { aberto: false };
let historico = [];

const usuarioLogado = JSON.parse(sessionStorage.getItem("usuarioLogado"));

if (!usuarioLogado) {
    window.location.href = "login.html";
}

const ehAdmin = usuarioLogado.tipo === "admin";

/* ==========================================================
    PERMISSÃO (Histórico Financeiro é só para admin)
   ========================================================== */

function aplicarPermissoes() {
    document.querySelectorAll(".somente-admin").forEach((el) => {
        el.classList.toggle("hidden", !ehAdmin);
    });
}

/* ==========================================================
    STATUS DO CAIXA
   ========================================================== */

async function carregarStatusCaixa() {
    const resposta = await window.api.obterStatusCaixa();

    if (!resposta.sucesso) {
        mostrarToast(resposta.mensagem, "error");
        return;
    }

    statusAtual = resposta;
    renderizarStatusCaixa();
}

function renderizarStatusCaixa() {
    if (!statusAtual.aberto) {
        avisoCaixaFechado.classList.remove("hidden");
        blocoCaixaAberto.classList.add("hidden");
        btnAbrirCaixa.classList.remove("hidden");
        btnFecharCaixa.classList.add("hidden");
        return;
    }

    avisoCaixaFechado.classList.add("hidden");
    blocoCaixaAberto.classList.remove("hidden");
    btnAbrirCaixa.classList.add("hidden");
    btnFecharCaixa.classList.remove("hidden");

    statusDataAbertura.textContent = formatarDataHora(
        statusAtual.caixa.data_abertura,
    );
    statusValorInicial.textContent = formatarMoeda(
        statusAtual.caixa.valor_inicial,
    );
    statusTotalEntradas.textContent = formatarMoeda(statusAtual.totalEntradas);
    statusTotalSaidas.textContent = formatarMoeda(statusAtual.totalSaidas);
    statusSaldoAtual.textContent = formatarMoeda(statusAtual.saldoAtual);

    aplicarFiltrosMovimentacoes();
}

/* ==========================================================
    MOVIMENTAÇÕES
   ========================================================== */

function renderizarMovimentacoes(lista) {
    tbodyMovimentacoes.innerHTML = "";

    if (!lista || lista.length === 0) {
        tbodyMovimentacoes.innerHTML = `
            <tr>
                <td colspan="6" class="empty-table">Nenhuma movimentação registrada hoje.</td>
            </tr>
        `;
        return;
    }

    lista.forEach((mov) => {
        const tr = document.createElement("tr");
        const classeTipo =
            mov.tipo === "Entrada" ? "status-ativo" : "status-inativo";

        tr.innerHTML = `
            <td><span class="status-badge ${classeTipo}">${mov.tipo}</span></td>
            <td>${mov.descricao}</td>
            <td>${mov.forma_pagamento || "-"}</td>
            <td>${formatarMoeda(mov.valor)}</td>
            <td>${formatarDataHora(mov.criado_em)}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-action btn-delete" title="Excluir" data-id="${mov.id}">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </td>
        `;

        tbodyMovimentacoes.appendChild(tr);
    });
}

function aplicarFiltrosMovimentacoes() {
    if (!statusAtual.aberto) return;

    const termo = txtPesquisarMovimentacao.value.trim().toLowerCase();
    const tipoFiltro = selectFiltroTipoMovimentacao.value;

    const filtradas = statusAtual.movimentacoes.filter((mov) => {
        const bateTermo = !termo || mov.descricao.toLowerCase().includes(termo);
        const bateTipo = !tipoFiltro || mov.tipo === tipoFiltro;
        return bateTermo && bateTipo;
    });

    renderizarMovimentacoes(filtradas);
}

tbodyMovimentacoes.addEventListener("click", async (event) => {
    const botao = event.target.closest("button[data-id]");
    if (!botao) return;

    const confirmar = await confirmarAcao({
        titulo: "Excluir movimentação",
        mensagem: "Deseja realmente excluir esta movimentação?",
        textoCancelar: "Cancelar",
        textoConfirmar: "Excluir",
    });

    if (!confirmar) return;

    const resposta = await window.api.excluirMovimentacao(
        Number(botao.dataset.id),
    );
    mostrarToast(resposta.mensagem, resposta.sucesso ? "success" : "error");
    await carregarStatusCaixa();
});

txtPesquisarMovimentacao.addEventListener("input", aplicarFiltrosMovimentacoes);
selectFiltroTipoMovimentacao.addEventListener(
    "change",
    aplicarFiltrosMovimentacoes,
);

/* ==========================================================
    ABRIR CAIXA
   ========================================================== */

btnAbrirCaixa.addEventListener("click", () => {
    formAbrirCaixa.reset();
    mensagemAbrirCaixa.textContent = "";
    modalAbrirCaixa.classList.remove("hidden");
});

function fecharModalAbrirCaixa() {
    modalAbrirCaixa.classList.add("hidden");
}

btnFecharModalAbrirCaixa.addEventListener("click", fecharModalAbrirCaixa);
btnCancelarAbrirCaixa.addEventListener("click", fecharModalAbrirCaixa);

formAbrirCaixa.addEventListener("submit", async (event) => {
    event.preventDefault();
    mensagemAbrirCaixa.textContent = "";

    const resposta = await window.api.abrirCaixa({
        usuario_abertura_id: usuarioLogado.id,
        valor_inicial: Number(txtValorInicialCaixa.value) || 0,
        observacao: txtObservacaoAbertura.value.trim(),
    });

    if (!resposta.sucesso) {
        mensagemAbrirCaixa.textContent = resposta.mensagem;
        mostrarToast(resposta.mensagem, "error");
        return;
    }

    fecharModalAbrirCaixa();
    mostrarToast(resposta.mensagem, "success");
    await carregarStatusCaixa();
});

/* ==========================================================
    FECHAR CAIXA
   ========================================================== */

btnFecharCaixa.addEventListener("click", () => {
    if (!statusAtual.aberto) return;

    formFecharCaixa.reset();
    mensagemFecharCaixa.textContent = "";

    resumoValorInicial.textContent = formatarMoeda(
        statusAtual.caixa.valor_inicial,
    );
    resumoTotalEntradas.textContent = formatarMoeda(statusAtual.totalEntradas);
    resumoTotalSaidas.textContent = formatarMoeda(statusAtual.totalSaidas);
    resumoSaldoEsperado.textContent = formatarMoeda(statusAtual.saldoAtual);

    modalFecharCaixa.classList.remove("hidden");
});

function fecharModalFecharCaixa() {
    modalFecharCaixa.classList.add("hidden");
}

btnFecharModalFecharCaixa.addEventListener("click", fecharModalFecharCaixa);
btnCancelarFecharCaixa.addEventListener("click", fecharModalFecharCaixa);

formFecharCaixa.addEventListener("submit", async (event) => {
    event.preventDefault();
    mensagemFecharCaixa.textContent = "";

    const resposta = await window.api.fecharCaixa({
        id: statusAtual.caixa.id,
        valor_final: Number(txtValorFinalCaixa.value) || 0,
        usuario_fechamento_id: usuarioLogado.id,
        observacao: txtObservacaoFechamento.value.trim(),
    });

    if (!resposta.sucesso) {
        mensagemFecharCaixa.textContent = resposta.mensagem;
        mostrarToast(resposta.mensagem, "error");
        return;
    }

    fecharModalFecharCaixa();
    mostrarToast(
        resposta.mensagem,
        resposta.divergencia ? "warning" : "success",
    );
    await carregarStatusCaixa();

    if (ehAdmin) {
        await carregarHistorico();
    }
});

/* ==========================================================
    NOVA ENTRADA / SAÍDA
   ========================================================== */

function abrirModalMovimentacao(tipo) {
    formMovimentacao.reset();
    mensagemMovimentacao.textContent = "";
    tipoMovimentacao.value = tipo;
    tituloModalMovimentacao.textContent =
        tipo === "Entrada" ? "Nova Entrada" : "Nova Saída";
    modalMovimentacao.classList.remove("hidden");
}

function fecharModalMovimentacao() {
    modalMovimentacao.classList.add("hidden");
}

btnNovaEntrada.addEventListener("click", () =>
    abrirModalMovimentacao("Entrada"),
);
btnNovaSaida.addEventListener("click", () => abrirModalMovimentacao("Saída"));
btnFecharModalMovimentacao.addEventListener("click", fecharModalMovimentacao);
btnCancelarMovimentacao.addEventListener("click", fecharModalMovimentacao);

formMovimentacao.addEventListener("submit", async (event) => {
    event.preventDefault();
    mensagemMovimentacao.textContent = "";

    const resposta = await window.api.registrarMovimentacao({
        tipo: tipoMovimentacao.value,
        descricao: txtDescricaoMovimentacao.value.trim(),
        valor: Number(txtValorMovimentacao.value) || 0,
        forma_pagamento: selectFormaPagamentoMovimentacao.value || null,
    });

    if (!resposta.sucesso) {
        mensagemMovimentacao.textContent = resposta.mensagem;
        mostrarToast(resposta.mensagem, "error");
        return;
    }

    fecharModalMovimentacao();
    mostrarToast(resposta.mensagem, "success");
    await carregarStatusCaixa();
});

/* ==========================================================
    HISTÓRICO FINANCEIRO (somente admin)
   ========================================================== */

async function carregarHistorico() {
    const resposta = await window.api.listarHistoricoCaixa();

    if (!resposta.sucesso) {
        mostrarToast(resposta.mensagem, "error");
        return;
    }

    historico = resposta.historico;
    aplicarFiltrosHistorico();
}

function renderizarHistorico(lista) {
    tbodyHistoricoCaixa.innerHTML = "";

    if (!lista || lista.length === 0) {
        tbodyHistoricoCaixa.innerHTML = `
            <tr>
                <td colspan="8" class="empty-table">Nenhum histórico encontrado.</td>
            </tr>
        `;
        return;
    }

    lista.forEach((registro) => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${formatarDataHora(registro.data_abertura)}</td>
            <td>${formatarDataHora(registro.data_fechamento)}</td>
            <td>${registro.operador_abertura || "-"}</td>
            <td>${formatarMoeda(registro.valor_inicial)}</td>
            <td>${formatarMoeda(registro.valor_final)}</td>
            <td>${formatarMoeda(registro.total_entradas)}</td>
            <td>${formatarMoeda(registro.total_saidas)}</td>
            <td>
                <button class="btn-action btn-edit" title="Ver detalhes" data-id="${registro.id}">
                    <i class="fa-solid fa-eye"></i>
                </button>
            </td>
        `;

        tbodyHistoricoCaixa.appendChild(tr);
    });
}

function aplicarFiltrosHistorico() {
    const inicio = filtroDataInicioHistorico.value;
    const fim = filtroDataFimHistorico.value;

    const filtrados = historico.filter((registro) => {
        const dataRegistro = (registro.data_abertura || "").slice(0, 10);
        const bateInicio = !inicio || dataRegistro >= inicio;
        const bateFim = !fim || dataRegistro <= fim;
        return bateInicio && bateFim;
    });

    renderizarHistorico(filtrados);
}

filtroDataInicioHistorico.addEventListener("change", aplicarFiltrosHistorico);
filtroDataFimHistorico.addEventListener("change", aplicarFiltrosHistorico);

tbodyHistoricoCaixa.addEventListener("click", async (event) => {
    const botao = event.target.closest("button[data-id]");
    if (!botao) return;

    const resposta = await window.api.buscarDetalheHistoricoCaixa(
        Number(botao.dataset.id),
    );

    if (!resposta.sucesso) {
        mostrarToast(resposta.mensagem, "error");
        return;
    }

    const detalhe = resposta.detalhe;

    detalheOperadorAbertura.textContent = detalhe.operador_abertura || "-";
    detalheOperadorFechamento.textContent = detalhe.operador_fechamento || "-";
    detalheValorInicial.textContent = formatarMoeda(detalhe.valor_inicial);
    detalheValorFinal.textContent = formatarMoeda(detalhe.valor_final);

    tbodyDetalheMovimentacoes.innerHTML = "";

    if (!detalhe.movimentacoes || detalhe.movimentacoes.length === 0) {
        tbodyDetalheMovimentacoes.innerHTML = `
            <tr><td colspan="5" class="empty-table">Nenhuma movimentação.</td></tr>
        `;
    } else {
        detalhe.movimentacoes.forEach((mov) => {
            const tr = document.createElement("tr");
            const classeTipo =
                mov.tipo === "Entrada" ? "status-ativo" : "status-inativo";

            tr.innerHTML = `
                <td><span class="status-badge ${classeTipo}">${mov.tipo}</span></td>
                <td>${mov.descricao}</td>
                <td>${mov.forma_pagamento || "-"}</td>
                <td>${formatarMoeda(mov.valor)}</td>
                <td>${formatarDataHora(mov.criado_em)}</td>
            `;

            tbodyDetalheMovimentacoes.appendChild(tr);
        });
    }

    modalDetalheHistorico.classList.remove("hidden");
});

function fecharModalDetalheHistorico() {
    modalDetalheHistorico.classList.add("hidden");
}

btnFecharModalDetalheHistorico.addEventListener(
    "click",
    fecharModalDetalheHistorico,
);
btnFecharDetalheHistorico.addEventListener(
    "click",
    fecharModalDetalheHistorico,
);

/* ==========================================================
    EVENTOS GERAIS
   ========================================================== */

btnSair.addEventListener("click", () => {
    sessionStorage.removeItem("usuarioLogado");
    window.location.href = "login.html";
});

/* ==========================================================
    INICIALIZAÇÃO
   ========================================================== */

(async function iniciar() {
    aplicarPermissoes();
    await carregarStatusCaixa();

    if (ehAdmin) {
        await carregarHistorico();
    }
})();
