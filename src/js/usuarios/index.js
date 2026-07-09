/* ==========================================================
    REFERÊNCIAS DO DOM
   ========================================================== */

const btnSair          = document.getElementById("btnSair");
const btnNovoUsuario   = document.getElementById("btnNovoUsuario");
const tbodyUsuarios    = document.getElementById("tbodyUsuarios");

const modalUsuario          = document.getElementById("modalUsuario");
const tituloModalUsuario    = document.getElementById("tituloModalUsuario");
const btnFecharModalUsuario = document.getElementById("btnFecharModalUsuario");
const btnCancelarUsuario    = document.getElementById("btnCancelarUsuario");
const formUsuario           = document.getElementById("formUsuario");
const usuarioId             = document.getElementById("usuarioId");
const txtNomeUsuario        = document.getElementById("txtNomeUsuario");
const txtLoginUsuario       = document.getElementById("txtLoginUsuario");
const txtSenhaUsuario       = document.getElementById("txtSenhaUsuario");
const txtConfirmarSenha     = document.getElementById("txtConfirmarSenha");
const selectTipoUsuario     = document.getElementById("selectTipoUsuario");
const grupoLoginUsuario     = document.getElementById("grupoLoginUsuario");
const grupoCriarSenha       = document.getElementById("grupoCriarSenha");
const mensagemUsuario       = document.getElementById("mensagemUsuario");

const modalSenha            = document.getElementById("modalSenha");
const tituloModalSenha      = document.getElementById("tituloModalSenha");
const btnFecharModalSenha   = document.getElementById("btnFecharModalSenha");
const btnCancelarSenha      = document.getElementById("btnCancelarSenha");
const formSenha             = document.getElementById("formSenha");
const senhauserId           = document.getElementById("senhauserId");
const txtNovaSenha          = document.getElementById("txtNovaSenha");
const txtConfirmarNovaSenha = document.getElementById("txtConfirmarNovaSenha");
const mensagemSenha         = document.getElementById("mensagemSenha");

/* ==========================================================
    ESTADO
   ========================================================== */

let usuarios = [];

const usuarioLogado = JSON.parse(sessionStorage.getItem("usuarioLogado"));

if (!usuarioLogado) {
    window.location.href = "login.html";
} else if (usuarioLogado.tipo !== "admin") {
    window.location.href = "dashboard.html";
}

/* ==========================================================
    LISTAGEM
   ========================================================== */

function montarBadgeTipo(tipo) {
    if (tipo === "admin") {
        return `<span class="status-badge" style="background:rgba(251,178,21,0.15);color:#FBB215;">
                    Administrador
                </span>`;
    }

    return `<span class="status-badge" style="background:rgba(96,165,250,0.15);color:#60a5fa;">
                Atendente
            </span>`;
}

function montarBadgeStatus(ativo) {
    if (Number(ativo) === 1) {
        return `<span class="status-badge status-ativo">Ativo</span>`;
    }

    return `<span class="status-badge status-inativo">Inativo</span>`;
}

function renderizarUsuarios() {
    tbodyUsuarios.innerHTML = "";

    if (!usuarios.length) {
        tbodyUsuarios.innerHTML = `
            <tr>
                <td colspan="6" class="empty-table">Nenhum usuário encontrado.</td>
            </tr>
        `;
        return;
    }

    usuarios.forEach((u, index) => {
        const tr = document.createElement("tr");
        const ehVoceMesmo = Number(u.id) === Number(usuarioLogado.id);

        const botaoInativarReativar = ehVoceMesmo ? "" : Number(u.ativo) === 1
            ? `<button class="btn-action btn-disable" title="Inativar" data-action="inativar" data-id="${u.id}">
                <i class="fa-solid fa-ban"></i>
                </button>`
            : `<button class="btn-action btn-edit" title="Reativar" data-action="reativar" data-id="${u.id}" style="color:var(--color-success)">
                <i class="fa-solid fa-circle-check"></i>
                </button>`;

        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>
                <strong>${u.nome}</strong>
                ${ehVoceMesmo ? `<small style="color:var(--color-gold)">você</small>` : ""}
            </td>
            <td>${u.usuario}</td>
            <td>${montarBadgeTipo(u.tipo)}</td>
            <td>${montarBadgeStatus(u.ativo)}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-action btn-edit" title="Editar" data-action="editar" data-id="${u.id}">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>

                    <button class="btn-action btn-copy" title="Trocar senha" data-action="senha" data-id="${u.id}">
                        <i class="fa-solid fa-key"></i>
                    </button>

                    ${botaoInativarReativar}
                </div>
            </td>
        `;

        tbodyUsuarios.appendChild(tr);
    });
}

async function carregarUsuarios() {
    const resposta = await window.api.listarUsuarios();

    if (!resposta.sucesso) {
        mostrarToast(resposta.mensagem, "error");
        return;
    }

    usuarios = resposta.usuarios;
    renderizarUsuarios();
}

/* ==========================================================
    MODAL CRIAR / EDITAR
   ========================================================== */

function resetarFormularioUsuario() {
    formUsuario.reset();
    usuarioId.value = "";
    mensagemUsuario.textContent = "";
}

function abrirModalNovoUsuario() {
    resetarFormularioUsuario();
    tituloModalUsuario.textContent = "Novo usuário";
    grupoLoginUsuario.style.display = "";
    grupoCriarSenha.style.display = "";
    modalUsuario.classList.remove("hidden");
    txtNomeUsuario.focus();
}

function abrirModalEditarUsuario(id) {
    const u = usuarios.find((x) => Number(x.id) === Number(id));

    if (!u) return;

    resetarFormularioUsuario();
    tituloModalUsuario.textContent = "Editar usuário";

    usuarioId.value = u.id;
    txtNomeUsuario.value = u.nome;
    txtLoginUsuario.value = u.usuario;
    selectTipoUsuario.value = u.tipo;

    grupoLoginUsuario.style.display = "";
    grupoCriarSenha.style.display = "none";

    modalUsuario.classList.remove("hidden");
    txtNomeUsuario.focus();
}

function fecharModalUsuario() {
    modalUsuario.classList.add("hidden");
}

formUsuario.addEventListener("submit", async (event) => {
    event.preventDefault();

    mensagemUsuario.textContent = "";

    const id    = usuarioId.value;
    const nome  = txtNomeUsuario.value.trim();
    const login = txtLoginUsuario.value.trim();
    const tipo  = selectTipoUsuario.value;

    if (id) {
        const resposta = await window.api.atualizarUsuario({ id, nome, usuario: login, tipo });

        if (!resposta.sucesso) {
            mensagemUsuario.textContent = resposta.mensagem;
            return;
        }

        fecharModalUsuario();
        await carregarUsuarios();
        mostrarToast(resposta.mensagem, "success");
    } else {
        const senha = txtSenhaUsuario.value;
        const conf  = txtConfirmarSenha.value;

        if (senha !== conf) {
            mensagemUsuario.textContent = "As senhas não coincidem.";
            return;
        }

        const resposta = await window.api.criarUsuario({ nome, usuario: login, senha, tipo });

        if (!resposta.sucesso) {
            mensagemUsuario.textContent = resposta.mensagem;
            return;
        }

        fecharModalUsuario();
        await carregarUsuarios();
        mostrarToast(resposta.mensagem, "success");
    }
});

/* ==========================================================
    MODAL TROCAR SENHA
   ========================================================== */

function abrirModalSenha(id) {
    const u = usuarios.find((x) => Number(x.id) === Number(id));

    if (!u) return;

    formSenha.reset();
    senhauserId.value = id;
    mensagemSenha.textContent = "";
    tituloModalSenha.textContent = `Trocar senha — ${u.nome}`;
    modalSenha.classList.remove("hidden");
    txtNovaSenha.focus();
}

function fecharModalSenha() {
    modalSenha.classList.add("hidden");
}

formSenha.addEventListener("submit", async (event) => {
    event.preventDefault();

    mensagemSenha.textContent = "";

    const id        = senhauserId.value;
    const novaSenha = txtNovaSenha.value;
    const conf      = txtConfirmarNovaSenha.value;

    if (novaSenha !== conf) {
        mensagemSenha.textContent = "As senhas não coincidem.";
        return;
    }

    const resposta = await window.api.trocarSenhaUsuario({ id, novaSenha });

    if (!resposta.sucesso) {
        mensagemSenha.textContent = resposta.mensagem;
        return;
    }

    fecharModalSenha();
    mostrarToast(resposta.mensagem, "success");
});

/* ==========================================================
    AÇÕES DA TABELA
   ========================================================== */

tbodyUsuarios.addEventListener("click", async (event) => {
    const botao = event.target.closest("button[data-action]");

    if (!botao) return;

    const acao = botao.dataset.action;
    const id   = Number(botao.dataset.id);

    if (acao === "editar") {
        abrirModalEditarUsuario(id);
    }

    if (acao === "senha") {
        abrirModalSenha(id);
    }

    if (acao === "inativar") {
        const confirmar = await confirmarAcao({
            titulo: "Inativar usuário",
            mensagem: "Este usuário perderá o acesso ao sistema. Deseja continuar?",
            textoCancelar: "Voltar",
            textoConfirmar: "Inativar",
        });

        if (!confirmar) return;

        const resposta = await window.api.inativarUsuario({
            id,
            adminId: usuarioLogado.id,
        });

        mostrarToast(resposta.mensagem, resposta.sucesso ? "success" : "error");
        await carregarUsuarios();
    }

    if (acao === "reativar") {
        const resposta = await window.api.reativarUsuario(id);

        mostrarToast(resposta.mensagem, resposta.sucesso ? "success" : "error");
        await carregarUsuarios();
    }
});

/* ==========================================================
    EVENTOS GERAIS
   ========================================================== */

btnNovoUsuario.addEventListener("click", abrirModalNovoUsuario);
btnFecharModalUsuario.addEventListener("click", fecharModalUsuario);
btnCancelarUsuario.addEventListener("click", fecharModalUsuario);
btnFecharModalSenha.addEventListener("click", fecharModalSenha);
btnCancelarSenha.addEventListener("click", fecharModalSenha);

btnSair.addEventListener("click", () => {
    sessionStorage.removeItem("usuarioLogado");
    window.location.href = "login.html";
});

/* ==========================================================
    INICIALIZAÇÃO
   ========================================================== */

carregarUsuarios();