const PedidoRepository = require("../repositories/PedidoRepository");
const CaixaRepository = require("../repositories/CaixaRepository");

class RelatorioService {
    async relatorioDiario(data) {
        const pedidos = await PedidoRepository.buscarPorData(data);
        const movimentacoes = await CaixaRepository.listarMovimentacoesPorData(data);

        const pedidosValidos = pedidos.filter((p) => p.status !== "Cancelado");

        const totalVendas = pedidosValidos.reduce((soma, p) => soma + Number(p.total), 0);

        const totalEntradas = movimentacoes
            .filter((m) => m.tipo === "Entrada")
            .reduce((soma, m) => soma + Number(m.valor), 0);

        const totalSaidas = movimentacoes
            .filter((m) => m.tipo === "Saída")
            .reduce((soma, m) => soma + Number(m.valor), 0);

        return {
            pedidos,
            totalVendas: Number(totalVendas.toFixed(2)),
            totalPedidos: pedidosValidos.length,
            totalEntradas: Number(totalEntradas.toFixed(2)),
            totalSaidas: Number(totalSaidas.toFixed(2)),
            saldoDia: Number((totalEntradas - totalSaidas).toFixed(2)),
        };
    }

    async relatorioMensal(mes) {
        const [ano, mesNumero] = mes.split("-").map(Number);
        const dataInicio = `${mes}-01`;
        const ultimoDia = new Date(ano, mesNumero, 0).getDate();
        const dataFim = `${mes}-${String(ultimoDia).padStart(2, "0")}`;

        const porDia = await PedidoRepository.buscarRelatorioPorPeriodo(dataInicio, dataFim);
        const movimentacoes = await CaixaRepository.listarMovimentacoesPorPeriodo(dataInicio, dataFim);

        const totalVendas = porDia.reduce((soma, d) => soma + Number(d.faturamento || 0), 0);
        const totalPedidos = porDia.reduce((soma, d) => soma + Number(d.total_pedidos || 0), 0);
        const ticketMedio = totalPedidos > 0 ? totalVendas / totalPedidos : 0;

        const totalEntradas = movimentacoes
            .filter((m) => m.tipo === "Entrada")
            .reduce((soma, m) => soma + Number(m.valor), 0);

        const totalSaidas = movimentacoes
            .filter((m) => m.tipo === "Saída")
            .reduce((soma, m) => soma + Number(m.valor), 0);

        const mapaDias = {};

        porDia.forEach((d) => {
            const dia = d.dia || d.data;
            mapaDias[dia] = {
                data: dia,
                total_pedidos: Number(d.total_pedidos || 0),
                entradas: 0,
                saidas: 0,
            };
        });

        movimentacoes.forEach((m) => {
            const dia = String(m.criado_em || "").slice(0, 10);

            if (!mapaDias[dia]) {
                mapaDias[dia] = { data: dia, total_pedidos: 0, entradas: 0, saidas: 0 };
            }

            if (m.tipo === "Entrada") {
                mapaDias[dia].entradas += Number(m.valor);
            } else {
                mapaDias[dia].saidas += Number(m.valor);
            }
        });

        const dias = Object.values(mapaDias)
            .map((d) => ({ ...d, saldo: Number((d.entradas - d.saidas).toFixed(2)) }))
            .sort((a, b) => a.data.localeCompare(b.data));

        return {
            dias,
            totalVendas: Number(totalVendas.toFixed(2)),
            totalPedidos,
            totalEntradas: Number(totalEntradas.toFixed(2)),
            totalSaidas: Number(totalSaidas.toFixed(2)),
            saldo: Number((totalEntradas - totalSaidas).toFixed(2)),
            ticketMedio: Number(ticketMedio.toFixed(2)),
        };
    }
}

module.exports = new RelatorioService();