const btnSair = document.getElementById("btnSair");
const btnNovo = document.getElementById("btnNovo");

const modalProduto = document.getElementById("modalProduto");
const btnFecharModal = document.getElementById("btnFecharModal");
const btnCancelar = document.getElementById("btnCancelar");
const formProduto = document.getElementById("formProduto");

const produtoId = document.getElementById("produtoId");
const tipoCadastro = document.getElementById("tipoCadastro");
const tituloModal = document.getElementById("tituloModal");

const txtNome = document.getElementById("txtNome");
const txtDescricao = document.getElementById("txtDescricao");
const selectCategoria = document.getElementById("selectCategoria");
const selectStatus = document.getElementById("selectStatus");

const inputImagem = document.getElementById("inputImagem");
const previewImagem = document.getElementById("previewImagem");

const txtPrecoBebida = document.getElementById("txtPrecoBebida");

const mensagemProduto = document.getElementById("mensagemProduto");

const tbodySabores = document.getElementById("tbodySabores");
const tbodyCombos = document.getElementById("tbodyCombos");
const tbodyTamanhos = document.getElementById("tbodyTamanhos");
const tbodyBebidas = document.getElementById("tbodyBebidas");
const tbodyAdicionais = document.getElementById("tbodyAdicionais");

const totalSabores = document.getElementById("totalSabores");
const totalCombos = document.getElementById("totalCombos");
const totalTamanhos = document.getElementById("totalTamanhos");
const totalBebidas = document.getElementById("totalBebidas");
const totalAdicionais = document.getElementById("totalAdicionais");

const txtPesquisar = document.getElementById("txtPesquisar");

const cards = document.querySelectorAll(".nav-card");
const tabs = document.querySelectorAll(".tab-content");

let sabores = [];
let combos = [];
let tamanhos = [];
let bebidas = [];
let adicionais = [];

const itensPorPagina = 5;

const paginacao = {
    sabores: {
        paginaAtual: 1,
        listaAtual: [],
        container: document.getElementById("paginacaoSabores"),
        renderizar: renderizarSabores,
    },
    combos: {
        paginaAtual: 1,
        listaAtual: [],
        container: document.getElementById("paginacaoCombos"),
        renderizar: renderizarCombos,
    },
    tamanhos: {
        paginaAtual: 1,
        listaAtual: [],
        container: document.getElementById("paginacaoTamanhos"),
        renderizar: renderizarTamanhos,
    },
    bebidas: {
        paginaAtual: 1,
        listaAtual: [],
        container: document.getElementById("paginacaoBebidas"),
        renderizar: renderizarBebidas,
    },
    adicionais: {
        paginaAtual: 1,
        listaAtual: [],
        container: document.getElementById("paginacaoAdicionais"),
        renderizar: renderizarAdicionais,
    },
};

let abaAtual = "sabores";
let imagemSelecionada = "";

const usuarioLogado = JSON.parse(sessionStorage.getItem("usuarioLogado"));

if (!usuarioLogado) {
    window.location.href = "login.html";
}

function obterImagemProduto(imagem) {
    if (!imagem || imagem.trim() === "") {
        return "../assets/images/pizza-placeholder.png";
    }

    return imagem;
}

function montarStatus(ativo) {
    if (Number(ativo) === 1) {
        return '<span class="status-badge status-ativo">Ativo</span>';
    }

    return '<span class="status-badge status-inativo">Inativo</span>';
}

function atualizarTotais() {
    totalSabores.textContent = sabores.length === 1
        ? "1 cadastrado"
        : `${sabores.length} cadastrados`;

    totalCombos.textContent = combos.length === 1
        ? "1 cadastrado"
        : `${combos.length} cadastrados`;

    totalTamanhos.textContent = tamanhos.length === 1
        ? "1 cadastrado"
        : `${tamanhos.length} cadastrados`;

    totalBebidas.textContent = bebidas.length === 1
        ? "1 cadastrada"
        : `${bebidas.length} cadastradas`;

    totalAdicionais.textContent = adicionais.length === 1
    ? "1 cadastrado"
    : `${adicionais.length} cadastrados`;
}

function setOpcoesCategoria(opcoes) {
    selectCategoria.innerHTML = "";

    opcoes.forEach((opcao) => {
        const option = document.createElement("option");
        option.value = opcao;
        option.textContent = opcao;
        selectCategoria.appendChild(option);
    });
}

function mostrarCampoCategoria() {
    selectCategoria.closest(".form-group").style.display = "flex";
}

function esconderCampoCategoria() {
    selectCategoria.closest(".form-group").style.display = "none";
}

function mostrarCampoDescricao() {
    txtDescricao.closest(".form-group").style.display = "flex";
}

function esconderCampoDescricao() {
    txtDescricao.closest(".form-group").style.display = "none";
}

function mostrarCampoImagem() {
    inputImagem.closest(".form-group").style.display = "flex";
    previewImagem.closest(".preview-area").style.display = "flex";
}

function esconderCampoImagem() {
    inputImagem.closest(".form-group").style.display = "none";
    previewImagem.closest(".preview-area").style.display = "none";
}

function mostrarCampoPrecoBebida() {
    txtPrecoBebida.closest(".form-group").style.display = "flex";
}

function esconderCampoPrecoBebida() {
    txtPrecoBebida.closest(".form-group").style.display = "none";
}

function atualizarCampoPrecoSabor() {
    if (selectCategoria.value === "Tradicional") {
        esconderCampoPrecoBebida();
    } else {
        mostrarCampoPrecoBebida();
        txtPrecoBebida.previousElementSibling.textContent = "Preço (Pix/Dinheiro)";
    }
}

function configurarModalParaSabor() {
    mostrarCampoCategoria();
    mostrarCampoDescricao();
    mostrarCampoImagem();
    atualizarCampoPrecoSabor();

    setOpcoesCategoria([
        "Tradicional",
        "Gourmet Salgada",
        "Gourmet Doce",
        
    ]);

    selectCategoria.previousElementSibling.textContent = "Categoria";
    txtDescricao.previousElementSibling.textContent = "Descrição";
    txtDescricao.placeholder = "";
}

function configurarModalParaTamanho() {
    esconderCampoCategoria();
    mostrarCampoDescricao();
    esconderCampoImagem();
    esconderCampoPrecoBebida();

    txtDescricao.previousElementSibling.textContent = "Quantidade de fatias";
    txtDescricao.placeholder = "Ex: 8";
}

function configurarModalParaBebida() {
    mostrarCampoCategoria();
    mostrarCampoDescricao();
    esconderCampoImagem();
    mostrarCampoPrecoBebida();
    txtPrecoBebida.previousElementSibling.textContent = "Preço";

    setOpcoesCategoria([
        "Refrigerante",
        "Água",
        "Suco",
        "Outros",
    ]);

    selectCategoria.previousElementSibling.textContent = "Categoria";
    txtDescricao.previousElementSibling.textContent = "Volume";
    txtDescricao.placeholder = "Ex: 350ml, 1L, 2L";
}

function configurarModalParaAdicional() {
    esconderCampoCategoria();
    esconderCampoImagem();
    esconderCampoPrecoBebida();

    txtDescricao.previousElementSibling.textContent = "Valor";
    txtDescricao.placeholder = "Ex: 5.00";
}

function resetarFormulario() {
    formProduto.reset();

    produtoId.value = "";
    mensagemProduto.textContent = "";
    imagemSelecionada = "";
    previewImagem.src = "../assets/images/pizza-placeholder.png";
}

function abrirModalNovoSabor() {
    abaAtual = "sabores";

    configurarModalParaSabor();
    resetarFormulario();

    tipoCadastro.value = "sabores";
    tituloModal.textContent = "Novo Sabor";
    selectStatus.value = "1";

    modalProduto.classList.remove("hidden");
    txtNome.focus();
}

function abrirModalEditarSabor(sabor) {
    configurarModalParaSabor();
    resetarFormulario();

    produtoId.value = sabor.id;
    tipoCadastro.value = "sabores";
    tituloModal.textContent = "Editar Sabor";

    txtNome.value = sabor.nome || "";
    selectCategoria.value = sabor.categoria || "Tradicional";
    txtDescricao.value = sabor.descricao || "";
    txtPrecoBebida.value = sabor.preco_pix || "";
    selectStatus.value = String(sabor.ativo);

    atualizarCampoPrecoSabor();

    imagemSelecionada = sabor.imagem || "";
    previewImagem.src = obterImagemProduto(sabor.imagem);

    modalProduto.classList.remove("hidden");
    txtNome.focus();
}

function abrirModalDuplicarSabor(sabor) {
    configurarModalParaSabor();
    resetarFormulario();

    tipoCadastro.value = "sabores";
    tituloModal.textContent = "Duplicar Sabor";

    txtNome.value = `${sabor.nome} (Cópia)`;
    selectCategoria.value = sabor.categoria || "Tradicional";
    txtDescricao.value = sabor.descricao || "";
    txtPrecoBebida.value = sabor.preco_pix || "";
    selectStatus.value = "1";

    atualizarCampoPrecoSabor();

    imagemSelecionada = sabor.imagem || "";
    previewImagem.src = obterImagemProduto(sabor.imagem);

    modalProduto.classList.remove("hidden");
    txtNome.focus();
}

function configurarModalParaCombo() {
    esconderCampoCategoria();
    mostrarCampoDescricao();
    mostrarCampoImagem();
    mostrarCampoPrecoBebida();

    txtPrecoBebida.previousElementSibling.textContent = "Preço Pix/Dinheiro";
    txtDescricao.previousElementSibling.textContent = "Descrição";
    txtDescricao.placeholder = "Ex: 2 pizzas família + 1 refrigerante";
}

function abrirModalNovoCombo() {
    abaAtual = "combos";

    configurarModalParaCombo();
    resetarFormulario();

    tipoCadastro.value = "combos";
    tituloModal.textContent = "Novo Combo";
    selectStatus.value = "1";

    modalProduto.classList.remove("hidden");
    txtNome.focus();
}

function abrirModalEditarCombo(combo) {
    configurarModalParaCombo();
    resetarFormulario();

    produtoId.value = combo.id;
    tipoCadastro.value = "combos";
    tituloModal.textContent = "Editar Combo";

    txtNome.value = combo.nome || "";
    txtDescricao.value = combo.descricao || "";
    txtPrecoBebida.value = combo.preco_pix_dinheiro || "";
    selectStatus.value = String(combo.ativo);

    imagemSelecionada = combo.imagem || "";
    previewImagem.src = obterImagemProduto(combo.imagem);

    modalProduto.classList.remove("hidden");
    txtNome.focus();
}

function abrirModalDuplicarCombo(combo) {
    configurarModalParaCombo();
    resetarFormulario();

    tipoCadastro.value = "combos";
    tituloModal.textContent = "Duplicar Combo";

    txtNome.value = `${combo.nome} (Cópia)`;
    txtDescricao.value = combo.descricao || "";
    txtPrecoBebida.value = combo.preco_pix_dinheiro || "";
    selectStatus.value = "1";

    imagemSelecionada = combo.imagem || "";
    previewImagem.src = obterImagemProduto(combo.imagem);

    modalProduto.classList.remove("hidden");
    txtNome.focus();
}

function abrirModalNovoTamanho() {
    abaAtual = "tamanhos";

    configurarModalParaTamanho();
    resetarFormulario();

    tipoCadastro.value = "tamanhos";
    tituloModal.textContent = "Novo Tamanho";
    selectStatus.value = "1";

    modalProduto.classList.remove("hidden");
    txtNome.focus();
}

function abrirModalEditarTamanho(tamanho) {
    configurarModalParaTamanho();
    resetarFormulario();

    produtoId.value = tamanho.id;
    tipoCadastro.value = "tamanhos";
    tituloModal.textContent = "Editar Tamanho";

    txtNome.value = tamanho.nome || "";
    txtDescricao.value = tamanho.fatias || "";
    selectStatus.value = String(tamanho.ativo);

    modalProduto.classList.remove("hidden");
    txtNome.focus();
}

function abrirModalDuplicarTamanho(tamanho) {
    configurarModalParaTamanho();
    resetarFormulario();

    tipoCadastro.value = "tamanhos";
    tituloModal.textContent = "Duplicar Tamanho";

    txtNome.value = `${tamanho.nome} (Cópia)`;
    txtDescricao.value = tamanho.fatias || "";
    selectStatus.value = "1";

    modalProduto.classList.remove("hidden");
    txtNome.focus();
}

function abrirModalNovoBebida() {
    abaAtual = "bebidas";

    configurarModalParaBebida();
    resetarFormulario();

    tipoCadastro.value = "bebidas";
    tituloModal.textContent = "Nova Bebida";
    selectStatus.value = "1";

    modalProduto.classList.remove("hidden");
    txtNome.focus();
}

function abrirModalEditarBebida(bebida) {
    configurarModalParaBebida();
    resetarFormulario();

    produtoId.value = bebida.id;
    tipoCadastro.value = "bebidas";
    tituloModal.textContent = "Editar Bebida";

    txtNome.value = bebida.nome || "";
    selectCategoria.value = bebida.categoria || "Refrigerante";
    txtDescricao.value = bebida.volume || "";
    txtPrecoBebida.value = bebida.preco || "";
    selectStatus.value = String(bebida.ativo);

    modalProduto.classList.remove("hidden");
    txtNome.focus();
}

function abrirModalDuplicarBebida(bebida) {
    configurarModalParaBebida();
    resetarFormulario();

    tipoCadastro.value = "bebidas";
    tituloModal.textContent = "Duplicar Bebida";

    txtNome.value = `${bebida.nome} (Cópia)`;
    selectCategoria.value = bebida.categoria || "Refrigerante";
    txtDescricao.value = bebida.volume || "";
    txtPrecoBebida.value = bebida.preco || "";
    selectStatus.value = "1";

    modalProduto.classList.remove("hidden");
    txtNome.focus();
}

function abrirModalNovoAdicional() {
    abaAtual = "adicionais";

    configurarModalParaAdicional();
    resetarFormulario();

    tipoCadastro.value = "adicionais";
    tituloModal.textContent = "Novo Adicional";
    selectStatus.value = "1";

    modalProduto.classList.remove("hidden");
    txtNome.focus();
}

function abrirModalEditarAdicional(adicional) {
    configurarModalParaAdicional();
    resetarFormulario();

    produtoId.value = adicional.id;
    tipoCadastro.value = "adicionais";
    tituloModal.textContent = "Editar Adicional";

    txtNome.value = adicional.nome || "";
    txtDescricao.value = adicional.preco || "";
    selectStatus.value = String(adicional.ativo);

    modalProduto.classList.remove("hidden");
    txtNome.focus();
}

function abrirModalDuplicarAdicional(adicional) {
    
    configurarModalParaAdicional();
    resetarFormulario();

    tipoCadastro.value = "adicionais";
    tituloModal.textContent = "Duplicar Adicional";

    txtNome.value = `${adicional.nome} (Cópia)`;
    txtDescricao.value = adicional.preco || "";
    selectStatus.value = "1";

    modalProduto.classList.remove("hidden");
    txtNome.focus();
}

function fecharModal() {
    modalProduto.classList.add("hidden");
    resetarFormulario();
}

function trocarAba(tabSelecionada) {
    abaAtual = tabSelecionada;

    cards.forEach((card) => {
        card.classList.toggle("active", card.dataset.tab === tabSelecionada);
    });

    tabs.forEach((tab) => {
        tab.classList.remove("active");
    });

    const abaSelecionada = document.getElementById(
        `tab${tabSelecionada.charAt(0).toUpperCase()}${tabSelecionada.slice(1)}`
    );

    if (abaSelecionada) {
        abaSelecionada.classList.add("active");
    }

    const nomesBotoes = {
        sabores: "Novo Sabor",
        combos: "Novo Combo",
        tamanhos: "Novo Tamanho",
        bebidas: "Nova Bebida",
        adicionais: "Novo Adicional",
        precos: "Novo Preço",
    };

    btnNovo.innerHTML = `
        <i class="fa-solid fa-plus"></i>
        ${nomesBotoes[tabSelecionada]}
    `;

    pesquisarProdutos();
}

function renderizarSabores(listaSabores) {
    tbodySabores.innerHTML = "";

    if (!listaSabores || listaSabores.length === 0) {
        tbodySabores.innerHTML = `
            <tr>
                <td colspan="6" class="empty-table">
                    Nenhum sabor cadastrado.
                </td>
            </tr>
        `;
        return;
    }

    listaSabores.forEach((sabor, index) => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${index + 1}</td>

            <td>
                <div style="display: flex; align-items: center; gap: 12px;">
                    <img
                        src="${obterImagemProduto(sabor.imagem)}"
                        alt="${sabor.nome}"
                        class="product-image"
                        onerror="this.onerror=null; this.src='../assets/images/pizza-placeholder.png';"
                    >
                    <div>
                        <strong>${sabor.nome}</strong>
                        <small>${sabor.descricao || ""}</small>
                    </div>
                </div>
            </td>

            <td>${sabor.categoria}</td>

            <td>${sabor.categoria === "Tradicional" ? "—" : formatarMoeda(sabor.preco_pix)}</td>

            <td>${montarStatus(sabor.ativo)}</td>

            <td>
                <div class="action-buttons">
                    <button class="btn-action btn-edit" title="Editar sabor" data-action="editar" data-id="${sabor.id}">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>

                    <button class="btn-action btn-copy" title="Duplicar sabor" data-action="duplicar" data-id="${sabor.id}">
                        <i class="fa-solid fa-copy"></i>
                    </button>

                    <button class="btn-action btn-disable" title="Inativar sabor" data-action="inativar" data-id="${sabor.id}">
                        <i class="fa-solid fa-ban"></i>
                    </button>

                    <button class="btn-action btn-delete" title="Excluir sabor" data-action="excluir" data-id="${sabor.id}">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </td>
        `;

        tbodySabores.appendChild(tr);
    });
}

function renderizarCombos(listaCombos) {
    tbodyCombos.innerHTML = "";

    if (!listaCombos || listaCombos.length === 0) {
        tbodyCombos.innerHTML = `
            <tr>
                <td colspan="5" class="empty-table">
                    Nenhum combo cadastrado.
                </td>
            </tr>
        `;
        return;
    }

    listaCombos.forEach((combo, index) => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${index + 1}</td>

            <td>
                <div style="display: flex; align-items: center; gap: 12px;">
                    <img
                        src="${obterImagemProduto(combo.imagem)}"
                        alt="${combo.nome}"
                        class="product-image"
                        onerror="this.onerror=null; this.src='../assets/images/pizza-placeholder.png';"
                    >
                    <div>
                        <strong>${combo.nome}</strong>
                        <small>${combo.descricao || ""}</small>
                    </div>
                </div>
            </td>

            <td>${formatarMoeda(combo.preco_pix_dinheiro)}</td>

            <td>${montarStatus(combo.ativo)}</td>

            <td>
                <div class="action-buttons">
                    <button class="btn-action btn-edit" title="Editar combo" data-action="editar" data-id="${combo.id}">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>

                    <button class="btn-action btn-copy" title="Duplicar combo" data-action="duplicar" data-id="${combo.id}">
                        <i class="fa-solid fa-copy"></i>
                    </button>

                    <button class="btn-action btn-disable" title="Inativar combo" data-action="inativar" data-id="${combo.id}">
                        <i class="fa-solid fa-ban"></i>
                    </button>

                    <button class="btn-action btn-delete" title="Excluir combo" data-action="excluir" data-id="${combo.id}">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </td>
        `;

        tbodyCombos.appendChild(tr);
    });
}

function renderizarTamanhos(listaTamanhos) {
    tbodyTamanhos.innerHTML = "";

    if (!listaTamanhos || listaTamanhos.length === 0) {
        tbodyTamanhos.innerHTML = `
            <tr>
                <td colspan="5" class="empty-table">
                    Nenhum tamanho cadastrado.
                </td>
            </tr>
        `;
        return;
    }

    listaTamanhos.forEach((tamanho, index) => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${index + 1}</td>

            <td>
                <strong>${tamanho.nome}</strong>
            </td>

            <td>${tamanho.fatias || 0}</td>

            <td>${montarStatus(tamanho.ativo)}</td>

            <td>
                <div class="action-buttons">
                    <button class="btn-action btn-edit" title="Editar tamanho" data-action="editar" data-id="${tamanho.id}">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>

                    <button class="btn-action btn-copy" title="Duplicar tamanho" data-action="duplicar" data-id="${tamanho.id}">
                        <i class="fa-solid fa-copy"></i>
                    </button>

                    <button class="btn-action btn-disable" title="Inativar tamanho" data-action="inativar" data-id="${tamanho.id}">
                        <i class="fa-solid fa-ban"></i>
                    </button>

                    <button class="btn-action btn-delete" title="Excluir tamanho" data-action="excluir" data-id="${tamanho.id}">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </td>
        `;

        tbodyTamanhos.appendChild(tr);
    });
}

function renderizarBebidas(listaBebidas) {
    tbodyBebidas.innerHTML = "";

    if (!listaBebidas || listaBebidas.length === 0) {
        tbodyBebidas.innerHTML = `
            <tr>
                <td colspan="7" class="empty-table">
                    Nenhuma bebida cadastrada.
                </td>
            </tr>
        `;
        return;
    }

    listaBebidas.forEach((bebida, index) => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${index + 1}</td>

            <td>
                <strong>${bebida.nome}</strong>
            </td>

            <td>${bebida.categoria}</td>

            <td>${bebida.volume || "-"}</td>

            <td>${formatarMoeda(bebida.preco)}</td>

            <td>${montarStatus(bebida.ativo)}</td>

            <td>
                <div class="action-buttons">
                    <button class="btn-action btn-edit" title="Editar bebida" data-action="editar" data-id="${bebida.id}">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>

                    <button class="btn-action btn-copy" title="Duplicar bebida" data-action="duplicar" data-id="${bebida.id}">
                        <i class="fa-solid fa-copy"></i>
                    </button>

                    <button class="btn-action btn-disable" title="Inativar bebida" data-action="inativar" data-id="${bebida.id}">
                        <i class="fa-solid fa-ban"></i>
                    </button>

                    <button class="btn-action btn-delete" title="Excluir bebida" data-action="excluir" data-id="${bebida.id}">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </td>
        `;

        tbodyBebidas.appendChild(tr);
    });
}

function renderizarAdicionais(listaAdicionais) {
    tbodyAdicionais.innerHTML = "";

    if (!listaAdicionais || listaAdicionais.length === 0) {
        tbodyAdicionais.innerHTML = `
            <tr>
                <td colspan="5" class="empty-table">
                    Nenhum adicional cadastrado.
                </td>
            </tr>
        `;
        return;
    }

    listaAdicionais.forEach((adicional, index) => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${index + 1}</td>

            <td>
                <strong>${adicional.nome}</strong>
            </td>

            <td>${formatarMoeda(adicional.preco)}</td>

            <td>${montarStatus(adicional.ativo)}</td>

            <td>
                <div class="action-buttons">
                    <button class="btn-action btn-edit" title="Editar adicional" data-action="editar" data-id="${adicional.id}">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>

                    <button class="btn-action btn-copy" title="Duplicar adicional" data-action="duplicar" data-id="${adicional.id}">
                        <i class="fa-solid fa-copy"></i>
                    </button>

                    <button class="btn-action btn-disable" title="Inativar adicional" data-action="inativar" data-id="${adicional.id}">
                        <i class="fa-solid fa-ban"></i>
                    </button>

                    <button class="btn-action btn-delete" title="Excluir adicional" data-action="excluir" data-id="${adicional.id}">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </td>
        `;

        tbodyAdicionais.appendChild(tr);
    });
}

function renderizarListaPaginada(tipo, lista) {
    const config = paginacao[tipo];

    if (!config) return;

    config.listaAtual = lista || [];

    const totalPaginas = Math.ceil(config.listaAtual.length / itensPorPagina);

    if (config.paginaAtual > totalPaginas) {
        config.paginaAtual = totalPaginas || 1;
    }

    const inicio = (config.paginaAtual - 1) * itensPorPagina;
    const fim = inicio + itensPorPagina;

    const listaPagina = config.listaAtual.slice(inicio, fim);

    config.renderizar(listaPagina);

    renderizarBotoesPaginacao(tipo);
}

function renderizarBotoesPaginacao(tipo) {
    const config = paginacao[tipo];

    if (!config || !config.container) return;

    config.container.innerHTML = "";

    const totalPaginas = Math.ceil(config.listaAtual.length / itensPorPagina);

    if (totalPaginas <= 1) return;

    for (let pagina = 1; pagina <= totalPaginas; pagina++) {
        const botao = document.createElement("button");

        botao.type = "button";
        botao.textContent = pagina;
        botao.className =
            pagina === config.paginaAtual
                ? "pagination-button active"
                : "pagination-button";

        botao.addEventListener("click", () => {
            config.paginaAtual = pagina;
            renderizarListaPaginada(tipo, config.listaAtual);
        });

        config.container.appendChild(botao);
    }
}

async function carregarSabores() {
    const resposta = await window.api.listarSabores();

    if (!resposta.sucesso) {
        mostrarToast(resposta.mensagem, "error");
        return;
    }

    sabores = resposta.sabores;

    paginacao.sabores.paginaAtual = 1;
    renderizarListaPaginada("sabores", sabores);

    atualizarTotais();
}

async function carregarTamanhos() {
    const resposta = await window.api.listarTamanhos();

    if (!resposta.sucesso) {
        mostrarToast(resposta.mensagem, "error");
        return;
    }

    tamanhos = resposta.tamanhos;

    paginacao.tamanhos.paginaAtual = 1;
    renderizarListaPaginada("tamanhos", tamanhos);

    atualizarTotais();
}

async function carregarCombos() {
    const resposta = await window.api.listarCombos();

    if (!resposta.sucesso) {
        mostrarToast(resposta.mensagem, "error");
        return;
    }

    combos = resposta.combos;

    paginacao.combos.paginaAtual = 1;
    renderizarListaPaginada("combos", combos);

    atualizarTotais();
}

async function carregarBebidas() {
    const resposta = await window.api.listarBebidas();

    if (!resposta.sucesso) {
        mostrarToast(resposta.mensagem, "error");
        return;
    }

    bebidas = resposta.bebidas;

    paginacao.bebidas.paginaAtual = 1;
    renderizarListaPaginada("bebidas", bebidas);

    atualizarTotais();
}

async function carregarAdicionais() {
    const resposta = await window.api.listarAdicionais();

    if (!resposta.sucesso) {
        mostrarToast(resposta.mensagem, "error");
        return;
    }

    adicionais = resposta.adicionais;

    paginacao.adicionais.paginaAtual = 1;
    renderizarListaPaginada("adicionais", adicionais);

    atualizarTotais();
}

function pesquisarProdutos() {
    const termo = txtPesquisar.value.trim().toLowerCase();

    if (abaAtual === "sabores") {
        const filtrados = sabores.filter((sabor) => {
            return (
                String(sabor.nome || "").toLowerCase().includes(termo) ||
                String(sabor.categoria || "").toLowerCase().includes(termo) ||
                String(sabor.descricao || "").toLowerCase().includes(termo)
            );
        });

        paginacao.sabores.paginaAtual = 1;
        renderizarListaPaginada("sabores", termo ? filtrados : sabores);
        return;
    }

    if (abaAtual === "combos") {
        const filtrados = combos.filter((combo) => {
            return (
                String(combo.nome || "").toLowerCase().includes(termo) ||
                String(combo.descricao || "").toLowerCase().includes(termo)
            );
        });

        paginacao.combos.paginaAtual = 1;
        renderizarListaPaginada("combos", termo ? filtrados : combos);
        return;
    }

    if (abaAtual === "tamanhos") {
        const filtrados = tamanhos.filter((tamanho) => {
            return String(tamanho.nome || "").toLowerCase().includes(termo);
        });

        paginacao.tamanhos.paginaAtual = 1;
        renderizarListaPaginada("tamanhos", termo ? filtrados : tamanhos);
        return;
    }

    if (abaAtual === "bebidas") {
        const filtrados = bebidas.filter((bebida) => {
            return (
                String(bebida.nome || "").toLowerCase().includes(termo) ||
                String(bebida.categoria || "").toLowerCase().includes(termo) ||
                String(bebida.volume || "").toLowerCase().includes(termo)
            );
        });

        paginacao.bebidas.paginaAtual = 1;
        renderizarListaPaginada("bebidas", termo ? filtrados : bebidas);
    }

    if (abaAtual === "adicionais") {
        const filtrados = adicionais.filter((adicional) => {
            return String(adicional.nome || "").toLowerCase().includes(termo);
        });

        paginacao.adicionais.paginaAtual = 1;
        renderizarListaPaginada("adicionais", termo ? filtrados : adicionais);
    }
}

function obterDadosSabor() {
    return {
        id: produtoId.value,
        nome: txtNome.value.trim(),
        categoria: selectCategoria.value,
        descricao: txtDescricao.value.trim(),
        imagem: imagemSelecionada || "",
        preco_pix: selectCategoria.value !== "Tradicional" && txtPrecoBebida.value
            ? Number(txtPrecoBebida.value)
            : null,
        ativo: selectStatus.value,
    };
}

function obterDadosCombo() {
    return {
        id: produtoId.value,
        nome: txtNome.value.trim(),
        descricao: txtDescricao.value.trim(),
        imagem: imagemSelecionada || "",
        preco_pix_dinheiro: Number(txtPrecoBebida.value) || 0,
        ativo: selectStatus.value,
    };
}

function obterDadosTamanho() {
    return {
        id: produtoId.value,
        nome: txtNome.value.trim(),
        fatias: txtDescricao.value.trim(),
        ativo: selectStatus.value,
    };
}

function obterDadosBebida() {
    return {
        id: produtoId.value,
        nome: txtNome.value.trim(),
        categoria: selectCategoria.value,
        volume: txtDescricao.value.trim(),
        preco: Number(txtPrecoBebida.value) || 0,
        ativo: selectStatus.value,
    };
}

function obterDadosAdicional() {
    return {
        id: produtoId.value,
        nome: txtNome.value.trim(),
        preco: txtDescricao.value.trim().replace(",", "."),
        ativo: selectStatus.value,
    };
}

async function salvarSabor(event) {
    event.preventDefault();

    mensagemProduto.textContent = "";

    const sabor = obterDadosSabor();

    const resposta = sabor.id
        ? await window.api.atualizarSabor(sabor)
        : await window.api.salvarSabor(sabor);

    if (!resposta.sucesso) {
        mensagemProduto.textContent = resposta.mensagem;
        mostrarToast(resposta.mensagem, "error");
        return;
    }

    fecharModal();
    await carregarSabores();
    mostrarToast(resposta.mensagem, "success");
}

async function salvarCombo(event) {
    event.preventDefault();

    mensagemProduto.textContent = "";

    const combo = obterDadosCombo();

    const resposta = combo.id
        ? await window.api.atualizarCombo(combo)
        : await window.api.salvarCombo(combo);

    if (!resposta.sucesso) {
        mensagemProduto.textContent = resposta.mensagem;
        mostrarToast(resposta.mensagem, "error");
        return;
    }

    fecharModal();
    await carregarCombos();
    mostrarToast(resposta.mensagem, "success");
}

async function salvarTamanho(event) {
    event.preventDefault();

    mensagemProduto.textContent = "";

    const tamanho = obterDadosTamanho();

    const resposta = tamanho.id
        ? await window.api.atualizarTamanho(tamanho)
        : await window.api.salvarTamanho(tamanho);

    if (!resposta.sucesso) {
        mensagemProduto.textContent = resposta.mensagem;
        mostrarToast(resposta.mensagem, "error");
        return;
    }

    fecharModal();
    await carregarTamanhos();
    mostrarToast(resposta.mensagem, "success");
}

async function salvarBebida(event) {
    event.preventDefault();

    mensagemProduto.textContent = "";

    const bebida = obterDadosBebida();

    const resposta = bebida.id
        ? await window.api.atualizarBebida(bebida)
        : await window.api.salvarBebida(bebida);

    if (!resposta.sucesso) {
        mensagemProduto.textContent = resposta.mensagem;
        mostrarToast(resposta.mensagem, "error");
        return;
    }

    fecharModal();
    await carregarBebidas();
    mostrarToast(resposta.mensagem, "success");
}

async function salvarAdicional(event) {
    event.preventDefault();

    mensagemProduto.textContent = "";

    const adicional = obterDadosAdicional();

    const resposta = adicional.id
        ? await window.api.atualizarAdicional(adicional)
        : await window.api.salvarAdicional(adicional);

    if (!resposta.sucesso) {
        mensagemProduto.textContent = resposta.mensagem;
        mostrarToast(resposta.mensagem, "error");
        return;
    }

    fecharModal();
    await carregarAdicionais();
    mostrarToast(resposta.mensagem, "success");
}

async function confirmarInativacao({ titulo, mensagem, callback }) {
    const confirmar = await confirmarAcao({
        titulo,
        mensagem,
        textoCancelar: "Cancelar",
        textoConfirmar: "Inativar",
    });

    if (!confirmar) {
        return;
    }

    await callback();
}

async function confirmarExclusao({ titulo, mensagem, callback }) {
    const confirmar = await confirmarAcao({
        titulo,
        mensagem,
        textoCancelar: "Cancelar",
        textoConfirmar: "Excluir",
    });

    if (!confirmar) {
        return;
    }

    await callback();
}

function executarAcaoSabores(event) {
    const botao = event.target.closest("button");

    if (!botao) return;

    const acao = botao.dataset.action;
    const id = Number(botao.dataset.id);
    const sabor = sabores.find((item) => Number(item.id) === id);

    if (!sabor) return;

    if (acao === "editar") abrirModalEditarSabor(sabor);
    if (acao === "duplicar") abrirModalDuplicarSabor(sabor);

    if (acao === "inativar") {
        confirmarInativacao({
            titulo: "Inativar sabor",
            mensagem: "Deseja realmente inativar este sabor?",
            callback: async () => {
                const resposta = await window.api.inativarSabor(id);
                await carregarSabores();
                mostrarToast(resposta.mensagem, resposta.sucesso ? "success" : "error");
            },
        });
    }

    if (acao === "excluir") {
        confirmarExclusao({
            titulo: "Excluir sabor",
            mensagem: "Deseja realmente excluir este sabor permanentemente?",
            callback: async () => {
                const resposta = await window.api.excluirSabor(id);
                await carregarSabores();
                mostrarToast(resposta.mensagem, resposta.sucesso ? "success" : "error");
            },
        });
    }
}

function executarAcaoCombos(event) {
    const botao = event.target.closest("button");

    if (!botao) return;

    const acao = botao.dataset.action;
    const id = Number(botao.dataset.id);
    const combo = combos.find((item) => Number(item.id) === id);

    if (!combo) return;

    if (acao === "editar") abrirModalEditarCombo(combo);
    if (acao === "duplicar") abrirModalDuplicarCombo(combo);

    if (acao === "inativar") {
        confirmarInativacao({
            titulo: "Inativar combo",
            mensagem: "Deseja realmente inativar este combo?",
            callback: async () => {
                const resposta = await window.api.inativarCombo(id);
                await carregarCombos();
                mostrarToast(resposta.mensagem, resposta.sucesso ? "success" : "error");
            },
        });
    }

    if (acao === "excluir") {
        confirmarExclusao({
            titulo: "Excluir combo",
            mensagem: "Deseja realmente excluir este combo permanentemente?",
            callback: async () => {
                const resposta = await window.api.excluirCombo(id);
                await carregarCombos();
                mostrarToast(resposta.mensagem, resposta.sucesso ? "success" : "error");
            },
        });
    }
}

function executarAcaoTamanhos(event) {
    const botao = event.target.closest("button");

    if (!botao) return;

    const acao = botao.dataset.action;
    const id = Number(botao.dataset.id);
    const tamanho = tamanhos.find((item) => Number(item.id) === id);

    if (!tamanho) return;

    if (acao === "editar") abrirModalEditarTamanho(tamanho);
    if (acao === "duplicar") abrirModalDuplicarTamanho(tamanho);

    if (acao === "inativar") {
        confirmarInativacao({
            titulo: "Inativar tamanho",
            mensagem: "Deseja realmente inativar este tamanho?",
            callback: async () => {
                const resposta = await window.api.inativarTamanho(id);
                await carregarTamanhos();
                mostrarToast(resposta.mensagem, resposta.sucesso ? "success" : "error");
            },
        });
    }

    if (acao === "excluir") {
        confirmarExclusao({
            titulo: "Excluir tamanho",
            mensagem: "Deseja realmente excluir este tamanho permanentemente?",
            callback: async () => {
                const resposta = await window.api.excluirTamanho(id);
                await carregarTamanhos();
                mostrarToast(resposta.mensagem, resposta.sucesso ? "success" : "error");
            },
        });
    }
}

function executarAcaoBebidas(event) {
    const botao = event.target.closest("button");

    if (!botao) return;

    const acao = botao.dataset.action;
    const id = Number(botao.dataset.id);
    const bebida = bebidas.find((item) => Number(item.id) === id);

    if (!bebida) return;

    if (acao === "editar") abrirModalEditarBebida(bebida);
    if (acao === "duplicar") abrirModalDuplicarBebida(bebida);

    if (acao === "inativar") {
        confirmarInativacao({
            titulo: "Inativar bebida",
            mensagem: "Deseja realmente inativar esta bebida?",
            callback: async () => {
                const resposta = await window.api.inativarBebida(id);
                await carregarBebidas();
                mostrarToast(resposta.mensagem, resposta.sucesso ? "success" : "error");
            },
        });
    }

    if (acao === "excluir") {
        confirmarExclusao({
            titulo: "Excluir bebida",
            mensagem: "Deseja realmente excluir esta bebida permanentemente?",
            callback: async () => {
                const resposta = await window.api.excluirBebida(id);
                await carregarBebidas();
                mostrarToast(resposta.mensagem, resposta.sucesso ? "success" : "error");
            },
        });
    }
}

function executarAcaoAdicionais(event) {
    const botao = event.target.closest("button");

    if (!botao) {
        return;
    }

    const acao = botao.dataset.action;
    const id = Number(botao.dataset.id);
    const adicional = adicionais.find((item) => Number(item.id) === id);

    if (!adicional) {
        return;
    }

    if (acao === "editar") {
        abrirModalEditarAdicional(adicional);
    }

    if (acao === "duplicar") {
        abrirModalDuplicarAdicional(adicional);
    }

    if (acao === "inativar") {
        confirmarInativacao({
            titulo: "Inativar adicional",
            mensagem: "Deseja realmente inativar este adicional?",
            callback: async () => {
                const resposta = await window.api.inativarAdicional(id);

                await carregarAdicionais();

                mostrarToast(
                    resposta.mensagem,
                    resposta.sucesso ? "success" : "error"
                );
            },
        });
    }

    if (acao === "excluir") {
        confirmarExclusao({
            titulo: "Excluir adicional",
            mensagem: "Deseja realmente excluir este adicional permanentemente?",
            callback: async () => {
                const resposta = await window.api.excluirAdicional(id);

                await carregarAdicionais();

                mostrarToast(
                    resposta.mensagem,
                    resposta.sucesso ? "success" : "error"
                );
            },
        });
    }
}

inputImagem.addEventListener("change", async () => {
    const arquivo = inputImagem.files[0];

    if (!arquivo) {
        return;
    }

    const caminhoOrigem = window.api.obterCaminhoArquivo(arquivo);

    const resposta = abaAtual === "combos"
        ? await window.api.salvarImagemCombo(caminhoOrigem)
        : await window.api.salvarImagemSabor(caminhoOrigem);

    if (!resposta.sucesso) {
        mostrarToast(resposta.mensagem, "error");
        return;
    }

    imagemSelecionada = resposta.caminho;
    previewImagem.src = resposta.caminho;
});

const btnRemoverImagem = document.getElementById("btnRemoverImagem");

if (btnRemoverImagem) {
    btnRemoverImagem.addEventListener("click", () => {
        imagemSelecionada = "";
        inputImagem.value = "";
        previewImagem.src = "../assets/images/pizza-placeholder.png";
    });
}

selectCategoria.addEventListener("change", () => {
    if (abaAtual === "sabores") {
        atualizarCampoPrecoSabor();
    }
});

cards.forEach((card) => {
    card.addEventListener("click", () => {
        trocarAba(card.dataset.tab);
    });
});

btnNovo.addEventListener("click", () => {
    if (abaAtual === "sabores") {
        abrirModalNovoSabor();
        return;
    }

    if (abaAtual === "combos") {
        abrirModalNovoCombo();
        return;
    }

    if (abaAtual === "tamanhos") {
        abrirModalNovoTamanho();
        return;
    }

    if (abaAtual === "bebidas") {
        abrirModalNovoBebida();
        return;
    }

    if (abaAtual === "adicionais") {
        abrirModalNovoAdicional();
        return;
    }

    if (abaAtual === "precos") {
        abrirModalNovoPrecoCategoria();
        return;
    }

    mostrarToast("Esta seção será implementada nas próximas etapas.", "warning");
});

btnFecharModal.addEventListener("click", fecharModal);
btnCancelar.addEventListener("click", fecharModal);

formProduto.addEventListener("submit", (event) => {
    if (abaAtual === "sabores") {
        salvarSabor(event);
        return;
    }

    if (abaAtual === "combos") {
        salvarCombo(event);
        return;
    }

    if (abaAtual === "tamanhos") {
        salvarTamanho(event);
        return;
    }

    if (abaAtual === "bebidas") {
        salvarBebida(event);
        return;
}

    if (abaAtual === "adicionais") {
        salvarAdicional(event);
    }
});

tbodySabores.addEventListener("click", executarAcaoSabores);
tbodyCombos.addEventListener("click", executarAcaoCombos);
tbodyTamanhos.addEventListener("click", executarAcaoTamanhos);
tbodyBebidas.addEventListener("click", executarAcaoBebidas);
tbodyAdicionais.addEventListener("click", executarAcaoAdicionais);

txtPesquisar.addEventListener("input", pesquisarProdutos);

btnSair.addEventListener("click", () => {
    sessionStorage.removeItem("usuarioLogado");
    window.location.href = "login.html";
});

trocarAba("sabores");
carregarSabores();
carregarCombos();
carregarTamanhos();
carregarBebidas();
carregarAdicionais();