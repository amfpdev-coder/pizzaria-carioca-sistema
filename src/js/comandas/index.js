/* ==========================================================
    REFERÊNCIAS DO DOM
   ========================================================== */

const btnSair = document.getElementById("btnSair");
const btnImprimirTodas = document.getElementById("btnImprimirTodas");

const txtPesquisarComanda = document.getElementById("txtPesquisarComanda");
const filtroDataComanda = document.getElementById("filtroDataComanda");
const selectFiltroStatusComanda = document.getElementById("selectFiltroStatusComanda");
const tbodyComandas = document.getElementById("tbodyComandas");

const modalComanda = document.getElementById("modalComanda");
const tituloModalComanda = document.getElementById("tituloModalComanda");
const btnFecharModalComanda = document.getElementById("btnFecharModalComanda");
const btnFecharComanda = document.getElementById("btnFecharComanda");
const btnImprimirComanda = document.getElementById("btnImprimirComanda");
const btnSalvarPdfComanda = document.getElementById("btnSalvarPdfComanda");
const comandaConteudo = document.getElementById("comandaConteudo");
const areaImpressao = document.getElementById("areaImpressao");

/* ==========================================================
    ESTADO
   ========================================================== */

let pedidos = [];

const usuarioLogado = JSON.parse(sessionStorage.getItem("usuarioLogado"));

if (!usuarioLogado) {
    window.location.href = "login.html";
}

/* ==========================================================
    CARREGAMENTO
   ========================================================== */

async function carregarPedidos() {
    const resposta = await window.api.listarPedidos();

    if (!resposta.sucesso) {
        mostrarToast(resposta.mensagem, "error");
        return;
    }

    pedidos = resposta.pedidos;
    aplicarFiltros();
}

/* ==========================================================
    LISTAGEM / FILTROS
   ========================================================== */

const MAPA_STATUS_CLASSE = {
    Aberto: "status-aberto",
    "Em Produção": "status-em-producao",
    Finalizado: "status-finalizado",
    Cancelado: "status-cancelado",
};

function montarBadgeStatus(status) {
    const classe = MAPA_STATUS_CLASSE[status] || "status-aberto";
    return `<span class="status-badge ${classe}">${status}</span>`;
}

function pedidoEhDoDia(pedido, dataFiltro) {
    if (!dataFiltro) {
        return true;
    }

    const dataPedido = (pedido.criado_em || "").slice(0, 10);
    return dataPedido === dataFiltro;
}

function renderizarComandas(lista) {
    tbodyComandas.innerHTML = "";

    if (!lista || lista.length === 0) {
        tbodyComandas.innerHTML = `
            <tr>
                <td colspan="6" class="empty-table">Nenhuma comanda encontrada.</td>
            </tr>
        `;
        return;
    }

    lista.forEach((pedido) => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${pedido.id}</td>
            <td>
                <strong>${pedido.cliente_nome || "Cliente não informado"}</strong>
                <small>${pedido.cliente_telefone || ""}</small>
            </td>
            <td>${pedido.total_itens} item(ns)</td>
            <td>${montarBadgeStatus(pedido.status)}</td>
            <td>${formatarDataHora(pedido.criado_em)}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-action btn-print" title="Ver / imprimir comanda" data-id="${pedido.id}">
                        <i class="fa-solid fa-print"></i>
                    </button>
                </div>
            </td>
        `;

        tbodyComandas.appendChild(tr);
    });
}

function aplicarFiltros() {
    const termo = txtPesquisarComanda.value.trim().toLowerCase();
    const dataFiltro = filtroDataComanda.value;
    const statusFiltro = selectFiltroStatusComanda.value;

    const filtrados = pedidos.filter((pedido) => {
        const bateTermo =
            !termo ||
            String(pedido.cliente_nome || "").toLowerCase().includes(termo) ||
            String(pedido.id).includes(termo);

        const bateStatus = !statusFiltro || pedido.status === statusFiltro;
        const bateData = pedidoEhDoDia(pedido, dataFiltro);

        return bateTermo && bateStatus && bateData;
    });

    renderizarComandas(filtrados);
}

/* ==========================================================
    MONTAGEM DA COMANDA (HTML do "papel")
   ========================================================== */

function montarLinhaItem(item) {
    if (item.tipo_item === "Pizza") {
        const sabores = [item.sabor_1_nome, item.sabor_2_nome, item.sabor_3_nome]
            .filter(Boolean)
            .join(" / ");

        return `
            <div class="comanda-item-linha">
                <strong>${item.quantidade}x Pizza ${item.tamanho_nome}</strong>
            </div>
            <div class="comanda-item-sabores">${sabores}</div>
            ${item.observacao ? `<div class="comanda-item-sabores">Obs: ${item.observacao}</div>` : ""}
        `;
    }

    if (item.tipo_item === "Bebida") {
        return `
            <div class="comanda-item-linha">
                <strong>${item.quantidade}x ${item.bebida_nome}</strong>
            </div>
        `;
    }

    if (item.tipo_item === "Combo") {
        let saboresHtml = "";

        try {
            const saboresCombo = item.observacao
                ? JSON.parse(item.observacao)
                : [];

            if (Array.isArray(saboresCombo) && saboresCombo.length > 0) {
                saboresHtml = saboresCombo.map((s, i) => {
                    const partes = [s.sabor1_nome, s.sabor2_nome].filter(Boolean).join(" / ");
                    return `<div class="comanda-item-sabores">Pizza ${i + 1}: ${partes}</div>`;
                }).join("");
            }
        } catch (e) {
            if (item.observacao) {
                saboresHtml = `<div class="comanda-item-sabores">Obs: ${item.observacao}</div>`;
            }
        }

        return `
            <div class="comanda-item-linha">
                <strong>${item.quantidade}x ${item.combo_nome}</strong>
            </div>
            ${saboresHtml}
        `;
    }

    return `
        <div class="comanda-item-linha">
            <strong>${item.quantidade}x ${item.adicional_nome}</strong>
        </div>
    `;
}

function montarHtmlComanda(pedido, aplicarQuebra) {
    const endereco = [pedido.cliente_endereco, pedido.cliente_numero, pedido.cliente_bairro]
        .filter(Boolean)
        .join(", ");

    const classeQuebra = aplicarQuebra ? " comanda-quebra-pagina" : "";

    return `
        <div class="comanda-papel${classeQuebra}">
            <div class="comanda-cabecalho">
                <strong>Pizzaria Carioca</strong>
                <span>Pedido #${pedido.id}</span>
                <span>${formatarDataHora(pedido.criado_em)}</span>
            </div>

            <div class="comanda-secao">
                <h4>Cliente</h4>
                <p>${pedido.cliente_nome || "Não informado"}</p>
                <p>${pedido.cliente_telefone || ""}</p>
                <p>${endereco || "Sem endereço cadastrado"}</p>
                ${pedido.cliente_ponto_referencia ? `<p>Ref: ${pedido.cliente_ponto_referencia}</p>` : ""}
            </div>

            <div class="comanda-secao">
                <h4>Itens</h4>
                ${(pedido.itens || []).map(montarLinhaItem).join("")}
            </div>

            ${pedido.observacao ? `
            <div class="comanda-secao">
                <h4>Observação do cliente</h4>
                <p>${pedido.observacao}</p>
            </div>
            ` : ""}

            ${pedido.descricao_complementar ? `
            <div class="comanda-secao">
                <h4>Descrição complementar</h4>
                <p>${pedido.descricao_complementar}</p>
            </div>
            ` : ""}

            <div class="comanda-secao comanda-totais">
                <p>Forma de pagamento: <strong>${pedido.forma_pagamento || "-"}</strong></p>
                ${pedido.forma_pagamento && pedido.forma_pagamento.includes("+") ? `
                    ${Number(pedido.valor_pix) > 0 ? `<p>Pix: <strong>${formatarMoeda(pedido.valor_pix)}</strong></p>` : ""}
                    ${Number(pedido.valor_dinheiro) > 0 ? `<p>Dinheiro: <strong>${formatarMoeda(pedido.valor_dinheiro)}</strong></p>` : ""}
                    ${Number(pedido.valor_cartao) > 0 ? `<p>Cartão: <strong>${formatarMoeda(pedido.valor_cartao)}</strong></p>` : ""}
                ` : ""}
                ${pedido.forma_pagamento && pedido.forma_pagamento.includes("Dinheiro") && Number(pedido.valor_recebido) > 0
                    ? `<p>Valor recebido: <strong>${formatarMoeda(pedido.valor_recebido)}</strong></p>`
                    : ""}
                ${pedido.forma_pagamento && pedido.forma_pagamento.includes("Dinheiro") && Number(pedido.troco) > 0
                    ? `<p>Troco: <strong>${formatarMoeda(pedido.troco)}</strong></p>`
                    : ""}
                <p>Taxa de entrega: <strong>${formatarMoeda(pedido.taxa_entrega)}</strong></p>
                <p class="comanda-total-final">Total: <strong>${formatarMoeda(pedido.total)}</strong></p>
            </div>
        </div>
    `;
}

/* ==========================================================
    AÇÕES
   ========================================================== */

async function abrirComanda(id) {
    const resposta = await window.api.buscarPedidoPorId(id);

    if (!resposta.sucesso) {
        mostrarToast(resposta.mensagem, "error");
        return;
    }

    tituloModalComanda.textContent = `Comanda do Pedido #${id}`;
    comandaConteudo.innerHTML = montarHtmlComanda(resposta.pedido, false);
    areaImpressao.innerHTML = comandaConteudo.innerHTML;
    modalComanda.classList.remove("hidden");
}

function fecharModalComanda() {
    modalComanda.classList.add("hidden");
    comandaConteudo.innerHTML = "";
    areaImpressao.innerHTML = "";
}

async function imprimirTodasDoDia() {
    const hoje = obterDataLocalISO();
    const pedidosHoje = pedidos.filter((pedido) => pedidoEhDoDia(pedido, hoje));

    if (pedidosHoje.length === 0) {
        mostrarToast("Não há pedidos registrados hoje.", "warning");
        return;
    }

    const detalhes = await Promise.all(
        pedidosHoje.map((pedido) => window.api.buscarPedidoPorId(pedido.id))
    );

    const pedidosValidos = detalhes
        .filter((resposta) => resposta.sucesso)
        .map((resposta) => resposta.pedido);

    const htmlCompleto = pedidosValidos
        .map((pedido, index) => montarHtmlComanda(pedido, index < pedidosValidos.length - 1))
        .join("");

    tituloModalComanda.textContent = `Comandas do dia (${pedidosHoje.length})`;
    comandaConteudo.innerHTML = htmlCompleto;
    areaImpressao.innerHTML = htmlCompleto;
    modalComanda.classList.remove("hidden");

    setTimeout(async () => {
        const html = areaImpressao.innerHTML;
        const resultado = await window.api.imprimirComanda(html);
        if (!resultado.sucesso) {
            mostrarToast("Erro ao imprimir: " + (resultado.errorType || "desconhecido"), "error");
        }
    }, 200);
}

tbodyComandas.addEventListener("click", (event) => {
    const botao = event.target.closest("button[data-id]");
    if (!botao) return;

    abrirComanda(Number(botao.dataset.id));
});

btnFecharModalComanda.addEventListener("click", fecharModalComanda);
btnFecharComanda.addEventListener("click", fecharModalComanda);

btnImprimirComanda.addEventListener("click", async () => {
    const html = areaImpressao.innerHTML;
    const resultado = await window.api.imprimirComanda(html);
    if (!resultado.sucesso) {
        mostrarToast("Erro ao imprimir: " + (resultado.errorType || "desconhecido"), "error");
    }
});

btnSalvarPdfComanda.addEventListener("click", async () => {
    const html = areaImpressao.innerHTML;
    const resultado = await window.api.imprimirComanda(html, true);
    if (!resultado.sucesso) {
        mostrarToast("Erro ao salvar PDF: " + (resultado.errorType || "desconhecido"), "error");
    }
});

btnImprimirTodas.addEventListener("click", imprimirTodasDoDia);

txtPesquisarComanda.addEventListener("input", aplicarFiltros);
filtroDataComanda.addEventListener("change", aplicarFiltros);
selectFiltroStatusComanda.addEventListener("change", aplicarFiltros);

btnSair.addEventListener("click", () => {
    sessionStorage.removeItem("usuarioLogado");
    window.location.href = "login.html";
});

/* ==========================================================
    INICIALIZAÇÃO
   ========================================================== */

carregarPedidos();

const idPedidoNaUrl = new URLSearchParams(window.location.search).get("pedido");

if (idPedidoNaUrl) {
    abrirComanda(Number(idPedidoNaUrl));
}