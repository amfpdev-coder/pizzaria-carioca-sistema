/**
 * Funções de formatação reutilizáveis entre páginas.
 * Carregar via <script> antes do script da página que for usá-las.
 */

function formatarMoeda(valor) {
    return Number(valor || 0).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
}

function aplicarMascaraTelefone(valor) {
    const numeros = valor.replace(/\D/g, "").slice(0, 11);

    if (numeros.length <= 2) {
        return numeros;
    }

    if (numeros.length <= 6) {
        return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
    }

    if (numeros.length <= 10) {
        return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 6)}-${numeros.slice(6)}`;
    }

    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
}

function formatarDataHora(valor) {
    if (!valor) {
        return "-";
    }

    const data = new Date(valor.replace(" ", "T"));

    if (isNaN(data.getTime())) {
        return "-";
    }

    return data.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function obterDataLocalISO() {
    const agora = new Date();
    const pad = (n) => String(n).padStart(2, "0");

    return `${agora.getFullYear()}-${pad(agora.getMonth() + 1)}-${pad(agora.getDate())}`;
}