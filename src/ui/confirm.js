function confirmarAcao({
    titulo = "Confirmar ação",
    mensagem = "Deseja continuar?",
    textoCancelar = "Cancelar",
    textoConfirmar = "Confirmar",
}) {
    return new Promise((resolve) => {
        const overlay = document.createElement("div");
        overlay.className = "confirm-overlay";

        overlay.innerHTML = `
            <div class="confirm-card">
                <div class="confirm-icon">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                </div>

                <h3>${titulo}</h3>

                <p>${mensagem}</p>

                <div class="confirm-actions">
                    <button class="confirm-cancelar">
                        ${textoCancelar}
                    </button>

                    <button class="confirm-confirmar">
                        ${textoConfirmar}
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        overlay.querySelector(".confirm-cancelar").addEventListener("click", () => {
            overlay.remove();
            resolve(false);
        });

        overlay.querySelector(".confirm-confirmar").addEventListener("click", () => {
            overlay.remove();
            resolve(true);
        });
    });
}