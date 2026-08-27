export function initAbout() {
    
    const panel = document.querySelector("[data-about-panel]");
    const universe = document.querySelector("[data-about-universe]");
    const words = [...document.querySelectorAll("[data-about-word]")];

    if (!panel || !universe || !words.length) {
        return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const wordState = words.map((el, index) => ({
        el,
        baseAngle: ((Math.PI * 2) / words.length) * index - Math.PI / 2,

        x: 0,
        y: 0,
    }));

    const pointer = {
        active: false,
        x: 0,
        y: 0,
    };

    let rafId = 0;
    let primed = false;

    const startedAt = performance.now();
    const getRadius = () => Math.max(universe.clientWidth * 0.36, 96);

    const render = (time) => {

        const rect = universe.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const radius = getRadius();
        const spin = reduceMotion 
            ? 0 
            : (time - startedAt) * 0.00028;

        wordState.forEach((word) => {

            const angle = word.baseAngle + spin;

            let x = Math.cos(angle) * radius;
            let y = Math.sin(angle) * radius;

            if (pointer.active && !reduceMotion) {

                const wordX = centerX + x;
                const wordY = centerY + y;
                const dx = pointer.x - wordX;
                const dy = pointer.y - wordY;
                const distance = Math.hypot(dx, dy) || 1;
                const influence = Math.max(0, 1 - distance / 420);
                const pull = influence * influence * 56;

                x += (dx / distance) * pull;
                y += (dy / distance) * pull;
            }

            if (!primed) {
                word.x = x;
                word.y = y;

            } else {
                word.x += (x - word.x) * 0.14;
                word.y += (y - word.y) * 0.14;
            }

            word.el.style.transform = `translate(-50%, -50%) translate3d(${word.x.toFixed(2)}px, ${word.y.toFixed(2)}px, 0)`;
                
        });

        primed = true;

        if (!reduceMotion) 
            rafId = window.requestAnimationFrame(render);
        
    };

    const setGlare = (clientX, clientY) => {
        const rect = panel.getBoundingClientRect();

        if (!rect.width || !rect.height) {
            return;
        }

        const x = ((clientX - rect.left) / rect.width) * 100;
        const y = ((clientY - rect.top) / rect.height) * 100;

        panel.style.setProperty("--about-mx", `${Math.min(100, Math.max(0, x)).toFixed(2)}%`);
        panel.style.setProperty("--about-my", `${Math.min(100, Math.max(0, y)).toFixed(2)}%`);
    };

    panel.addEventListener("pointerenter", (event) => {

        pointer.active = true;
        panel.classList.add("is-active");
        pointer.x = event.clientX;
        pointer.y = event.clientY;
        setGlare(event.clientX, event.clientY);
    });

    panel.addEventListener("pointermove", (event) => {

        pointer.active = true;
        pointer.x = event.clientX;
        pointer.y = event.clientY;

        panel.classList.add("is-active");
        setGlare(event.clientX, event.clientY);
    });

    panel.addEventListener("pointerleave", () => {
        pointer.active = false;

        panel.classList.remove("is-active");
        panel.style.setProperty("--about-mx", "70%");
        panel.style.setProperty("--about-my", "40%");
    });

    if (reduceMotion) {
        render(performance.now());
        
    } else {
        rafId = window.requestAnimationFrame(render);
    }
}
