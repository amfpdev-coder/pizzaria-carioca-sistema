const btnSair = document.getElementById("btnSair");
const btnNovoCliente = document.getElementById("btnNovoCliente");
const modalCliente = document.getElementById("modalCliente");
const btnFecharModal = document.getElementById("btnFecharModal");
const btnCancelarCliente = document.getElementById("btnCancelarCliente");
const formCliente = document.getElementById("formCliente");
const mensagemCliente = document.getElementById("mensagemCliente");
const tbodyClientes = document.getElementById("tbodyClientes");
const txtPesquisarCliente = document.getElementById("txtPesquisarCliente");
const tituloModalCliente = document.getElementById("tituloModalCliente");

const clienteId = document.getElementById("clienteId");
const txtNomeCompleto = document.getElementById("txtNomeCompleto");
const txtTelefone = document.getElementById("txtTelefone");
const txtEndereco = document.getElementById("txtEndereco");
const txtNumero = document.getElementById("txtNumero");
const txtBairro = document.getElementById("txtBairro");
const txtPontoReferencia = document.getElementById("txtPontoReferencia");
const selectStatusCliente = document.getElementById("selectStatusCliente");

const modalHistoricoCliente = document.getElementById("modalHistoricoCliente");
const tituloHistoricoCliente = document.getElementById("tituloHistoricoCliente");
const subtituloHistoricoCliente = document.getElementById("subtituloHistoricoCliente");
const tbodyHistoricoCliente = document.getElementById("tbodyHistoricoCliente");
const btnFecharHistoricoCliente = document.getElementById("btnFecharHistoricoCliente");
const btnFecharHistoricoCliente2 = document.getElementById("btnFecharHistoricoCliente2");

let clientes = [];

const usuarioLogado = JSON.parse(sessionStorage.getItem("usuarioLogado"));

if (!usuarioLogado) {
    window.location.href = "login.html";
}

const ehAdmin = usuarioLogado?.tipo === "admin";

function abrirModalCliente() {
    if (!modalCliente || !formCliente) return;

    if (tituloModalCliente) {
        tituloModalCliente.textContent = "Novo Cliente";
    }

    if (clienteId) {
        clienteId.value = "";
    }

    formCliente.reset();

    if (mensagemCliente) {
        mensagemCliente.textContent = "";
    }

    modalCliente.classList.remove("hidden");

    if (txtNomeCompleto) {
        txtNomeCompleto.focus();
    }
}

function abrirModalEdicao(cliente) {
    if (!modalCliente) return;

    if (tituloModalCliente) {
        tituloModalCliente.textContent = "Editar Cliente";
    }

    clienteId.value = cliente.id;
    txtNomeCompleto.value = cliente.nome_completo || "";
    txtTelefone.value = cliente.telefone || "";
    txtEndereco.value = cliente.endereco || "";
    txtNumero.value = cliente.numero || "";
    txtBairro.value = cliente.bairro || "";
    txtPontoReferencia.value = cliente.ponto_referencia || "";
    selectStatusCliente.value = String(cliente.ativo);

    if (mensagemCliente) {
        mensagemCliente.textContent = "";
    }

    modalCliente.classList.remove("hidden");
    txtNomeCompleto.focus();
}

function fecharModalCliente() {
    if (!modalCliente || !formCliente) return;

    modalCliente.classList.add("hidden");
    formCliente.reset();

    if (clienteId) {
        clienteId.value = "";
    }

    if (mensagemCliente) {
        mensagemCliente.textContent = "";
    }
}

function montarEndereco(cliente) {
    const partes = [];

    if (cliente.endereco) {
        partes.push(cliente.endereco);
    }

    if (cliente.numero) {
        partes.push(`Nº ${cliente.numero}`);
    }

    return partes.length > 0 ? partes.join(", ") : "-";
}

function montarStatus(cliente) {
    if (Number(cliente.ativo) === 1) {
        return '<span class="status-badge status-ativo">Ativo</span>';
    }

    return '<span class="status-badge status-inativo">Inativo</span>';
}

function renderizarClientes(listaClientes) {
    if (!tbodyClientes) return;

    tbodyClientes.innerHTML = "";

    if (!listaClientes || listaClientes.length === 0) {
        tbodyClientes.innerHTML = `
            <tr>
                <td colspan="8" class="empty-table">
                    Nenhum cliente cadastrado.
                </td>
            </tr>
        `;

        return;
    }

    listaClientes.forEach((cliente) => {
        const tr = document.createElement("tr");

        const botaoInativar = Number(cliente.ativo) === 1 && ehAdmin
            ? `
                <button
                    class="btn-action btn-disable"
                    title="Inativar cliente"
                    data-action="inativar"
                    data-id="${cliente.id}"
                    type="button"
                >
                    <i class="fa-solid fa-ban"></i>
                </button>
            `
            : "";

        const botaoExcluir = ehAdmin
            ? `
                <button
                    class="btn-action btn-delete"
                    title="Excluir cliente"
                    data-action="excluir"
                    data-id="${cliente.id}"
                    type="button"
                >
                    <i class="fa-solid fa-trash"></i>
                </button>
            `
            : "";

        tr.innerHTML = `
            <td>${cliente.id}</td>
            <td><strong>${cliente.nome_completo || "-"}</strong></td>
            <td>${cliente.telefone || "-"}</td>
            <td>${cliente.bairro || "-"}</td>
            <td>${montarEndereco(cliente)}</td>
            <td>${cliente.ponto_referencia || "-"}</td>
            <td>${montarStatus(cliente)}</td>
            <td>
                <div class="action-buttons">
                    <button
                        class="btn-action btn-edit"
                        title="Editar cliente"
                        data-action="editar"
                        data-id="${cliente.id}"
                        type="button"
                    >
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>

                    <button
                        class="btn-action btn-history"
                        title="Histórico do cliente"
                        data-action="historico"
                        data-id="${cliente.id}"
                        type="button"
                    >
                        <i class="fa-solid fa-clock-rotate-left"></i>
                    </button>

                    ${botaoInativar}
                    ${botaoExcluir}
                </div>
            </td>
        `;

        tbodyClientes.appendChild(tr);
    });
}

async function carregarClientes() {
    try {
        const resposta = await window.api.listarClientes();

        if (!resposta.sucesso) {
            if (tbodyClientes) {
                tbodyClientes.innerHTML = `
                    <tr>
                        <td colspan="8" class="empty-table">
                            ${resposta.mensagem}
                        </td>
                    </tr>
                `;
            }

            mostrarToastSeguro(resposta.mensagem, "error");
            return;
        }

        clientes = resposta.clientes || [];
        renderizarClientes(clientes);
    } catch (erro) {
        console.error("Erro ao carregar clientes:", erro);
        mostrarToastSeguro("Erro ao carregar clientes.", "error");
    }
}

function filtrarClientes() {
    const termo = txtPesquisarCliente.value.trim().toLowerCase();

    if (!termo) {
        renderizarClientes(clientes);
        return;
    }

    const clientesFiltrados = clientes.filter((cliente) => {
        return (
            String(cliente.nome_completo || "").toLowerCase().includes(termo) ||
            String(cliente.telefone || "").toLowerCase().includes(termo) ||
            String(cliente.bairro || "").toLowerCase().includes(termo) ||
            String(cliente.endereco || "").toLowerCase().includes(termo) ||
            String(cliente.ponto_referencia || "").toLowerCase().includes(termo)
        );
    });

    renderizarClientes(clientesFiltrados);
}

async function salvarCliente(event) {
    event.preventDefault();

    if (mensagemCliente) {
        mensagemCliente.textContent = "";
    }

    const cliente = {
        id: clienteId.value,
        nome_completo: txtNomeCompleto.value.trim(),
        telefone: txtTelefone.value.trim(),
        endereco: txtEndereco.value.trim(),
        numero: txtNumero.value.trim(),
        bairro: txtBairro.value.trim(),
        ponto_referencia: txtPontoReferencia.value.trim(),
        ativo: selectStatusCliente.value,
    };

    try {
        const resposta = cliente.id
            ? await window.api.atualizarCliente(cliente)
            : await window.api.salvarCliente(cliente);

        if (!resposta.sucesso) {
            if (mensagemCliente) {
                mensagemCliente.textContent = resposta.mensagem;
            }

            mostrarToastSeguro(resposta.mensagem, "error");
            return;
        }

        fecharModalCliente();
        await carregarClientes();

        mostrarToastSeguro(resposta.mensagem, "success");
    } catch (erro) {
        console.error("Erro ao salvar cliente:", erro);
        mostrarToastSeguro("Erro ao salvar cliente.", "error");
    }
}

async function inativarCliente(id) {
    if (!ehAdmin) {
        mostrarToastSeguro("Apenas o administrador pode inativar clientes.", "warning");
        return;
    }

    const confirmar = await confirmarAcaoSeguro({
        titulo: "Inativar cliente",
        mensagem: "Deseja realmente inativar este cliente? Ele continuará salvo para manter o histórico de pedidos.",
        textoCancelar: "Cancelar",
        textoConfirmar: "Inativar",
    });

    if (!confirmar) return;

    const resposta = await window.api.inativarCliente(id);

    if (!resposta.sucesso) {
        mostrarToastSeguro(resposta.mensagem, "error");
        return;
    }

    await carregarClientes();
    mostrarToastSeguro(resposta.mensagem, "success");
}

async function excluirCliente(id) {
    if (!ehAdmin) {
        mostrarToastSeguro("Apenas o administrador pode excluir clientes.", "warning");
        return;
    }

    const confirmar = await confirmarAcaoSeguro({
        titulo: "Excluir cliente",
        mensagem: "Tem certeza que quer excluir esse cliente? Essa ação não pode ser desfeita.",
        textoCancelar: "Cancelar",
        textoConfirmar: "Excluir",
    });

    if (!confirmar) return;

    const resposta = await window.api.excluirCliente(id);

    if (!resposta.sucesso) {
        mostrarToastSeguro(resposta.mensagem, "error");
        return;
    }

    await carregarClientes();
    mostrarToastSeguro(resposta.mensagem, "success");
}

function executarAcaoTabela(event) {
    const botao = event.target.closest("button");

    if (!botao) return;

    const acao = botao.dataset.action;
    const id = Number(botao.dataset.id);

    const cliente = clientes.find((item) => Number(item.id) === id);

    if (!cliente) return;

    if (acao === "editar") {
        abrirModalEdicao(cliente);
        return;
    }

    if (acao === "historico") {
        abrirHistoricoCliente(cliente);
        return;
    }

    if (acao === "inativar") {
        inativarCliente(id);
        return;
    }

    if (acao === "excluir") {
        excluirCliente(id);
    }
}

/* ==========================================================
    HISTÓRICO DE PEDIDOS DO CLIENTE
========================================================== */

const MAPA_STATUS_CLASSE_HISTORICO = {
    Aberto: "status-aberto",
    "Em Produção": "status-em-producao",
    Finalizado: "status-finalizado",
    Cancelado: "status-cancelado",
};

function montarBadgeStatusHistorico(status) {
    const classe = MAPA_STATUS_CLASSE_HISTORICO[status] || "status-aberto";
    return `<span class="status-badge ${classe}">${status}</span>`;
}

async function abrirHistoricoCliente(cliente) {
    if (!modalHistoricoCliente) return;

    tituloHistoricoCliente.textContent = `Histórico de Pedidos — ${cliente.nome_completo}`;
    subtituloHistoricoCliente.textContent = cliente.telefone || "";

    const resposta = await window.api.listarPedidos();

    if (!resposta.sucesso) {
        mostrarToastSeguro(resposta.mensagem, "error");
        return;
    }

    const pedidosDoCliente = (resposta.pedidos || []).filter(
        (pedido) => Number(pedido.cliente_id) === Number(cliente.id)
    );

    tbodyHistoricoCliente.innerHTML = "";

    if (pedidosDoCliente.length === 0) {
        tbodyHistoricoCliente.innerHTML = `
            <tr>
                <td colspan="5" class="empty-table">Este cliente ainda não fez nenhum pedido.</td>
            </tr>
        `;
    } else {
        pedidosDoCliente.forEach((pedido) => {
            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td>${pedido.id}</td>
                <td>${formatarDataHoraSeguro(pedido.criado_em)}</td>
                <td>${montarBadgeStatusHistorico(pedido.status)}</td>
                <td>${pedido.forma_pagamento || "-"}</td>
                <td>${formatarMoedaSeguro(pedido.total)}</td>
            `;

            tbodyHistoricoCliente.appendChild(tr);
        });
    }

    modalHistoricoCliente.classList.remove("hidden");
}

function fecharHistoricoCliente() {
    if (modalHistoricoCliente) {
        modalHistoricoCliente.classList.add("hidden");
    }
}

/* ==========================================================
    UTILITÁRIOS
========================================================== */

function mostrarToastSeguro(mensagem, tipo = "success") {
    if (typeof mostrarToast === "function") {
        mostrarToast(mensagem, tipo);
        return;
    }

    alert(mensagem);
}

async function confirmarAcaoSeguro(opcoes) {
    if (typeof confirmarAcao === "function") {
        return await confirmarAcao(opcoes);
    }

    return confirm(opcoes.mensagem);
}

function formatarDataHoraSeguro(valor) {
    if (typeof formatarDataHora === "function") {
        return formatarDataHora(valor);
    }

    return valor || "-";
}

function formatarMoedaSeguro(valor) {
    if (typeof formatarMoeda === "function") {
        return formatarMoeda(valor);
    }

    return Number(valor || 0).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
}

/* ==========================================================
    EVENTOS
========================================================== */

if (txtTelefone) {
    txtTelefone.addEventListener("input", () => {
        txtTelefone.value = aplicarMascaraTelefone(txtTelefone.value);
    });
}

if (btnNovoCliente) {
    btnNovoCliente.addEventListener("click", abrirModalCliente);
}

if (btnFecharModal) {
    btnFecharModal.addEventListener("click", fecharModalCliente);
}

if (btnCancelarCliente) {
    btnCancelarCliente.addEventListener("click", fecharModalCliente);
}

if (formCliente) {
    formCliente.addEventListener("submit", salvarCliente);
}

if (txtPesquisarCliente) {
    txtPesquisarCliente.addEventListener("input", filtrarClientes);
}

if (tbodyClientes) {
    tbodyClientes.addEventListener("click", executarAcaoTabela);
}

if (btnFecharHistoricoCliente) {
    btnFecharHistoricoCliente.addEventListener("click", fecharHistoricoCliente);
}

if (btnFecharHistoricoCliente2) {
    btnFecharHistoricoCliente2.addEventListener("click", fecharHistoricoCliente);
}

if (btnSair) {
    btnSair.addEventListener("click", () => {
        sessionStorage.removeItem("usuarioLogado");
        window.location.href = "login.html";
    });
}

carregarClientes();