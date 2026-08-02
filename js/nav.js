export function initNavigation() {
    initMobileMenu();
    initActiveLinks();
}

function initMobileMenu() {
    const menuButton = document.querySelector(".mobile-menu-button");
    const mobileNavigation = document.getElementById("mobile-navigation");

    if (!menuButton || !mobileNavigation) {
        return;
    }

    const mobileLinks = mobileNavigation.querySelectorAll("a");

    const setMenuState = (isOpen) => {
        menuButton.setAttribute("aria-expanded", String(isOpen));
        menuButton.setAttribute(
            "aria-label",
            isOpen ? "Close navigation menu" : "Open navigation menu"
        );

        mobileNavigation.classList.toggle("is-open", isOpen);
        mobileNavigation.hidden = !isOpen;
        document.body.classList.toggle("nav-open", isOpen);
    };

    const closeMenu = () => setMenuState(false);

    const toggleMenu = () => {
        const isOpen = menuButton.getAttribute("aria-expanded") === "true";
        setMenuState(!isOpen);
    };

    menuButton.addEventListener("click", toggleMenu);

    mobileLinks.forEach((link) => {
        link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeMenu();
        }
    });

    window.addEventListener("resize", () => {
        if (window.matchMedia("(min-width: 981px)").matches) {
            closeMenu();
        }
    });

    closeMenu();
}

function initActiveLinks() {
    const links = document.querySelectorAll(
        ".navigation-link, .mobile-navigation-link"
    );

    if (!links.length) {
        return;
    }

    const setActive = (hash) => {
        const targetHash = hash && hash !== "#" ? hash : "#home";

        links.forEach((link) => {
            const href = link.getAttribute("href");
            link.classList.toggle("active", href === targetHash);
        });
    };

    links.forEach((link) => {
        link.addEventListener("click", () => {
            const href = link.getAttribute("href");

            if (href && href.startsWith("#")) {
                setActive(href);
            }
        });
    });

    setActive(window.location.hash);
    window.addEventListener("hashchange", () => {
        setActive(window.location.hash);
    });

    initScrollSpy(setActive);
}

function initScrollSpy(setActive) {
    const sectionIds = ["home", "features", "security", "roadmap", "about"];
    const sections = sectionIds
        .map((id) => document.getElementById(id))
        .filter(Boolean);

    if (sections.length < 2 || !("IntersectionObserver" in window)) {
        return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const observer = new IntersectionObserver(
        (entries) => {
            const visible = entries
                .filter((entry) => entry.isIntersecting)
                .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

            if (!visible.length) {
                return;
            }

            setActive(`#${visible[0].target.id}`);
        },
        {
            rootMargin: reduceMotion.matches
                ? "-20% 0px -55% 0px"
                : "-25% 0px -50% 0px",
            threshold: [0.15, 0.35, 0.6],
        }
    );

    sections.forEach((section) => observer.observe(section));
}
