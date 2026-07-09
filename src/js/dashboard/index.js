const boasVindas = document.getElementById("boasVindas");
const tipoUsuario = document.getElementById("tipoUsuario");
const btnSair = document.getElementById("btnSair");

const cardPedidosHoje = document.getElementById("cardPedidosHoje");
const cardCaixaDia = document.getElementById("cardCaixaDia");
const cardClientes = document.getElementById("cardClientes");
const cardEntregas = document.getElementById("cardEntregas");

const usuarioLogado = JSON.parse(sessionStorage.getItem("usuarioLogado"));

if (!usuarioLogado) {
    window.location.href = "login.html";
} else {
    if (boasVindas) {
        boasVindas.textContent = `Bem-vinda(o), ${usuarioLogado.nome}!`;
    }

    if (tipoUsuario) {
        tipoUsuario.textContent = usuarioLogado.tipo === "admin"
            ? "Administrador"
            : "Atendente";
    }

    const sidebarNome = document.getElementById("sidebarNome");
    const sidebarTipo = document.getElementById("sidebarTipo");
    const sidebarAvatar = document.getElementById("sidebarAvatar");
    const menuUsuarios = document.getElementById("menuUsuarios");

    if (sidebarNome) sidebarNome.textContent = usuarioLogado.nome;
    if (sidebarAvatar) sidebarAvatar.textContent = usuarioLogado.nome.substring(0, 2).toUpperCase();
    if (sidebarTipo) sidebarTipo.textContent = usuarioLogado.tipo === "admin" ? "Administrador" : "Atendente";
    if (menuUsuarios && usuarioLogado.tipo !== "admin") menuUsuarios.style.display = "none";
}

if (btnSair) {
    btnSair.addEventListener("click", () => {
        sessionStorage.removeItem("usuarioLogado");
        window.location.href = "login.html";
    });
}

/* ==========================================================
    CARDS DE RESUMO
========================================================== */

async function carregarResumoDashboard() {
    try {
        const hoje = obterDataLocalISO();

        const [respRelatorio, respCaixa, respClientes] = await Promise.all([
            window.api.relatorioDiario(hoje),
            window.api.obterStatusCaixa(),
            window.api.listarClientes(),
        ]);

        if (respRelatorio?.sucesso) {
            if (cardPedidosHoje) {
                cardPedidosHoje.textContent = respRelatorio.totalPedidos || 0;
            }

            const totalEntregas = (respRelatorio.pedidos || []).filter((pedido) => {
                return Number(pedido.taxa_entrega) > 0;
            }).length;

            if (cardEntregas) {
                cardEntregas.textContent = totalEntregas;
            }
        }

        if (respCaixa?.sucesso && cardCaixaDia) {
            const aberto = respCaixa.aberto;
            const cardContainer = document.getElementById("cardCaixaContainer");
            const cardStatus = document.getElementById("cardCaixaStatus");

            cardCaixaDia.textContent = aberto
            ? formatarMoeda(respCaixa.saldoAtual || 0)
            : formatarMoeda(0);

            if (cardStatus) {
                cardStatus.textContent = aberto ? "● Caixa aberto" : "● Caixa fechado";
                cardStatus.style.color = aberto ? "#22c55e" : "#ef4444";
                cardStatus.style.fontWeight = "800";
            }

            if (cardContainer) {
                cardContainer.style.borderColor = aberto
                ? "rgba(34, 197, 94, 0.35)"
                : "rgba(239, 68, 68, 0.35)";
        }
    }

        if (respClientes?.sucesso && cardClientes) {
            const clientesAtivos = (respClientes.clientes || []).filter((cliente) => {
                return Number(cliente.ativo) === 1;
            });

            cardClientes.textContent = clientesAtivos.length;
        }
    } catch (erro) {
        console.error("Erro ao carregar resumo do dashboard:", erro.message);
    }
}

carregarResumoDashboard();

/* ==========================================================
    ATALHOS DO DASHBOARD
========================================================== */

document.querySelectorAll("[data-link]").forEach((botao) => {
    botao.addEventListener("click", () => {
        const destino = botao.dataset.link;

        if (destino) {
            window.location.href = destino;
        }
    });
});