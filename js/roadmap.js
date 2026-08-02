export function initRoadmap() {
    const track = document.querySelector("[data-roadmap-track]");
    const scroller = document.querySelector("[data-roadmap-scroller]");
    const progress = document.querySelector("[data-roadmap-progress]");
    const dots = [...document.querySelectorAll("[data-roadmap-dot]")];
    const cards = [...document.querySelectorAll("[data-roadmap-card]")];

    if (!track || !scroller || !cards.length) {
        return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let hasAnimatedCards = false;
    let ticking = false;

    const setRailProgress = (ratio) => {
        const clamped = Math.min(1, Math.max(0, ratio));

        if (progress) {
            progress.style.width = `${clamped * 100}%`;
        }

        const lastIndex = Math.max(dots.length - 1, 1);

        dots.forEach((dot, index) => {
            const threshold = index / lastIndex;
            dot.classList.toggle("is-lit", clamped >= threshold - 0.02);
        });
    };

    const getScrollRatio = () => {
        const rect = track.getBoundingClientRect();
        const viewHeight = window.innerHeight || 1;
        const start = viewHeight * 0.82;
        const end = viewHeight * 0.28;

        return (start - rect.top) / (start - end);
    };

    const playCardEntrance = () => {
        if (hasAnimatedCards) {
            return;
        }

        hasAnimatedCards = true;

        cards.forEach((card, index) => {
            window.setTimeout(() => {
                card.classList.add("is-visible");
            }, index * 160);
        });
    };

    const showAll = () => {
        hasAnimatedCards = true;
        setRailProgress(1);
        cards.forEach((card) => card.classList.add("is-visible"));
    };

    const updateOnScroll = () => {
        setRailProgress(getScrollRatio());

        if (getScrollRatio() > 0.08) {
            playCardEntrance();
        }
    };

    const requestUpdate = () => {
        if (ticking) {
            return;
        }

        ticking = true;
        requestAnimationFrame(() => {
            ticking = false;
            updateOnScroll();
        });
    };

    // Wheel scroll while hovering the track
    track.addEventListener(
        "wheel",
        (event) => {
            if (Math.abs(event.deltaY) < Math.abs(event.deltaX)) {
                return;
            }

            if (scroller.scrollWidth <= scroller.clientWidth + 2) {
                return;
            }

            event.preventDefault();
            scroller.scrollBy({ left: event.deltaY });
        },
        { passive: false }
    );

    // Drag to scroll
    let isDragging = false;
    let startX = 0;
    let scrollStart = 0;

    scroller.addEventListener("pointerdown", (event) => {
        isDragging = true;
        startX = event.clientX;
        scrollStart = scroller.scrollLeft;
        scroller.classList.add("is-dragging");
        scroller.setPointerCapture(event.pointerId);
    });

    scroller.addEventListener("pointermove", (event) => {
        if (!isDragging) {
            return;
        }

        const distance = event.clientX - startX;
        scroller.scrollLeft = scrollStart - distance;
    });

    const endDrag = (event) => {
        if (!isDragging) {
            return;
        }

        isDragging = false;
        scroller.classList.remove("is-dragging");

        if (scroller.hasPointerCapture?.(event.pointerId)) {
            scroller.releasePointerCapture(event.pointerId);
        }
    };

    scroller.addEventListener("pointerup", endDrag);
    scroller.addEventListener("pointercancel", endDrag);

    if (reduceMotion) {
        showAll();
        return;
    }

    setRailProgress(0);
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    updateOnScroll();
}
