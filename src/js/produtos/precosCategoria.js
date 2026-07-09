/* ==========================================================
    REFERÊNCIAS DO DOM
   ========================================================== */

const tbodyPrecosCategoria = document.getElementById("tbodyPrecosCategoria");

const modalPrecoCategoria = document.getElementById("modalPrecoCategoria");
const tituloModalPrecoCategoria = document.getElementById("tituloModalPrecoCategoria");
const btnFecharModalPrecoCategoria = document.getElementById("btnFecharModalPrecoCategoria");
const btnCancelarPrecoCategoria = document.getElementById("btnCancelarPrecoCategoria");
const formPrecoCategoria = document.getElementById("formPrecoCategoria");
const mensagemPrecoCategoria = document.getElementById("mensagemPrecoCategoria");

const precoCategoriaId = document.getElementById("precoCategoriaId");
const selectTamanhoPrecoCategoria = document.getElementById("selectTamanhoPrecoCategoria");
const selectTipoPizzaPrecoCategoria = document.getElementById("selectTipoPizzaPrecoCategoria");
const txtPrecoCategoriaPix = document.getElementById("txtPrecoCategoriaPix");

const txtAcrescimoCartao = document.getElementById("txtAcrescimoCartao");
const btnSalvarAcrescimoCartao = document.getElementById("btnSalvarAcrescimoCartao");

/* ==========================================================
    ESTADO
   ========================================================== */

let precosCategoria = [];
let acrescimoCartaoAtual = 2;

const itensPorPaginaPrecosCategoria = 5;
let paginaAtualPrecosCategoria = 1;
let listaAtualPrecosCategoria = [];
const paginacaoPrecosCategoria = document.getElementById("paginacaoPrecosCategoria");

/* ==========================================================
    ACRÉSCIMO DO CARTÃO
   ========================================================== */

async function carregarAcrescimoCartao() {
    const resposta = await window.api.obterAcrescimoCartao();

    if (!resposta.sucesso) {
        mostrarToast(resposta.mensagem, "error");
        return;
    }

    acrescimoCartaoAtual = resposta.valor;
    txtAcrescimoCartao.value = acrescimoCartaoAtual;
    renderizarPrecosCategoriaPaginados(
    listaAtualPrecosCategoria.length
        ? listaAtualPrecosCategoria
        : precosCategoria
    );
}

btnSalvarAcrescimoCartao.addEventListener("click", async () => {
    const resposta = await window.api.salvarAcrescimoCartao(Number(txtAcrescimoCartao.value));

    if (!resposta.sucesso) {
        mostrarToast(resposta.mensagem, "error");
        return;
    }

    acrescimoCartaoAtual = Number(txtAcrescimoCartao.value);
    renderizarPrecosCategoriaPaginados(
    listaAtualPrecosCategoria.length
        ? listaAtualPrecosCategoria
        : precosCategoria
    );
    mostrarToast(resposta.mensagem, "success");
});

/* ==========================================================
    LISTAGEM
   ========================================================== */

function renderizarPrecosCategoria(lista) {
    tbodyPrecosCategoria.innerHTML = "";

    if (!lista || lista.length === 0) {
        tbodyPrecosCategoria.innerHTML = `
            <tr>
                <td colspan="5" class="empty-table">Nenhum preço cadastrado.</td>
            </tr>
        `;
        return;
    }

    lista.forEach((preco) => {
        const tr = document.createElement("tr");
        const precoCartao = Number(preco.preco_pix) + Number(acrescimoCartaoAtual);

        tr.innerHTML = `
            <td><strong>${preco.tamanho_nome}</strong></td>
            <td>${preco.tipo_pizza}</td>
            <td>${formatarMoeda(preco.preco_pix)}</td>
            <td>${formatarMoeda(precoCartao)}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-action btn-edit" title="Editar preço" data-action="editar" data-id="${preco.id}">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>

                    <button class="btn-action btn-delete" title="Excluir preço" data-action="excluir" data-id="${preco.id}">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </td>
        `;

        tbodyPrecosCategoria.appendChild(tr);
    });
}

function renderizarPrecosCategoriaPaginados(lista) {
    listaAtualPrecosCategoria = lista || [];

    const totalPaginas = Math.ceil(listaAtualPrecosCategoria.length / itensPorPaginaPrecosCategoria);

    if (paginaAtualPrecosCategoria > totalPaginas) {
        paginaAtualPrecosCategoria = totalPaginas || 1;
    }

    const inicio = (paginaAtualPrecosCategoria - 1) * itensPorPaginaPrecosCategoria;
    const fim = inicio + itensPorPaginaPrecosCategoria;
    const listaPagina = listaAtualPrecosCategoria.slice(inicio, fim);

    renderizarPrecosCategoria(listaPagina);
    renderizarPaginacaoPrecosCategoria();
}

function renderizarPaginacaoPrecosCategoria() {
    if (!paginacaoPrecosCategoria) return;

    paginacaoPrecosCategoria.innerHTML = "";

    const totalPaginas = Math.ceil(listaAtualPrecosCategoria.length / itensPorPaginaPrecosCategoria);

    if (totalPaginas <= 1) return;

    for (let pagina = 1; pagina <= totalPaginas; pagina++) {
        const botao = document.createElement("button");

        botao.type = "button";
        botao.textContent = pagina;
        botao.className = pagina === paginaAtualPrecosCategoria
            ? "pagination-button active"
            : "pagination-button";

        botao.addEventListener("click", () => {
            paginaAtualPrecosCategoria = pagina;
            renderizarPrecosCategoriaPaginados(listaAtualPrecosCategoria);
        });

        paginacaoPrecosCategoria.appendChild(botao);
    }
}

async function carregarPrecosCategoria() {
    const resposta = await window.api.listarPrecosCategoria();

    if (!resposta.sucesso) {
        mostrarToast(resposta.mensagem, "error");
        return;
    }

    precosCategoria = resposta.precos;

    paginaAtualPrecosCategoria = 1;
    renderizarPrecosCategoriaPaginados(precosCategoria);
}

/* ==========================================================
    MODAL
   ========================================================== */

function preencherSelectTamanhoPrecoCategoria() {
    selectTamanhoPrecoCategoria.innerHTML = tamanhos
        .map((t) => `<option value="${t.id}">${t.nome}</option>`)
        .join("");
}

function resetarFormularioPrecoCategoria() {
    formPrecoCategoria.reset();
    precoCategoriaId.value = "";
    mensagemPrecoCategoria.textContent = "";
}

function abrirModalNovoPrecoCategoria() {
    preencherSelectTamanhoPrecoCategoria();
    resetarFormularioPrecoCategoria();

    tituloModalPrecoCategoria.textContent = "Novo Preço";
    modalPrecoCategoria.classList.remove("hidden");
}

function abrirModalEditarPrecoCategoria(preco) {
    preencherSelectTamanhoPrecoCategoria();
    resetarFormularioPrecoCategoria();

    precoCategoriaId.value = preco.id;
    tituloModalPrecoCategoria.textContent = "Editar Preço";

    selectTamanhoPrecoCategoria.value = preco.tamanho_id;
    selectTipoPizzaPrecoCategoria.value = preco.tipo_pizza;
    txtPrecoCategoriaPix.value = preco.preco_pix;

    modalPrecoCategoria.classList.remove("hidden");
}

function fecharModalPrecoCategoria() {
    modalPrecoCategoria.classList.add("hidden");
}

btnFecharModalPrecoCategoria.addEventListener("click", fecharModalPrecoCategoria);
btnCancelarPrecoCategoria.addEventListener("click", fecharModalPrecoCategoria);

formPrecoCategoria.addEventListener("submit", async (event) => {
    event.preventDefault();

    mensagemPrecoCategoria.textContent = "";

    const preco = {
        id: precoCategoriaId.value || undefined,
        tamanho_id: Number(selectTamanhoPrecoCategoria.value),
        tipo_pizza: selectTipoPizzaPrecoCategoria.value,
        preco_pix: Number(txtPrecoCategoriaPix.value),
    };

    const resposta = preco.id
        ? await window.api.atualizarPrecoCategoria(preco)
        : await window.api.salvarPrecoCategoria(preco);

    if (!resposta.sucesso) {
        mensagemPrecoCategoria.textContent = resposta.mensagem;
        mostrarToast(resposta.mensagem, "error");
        return;
    }

    fecharModalPrecoCategoria();
    await carregarPrecosCategoria();
    mostrarToast(resposta.mensagem, "success");
});

tbodyPrecosCategoria.addEventListener("click", async (event) => {
    const botao = event.target.closest("button");
    if (!botao) return;

    const acao = botao.dataset.action;
    const id = Number(botao.dataset.id);
    const preco = precosCategoria.find((item) => Number(item.id) === id);

    if (!preco) return;

    if (acao === "editar") {
        abrirModalEditarPrecoCategoria(preco);
    }

    if (acao === "excluir") {
        const confirmar = await confirmarAcao({
            titulo: "Excluir preço",
            mensagem: "Deseja realmente excluir este preço permanentemente?",
            textoCancelar: "Cancelar",
            textoConfirmar: "Excluir",
        });

        if (!confirmar) return;

        const resposta = await window.api.excluirPrecoCategoria(id);
        await carregarPrecosCategoria();
        mostrarToast(resposta.mensagem, resposta.sucesso ? "success" : "error");
    }
});

/* ==========================================================
    INICIALIZAÇÃO
   ========================================================== */

carregarAcrescimoCartao();
carregarPrecosCategoria();
