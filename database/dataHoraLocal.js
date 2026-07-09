function obterDataHoraLocal() {
    const agora = new Date();
    const pad = (n) => String(n).padStart(2, "0");

    return (
        `${agora.getFullYear()}-${pad(agora.getMonth() + 1)}-${pad(agora.getDate())}` +
        ` ${pad(agora.getHours())}:${pad(agora.getMinutes())}:${pad(agora.getSeconds())}`
    );
}

function obterDataLocalISO() {
    const agora = new Date();
    const pad = (n) => String(n).padStart(2, "0");

    return `${agora.getFullYear()}-${pad(agora.getMonth() + 1)}-${pad(agora.getDate())}`;
}

module.exports = {
    obterDataHoraLocal,
    obterDataLocalISO,
};