/* ==========================================================
    REFERÊNCIAS DO DOM
========================================================== */

const btnSair = document.getElementById("btnSair");
const btnAbrirPastaBackup = document.getElementById("btnAbrirPastaBackup");
const btnNovoBackupManual = document.getElementById("btnNovoBackupManual");

const statusBackupAutomatico = document.getElementById("statusBackupAutomatico");
const statusUltimoBackup = document.getElementById("statusUltimoBackup");
const statusTotalBackups = document.getElementById("statusTotalBackups");

const txtPesquisarBackup = document.getElementById("txtPesquisarBackup");
const selectFiltroTipoBackup = document.getElementById("selectFiltroTipoBackup");
const tbodyBackups = document.getElementById("tbodyBackups");

const modalBackupManual = document.getElementById("modalBackupManual");
const btnFecharModalBackupManual =
    document.getElementById("btnFecharModalBackupManual") ||
    document.getElementById("btnFecharModalBackup");

const formBackupManual = document.getElementById("formBackupManual");

const mensagemBackupManual =
    document.getElementById("mensagemBackupManual") ||
    document.getElementById("mensagemBackup");

const btnCancelarBackupManual =
    document.getElementById("btnCancelarBackupManual") ||
    document.getElementById("btnCancelarBackup");

const modalRestaurarBackup = document.getElementById("modalRestaurarBackup");

const btnFecharModalRestaurarBackup =
    document.getElementById("btnFecharModalRestaurarBackup") ||
    document.getElementById("btnFecharModalRestaurar");

const nomeArquivoRestaurar =
    document.getElementById("nomeArquivoRestaurar") ||
    document.getElementById("textoRestaurarBackup");

const mensagemRestaurarBackup = document.getElementById("mensagemRestaurarBackup");

const btnCancelarRestaurarBackup =
    document.getElementById("btnCancelarRestaurarBackup") ||
    document.getElementById("btnCancelarRestaurar");

const btnConfirmarRestaurarBackup =
    document.getElementById("btnConfirmarRestaurarBackup") ||
    document.getElementById("btnConfirmarRestaurar");

/* ==========================================================
    ESTADO
========================================================== */

let backups = [];
let idBackupParaRestaurar = null;

const usuarioLogado = JSON.parse(sessionStorage.getItem("usuarioLogado"));

if (!usuarioLogado) {
    window.location.href = "login.html";
}

/* ==========================================================
    CARREGAMENTO / LISTAGEM
========================================================== */

async function carregarBackups() {
    try {
        const resposta = await window.api.listarBackups();

        if (!resposta?.sucesso) {
            mostrarToastSeguro(resposta?.mensagem || "Erro ao listar backups.", "error");
            return;
        }

        backups = resposta.backups || [];

        atualizarCardsStatus();
        aplicarFiltros();
    } catch (erro) {
        console.error("Erro ao carregar backups:", erro);
        mostrarToastSeguro("Erro ao carregar backups.", "error");
    }
}

function atualizarCardsStatus() {
    if (statusBackupAutomatico) {
        statusBackupAutomatico.textContent = "Ativo";
    }

    if (statusTotalBackups) {
        statusTotalBackups.textContent = backups.length;
    }

    if (!statusUltimoBackup) {
        return;
    }

    if (backups.length === 0) {
        statusUltimoBackup.textContent = "Nenhum";
        return;
    }

    statusUltimoBackup.textContent = formatarDataHoraBackup(backups[0].criado_em);
}

function renderizarBackups(lista) {
    if (!tbodyBackups) return;

    tbodyBackups.innerHTML = "";

    if (!lista || lista.length === 0) {
        tbodyBackups.innerHTML = `
            <tr>
                <td colspan="5" class="empty-table">
                    Nenhum backup encontrado.
                </td>
            </tr>
        `;
        return;
    }

    lista.forEach((backup) => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>
                <strong>${backup.nome_arquivo || "-"}</strong>
                <small>${backup.caminho_arquivo || ""}</small>
            </td>

            <td>
                <span class="status-badge ${obterClasseTipoBackup(backup.tipo)}">
                    ${backup.tipo || "-"}
                </span>
            </td>

            <td>${formatarDataHoraBackup(backup.criado_em)}</td>

            <td>${backup.tamanho || "-"}</td>

            <td>
                <div class="action-buttons">
                    <button
                        class="btn-action btn-edit"
                        type="button"
                        title="Restaurar este backup"
                        data-id="${backup.id}"
                        data-nome="${backup.nome_arquivo || ""}"
                    >
                        <i class="fa-solid fa-clock-rotate-left"></i>
                    </button>
                </div>
            </td>
        `;

        tbodyBackups.appendChild(tr);
    });
}

function aplicarFiltros() {
    const termo = (txtPesquisarBackup?.value || "").trim().toLowerCase();
    const tipoFiltro = selectFiltroTipoBackup?.value || "";

    const filtrados = backups.filter((backup) => {
        const nome = String(backup.nome_arquivo || "").toLowerCase();
        const tipo = String(backup.tipo || "");

        const bateTermo = !termo || nome.includes(termo);
        const bateTipo = !tipoFiltro || tipo === tipoFiltro;

        return bateTermo && bateTipo;
    });

    renderizarBackups(filtrados);
}

/* ==========================================================
    ABRIR PASTA / NOVO BACKUP MANUAL
========================================================== */

if (btnAbrirPastaBackup) {
    btnAbrirPastaBackup.addEventListener("click", async () => {
        try {
            await window.api.abrirPastaBackups();
        } catch (erro) {
            console.error("Erro ao abrir pasta de backups:", erro);
            mostrarToastSeguro("Erro ao abrir pasta de backups.", "error");
        }
    });
}

if (btnNovoBackupManual) {
    btnNovoBackupManual.addEventListener("click", () => {
        limparMensagem(mensagemBackupManual);
        abrirModal(modalBackupManual);
    });
}

function fecharModalBackupManual() {
    fecharModal(modalBackupManual);
}

if (btnFecharModalBackupManual) {
    btnFecharModalBackupManual.addEventListener("click", fecharModalBackupManual);
}

if (btnCancelarBackupManual) {
    btnCancelarBackupManual.addEventListener("click", fecharModalBackupManual);
}

if (formBackupManual) {
    formBackupManual.addEventListener("submit", async (event) => {
        event.preventDefault();

        limparMensagem(mensagemBackupManual);

        try {
            const resposta = await window.api.criarBackupManual();

            if (!resposta?.sucesso) {
                definirMensagem(mensagemBackupManual, resposta?.mensagem || "Erro ao criar backup.");
                mostrarToastSeguro(resposta?.mensagem || "Erro ao criar backup.", "error");
                return;
            }

            fecharModalBackupManual();
            mostrarToastSeguro(resposta.mensagem || "Backup manual criado com sucesso.", "success");

            await carregarBackups();
        } catch (erro) {
            console.error("Erro ao criar backup manual:", erro);
            definirMensagem(mensagemBackupManual, "Erro ao criar backup manual.");
            mostrarToastSeguro("Erro ao criar backup manual.", "error");
        }
    });
}

/* ==========================================================
    RESTAURAR BACKUP
========================================================== */

if (tbodyBackups) {
    tbodyBackups.addEventListener("click", (event) => {
        const botao = event.target.closest("button[data-id]");

        if (!botao) return;

        idBackupParaRestaurar = Number(botao.dataset.id);

        if (nomeArquivoRestaurar) {
            nomeArquivoRestaurar.textContent = `Deseja realmente restaurar o backup "${botao.dataset.nome}"?`;
        }

        limparMensagem(mensagemRestaurarBackup);
        abrirModal(modalRestaurarBackup);
    });
}

function fecharModalRestaurarBackup() {
    fecharModal(modalRestaurarBackup);
    idBackupParaRestaurar = null;
}

if (btnFecharModalRestaurarBackup) {
    btnFecharModalRestaurarBackup.addEventListener("click", fecharModalRestaurarBackup);
}

if (btnCancelarRestaurarBackup) {
    btnCancelarRestaurarBackup.addEventListener("click", fecharModalRestaurarBackup);
}

if (btnConfirmarRestaurarBackup) {
    btnConfirmarRestaurarBackup.addEventListener("click", async () => {
        if (!idBackupParaRestaurar) return;

        try {
            const resposta = await window.api.restaurarBackup(idBackupParaRestaurar);

            if (!resposta?.sucesso) {
                definirMensagem(
                    mensagemRestaurarBackup,
                    resposta?.mensagem || "Erro ao restaurar backup."
                );

                mostrarToastSeguro(
                    resposta?.mensagem || "Erro ao restaurar backup.",
                    "error"
                );

                return;
            }

            fecharModalRestaurarBackup();
            mostrarToastSeguro(
                resposta.mensagem || "Backup restaurado com sucesso.",
                "success"
            );

            await carregarBackups();
        } catch (erro) {
            console.error("Erro ao restaurar backup:", erro);
            definirMensagem(mensagemRestaurarBackup, "Erro ao restaurar backup.");
            mostrarToastSeguro("Erro ao restaurar backup.", "error");
        }
    });
}

/* ==========================================================
    EVENTOS GERAIS
========================================================== */

if (txtPesquisarBackup) {
    txtPesquisarBackup.addEventListener("input", aplicarFiltros);
}

if (selectFiltroTipoBackup) {
    selectFiltroTipoBackup.addEventListener("change", aplicarFiltros);
}

if (btnSair) {
    btnSair.addEventListener("click", () => {
        sessionStorage.removeItem("usuarioLogado");
        window.location.href = "login.html";
    });
}

/* ==========================================================
    UTILITÁRIOS
========================================================== */

function abrirModal(modal) {
    if (modal) {
        modal.classList.remove("hidden");
    }
}

function fecharModal(modal) {
    if (modal) {
        modal.classList.add("hidden");
    }
}

function limparMensagem(elemento) {
    if (elemento) {
        elemento.textContent = "";
    }
}

function definirMensagem(elemento, mensagem) {
    if (elemento) {
        elemento.textContent = mensagem;
    }
}

function formatarDataHoraBackup(valor) {
    if (!valor) return "-";

    if (typeof formatarDataHora === "function") {
        return formatarDataHora(valor);
    }

    const data = new Date(valor);

    if (Number.isNaN(data.getTime())) {
        return valor;
    }

    return data.toLocaleString("pt-BR");
}

function obterClasseTipoBackup(tipo) {
    if (tipo === "Manual") {
        return "status-ativo";
    }

    if (tipo === "Automático") {
        return "status-entrega";
    }

    if (tipo === "Restauração") {
        return "status-preparo";
    }

    return "status-ativo";
}

function mostrarToastSeguro(mensagem, tipo = "success") {
    if (typeof mostrarToast === "function") {
        mostrarToast(mensagem, tipo);
        return;
    }

    if (window.toast?.sucesso && tipo === "success") {
        window.toast.sucesso(mensagem);
        return;
    }

    if (window.toast?.erro && tipo === "error") {
        window.toast.erro(mensagem);
        return;
    }

    alert(mensagem);
}

/* ==========================================================
    INICIALIZAÇÃO
========================================================== */

carregarBackups();