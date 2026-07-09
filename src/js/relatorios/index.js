const btnSair = document.getElementById("btnSair");

const filtroDataDiario = document.getElementById("filtroDataDiario");
const btnImprimirRelatorioDiario = document.getElementById("btnImprimirRelatorioDiario");
const totalVendasDia = document.getElementById("totalVendasDia");
const totalEntradasDia = document.getElementById("totalEntradasDia");
const totalSaidasDia = document.getElementById("totalSaidasDia");
const saldoDia = document.getElementById("saldoDia");
const totalPixDia = document.getElementById("totalPixDia");
const totalDinheiroDia = document.getElementById("totalDinheiroDia");
const totalCartaoDia = document.getElementById("totalCartaoDia");
const totalEntregasDia = document.getElementById("totalEntregasDia");
const tbodyPedidosDia = document.getElementById("tbodyPedidosDia");

const formSenhaMensal = document.getElementById("formSenhaMensal");
const txtSenhaMensal = document.getElementById("txtSenhaMensal");
const blocoSenhaMensal = document.getElementById("blocoSenhaMensal");
const blocoConteudoMensal = document.getElementById("blocoConteudoMensal");

const filtroMesMensal = document.getElementById("filtroMesMensal");
const btnGerarRelatorioMensal = document.getElementById("btnGerarRelatorioMensal");
const totalVendasMes = document.getElementById("totalVendasMes");
const totalEntradasMes = document.getElementById("totalEntradasMes");
const totalSaidasMes = document.getElementById("totalSaidasMes");
const saldoMes = document.getElementById("saldoMes");
const ticketMedioMes = document.getElementById("ticketMedioMes");
const tbodyRelatorioMensal = document.getElementById("tbodyRelatorioMensal");
const areaImpressaoRelatorio = document.getElementById("areaImpressaoRelatorio");

let ultimoRelatorioDiario = null;
let ultimoRelatorioMensal = null;

const usuarioLogado = JSON.parse(sessionStorage.getItem("usuarioLogado"));

if (!usuarioLogado) {
    window.location.href = "login.html";
}

if (btnSair) {
    btnSair.addEventListener("click", () => {
        sessionStorage.removeItem("usuarioLogado");
        window.location.href = "login.html";
    });
}

/* ==========================================================
    ABAS
========================================================== */

document.querySelectorAll(".nav-card").forEach((botao) => {
    botao.addEventListener("click", () => {
        const tab = botao.dataset.tab;

        document.querySelectorAll(".nav-card").forEach((item) => {
            item.classList.remove("active");
        });

        document.querySelectorAll(".tab-content").forEach((conteudo) => {
            conteudo.classList.remove("active");
        });

        botao.classList.add("active");

        if (tab === "diario") {
            document.getElementById("tabDiario")?.classList.add("active");
        }

        if (tab === "mensal") {
            document.getElementById("tabMensal")?.classList.add("active");
        }
    });
});

/* ==========================================================
    UTILITÁRIOS
========================================================== */

function obterDataLocalISO() {
    const data = new Date();
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");
    return `${ano}-${mes}-${dia}`;
}

function obterMesAtual() {
    const data = new Date();
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    return `${ano}-${mes}`;
}

function formatarValor(valor) {
    if (typeof formatarMoeda === "function") {
        return formatarMoeda(valor || 0);
    }
    return Number(valor || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatarDataExibicao(data) {
    if (!data) return "-";
    const dataObj = new Date(data);
    if (Number.isNaN(dataObj.getTime())) return data;
    return dataObj.toLocaleString("pt-BR");
}

function formatarDataPdf(data) {
    if (!data) return "-";
    const partes = String(data).slice(0, 10).split("-");
    if (partes.length === 3) return `${partes[2]}/${partes[1]}/${partes[0]}`;
    return data;
}

function nomeMesPorExtenso(mesString) {
    const [ano, mes] = mesString.split("-").map(Number);
    const data = new Date(ano, mes - 1, 1);
    const nome = data.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
    return nome.charAt(0).toUpperCase() + nome.slice(1);
}

function mostrarTabelaVazia(tbody, colspan, mensagem) {
    if (!tbody) return;
    tbody.innerHTML = `
        <tr>
            <td colspan="${colspan}" class="empty-table">${mensagem}</td>
        </tr>
    `;
}

function toastErro(mensagem) {
    if (typeof mostrarToast === "function") {
        mostrarToast(mensagem, "error");
        return;
    }
    alert(mensagem);
}

/* ==========================================================
    RELATÓRIO DIÁRIO
========================================================== */

async function carregarRelatorioDiario() {
    try {
        const data = filtroDataDiario?.value || obterDataLocalISO();

        if (!filtroDataDiario.value) {
            filtroDataDiario.value = data;
        }

        const resposta = await window.api.relatorioDiario(data);

        if (!resposta?.sucesso) {
            mostrarTabelaVazia(tbodyPedidosDia, 6, "Nenhum pedido encontrado para este dia.");
            return;
        }

        totalVendasDia.textContent = formatarValor(resposta.totalVendas || 0);
        totalEntradasDia.textContent = formatarValor(resposta.totalEntradas || 0);
        totalSaidasDia.textContent = formatarValor(resposta.totalSaidas || 0);
        saldoDia.textContent = formatarValor(resposta.saldoDia || 0);

        // Calcula totais por forma de pagamento a partir dos pedidos válidos
        const pedidosValidos = (resposta.pedidos || []).filter(
            (p) => p.status !== "Cancelado"
        );

        const tPix = pedidosValidos.reduce((s, p) => s + Number(p.valor_pix || 0), 0);
        const tDinheiro = pedidosValidos.reduce((s, p) => s + Number(p.valor_dinheiro || 0), 0);
        const tCartao = pedidosValidos.reduce((s, p) => s + Number(p.valor_cartao || 0), 0);
        const tEntregas = pedidosValidos.reduce((s, p) => s + Number(p.taxa_entrega || 0), 0);

        if (totalPixDia) totalPixDia.textContent = formatarValor(tPix);
        if (totalDinheiroDia) totalDinheiroDia.textContent = formatarValor(tDinheiro);
        if (totalCartaoDia) totalCartaoDia.textContent = formatarValor(tCartao);
        if (totalEntregasDia) totalEntregasDia.textContent = formatarValor(tEntregas);

        ultimoRelatorioDiario = {
            data,
            totalVendas: resposta.totalVendas || 0,
            totalEntradas: resposta.totalEntradas || 0,
            totalSaidas: resposta.totalSaidas || 0,
            saldoDia: resposta.saldoDia || 0,
            totalPix: tPix,
            totalDinheiro: tDinheiro,
            totalCartao: tCartao,
            totalEntregas: tEntregas,
            pedidos: resposta.pedidos || [],
        };

        renderizarPedidosDia(resposta.pedidos || []);
    } catch (erro) {
        console.error("Erro ao carregar relatório diário:", erro);
        mostrarTabelaVazia(tbodyPedidosDia, 6, "Erro ao carregar relatório diário.");
    }
}

function renderizarPedidosDia(pedidos) {
    tbodyPedidosDia.innerHTML = "";

    if (!pedidos.length) {
        mostrarTabelaVazia(tbodyPedidosDia, 6, "Nenhum pedido encontrado para este dia.");
        return;
    }

    pedidos.forEach((pedido) => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>#${pedido.id || "-"}</td>
            <td>${pedido.cliente_nome || "-"}</td>
            <td>${pedido.forma_pagamento || "-"}</td>
            <td><strong>${formatarValor(pedido.total || 0)}</strong></td>
            <td>${pedido.status || "-"}</td>
            <td>${formatarDataExibicao(pedido.criado_em)}</td>
        `;

        tbodyPedidosDia.appendChild(tr);
    });
}

function montarHtmlRelatorioDiarioImpressao(dados) {
    const linhas = (dados.pedidos || [])
        .filter((p) => p.status !== "Cancelado")
        .map((p) => `
            <tr>
                <td>#${p.id}</td>
                <td>${p.cliente_nome || "-"}</td>
                <td>${p.forma_pagamento || "-"}</td>
                <td>${formatarValor(p.taxa_entrega || 0)}</td>
                <td>${formatarValor(p.total || 0)}</td>
                <td>${p.status}</td>
            </tr>
        `)
        .join("");

    const dataFormatada = formatarDataPdf(dados.data);

    return `
        <div class="relatorio-pdf-pagina">
            <div class="relatorio-pdf-cabecalho">
                <strong>Pizzaria Carioca</strong>
                <span>Relatório Diário — ${dataFormatada}</span>
            </div>

            <div class="relatorio-pdf-estatisticas">
                <div class="relatorio-pdf-card">
                    <span>Total de vendas</span>
                    <strong>${formatarValor(dados.totalVendas)}</strong>
                </div>
                <div class="relatorio-pdf-card">
                    <span>Total em Pix</span>
                    <strong>${formatarValor(dados.totalPix)}</strong>
                </div>
                <div class="relatorio-pdf-card">
                    <span>Total em Dinheiro</span>
                    <strong>${formatarValor(dados.totalDinheiro)}</strong>
                </div>
                <div class="relatorio-pdf-card">
                    <span>Total em Cartão</span>
                    <strong>${formatarValor(dados.totalCartao)}</strong>
                </div>
                <div class="relatorio-pdf-card">
                    <span>Total de entregas</span>
                    <strong>${formatarValor(dados.totalEntregas)}</strong>
                </div>
                <div class="relatorio-pdf-card">
                    <span>Saldo do dia</span>
                    <strong>${formatarValor(dados.saldoDia)}</strong>
                </div>
            </div>

            <table class="relatorio-pdf-tabela">
                <thead>
                    <tr>
                        <th>Pedido</th>
                        <th>Cliente</th>
                        <th>Pagamento</th>
                        <th>Entrega</th>
                        <th>Total</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${linhas || `<tr><td colspan="6">Nenhum pedido encontrado neste dia.</td></tr>`}
                </tbody>
            </table>
        </div>
    `;
}

async function gerarRelatorioDiarioPdf() {
    if (!btnImprimirRelatorioDiario) return;

    const textoOriginal = btnImprimirRelatorioDiario.innerHTML;
    btnImprimirRelatorioDiario.disabled = true;
    btnImprimirRelatorioDiario.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Gerando...`;

    try {
        await carregarRelatorioDiario();

        if (!ultimoRelatorioDiario) {
            toastErro("Não foi possível carregar os dados do dia.");
            return;
        }

        areaImpressaoRelatorio.innerHTML = montarHtmlRelatorioDiarioImpressao(ultimoRelatorioDiario);

        const dataFormatadaNome = (filtroDataDiario?.value || obterDataLocalISO()).replace(/-/g, "");
        const nomeArquivo = `relatorio-diario-${dataFormatadaNome}.pdf`;
        const resposta = await window.api.exportarRelatorioDiarioPdf(nomeArquivo);

        if (resposta.cancelado) return;

        if (!resposta.sucesso) {
            toastErro(resposta.mensagem || "Erro ao gerar o PDF.");
            return;
        }

        if (typeof mostrarToast === "function") {
            mostrarToast("Relatório em PDF gerado com sucesso.", "success");
        }
    } catch (erro) {
        console.error("Erro ao gerar PDF do relatório diário:", erro);
        toastErro("Erro ao gerar o PDF do relatório diário.");
    } finally {
        areaImpressaoRelatorio.innerHTML = "";
        btnImprimirRelatorioDiario.disabled = false;
        btnImprimirRelatorioDiario.innerHTML = textoOriginal;
    }
}

/* ==========================================================
    RELATÓRIO MENSAL
========================================================== */

if (formSenhaMensal) {
    formSenhaMensal.addEventListener("submit", async (event) => {
        event.preventDefault();

        const senha = txtSenhaMensal.value.trim();

        if (!senha) {
            toastErro("Informe a senha administrativa.");
            return;
        }

        const resposta = await window.api.validarSenhaAdmin(senha);

        if (!resposta.sucesso) {
            toastErro("Senha incorreta.");
            return;
        }

        blocoSenhaMensal.classList.add("hidden");
        blocoConteudoMensal.classList.remove("hidden");

        carregarRelatorioMensal();
    });
}

async function carregarRelatorioMensal() {
    try {
        const mesAtual = obterMesAtual();

        if (!filtroMesMensal.value) {
            filtroMesMensal.value = mesAtual;
        }

        const resposta = await window.api.relatorioMensal(filtroMesMensal.value);

        if (!resposta?.sucesso) {
            mostrarTabelaVazia(tbodyRelatorioMensal, 5, "Nenhum dado mensal encontrado.");
            return;
        }

        totalVendasMes.textContent = formatarValor(resposta.totalVendas || 0);
        totalEntradasMes.textContent = formatarValor(resposta.totalEntradas || 0);
        totalSaidasMes.textContent = formatarValor(resposta.totalSaidas || 0);
        saldoMes.textContent = formatarValor(resposta.saldo || 0);
        ticketMedioMes.textContent = formatarValor(resposta.ticketMedio || 0);

        ultimoRelatorioMensal = { ...resposta, mes: filtroMesMensal.value };

        renderizarRelatorioMensal(resposta.dias || []);
    } catch (erro) {
        console.error("Erro ao carregar relatório mensal:", erro);
        mostrarTabelaVazia(tbodyRelatorioMensal, 5, "Erro ao carregar relatório mensal.");
    }
}

function montarHtmlRelatorioMensalImpressao(dados) {
    const linhas = (dados.dias || [])
        .map((linha) => `
            <tr>
                <td>${formatarDataPdf(linha.data)}</td>
                <td>${linha.total_pedidos || 0}</td>
                <td>${formatarValor(linha.entradas || 0)}</td>
                <td>${formatarValor(linha.saidas || 0)}</td>
                <td>${formatarValor(linha.saldo || 0)}</td>
            </tr>
        `)
        .join("");

    return `
        <div class="relatorio-pdf-pagina">
            <div class="relatorio-pdf-cabecalho">
                <strong>Pizzaria Carioca</strong>
                <span>Relatório de Fechamento Mensal — ${nomeMesPorExtenso(dados.mes)}</span>
            </div>

            <div class="relatorio-pdf-estatisticas">
                <div class="relatorio-pdf-card">
                    <span>Faturamento</span>
                    <strong>${formatarValor(dados.totalVendas || 0)}</strong>
                </div>
                <div class="relatorio-pdf-card">
                    <span>Total de pedidos</span>
                    <strong>${dados.totalPedidos || 0}</strong>
                </div>
                <div class="relatorio-pdf-card">
                    <span>Ticket médio</span>
                    <strong>${formatarValor(dados.ticketMedio || 0)}</strong>
                </div>
                <div class="relatorio-pdf-card">
                    <span>Entradas</span>
                    <strong>${formatarValor(dados.totalEntradas || 0)}</strong>
                </div>
                <div class="relatorio-pdf-card">
                    <span>Saídas</span>
                    <strong>${formatarValor(dados.totalSaidas || 0)}</strong>
                </div>
                <div class="relatorio-pdf-card">
                    <span>Saldo mensal</span>
                    <strong>${formatarValor(dados.saldo || 0)}</strong>
                </div>
            </div>

            <table class="relatorio-pdf-tabela">
                <thead>
                    <tr>
                        <th>Data</th>
                        <th>Pedidos</th>
                        <th>Entradas</th>
                        <th>Saídas</th>
                        <th>Saldo</th>
                    </tr>
                </thead>
                <tbody>
                    ${linhas || `<tr><td colspan="5">Nenhum dado encontrado neste mês.</td></tr>`}
                </tbody>
            </table>
        </div>
    `;
}

async function gerarRelatorioMensalPdf() {
    if (!btnGerarRelatorioMensal) return;

    const textoOriginal = btnGerarRelatorioMensal.innerHTML;
    btnGerarRelatorioMensal.disabled = true;
    btnGerarRelatorioMensal.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Gerando...`;

    try {
        await carregarRelatorioMensal();

        if (!ultimoRelatorioMensal) {
            toastErro("Não foi possível carregar os dados do mês selecionado.");
            return;
        }

        areaImpressaoRelatorio.innerHTML = montarHtmlRelatorioMensalImpressao(ultimoRelatorioMensal);

        const nomeArquivo = `relatorio-mensal-${ultimoRelatorioMensal.mes}.pdf`;
        const resposta = await window.api.exportarRelatorioMensalPdf(nomeArquivo);

        if (resposta.cancelado) return;

        if (!resposta.sucesso) {
            toastErro(resposta.mensagem || "Erro ao gerar o PDF.");
            return;
        }

        if (typeof mostrarToast === "function") {
            mostrarToast("Relatório em PDF gerado com sucesso.", "success");
        }
    } catch (erro) {
        console.error("Erro ao gerar PDF do relatório mensal:", erro);
        toastErro("Erro ao gerar o PDF do relatório mensal.");
    } finally {
        areaImpressaoRelatorio.innerHTML = "";
        btnGerarRelatorioMensal.disabled = false;
        btnGerarRelatorioMensal.innerHTML = textoOriginal;
    }
}

function renderizarRelatorioMensal(linhas) {
    tbodyRelatorioMensal.innerHTML = "";

    if (!linhas.length) {
        mostrarTabelaVazia(tbodyRelatorioMensal, 5, "Nenhum dado mensal encontrado.");
        return;
    }

    linhas.forEach((linha) => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${linha.data || "-"}</td>
            <td>${linha.total_pedidos || 0}</td>
            <td>${formatarValor(linha.entradas || 0)}</td>
            <td>${formatarValor(linha.saidas || 0)}</td>
            <td><strong>${formatarValor(linha.saldo || 0)}</strong></td>
        `;

        tbodyRelatorioMensal.appendChild(tr);
    });
}

/* ==========================================================
    EVENTOS
========================================================== */

if (filtroDataDiario) {
    filtroDataDiario.addEventListener("change", carregarRelatorioDiario);
}

if (btnImprimirRelatorioDiario) {
    btnImprimirRelatorioDiario.addEventListener("click", gerarRelatorioDiarioPdf);
}

if (filtroMesMensal) {
    filtroMesMensal.addEventListener("change", carregarRelatorioMensal);
}

if (btnGerarRelatorioMensal) {
    btnGerarRelatorioMensal.addEventListener("click", gerarRelatorioMensalPdf);
}

carregarRelatorioDiario();