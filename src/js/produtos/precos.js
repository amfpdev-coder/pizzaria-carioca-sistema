const modalPreco = document.getElementById("modalPreco");
const btnFecharModalPreco = document.getElementById("btnFecharModalPreco");
const btnCancelarPreco = document.getElementById("btnCancelarPreco");
const formPreco = document.getElementById("formPreco");

const precoId = document.getElementById("precoId");
const tituloModalPreco = document.getElementById("tituloModalPreco");

const selectSaborPreco = document.getElementById("selectSaborPreco");
const selectTamanhoPreco = document.getElementById("selectTamanhoPreco");
const txtPrecoPix = document.getElementById("txtPrecoPix");
const txtPrecoCartao = document.getElementById("txtPrecoCartao");

const mensagemPreco = document.getElementById("mensagemPreco");
const tbodyPrecos = document.getElementById("tbodyPrecos");

let precos = [];

function preencherSelectSabores() {
    selectSaborPreco.innerHTML = "";

    sabores.forEach((sabor) => {
        const option = document.createElement("option");
        option.value = sabor.id;
        option.textContent = sabor.nome;
        selectSaborPreco.appendChild(option);
    });
}

function preencherSelectTamanhos() {
    selectTamanhoPreco.innerHTML = "";

    tamanhos.forEach((tamanho) => {
        const option = document.createElement("option");
        option.value = tamanho.id;
        option.textContent = tamanho.nome;
        selectTamanhoPreco.appendChild(option);
    });
}

function resetarFormularioPreco() {
    formPreco.reset();
    precoId.value = "";
    mensagemPreco.textContent = "";
}

function abrirModalNovoPreco() {
    preencherSelectSabores();
    preencherSelectTamanhos();
    resetarFormularioPreco();

    tituloModalPreco.textContent = "Novo Preço";

    modalPreco.classList.remove("hidden");
}

function abrirModalEditarPreco(preco) {
    preencherSelectSabores();
    preencherSelectTamanhos();
    resetarFormularioPreco();

    precoId.value = preco.id;
    tituloModalPreco.textContent = "Editar Preço";

    selectSaborPreco.value = preco.sabor_id;
    selectTamanhoPreco.value = preco.tamanho_id;
    txtPrecoPix.value = preco.preco_pix;
    txtPrecoCartao.value = preco.preco_cartao || "";

    modalPreco.classList.remove("hidden");
}

function fecharModalPreco() {
    modalPreco.classList.add("hidden");
    resetarFormularioPreco();
}

function formatarPrecoExibicao(valor) {
    if (valor === null || valor === undefined || valor === "") {
        return "—";
    }

    return formatarMoeda(valor);
}

function renderizarPrecos(listaPrecos) {
    tbodyPrecos.innerHTML = "";

    if (!listaPrecos || listaPrecos.length === 0) {
        tbodyPrecos.innerHTML = `
            <tr>
                <td colspan="5" class="empty-table">
                    Nenhum preço cadastrado.
                </td>
            </tr>
        `;
        return;
    }

    listaPrecos.forEach((preco) => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td><strong>${preco.sabor_nome}</strong></td>
            <td>${preco.tamanho_nome}</td>
            <td>${formatarMoeda(preco.preco_pix)}</td>
            <td>${formatarPrecoExibicao(preco.preco_cartao)}</td>
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

        tbodyPrecos.appendChild(tr);
    });
}

async function carregarPrecos() {
    const resposta = await window.api.listarPrecos();

    if (!resposta.sucesso) {
        mostrarToast(resposta.mensagem, "error");
        return;
    }

    precos = resposta.precos;
    renderizarPrecos(precos);
}

function obterDadosPreco() {
    return {
        id: precoId.value,
        sabor_id: Number(selectSaborPreco.value),
        tamanho_id: Number(selectTamanhoPreco.value),
        preco_pix: Number(txtPrecoPix.value),
        preco_cartao: txtPrecoCartao.value ? Number(txtPrecoCartao.value) : null,
    };
}

async function salvarPrecoFormulario(event) {
    event.preventDefault();

    mensagemPreco.textContent = "";

    const preco = obterDadosPreco();

    const resposta = preco.id
        ? await window.api.atualizarPreco(preco)
        : await window.api.salvarPreco(preco);

    if (!resposta.sucesso) {
        mensagemPreco.textContent = resposta.mensagem;
        mostrarToast(resposta.mensagem, "error");
        return;
    }

    fecharModalPreco();
    await carregarPrecos();
    mostrarToast(resposta.mensagem, "success");
}

function executarAcaoPrecos(event) {
    const botao = event.target.closest("button");

    if (!botao) return;

    const acao = botao.dataset.action;
    const id = Number(botao.dataset.id);
    const preco = precos.find((item) => Number(item.id) === id);

    if (!preco) return;

    if (acao === "editar") {
        abrirModalEditarPreco(preco);
    }

    if (acao === "excluir") {
        confirmarExclusao({
            titulo: "Excluir preço",
            mensagem: "Deseja realmente excluir este preço permanentemente?",
            callback: async () => {
                const resposta = await window.api.excluirPreco(id);
                await carregarPrecos();
                mostrarToast(resposta.mensagem, resposta.sucesso ? "success" : "error");
            },
        });
    }
}

btnFecharModalPreco.addEventListener("click", fecharModalPreco);
btnCancelarPreco.addEventListener("click", fecharModalPreco);
formPreco.addEventListener("submit", salvarPrecoFormulario);
tbodyPrecos.addEventListener("click", executarAcaoPrecos);

carregarPrecos();