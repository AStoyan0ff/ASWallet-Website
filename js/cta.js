export function initCta() {
    const section = document.querySelector("[data-cta]");
    const glow = document.querySelector("[data-cta-glow]");

    if (!section || !glow) {
        return;
    }

    const setGlow = (clientX, clientY) => {
        const rect = section.getBoundingClientRect();

        if (!rect.width || !rect.height) {
            return;
        }

        const x = ((clientX - rect.left) / rect.width) * 100;
        const y = ((clientY - rect.top) / rect.height) * 100;

        section.style.setProperty("--cta-mx", `${Math.min(100, Math.max(0, x)).toFixed(2)}%`);
        section.style.setProperty("--cta-my", `${Math.min(100, Math.max(0, y)).toFixed(2)}%`);
    };

    section.addEventListener("pointerenter", (event) => {
        section.classList.add("is-active");
        setGlow(event.clientX, event.clientY);
    });

    section.addEventListener("pointermove", (event) => {
        section.classList.add("is-active");
        setGlow(event.clientX, event.clientY);
    });

    section.addEventListener("pointerleave", () => {
        section.classList.remove("is-active");
        section.style.setProperty("--cta-mx", "50%");
        section.style.setProperty("--cta-my", "52%");
    });
}
