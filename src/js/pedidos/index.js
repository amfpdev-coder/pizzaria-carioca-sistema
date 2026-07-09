/* ==========================================================
    REFERÊNCIAS DO DOM
   ========================================================== */

const btnSair = document.getElementById("btnSair");
const btnNovoPedido = document.getElementById("btnNovoPedido");

const txtPesquisarPedido = document.getElementById("txtPesquisarPedido");
const selectFiltroStatus = document.getElementById("selectFiltroStatus");
const tbodyPedidos = document.getElementById("tbodyPedidos");

const modalPedido = document.getElementById("modalPedido");
const tituloModalPedido = document.getElementById("tituloModalPedido");
const btnFecharModalPedido = document.getElementById("btnFecharModalPedido");
const btnCancelarPedido = document.getElementById("btnCancelarPedido");
const formPedido = document.getElementById("formPedido");
const pedidoId = document.getElementById("pedidoId");
const clienteIdPedido = document.getElementById("clienteIdPedido");
const mensagemPedido = document.getElementById("mensagemPedido");

const txtBuscarCliente = document.getElementById("txtBuscarCliente");
const listaResultadosCliente = document.getElementById(
    "listaResultadosCliente",
);
const clienteSelecionadoCard = document.getElementById(
    "clienteSelecionadoCard",
);
const clienteSelecionadoNome = document.getElementById(
    "clienteSelecionadoNome",
);
const clienteSelecionadoTelefone = document.getElementById(
    "clienteSelecionadoTelefone",
);
const clienteSelecionadoEndereco = document.getElementById(
    "clienteSelecionadoEndereco",
);
const btnTrocarCliente = document.getElementById("btnTrocarCliente");

const selectTipoItem = document.getElementById("selectTipoItem");
const camposPizza = document.getElementById("camposPizza");
const camposCombo = document.getElementById("camposCombo");
const camposBebida = document.getElementById("camposBebida");
const camposAdicional = document.getElementById("camposAdicional");

const selectTamanhoPedido = document.getElementById("selectTamanhoPedido");
const selectTipoPizza = document.getElementById("selectTipoPizza");
const selectSabor1Pedido = document.getElementById("selectSabor1Pedido");
const grupoSabor2 = document.getElementById("grupoSabor2");
const selectSabor2Pedido = document.getElementById("selectSabor2Pedido");
const grupoSabor3 = document.getElementById("grupoSabor3");
const selectSabor3Pedido = document.getElementById("selectSabor3Pedido");
const txtQuantidadePizza = document.getElementById("txtQuantidadePizza");
const txtValorUnitarioPizza = document.getElementById("txtValorUnitarioPizza");
const txtObservacaoPizza = document.getElementById("txtObservacaoPizza");

const selectComboPedido = document.getElementById("selectComboPedido");
const txtQuantidadeCombo = document.getElementById("txtQuantidadeCombo");
const txtAcrescimoCombo = document.getElementById("txtAcrescimoCombo");
const txtValorUnitarioCombo = document.getElementById("txtValorUnitarioCombo");
const listaSaboresCombo = document.getElementById("listaSaboresCombo");
const txtObservacaoCombo = document.getElementById("txtObservacaoCombo");

const selectBebidaPedido = document.getElementById("selectBebidaPedido");
const txtQuantidadeBebida = document.getElementById("txtQuantidadeBebida");

const selectAdicionalPedido = document.getElementById("selectAdicionalPedido");
const txtQuantidadeAdicional = document.getElementById(
    "txtQuantidadeAdicional",
);

const selectFormaPagamento = document.getElementById("selectFormaPagamento");

const selectModoPagamento = document.getElementById("selectModoPagamento");
const campoPagamentoUnico = document.getElementById("campoPagamentoUnico");
const campoPagamentoMisto = document.getElementById("campoPagamentoMisto");

const selectFormaPagamentoUnico = document.getElementById(
    "selectFormaPagamentoUnico",
);
const grupoTrocoUnico = document.getElementById("grupoTrocoUnico");
const grupoTrocoExibicaoUnico = document.getElementById(
    "grupoTrocoExibicaoUnico",
);
const txtValorRecebidoUnico = document.getElementById("txtValorRecebidoUnico");
const trocoExibicaoUnico = document.getElementById("trocoExibicaoUnico");

const selectFormaMisto1 = document.getElementById("selectFormaMisto1");
const txtValorMisto1 = document.getElementById("txtValorMisto1");
const selectFormaMisto2 = document.getElementById("selectFormaMisto2");
const txtValorMisto2 = document.getElementById("txtValorMisto2");
const grupoTrocoMisto = document.getElementById("grupoTrocoMisto");
const txtValorRecebidoMisto = document.getElementById("txtValorRecebidoMisto");
const trocoExibicaoMisto = document.getElementById("trocoExibicaoMisto");

const txtTaxaEntrega = document.getElementById("txtTaxaEntrega");
const selectStatusPedido = document.getElementById("selectStatusPedido");
const valorSubtotal = document.getElementById("valorSubtotal");
const valorTaxaEntrega = document.getElementById("valorTaxaEntrega");
const valorTotalGeral = document.getElementById("valorTotalGeral");
const resumoPagamento = document.getElementById("resumoPagamento");
const resumoPix = document.getElementById("resumoPix");
const resumoValorPix = document.getElementById("resumoValorPix");
const resumoDinheiro = document.getElementById("resumoDinheiro");
const resumoValorDinheiro = document.getElementById("resumoValorDinheiro");
const resumoCartao = document.getElementById("resumoCartao");
const resumoValorCartao = document.getElementById("resumoValorCartao");
const resumoEntrega = document.getElementById("resumoEntrega");
const resumoValorEntrega = document.getElementById("resumoValorEntrega");

const btnAdicionarItem = document.getElementById("btnAdicionarItem");
const tbodyItensPedido = document.getElementById("tbodyItensPedido");

/* ==========================================================
    ESTADO
   ========================================================== */

let sabores = [];
let tamanhos = [];
let bebidas = [];
let adicionais = [];
let combos = [];
let clientes = [];
let pedidos = [];
let precosCategoria = [];
let acrescimoCartao = 2;

let itensPedido = [];
let clienteSelecionado = null;
let proximoItemTempId = 1;
let itemEditandoTempId = null;

const usuarioLogado = JSON.parse(sessionStorage.getItem("usuarioLogado"));

if (!usuarioLogado) {
    window.location.href = "login.html";
}

/* ==========================================================
    CARREGAMENTO INICIAL
   ========================================================== */

async function carregarDadosApoio() {
    const [
        respSabores,
        respTamanhos,
        respBebidas,
        respAdicionais,
        respClientes,
        respAcrescimoCartao,
        respPrecosCategoria,
        respCombos,
    ] = await Promise.all([
        window.api.listarSabores(),
        window.api.listarTamanhos(),
        window.api.listarBebidas(),
        window.api.listarAdicionais(),
        window.api.listarClientes(),
        window.api.obterAcrescimoCartao(),
        window.api.listarPrecosCategoria(),
        window.api.listarCombos(),
    ]);

    sabores = (respSabores.sabores || []).filter((s) => Number(s.ativo) === 1);
    tamanhos = (respTamanhos.tamanhos || []).filter(
        (t) => Number(t.ativo) === 1,
    );
    bebidas = (respBebidas.bebidas || []).filter((b) => Number(b.ativo) === 1);
    adicionais = (respAdicionais.adicionais || []).filter(
        (a) => Number(a.ativo) === 1,
    );
    clientes = (respClientes.clientes || []).filter(
        (c) => Number(c.ativo) === 1,
    );
    acrescimoCartao = Number(respAcrescimoCartao.valor) || 2;
    precosCategoria = (respPrecosCategoria.precos || []).filter(
        (pc) => Number(pc.ativo) !== 0,
    );
    combos = (respCombos.combos || []).filter((c) => Number(c.ativo) === 1);

    preencherSelectsDeApoio();
}

function preencherSelectsDeApoio() {
    selectTamanhoPedido.innerHTML = tamanhos
        .map((t) => `<option value="${t.id}">${t.nome}</option>`)
        .join("");

    const opcoesSabores = sabores
        .map((s) => `<option value="${s.id}">${s.nome}</option>`)
        .join("");

    selectSabor1Pedido.innerHTML = opcoesSabores;
    selectSabor2Pedido.innerHTML = opcoesSabores;
    selectSabor3Pedido.innerHTML = opcoesSabores;

    selectBebidaPedido.innerHTML = bebidas
        .map(
            (b) =>
                `<option value="${b.id}">${b.nome} (${formatarMoeda(b.preco)})</option>`,
        )
        .join("");

    selectAdicionalPedido.innerHTML = adicionais
        .map(
            (a) =>
                `<option value="${a.id}">${a.nome} (${formatarMoeda(a.preco)})</option>`,
        )
        .join("");

    selectComboPedido.innerHTML =
        `<option value="">Selecione</option>` +
        combos
            .map(
                (c) =>
                    `<option value="${c.id}">${c.nome} (${formatarMoeda(c.preco_pix_dinheiro)})</option>`,
            )
            .join("");
}

/* ==========================================================
    FORMA DE PAGAMENTO — leitura centralizada
   ========================================================== */

function obterFormaPagamentoAtual() {
    const modo = selectModoPagamento.value;

    if (modo === "unico") {
        return selectFormaPagamentoUnico.value || "";
    }

    const f1 = selectFormaMisto1.value;
    const f2 = selectFormaMisto2.value;

    if (f1 && f2 && f1 !== f2) {
        return normalizarFormaMista(f1, f2);
    }

    return "";
}

function temCartaoNoPagamento() {
    return obterFormaPagamentoAtual().includes("Cartão");
}

function normalizarFormaMista(f1, f2) {
    const ordem = { Pix: 0, Dinheiro: 1, Cartão: 2 };
    const [a, b] = [f1, f2].sort((x, y) => ordem[x] - ordem[y]);
    return `${a}+${b}`;
}

function sincronizarFormaPagamento() {
    selectFormaPagamento.value = obterFormaPagamentoAtual();
    renderizarCarrinho();
}

function atualizarCamposPagamento() {
    const modo = selectModoPagamento.value;

    campoPagamentoUnico.classList.toggle("hidden", modo !== "unico");
    campoPagamentoMisto.classList.toggle("hidden", modo !== "misto");

    sincronizarFormaPagamento();
    atualizarTroco();
}

function atualizarTroco() {
    const modo = selectModoPagamento.value;
    const taxa = Number(txtTaxaEntrega.value) || 0;
    const subtotal = calcularSubtotal();
    const total = subtotal + taxa;

    if (modo === "unico") {
        const ehDinheiro = selectFormaPagamentoUnico.value === "Dinheiro";
        grupoTrocoUnico.classList.toggle("hidden", !ehDinheiro);
        grupoTrocoExibicaoUnico.classList.toggle("hidden", !ehDinheiro);

        if (ehDinheiro) {
            const recebido = Number(txtValorRecebidoUnico.value) || 0;
            const troco = Math.max(0, recebido - total);
            trocoExibicaoUnico.textContent = formatarMoeda(troco);
        }
    } else {
        const temDinheiro =
            selectFormaMisto1.value === "Dinheiro" ||
            selectFormaMisto2.value === "Dinheiro";

        grupoTrocoMisto.classList.toggle("hidden", !temDinheiro);

        if (temDinheiro) {
            const valorDinheiro =
                selectFormaMisto1.value === "Dinheiro"
                    ? Number(txtValorMisto1.value) || 0
                    : Number(txtValorMisto2.value) || 0;

            const recebido = Number(txtValorRecebidoMisto.value) || 0;
            const troco = Math.max(0, recebido - valorDinheiro);
            trocoExibicaoMisto.textContent = formatarMoeda(troco);
        }
    }
}

function atualizarResumoPagamento() {
    const modo = selectModoPagamento.value;
    const taxa = Number(txtTaxaEntrega.value) || 0;
    const subtotal = calcularSubtotal();
    const total = subtotal + taxa;
    const forma = obterFormaPagamentoAtual();

    resumoPix.classList.add("hidden");
    resumoDinheiro.classList.add("hidden");
    resumoCartao.classList.add("hidden");
    resumoEntrega.classList.add("hidden");
    resumoPagamento.classList.add("hidden");

    if (!forma) return;

    resumoPagamento.classList.remove("hidden");

    if (modo === "unico") {
        if (forma === "Pix") {
            resumoValorPix.textContent = formatarMoeda(total);
            resumoPix.classList.remove("hidden");
        } else if (forma === "Dinheiro") {
            resumoValorDinheiro.textContent = formatarMoeda(total);
            resumoDinheiro.classList.remove("hidden");
        } else if (forma === "Cartão") {
            resumoValorCartao.textContent = formatarMoeda(total);
            resumoCartao.classList.remove("hidden");
        }
    } else {
        const v1 = Number(txtValorMisto1.value) || 0;
        const v2 = Number(txtValorMisto2.value) || 0;
        const f1 = selectFormaMisto1.value;
        const f2 = selectFormaMisto2.value;

        if (f1 === "Pix" || f2 === "Pix") {
            resumoValorPix.textContent = formatarMoeda(f1 === "Pix" ? v1 : v2);
            resumoPix.classList.remove("hidden");
        }
        if (f1 === "Dinheiro" || f2 === "Dinheiro") {
            resumoValorDinheiro.textContent = formatarMoeda(
                f1 === "Dinheiro" ? v1 : v2,
            );
            resumoDinheiro.classList.remove("hidden");
        }
        if (f1 === "Cartão" || f2 === "Cartão") {
            resumoValorCartao.textContent = formatarMoeda(
                f1 === "Cartão" ? v1 : v2,
            );
            resumoCartao.classList.remove("hidden");
        }
    }

    if (taxa > 0) {
        resumoValorEntrega.textContent = formatarMoeda(taxa);
        resumoEntrega.classList.remove("hidden");
    }
}

/* ==========================================================
    AUTO-SUGESTÃO DE PREÇO DE PIZZA
   ========================================================== */

function sugerirPrecoPizza() {
    if (!sabores.length || !precosCategoria) return;

    const tamanhoId = Number(selectTamanhoPedido.value);
    const tipoPizza = selectTipoPizza.value;

    const saborIds = [
        Number(selectSabor1Pedido.value),
        tipoPizza !== "1 Sabor" ? Number(selectSabor2Pedido.value) : null,
        tipoPizza === "3 Sabores" ? Number(selectSabor3Pedido.value) : null,
    ].filter(Boolean);

    const saboresSelecionados = saborIds
        .map((id) => sabores.find((s) => Number(s.id) === id))
        .filter(Boolean);

    const saboresGourmet = saboresSelecionados.filter(
        (s) => s.categoria !== "Tradicional" && Number(s.preco_pix) > 0,
    );

    if (saboresGourmet.length > 0) {
        const maior = Math.max(
            ...saboresGourmet.map((s) => Number(s.preco_pix)),
        );
        txtValorUnitarioPizza.value = maior.toFixed(2);
        return;
    }

    const precoCategoria = precosCategoria.find(
        (pc) =>
            Number(pc.tamanho_id) === tamanhoId && pc.tipo_pizza === tipoPizza,
    );

    txtValorUnitarioPizza.value = precoCategoria
        ? Number(precoCategoria.preco_pix).toFixed(2)
        : "";
}

/* ==========================================================
    COMBO — campos de sabor dinâmicos
   ========================================================== */

function gerarCamposSaboresCombo(qtdPizzas, saboresExistentes = []) {
    listaSaboresCombo.innerHTML = "";

    if (!qtdPizzas || qtdPizzas <= 0) {
        listaSaboresCombo.innerHTML = `<small style="color: var(--color-muted);">Selecione um combo para informar os sabores.</small>`;
        return;
    }

    const saboresTradicional = sabores.filter(
        (s) => s.categoria === "Tradicional",
    );

    const opcoesSabores = saboresTradicional
        .map((s) => `<option value="${s.id}">${s.nome}</option>`)
        .join("");

    for (let i = 1; i <= qtdPizzas; i++) {
        const existente = saboresExistentes[i - 1] || {};
        const div = document.createElement("div");
        div.style.cssText = "display:flex; gap:8px; align-items:center;";
        div.innerHTML = `
            <label style="min-width:70px; font-size:13px;">Pizza ${i}</label>
            <select class="combo-sabor-1" data-pizza="${i}" style="flex:1;">
                ${opcoesSabores}
            </select>
            <select class="combo-sabor-2" data-pizza="${i}" style="flex:1;">
                <option value="">— 2º sabor (opcional) —</option>
                ${opcoesSabores}
            </select>
        `;
        listaSaboresCombo.appendChild(div);

        if (existente.sabor1_id) {
            div.querySelector(".combo-sabor-1").value = existente.sabor1_id;
        }
        if (existente.sabor2_id) {
            div.querySelector(".combo-sabor-2").value = existente.sabor2_id;
        }
    }
}

function recalcularValorCombo() {
    const comboId = Number(selectComboPedido.value);
    const combo = combos.find((c) => Number(c.id) === comboId);
    if (!combo) return;

    const base = Number(combo.preco_pix_dinheiro);
    const acrescimo = Number(txtAcrescimoCombo.value) || 0;
    txtValorUnitarioCombo.value = (base + acrescimo).toFixed(2);
}

function aoSelecionarCombo() {
    const comboId = Number(selectComboPedido.value);

    if (!comboId) {
        txtValorUnitarioCombo.value = "";
        txtAcrescimoCombo.value = "0";
        gerarCamposSaboresCombo(0);
        return;
    }

    const combo = combos.find((c) => Number(c.id) === comboId);
    if (!combo) return;

    txtAcrescimoCombo.value = "0";
    txtValorUnitarioCombo.value = Number(combo.preco_pix_dinheiro).toFixed(2);

    const descricao = combo.descricao || "";
    const match = descricao.match(/(\d+)\s*pizza/i);
    const qtdPizzas = match ? Number(match[1]) : 1;

    gerarCamposSaboresCombo(qtdPizzas);
}

selectComboPedido.addEventListener("change", aoSelecionarCombo);
txtAcrescimoCombo.addEventListener("input", recalcularValorCombo);

/* ==========================================================
    LISTAGEM / FILTROS
   ========================================================== */

async function carregarPedidos() {
    const resposta = await window.api.listarPedidos();

    if (!resposta.sucesso) {
        mostrarToast(resposta.mensagem, "error");
        return;
    }

    pedidos = resposta.pedidos;
    aplicarFiltrosPedidos();
}

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

function renderizarPedidos(lista) {
    tbodyPedidos.innerHTML = "";

    if (!lista || lista.length === 0) {
        tbodyPedidos.innerHTML = `
            <tr>
                <td colspan="7" class="empty-table">Nenhum pedido encontrado.</td>
            </tr>
        `;
        return;
    }

    lista.forEach((pedido) => {
        const tr = document.createElement("tr");
        const podeAlterar =
            pedido.status !== "Finalizado" &&
            pedido.status !== "Cancelado" &&
            usuarioLogado.tipo === "admin";

        tr.innerHTML = `
            <td>${pedido.id}</td>
            <td>
                <strong>${pedido.cliente_nome || "Cliente não informado"}</strong>
                <small>${pedido.cliente_telefone || ""}</small>
            </td>
            <td>${montarBadgeStatus(pedido.status)}</td>
            <td>${pedido.forma_pagamento || "-"}</td>
            <td>${formatarMoeda(pedido.total)}</td>
            <td>${formatarDataHora(pedido.criado_em)}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-action btn-edit" title="Ver/Editar pedido" data-action="editar" data-id="${pedido.id}">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button class="btn-action btn-print" title="Imprimir comanda" data-action="comanda" data-id="${pedido.id}">
                        <i class="fa-solid fa-print"></i>
                    </button>
                    ${
                        podeAlterar
                            ? `
                    <button class="btn-action btn-delete" title="Cancelar pedido" data-action="cancelar" data-id="${pedido.id}">
                        <i class="fa-solid fa-ban"></i>
                    </button>
                    `
                            : ""
                    }
                </div>
            </td>
        `;

        tbodyPedidos.appendChild(tr);
    });
}

function aplicarFiltrosPedidos() {
    const termo = txtPesquisarPedido.value.trim().toLowerCase();
    const statusFiltro = selectFiltroStatus.value;

    const filtrados = pedidos.filter((pedido) => {
        const bateTermo =
            !termo ||
            String(pedido.cliente_nome || "")
                .toLowerCase()
                .includes(termo) ||
            String(pedido.cliente_telefone || "")
                .toLowerCase()
                .includes(termo);

        const bateStatus = !statusFiltro || pedido.status === statusFiltro;

        return bateTermo && bateStatus;
    });

    renderizarPedidos(filtrados);
}

async function executarAcaoPedido(event) {
    const botao = event.target.closest("button");
    if (!botao) return;

    const acao = botao.dataset.action;
    const id = Number(botao.dataset.id);

    if (acao === "editar") {
        await abrirModalEditarPedido(id);
    }

    if (acao === "comanda") {
        window.location.href = `comandas.html?pedido=${id}`;
    }

    if (acao === "cancelar") {
        if (usuarioLogado.tipo !== "admin") {
            mostrarToast(
                "Apenas o administrador pode cancelar pedidos.",
                "warning",
            );
            return;
        }

        const confirmar = await confirmarAcao({
            titulo: "Cancelar pedido",
            mensagem: "Deseja realmente cancelar este pedido?",
            textoCancelar: "Voltar",
            textoConfirmar: "Cancelar pedido",
        });

        if (!confirmar) return;

        const resposta = await window.api.cancelarPedido(id);
        mostrarToast(resposta.mensagem, resposta.sucesso ? "success" : "error");
        await carregarPedidos();
    }
}

/* ==========================================================
    BUSCA DE CLIENTE
   ========================================================== */

function renderizarResultadosCliente(lista) {
    if (!lista || lista.length === 0) {
        listaResultadosCliente.innerHTML = `
            <div class="resultados-busca-item">
                <span>Nenhum cliente encontrado.</span>
            </div>
        `;
        listaResultadosCliente.classList.remove("hidden");
        return;
    }

    listaResultadosCliente.innerHTML = lista
        .map(
            (cliente) => `
            <div class="resultados-busca-item" data-id="${cliente.id}">
                <strong>${cliente.nome_completo}</strong>
                <span>${cliente.telefone || "sem telefone"} — ${cliente.bairro || "sem bairro"}</span>
            </div>
        `,
        )
        .join("");

    listaResultadosCliente.classList.remove("hidden");
}

function selecionarCliente(cliente) {
    clienteSelecionado = cliente;
    clienteIdPedido.value = cliente.id;

    clienteSelecionadoNome.textContent = cliente.nome_completo;
    clienteSelecionadoTelefone.textContent = cliente.telefone || "Sem telefone";

    const enderecoCompleto = [cliente.endereco, cliente.numero, cliente.bairro]
        .filter(Boolean)
        .join(", ");

    clienteSelecionadoEndereco.textContent =
        enderecoCompleto || "Sem endereço cadastrado";

    listaResultadosCliente.classList.add("hidden");
    txtBuscarCliente.value = "";
    txtBuscarCliente.closest(".form-group").classList.add("hidden");
    clienteSelecionadoCard.classList.remove("hidden");

    recolherSecaoCliente();
}

function trocarCliente() {
    clienteSelecionado = null;
    clienteIdPedido.value = "";
    clienteSelecionadoCard.classList.add("hidden");
    txtBuscarCliente.closest(".form-group").classList.remove("hidden");

    expandirSecaoCliente();
    txtBuscarCliente.focus();
}

txtBuscarCliente.addEventListener("input", () => {
    const termo = txtBuscarCliente.value.trim().toLowerCase();

    if (!termo) {
        listaResultadosCliente.classList.add("hidden");
        return;
    }

    const encontrados = clientes.filter(
        (cliente) =>
            String(cliente.nome_completo || "")
                .toLowerCase()
                .includes(termo) ||
            String(cliente.telefone || "")
                .toLowerCase()
                .includes(termo),
    );

    renderizarResultadosCliente(encontrados);
});

listaResultadosCliente.addEventListener("click", (event) => {
    const item = event.target.closest(".resultados-busca-item");
    if (!item || !item.dataset.id) return;

    const cliente = clientes.find(
        (c) => Number(c.id) === Number(item.dataset.id),
    );
    if (cliente) selecionarCliente(cliente);
});

btnTrocarCliente.addEventListener("click", trocarCliente);

/* ==========================================================
    ACORDEÃO DAS SEÇÕES
   ========================================================== */

function recolherSecaoCliente() {
    document.getElementById("secaoCliente")?.classList.add("recolhida");
}

function expandirSecaoCliente() {
    document.getElementById("secaoCliente")?.classList.remove("recolhida");
}

/* ==========================================================
    TIPO DE ITEM / TIPO DE PIZZA
   ========================================================== */

function atualizarCamposTipoItem() {
    const tipo = selectTipoItem.value;

    camposPizza.classList.toggle("hidden", tipo !== "Pizza");
    camposCombo.classList.toggle("hidden", tipo !== "Combo");
    camposBebida.classList.toggle("hidden", tipo !== "Bebida");
    camposAdicional.classList.toggle("hidden", tipo !== "Adicional");
}

function atualizarCamposTipoPizza() {
    const tipo = selectTipoPizza.value;

    grupoSabor2.classList.toggle("hidden", tipo === "1 Sabor");
    grupoSabor3.classList.toggle("hidden", tipo !== "3 Sabores");
}

function atualizarOpcoesPorTamanho() {
    const tamanhoId = Number(selectTamanhoPedido.value);
    const tamanho = tamanhos.find((t) => Number(t.id) === tamanhoId);
    const ehBrotinho =
        tamanho && tamanho.nome.toLowerCase().includes("brotinho");

    const opcaoMeioAMeio = selectTipoPizza.querySelector(
        'option[value="Meio a Meio"]',
    );
    const opcao3Sabores = selectTipoPizza.querySelector(
        'option[value="3 Sabores"]',
    );

    if (opcaoMeioAMeio) {
        opcaoMeioAMeio.disabled = ehBrotinho;
        opcaoMeioAMeio.hidden = ehBrotinho;
    }
    if (opcao3Sabores) {
        opcao3Sabores.disabled = ehBrotinho;
        opcao3Sabores.hidden = ehBrotinho;
    }

    if (ehBrotinho) {
        selectTipoPizza.value = "1 Sabor";
        atualizarCamposTipoPizza();
    }

    const saboresFiltrados = ehBrotinho
        ? sabores.filter((s) => s.categoria === "Tradicional")
        : sabores;

    const opcoesSabores = saboresFiltrados
        .map((s) => `<option value="${s.id}">${s.nome}</option>`)
        .join("");

    selectSabor1Pedido.innerHTML = opcoesSabores;
    selectSabor2Pedido.innerHTML = opcoesSabores;
    selectSabor3Pedido.innerHTML = opcoesSabores;

    sugerirPrecoPizza();
}

selectTipoItem.addEventListener("change", atualizarCamposTipoItem);
selectTipoPizza.addEventListener("change", atualizarCamposTipoPizza);
selectTipoPizza.addEventListener("change", sugerirPrecoPizza);
selectTamanhoPedido.addEventListener("change", atualizarOpcoesPorTamanho);
selectSabor1Pedido.addEventListener("change", sugerirPrecoPizza);
selectSabor2Pedido.addEventListener("change", sugerirPrecoPizza);
selectSabor3Pedido.addEventListener("change", sugerirPrecoPizza);

/* ==========================================================
    CARRINHO (ITENS DO PEDIDO)
   ========================================================== */

function obterValorUnitarioEfetivo(item) {
    if (item.tipo_item === "Pizza") {
        const base = Number(item.valor_base);
        return temCartaoNoPagamento()
            ? Number((base + acrescimoCartao).toFixed(2))
            : base;
    }

    return Number(item.valor_unitario);
}

function montarBadgePgto(item) {
    const forma = obterFormaPagamentoAtual();

    if (!forma) {
        return `<span style="color:var(--color-muted);font-size:12px;">—</span>`;
    }

    if (forma.includes("Cartão")) {
        return `<span class="status-badge" style="background:rgba(251,178,21,0.15);color:#FBB215;font-size:11px;">Cartão</span>`;
    }

    if (forma.includes("Pix")) {
        return `<span class="status-badge" style="background:rgba(96,165,250,0.15);color:#60a5fa;font-size:11px;">Pix</span>`;
    }

    return `<span class="status-badge" style="background:rgba(34,197,94,0.15);color:#4ade80;font-size:11px;">Dinheiro</span>`;
}

function montarDescricaoItem(item) {
    if (item.tipo_item === "Pizza") {
        const saboresTexto = [
            item.sabor_1_nome,
            item.sabor_2_nome,
            item.sabor_3_nome,
        ]
            .filter(Boolean)
            .join(" / ");

        return `<strong>Pizza ${item.tamanho_nome}</strong><small>${saboresTexto}</small>`;
    }

    if (item.tipo_item === "Combo") {
        const saboresTexto = (item.sabores_combo || [])
            .map((s, i) => {
                const partes = [s.sabor1_nome, s.sabor2_nome]
                    .filter(Boolean)
                    .join(" / ");
                return `Pizza ${i + 1}: ${partes}`;
            })
            .join(" | ");

        return `<strong>${item.combo_nome}</strong><small>${saboresTexto || "Sem sabores informados"}</small>`;
    }

    if (item.tipo_item === "Bebida") {
        return `<strong>${item.bebida_nome}</strong>`;
    }

    return `<strong>${item.adicional_nome}</strong>`;
}

function calcularSubtotal() {
    return itensPedido.reduce((soma, item) => {
        const valorUnitEfetivo = obterValorUnitarioEfetivo(item);
        return soma + Number((valorUnitEfetivo * item.quantidade).toFixed(2));
    }, 0);
}

function renderizarCarrinho() {
    tbodyItensPedido.innerHTML = "";

    if (itensPedido.length === 0) {
        tbodyItensPedido.innerHTML = `
            <tr>
                <td colspan="6" class="empty-table">Nenhum item adicionado.</td>
            </tr>
        `;
        atualizarTotais();
        return;
    }

    itensPedido.forEach((item) => {
        const tr = document.createElement("tr");
        const valorUnitEfetivo = obterValorUnitarioEfetivo(item);
        const valorTotalEfetivo = Number(
            (valorUnitEfetivo * item.quantidade).toFixed(2),
        );
        const estaEditando = item._tempId === itemEditandoTempId;

        tr.innerHTML = `
            <td>${montarDescricaoItem(item)}</td>
            <td>${item.quantidade}</td>
            <td>${formatarMoeda(valorUnitEfetivo)}</td>
            <td>${formatarMoeda(valorTotalEfetivo)}</td>
            <td>${montarBadgePgto(item)}</td>
            <td>
                <div class="action-buttons">
                    <button type="button" class="btn-action btn-edit ${estaEditando ? "btn-editando" : ""}" data-action-item="editar" data-temp-id="${item._tempId}" title="Editar item">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button type="button" class="btn-action btn-delete" data-action-item="remover" data-temp-id="${item._tempId}" title="Remover item">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </td>
        `;

        tbodyItensPedido.appendChild(tr);
    });

    atualizarTotais();
}

function atualizarTotais() {
    const subtotal = calcularSubtotal();
    const taxa = Number(txtTaxaEntrega.value) || 0;
    const total = subtotal + taxa;

    valorSubtotal.textContent = formatarMoeda(subtotal);
    valorTaxaEntrega.textContent = formatarMoeda(taxa);
    valorTotalGeral.textContent = formatarMoeda(total);

    atualizarTroco();
    atualizarResumoPagamento();
}

txtTaxaEntrega.addEventListener("input", atualizarTotais);

selectModoPagamento.addEventListener("change", atualizarCamposPagamento);
selectFormaPagamentoUnico.addEventListener("change", () => {
    sincronizarFormaPagamento();
    atualizarTroco();
    atualizarResumoPagamento();
});
txtValorRecebidoUnico.addEventListener("input", atualizarTroco);
selectFormaMisto1.addEventListener("change", () => {
    sincronizarFormaPagamento();
    atualizarTroco();
    atualizarResumoPagamento();
});
selectFormaMisto2.addEventListener("change", () => {
    sincronizarFormaPagamento();
    atualizarTroco();
    atualizarResumoPagamento();
});
txtValorMisto1.addEventListener("input", () => {
    atualizarTroco();
    atualizarResumoPagamento();
});
txtValorMisto2.addEventListener("input", () => {
    atualizarTroco();
    atualizarResumoPagamento();
});
txtValorRecebidoMisto.addEventListener("input", atualizarTroco);

function resetarFormularioItem() {
    itemEditandoTempId = null;
    btnAdicionarItem.innerHTML = `<i class="fa-solid fa-plus"></i> Adicionar Item`;

    txtQuantidadePizza.value = 1;
    txtValorUnitarioPizza.value = "";
    txtQuantidadeBebida.value = 1;
    txtQuantidadeAdicional.value = 1;
    txtQuantidadeCombo.value = 1;
    txtAcrescimoCombo.value = "0";
    txtObservacaoPizza.value = "";
    txtObservacaoCombo.value = "";
    selectSabor1Pedido.selectedIndex = 0;
    selectSabor2Pedido.selectedIndex = 0;
    selectSabor3Pedido.selectedIndex = 0;
    selectComboPedido.selectedIndex = 0;
    txtValorUnitarioCombo.value = "";
    gerarCamposSaboresCombo(0);
    sugerirPrecoPizza();
}

/* ==========================================================
    EDITAR ITEM DO CARRINHO
   ========================================================== */

function editarItemCarrinho(tempId) {
    const item = itensPedido.find((i) => i._tempId === tempId);
    if (!item) return;

    itemEditandoTempId = tempId;
    btnAdicionarItem.innerHTML = `<i class="fa-solid fa-floppy-disk"></i> Atualizar Item`;

    selectTipoItem.value = item.tipo_item;
    atualizarCamposTipoItem();

    if (item.tipo_item === "Pizza") {
        selectTamanhoPedido.value = item.tamanho_id;
        atualizarOpcoesPorTamanho();

        selectTipoPizza.value = item.tipo_pizza;
        atualizarCamposTipoPizza();

        if (item.sabor_1_id) selectSabor1Pedido.value = item.sabor_1_id;
        if (item.sabor_2_id) selectSabor2Pedido.value = item.sabor_2_id;
        if (item.sabor_3_id) selectSabor3Pedido.value = item.sabor_3_id;

        txtQuantidadePizza.value = item.quantidade;
        txtValorUnitarioPizza.value = Number(item.valor_base).toFixed(2);
        txtObservacaoPizza.value = item.observacao || "";
    } else if (item.tipo_item === "Combo") {
        selectComboPedido.value = item.combo_id;

        const combo = combos.find(
            (c) => Number(c.id) === Number(item.combo_id),
        );
        const descricao = combo?.descricao || "";
        const match = descricao.match(/(\d+)\s*pizza/i);
        const qtdPizzas = match ? Number(match[1]) : 1;

        gerarCamposSaboresCombo(qtdPizzas, item.sabores_combo || []);

        const base = Number(combo?.preco_pix_dinheiro || 0);
        const acrescimo = Number((item.valor_unitario - base).toFixed(2));
        txtAcrescimoCombo.value = acrescimo > 0 ? acrescimo.toFixed(2) : "0";
        txtValorUnitarioCombo.value = Number(item.valor_unitario).toFixed(2);

        txtQuantidadeCombo.value = item.quantidade;
        txtObservacaoCombo.value = item.observacao || "";
    } else if (item.tipo_item === "Bebida") {
        selectBebidaPedido.value = item.bebida_id;
        txtQuantidadeBebida.value = item.quantidade;
    } else if (item.tipo_item === "Adicional") {
        selectAdicionalPedido.value = item.adicional_id;
        txtQuantidadeAdicional.value = item.quantidade;
    }

    document
        .getElementById("camposPizza")
        ?.closest(".pedido-secao")
        ?.scrollIntoView({ behavior: "smooth" });

    renderizarCarrinho();
}

/* ==========================================================
    ADICIONAR / ATUALIZAR ITEM NO CARRINHO
   ========================================================== */

function adicionarItemAoPedido() {
    const tipo = selectTipoItem.value;
    const modoEdicao = itemEditandoTempId !== null;

    let novoItem = null;

    if (tipo === "Pizza") {
        const tamanhoId = Number(selectTamanhoPedido.value);
        const tipoPizza = selectTipoPizza.value;
        const quantidade = Number(txtQuantidadePizza.value) || 1;
        const observacao = txtObservacaoPizza.value.trim();

        const sabor1Id = Number(selectSabor1Pedido.value);
        const sabor2Id =
            tipoPizza !== "1 Sabor" ? Number(selectSabor2Pedido.value) : null;
        const sabor3Id =
            tipoPizza === "3 Sabores" ? Number(selectSabor3Pedido.value) : null;

        if (tipoPizza !== "1 Sabor" && sabor1Id === sabor2Id) {
            mostrarToast("Escolha sabores diferentes para a pizza.", "warning");
            return;
        }

        const valorDigitado = Number(txtValorUnitarioPizza.value);

        if (!valorDigitado || valorDigitado <= 0) {
            mostrarToast("Informe o valor unitário da pizza.", "warning");
            return;
        }

        const tamanho = tamanhos.find((t) => Number(t.id) === tamanhoId);

        novoItem = {
            tipo_item: "Pizza",
            tipo_pizza: tipoPizza,
            tamanho_id: tamanhoId,
            tamanho_nome: tamanho ? tamanho.nome : "",
            sabor_1_id: sabor1Id,
            sabor_1_nome:
                sabores.find((s) => Number(s.id) === sabor1Id)?.nome || "",
            sabor_2_id: sabor2Id,
            sabor_2_nome: sabor2Id
                ? sabores.find((s) => Number(s.id) === sabor2Id)?.nome || ""
                : null,
            sabor_3_id: sabor3Id,
            sabor_3_nome: sabor3Id
                ? sabores.find((s) => Number(s.id) === sabor3Id)?.nome || ""
                : null,
            regra_cobranca: "manual",
            quantidade,
            valor_base: valorDigitado,
            observacao,
        };
    } else if (tipo === "Combo") {
        const comboId = Number(selectComboPedido.value);

        if (!comboId) {
            mostrarToast("Selecione um combo.", "warning");
            return;
        }

        const combo = combos.find((c) => Number(c.id) === comboId);
        if (!combo) return;

        const quantidade = Number(txtQuantidadeCombo.value) || 1;
        const valorUnitario =
            Number(txtValorUnitarioCombo.value) ||
            Number(combo.preco_pix_dinheiro);
        const observacao = txtObservacaoCombo.value.trim();

        const linhasSabores =
            listaSaboresCombo.querySelectorAll("[data-pizza]");
        const pizzasMap = {};

        linhasSabores.forEach((el) => {
            const numPizza = el.dataset.pizza;
            if (!pizzasMap[numPizza]) pizzasMap[numPizza] = {};

            if (el.classList.contains("combo-sabor-1")) {
                const id = Number(el.value);
                pizzasMap[numPizza].sabor1_id = id;
                pizzasMap[numPizza].sabor1_nome =
                    sabores.find((s) => Number(s.id) === id)?.nome || "";
            }
            if (el.classList.contains("combo-sabor-2") && el.value) {
                const id = Number(el.value);
                pizzasMap[numPizza].sabor2_id = id;
                pizzasMap[numPizza].sabor2_nome =
                    sabores.find((s) => Number(s.id) === id)?.nome || "";
            }
        });

        novoItem = {
            tipo_item: "Combo",
            combo_id: comboId,
            combo_nome: combo.nome,
            sabores_combo: Object.values(pizzasMap),
            quantidade,
            valor_unitario: valorUnitario,
            observacao,
        };
    } else if (tipo === "Bebida") {
        const bebidaId = Number(selectBebidaPedido.value);
        const quantidade = Number(txtQuantidadeBebida.value) || 1;
        const bebida = bebidas.find((b) => Number(b.id) === bebidaId);

        if (!bebida) {
            mostrarToast("Selecione uma bebida.", "warning");
            return;
        }

        novoItem = {
            tipo_item: "Bebida",
            bebida_id: bebidaId,
            bebida_nome: bebida.nome,
            quantidade,
            valor_unitario: Number(bebida.preco),
        };
    } else {
        const adicionalId = Number(selectAdicionalPedido.value);
        const quantidade = Number(txtQuantidadeAdicional.value) || 1;
        const adicional = adicionais.find((a) => Number(a.id) === adicionalId);

        if (!adicional) {
            mostrarToast("Selecione um adicional.", "warning");
            return;
        }

        novoItem = {
            tipo_item: "Adicional",
            adicional_id: adicionalId,
            adicional_nome: adicional.nome,
            quantidade,
            valor_unitario: Number(adicional.preco),
        };
    }

    if (!novoItem) return;

    if (modoEdicao) {
        itensPedido = itensPedido.map((item) =>
            item._tempId === itemEditandoTempId
                ? { ...novoItem, _tempId: itemEditandoTempId }
                : item,
        );
        mostrarToast("Item atualizado.", "success");
    } else {
        itensPedido.push({ ...novoItem, _tempId: proximoItemTempId++ });
    }

    resetarFormularioItem();
    renderizarCarrinho();
}

function removerItemCarrinho(tempId) {
    if (itemEditandoTempId === tempId) {
        resetarFormularioItem();
    }
    itensPedido = itensPedido.filter((item) => item._tempId !== tempId);
    renderizarCarrinho();
}

btnAdicionarItem.addEventListener("click", adicionarItemAoPedido);

tbodyItensPedido.addEventListener("click", (event) => {
    const botao = event.target.closest("button[data-action-item]");
    if (!botao) return;

    const acao = botao.dataset.actionItem;
    const tempId = Number(botao.dataset.tempId);

    if (acao === "editar") editarItemCarrinho(tempId);
    if (acao === "remover") removerItemCarrinho(tempId);
});

/* ==========================================================
    ABRIR / FECHAR MODAL DE PEDIDO
   ========================================================== */

function resetarFormularioPedido() {
    formPedido.reset();
    pedidoId.value = "";
    mensagemPedido.textContent = "";
    itensPedido = [];
    itemEditandoTempId = null;
    btnAdicionarItem.innerHTML = `<i class="fa-solid fa-plus"></i> Adicionar Item`;

    trocarCliente();

    selectTipoItem.selectedIndex = 0;
    atualizarCamposTipoItem();
    selectTipoPizza.selectedIndex = 0;
    atualizarCamposTipoPizza();
    atualizarOpcoesPorTamanho();

    selectModoPagamento.value = "unico";
    selectFormaPagamentoUnico.value = "Dinheiro";
    selectFormaPagamento.value = "Dinheiro";
    txtTaxaEntrega.value = "0";
    selectStatusPedido.value = "Aberto";

    atualizarCamposPagamento();

    gerarCamposSaboresCombo(0);
    renderizarCarrinho();
}

function abrirModalNovoPedido() {
    resetarFormularioPedido();
    tituloModalPedido.textContent = "Novo Pedido";
    modalPedido.classList.remove("hidden");
    sugerirPrecoPizza();
}

async function abrirModalEditarPedido(id) {
    const resposta = await window.api.buscarPedidoPorId(id);

    if (!resposta.sucesso) {
        mostrarToast(resposta.mensagem, "error");
        return;
    }

    const pedido = resposta.pedido;

    resetarFormularioPedido();
    tituloModalPedido.textContent = `Editar Pedido #${pedido.id}`;
    pedidoId.value = pedido.id;

    if (pedido.cliente_id) {
        selecionarCliente({
            id: pedido.cliente_id,
            nome_completo: pedido.cliente_nome,
            telefone: pedido.cliente_telefone,
            endereco: pedido.cliente_endereco,
            numero: pedido.cliente_numero,
            bairro: pedido.cliente_bairro,
        });
    }

    const forma = pedido.forma_pagamento || "Dinheiro";
    const ehMisto = forma.includes("+");

    selectFormaPagamento.value = forma;
    txtTaxaEntrega.value = pedido.taxa_entrega || 0;
    selectStatusPedido.value = pedido.status || "Aberto";

    if (ehMisto) {
        const partes = forma.split("+");
        selectModoPagamento.value = "misto";
        campoPagamentoUnico.classList.add("hidden");
        campoPagamentoMisto.classList.remove("hidden");

        selectFormaMisto1.value = partes[0];
        selectFormaMisto2.value = partes[1];

        const mapaValores = {
            Pix: Number(pedido.valor_pix) || 0,
            Dinheiro: Number(pedido.valor_dinheiro) || 0,
            Cartão: Number(pedido.valor_cartao) || 0,
        };

        txtValorMisto1.value =
            mapaValores[partes[0]] > 0 ? mapaValores[partes[0]].toFixed(2) : "";
        txtValorMisto2.value =
            mapaValores[partes[1]] > 0 ? mapaValores[partes[1]].toFixed(2) : "";

        atualizarTroco();
    } else {
        selectModoPagamento.value = "unico";
        selectFormaPagamentoUnico.value = forma;
        campoPagamentoUnico.classList.remove("hidden");
        campoPagamentoMisto.classList.add("hidden");

        atualizarTroco();
    }

    const temCartaoNaEdicao = forma.includes("Cartão");

    itensPedido = (pedido.itens || []).map((item) => {
        if (item.tipo_item === "Combo") {
            const combo = combos.find(
                (c) => Number(c.id) === Number(item.combo_id),
            );
            return {
                _tempId: proximoItemTempId++,
                tipo_item: "Combo",
                combo_id: item.combo_id,
                combo_nome: item.combo_nome || combo?.nome || "",
                sabores_combo: item.sabores_combo || [],
                quantidade: item.quantidade,
                valor_unitario: Number(item.valor_unitario),
            };
        }

        const ehPizza = item.tipo_item === "Pizza";
        const valorBase =
            ehPizza && temCartaoNaEdicao
                ? Number(
                      (Number(item.valor_unitario) - acrescimoCartao).toFixed(
                          2,
                      ),
                  )
                : Number(item.valor_unitario);

        return {
            _tempId: proximoItemTempId++,
            tipo_item: item.tipo_item,
            tipo_pizza: item.tipo_pizza,
            tamanho_id: item.tamanho_id,
            tamanho_nome: item.tamanho_nome,
            sabor_1_id: item.sabor_1_id,
            sabor_1_nome: item.sabor_1_nome,
            sabor_2_id: item.sabor_2_id,
            sabor_2_nome: item.sabor_2_nome,
            sabor_3_id: item.sabor_3_id,
            sabor_3_nome: item.sabor_3_nome,
            bebida_id: item.bebida_id,
            bebida_nome: item.bebida_nome,
            adicional_id: item.adicional_id,
            adicional_nome: item.adicional_nome,
            regra_cobranca: item.regra_cobranca,
            quantidade: item.quantidade,
            valor_base: valorBase,
            valor_unitario: Number(item.valor_unitario),
            observacao: item.observacao,
        };
    });

    renderizarCarrinho();
    modalPedido.classList.remove("hidden");
}

function fecharModalPedido() {
    modalPedido.classList.add("hidden");
}

btnNovoPedido.addEventListener("click", abrirModalNovoPedido);
btnFecharModalPedido.addEventListener("click", fecharModalPedido);
btnCancelarPedido.addEventListener("click", fecharModalPedido);

/* ==========================================================
    SALVAR PEDIDO
   ========================================================== */

function obterDadosPagamento() {
    const modo = selectModoPagamento.value;
    const taxa = Number(txtTaxaEntrega.value) || 0;
    const subtotal = calcularSubtotal();
    const total = subtotal + taxa;

    if (modo === "unico") {
        const forma = selectFormaPagamentoUnico.value;
        const valRecebido = Number(txtValorRecebidoUnico.value) || 0;
        const troco =
            forma === "Dinheiro" && valRecebido > 0
                ? Math.max(0, valRecebido - total)
                : 0;

        return {
            forma_pagamento: forma,
            valor_pix: forma === "Pix" ? total : 0,
            valor_dinheiro: forma === "Dinheiro" ? total : 0,
            valor_cartao: forma === "Cartão" ? total : 0,
            valor_recebido: valRecebido,
            troco,
        };
    } else {
        const f1 = selectFormaMisto1.value;
        const f2 = selectFormaMisto2.value;
        const v1 = Number(txtValorMisto1.value) || 0;
        const v2 = Number(txtValorMisto2.value) || 0;

        const mapaValores = { Pix: 0, Dinheiro: 0, Cartão: 0 };
        mapaValores[f1] = v1;
        mapaValores[f2] = v2;

        const valRecebido = Number(txtValorRecebidoMisto.value) || 0;
        const valorDinheiro = mapaValores["Dinheiro"];
        const troco =
            valorDinheiro > 0 && valRecebido > 0
                ? Math.max(0, valRecebido - valorDinheiro)
                : 0;

        return {
            forma_pagamento: normalizarFormaMista(f1, f2),
            valor_pix: mapaValores["Pix"],
            valor_dinheiro: mapaValores["Dinheiro"],
            valor_cartao: mapaValores["Cartão"],
            valor_recebido: valRecebido,
            troco,
        };
    }
}

function obterItensParaEnvio() {
    return itensPedido.map((item) => {
        if (item.tipo_item === "Combo") {
            const valorTotal = Number(
                (item.valor_unitario * item.quantidade).toFixed(2),
            );
            return {
                tipo_item: "Combo",
                combo_id: item.combo_id,
                quantidade: item.quantidade,
                valor_unitario: item.valor_unitario,
                valor_total: valorTotal,
                observacao: item.sabores_combo
                    ? JSON.stringify(item.sabores_combo)
                    : null,
            };
        }

        const valorUnitEfetivo = obterValorUnitarioEfetivo(item);
        const valorTotalEfetivo = Number(
            (valorUnitEfetivo * item.quantidade).toFixed(2),
        );

        return {
            tipo_item: item.tipo_item,
            tipo_pizza: item.tipo_pizza || null,
            tamanho_id: item.tamanho_id || null,
            sabor_1_id: item.sabor_1_id || null,
            sabor_2_id: item.sabor_2_id || null,
            sabor_3_id: item.sabor_3_id || null,
            bebida_id: item.bebida_id || null,
            adicional_id: item.adicional_id || null,
            regra_cobranca: item.regra_cobranca || null,
            quantidade: item.quantidade,
            valor_unitario: valorUnitEfetivo,
            valor_total: valorTotalEfetivo,
            observacao: item.observacao || null,
        };
    });
}

formPedido.addEventListener("submit", async (event) => {
    event.preventDefault();

    mensagemPedido.textContent = "";

    if (!clienteSelecionado) {
        mensagemPedido.textContent = "Selecione um cliente para o pedido.";
        return;
    }

    if (itensPedido.length === 0) {
        mensagemPedido.textContent = "Adicione pelo menos um item ao pedido.";
        return;
    }

    const forma = obterFormaPagamentoAtual();

    if (!forma) {
        mensagemPedido.textContent = "Selecione a forma de pagamento.";
        return;
    }

    if (selectModoPagamento.value === "misto") {
        const v1 = Number(txtValorMisto1.value) || 0;
        const v2 = Number(txtValorMisto2.value) || 0;
        const f1 = selectFormaMisto1.value;
        const f2 = selectFormaMisto2.value;

        if (f1 === f2) {
            mensagemPedido.textContent =
                "Selecione formas de pagamento diferentes no modo misto.";
            return;
        }

        if (v1 <= 0) {
            mensagemPedido.textContent = `Informe o valor para ${f1}.`;
            return;
        }

        if (v2 <= 0) {
            mensagemPedido.textContent = `Informe o valor para ${f2}.`;
            return;
        }
    }

    const pagamento = obterDadosPagamento();
    const itens = obterItensParaEnvio();

    const dadosPedido = {
        id: pedidoId.value || undefined,
        cliente_id: clienteSelecionado.id,
        usuario_id: usuarioLogado.id,
        status: selectStatusPedido.value,
        forma_pagamento: pagamento.forma_pagamento,
        taxa_entrega: Number(txtTaxaEntrega.value) || 0,
        valor_pix: pagamento.valor_pix,
        valor_dinheiro: pagamento.valor_dinheiro,
        valor_cartao: pagamento.valor_cartao,
        valor_recebido: pagamento.valor_recebido,
        troco: pagamento.troco,
        observacao: "",
        descricao_complementar: "",
    };

    const resposta = pedidoId.value
        ? await window.api.atualizarPedido({ pedido: dadosPedido, itens })
        : await window.api.salvarPedido({ pedido: dadosPedido, itens });

    if (!resposta.sucesso) {
        mensagemPedido.textContent = resposta.mensagem;
        mostrarToast(resposta.mensagem, "error");
        return;
    }

    fecharModalPedido();
    await carregarPedidos();
    mostrarToast(resposta.mensagem, "success");
});

/* ==========================================================
    EVENTOS GERAIS
   ========================================================== */

tbodyPedidos.addEventListener("click", executarAcaoPedido);
txtPesquisarPedido.addEventListener("input", aplicarFiltrosPedidos);
selectFiltroStatus.addEventListener("change", aplicarFiltrosPedidos);

btnSair.addEventListener("click", () => {
    sessionStorage.removeItem("usuarioLogado");
    window.location.href = "login.html";
});

/* ==========================================================
    INICIALIZAÇÃO
   ========================================================== */

(async function iniciar() {
    await carregarDadosApoio();
    await carregarPedidos();
    atualizarCamposTipoItem();
    atualizarCamposTipoPizza();
    atualizarOpcoesPorTamanho();
    atualizarCamposPagamento();

    if (usuarioLogado.tipo !== "admin") {
        const opcaoCancelado = selectStatusPedido.querySelector(
            'option[value="Cancelado"]',
        );
        if (opcaoCancelado) opcaoCancelado.disabled = true;
    }
})();
