function mostrarToast(mensagem, tipo = "success") {
    let container = document.querySelector(".toast-container");

    if (!container) {
        container = document.createElement("div");
        container.className = "toast-container";
        document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast ${tipo}`;

    const icone = tipo === "success"
        ? "fa-circle-check"
        : tipo === "error"
            ? "fa-circle-xmark"
            : "fa-triangle-exclamation";

    toast.innerHTML = `
        <i class="fa-solid ${icone}"></i>
        <span>${mensagem}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}