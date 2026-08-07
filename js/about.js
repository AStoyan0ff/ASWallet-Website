export function initAbout() {
    const panel = document.querySelector("[data-about-panel]");
    const universe = document.querySelector("[data-about-universe]");
    const words = [...document.querySelectorAll("[data-about-word]")];

    if (!panel || !universe || words.length !== 4) {
        return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const wordState = words.map((el, index) => ({
        el,
        baseAngle: (Math.PI * 2 * index) / words.length - Math.PI / 2,
    }));

    let mouseX = 0;
    let mouseY = 0;
    let hasPointer = false;
    let rafId = 0;
    let startTime = performance.now();

    const getRadius = () => {
        const size = universe.clientWidth || 300;
        return size * 0.38;
    };

    const placeWords = (time) => {
        const rect = universe.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const radius = getRadius();
        const rotation = reduceMotion ? 0 : (time - startTime) * 0.00018;
        const magnetRadius = Math.max(rect.width * 0.85, 180);
        const magnetStrength = reduceMotion ? 0 : 18;

        wordState.forEach((word) => {
            const angle = word.baseAngle + rotation;
            let x = Math.cos(angle) * radius;
            let y = Math.sin(angle) * radius;

            if (hasPointer) {
                const wordX = centerX + x;
                const wordY = centerY + y;
                const dx = mouseX - wordX;
                const dy = mouseY - wordY;
                const distance = Math.hypot(dx, dy) || 1;
                const pull = Math.max(0, 1 - distance / magnetRadius) * magnetStrength;

                x += (dx / distance) * pull;
                y += (dy / distance) * pull;
            }

            word.el.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
        });
    };

    const tick = (time) => {
        placeWords(time);
        rafId = window.requestAnimationFrame(tick);
    };

    const updateGlare = (clientX, clientY) => {
        const rect = panel.getBoundingClientRect();
        const x = ((clientX - rect.left) / rect.width) * 100;
        const y = ((clientY - rect.top) / rect.height) * 100;

        panel.style.setProperty("--about-mx", `${x}%`);
        panel.style.setProperty("--about-my", `${y}%`);
    };

    panel.addEventListener("pointerenter", () => {
        panel.classList.add("is-active");
    });

    panel.addEventListener("pointerleave", () => {
        panel.classList.remove("is-active");
        hasPointer = false;
        panel.style.setProperty("--about-mx", "72%");
        panel.style.setProperty("--about-my", "38%");
    });

    panel.addEventListener("pointermove", (event) => {
        hasPointer = true;
        mouseX = event.clientX;
        mouseY = event.clientY;
        updateGlare(event.clientX, event.clientY);
    });

    window.addEventListener(
        "resize",
        () => {
            placeWords(performance.now());
        },
        { passive: true }
    );

    placeWords(performance.now());
    rafId = window.requestAnimationFrame(tick);

    return () => {
        window.cancelAnimationFrame(rafId);
    };
}
