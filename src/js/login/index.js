/* ==========================================================
    SENHA MASTER — preencha antes de entregar
========================================================== */
const SENHA_MASTER = "pizza#@Carioca"; // ← coloque aqui a senha master

/* ==========================================================
    REFERÊNCIAS DOM
========================================================== */
const formLogin          = document.getElementById("formLogin");
const txtUsuario         = document.getElementById("txtUsuario");
const txtSenha           = document.getElementById("txtSenha");
const btnMostrarSenha    = document.getElementById("btnMostrarSenha");
const mensagem           = document.getElementById("mensagem");

const loginBox           = document.getElementById("loginBox");
const criarContaBox      = document.getElementById("criarContaBox");
const btnIrCriarConta    = document.getElementById("btnIrCriarConta");
const btnVoltarLogin     = document.getElementById("btnVoltarLogin");
const formCriarConta     = document.getElementById("formCriarConta");
const txtNovoConta       = document.getElementById("txtNovoConta");
const txtLoginConta      = document.getElementById("txtLoginConta");
const txtSenhaConta      = document.getElementById("txtSenhaConta");
const txtConfSenhaConta  = document.getElementById("txtConfSenhaConta");
const mensagemConta      = document.getElementById("mensagemConta");

const modalMaster        = document.getElementById("modalMaster");
const txtSenhaMaster     = document.getElementById("txtSenhaMaster");
const mensagemMaster     = document.getElementById("mensagemMaster");
const btnCancelarMaster  = document.getElementById("btnCancelarMaster");
const btnConfirmarMaster = document.getElementById("btnConfirmarMaster");

const modalReset         = document.getElementById("modalReset");
const selectUsuarioReset = document.getElementById("selectUsuarioReset");
const txtNovasenhaReset  = document.getElementById("txtNovasenhaReset");
const txtConfsenhaReset  = document.getElementById("txtConfsenhaReset");
const mensagemReset      = document.getElementById("mensagemReset");
const btnCancelarReset   = document.getElementById("btnCancelarReset");
const btnConfirmarReset  = document.getElementById("btnConfirmarReset");

/* ==========================================================
   MOSTRAR / OCULTAR SENHA
========================================================== */
if (btnMostrarSenha && txtSenha) {
    btnMostrarSenha.addEventListener("click", () => {
        const oculta = txtSenha.type === "password";
        txtSenha.type = oculta ? "text" : "password";
        btnMostrarSenha.innerHTML = oculta
            ? '<i class="fa-solid fa-eye-slash"></i>'
            : '<i class="fa-solid fa-eye"></i>';
    });
}

/* ==========================================================
   LOGIN
========================================================== */
if (formLogin) {
    formLogin.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (mensagem) mensagem.textContent = "";

        const usuario = txtUsuario.value.trim();
        const senha   = txtSenha.value.trim();

        if (!usuario || !senha) {
            if (mensagem) mensagem.textContent = "Informe usuário e senha.";
            return;
        }

        try {
            const resposta = await window.api.login({ usuario, senha });

            if (!resposta.sucesso) {
                if (mensagem) mensagem.textContent = resposta.mensagem;
                return;
            }

            sessionStorage.setItem("usuarioLogado", JSON.stringify(resposta.usuario));
            window.location.href = "dashboard.html";
        } catch (erro) {
            console.error("Erro ao fazer login:", erro);
            if (mensagem) mensagem.textContent = "Erro ao fazer login. Tente novamente.";
        }
    });
}

/* ==========================================================
   CRIAR CONTA (atendente)
========================================================== */
btnIrCriarConta.addEventListener("click", () => {
    loginBox.classList.add("hidden");
    criarContaBox.classList.remove("hidden");
    mensagemConta.textContent = "";
    formCriarConta.reset();
});

btnVoltarLogin.addEventListener("click", () => {
    criarContaBox.classList.add("hidden");
    loginBox.classList.remove("hidden");
});

formCriarConta.addEventListener("submit", async (event) => {
    event.preventDefault();
    mensagemConta.textContent = "";

    const nome   = txtNovoConta.value.trim();
    const login  = txtLoginConta.value.trim();
    const senha  = txtSenhaConta.value;
    const conf   = txtConfSenhaConta.value;

    if (!nome || !login || !senha) {
        mensagemConta.textContent = "Preencha todos os campos.";
        return;
    }

    if (senha !== conf) {
        mensagemConta.textContent = "As senhas não coincidem.";
        return;
    }

    try {
        const resposta = await window.api.criarUsuario({
            nome,
            usuario: login,
            senha,
            tipo: "atendente",
        });

        if (!resposta.sucesso) {
            mensagemConta.textContent = resposta.mensagem;
            return;
        }

        criarContaBox.classList.add("hidden");
        loginBox.classList.remove("hidden");
        mensagem.textContent = "";
        if (mensagem) {
            mensagem.style.color = "var(--color-success)";
            mensagem.textContent = "Conta criada com sucesso! Faça login.";
            setTimeout(() => {
                mensagem.textContent = "";
                mensagem.style.color = "";
            }, 4000);
        }
    } catch (erro) {
        mensagemConta.textContent = "Erro ao criar conta. Tente novamente.";
    }
});

/* ==========================================================
   ATALHO CTRL+SHIFT+R — abre modal master
========================================================== */
document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === "R") {
        e.preventDefault();
        abrirModalMaster();
    }
});

function abrirModalMaster() {
    txtSenhaMaster.value = "";
    mensagemMaster.textContent = "";
    modalMaster.classList.remove("hidden");
    txtSenhaMaster.focus();
}

function fecharModalMaster() {
    modalMaster.classList.add("hidden");
}

btnCancelarMaster.addEventListener("click", fecharModalMaster);

btnConfirmarMaster.addEventListener("click", async () => {
    mensagemMaster.textContent = "";

    if (txtSenhaMaster.value !== SENHA_MASTER) {
        mensagemMaster.textContent = "Senha incorreta.";
        txtSenhaMaster.value = "";
        txtSenhaMaster.focus();
        return;
    }

    fecharModalMaster();
    await abrirModalReset();
});

/* ==========================================================
   MODAL RESET DE SENHA
========================================================== */
async function abrirModalReset() {
    mensagemReset.textContent = "";
    txtNovasenhaReset.value = "";
    txtConfsenhaReset.value = "";

    try {
        const resposta = await window.api.listarUsuarios();
        const usuarios = (resposta.usuarios || []).filter((u) => Number(u.ativo) === 1);

        selectUsuarioReset.innerHTML = usuarios
            .map((u) => `<option value="${u.id}">${u.nome} (${u.usuario})</option>`)
            .join("");
    } catch (erro) {
        selectUsuarioReset.innerHTML = "<option>Erro ao carregar usuários</option>";
    }

    modalReset.classList.remove("hidden");
    txtNovasenhaReset.focus();
}

function fecharModalReset() {
    modalReset.classList.add("hidden");
}

btnCancelarReset.addEventListener("click", fecharModalReset);

btnConfirmarReset.addEventListener("click", async () => {
    mensagemReset.textContent = "";

    const id        = selectUsuarioReset.value;
    const novaSenha = txtNovasenhaReset.value;
    const conf      = txtConfsenhaReset.value;

    if (!novaSenha) {
        mensagemReset.textContent = "Digite a nova senha.";
        return;
    }

    if (novaSenha !== conf) {
        mensagemReset.textContent = "As senhas não coincidem.";
        return;
    }

    try {
        const resposta = await window.api.trocarSenhaUsuario({ id, novaSenha });

        if (!resposta.sucesso) {
            mensagemReset.textContent = resposta.mensagem;
            return;
        }

        fecharModalReset();
        if (mensagem) {
            mensagem.style.color = "var(--color-success, #22c55e)";
            mensagem.textContent = "Senha resetada com sucesso!";
            setTimeout(() => {
                mensagem.textContent = "";
                mensagem.style.color = "";
            }, 4000);
        }
    } catch (erro) {
        mensagemReset.textContent = "Erro ao resetar senha.";
    }
});