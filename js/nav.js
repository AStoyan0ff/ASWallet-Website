export function initNavigation() {
    initMobileMenu();
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
        menuButton.setAttribute("aria-label", isOpen
            ? "Close navigation menu"
            : "Open navigation menu"
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

export function initActiveNavigation() {

    const navigationLinks = Array.from(document.querySelectorAll('nav a[href^="#"]'));
    const navigationItems = navigationLinks
        .map((link) => {
            const sectionId = link.getAttribute("href");

            if (!sectionId || sectionId === "#") {
                return null;
            }

            const section = document.querySelector(sectionId);

            if (!section) {
                return null;
            }

            return { link, section };
        })

        .filter(Boolean);

    if (!navigationItems.length) {
        return;
    }

    function activateNavigationLink(sectionId) {
        navigationItems.forEach(({ link }) => {

            const isActive = link.getAttribute("href") === sectionId;
            link.classList.toggle("active", isActive);

            if (isActive) {
                link.setAttribute("aria-current", "page");

            } else {
                link.removeAttribute("aria-current");
            }
        });
    }

    const sectionObserver = new IntersectionObserver((entries) => {

        const visibleSections = entries
            .filter((entry) => entry.isIntersecting)
            .sort((firstEntry, secondEntry) =>
                secondEntry.intersectionRatio -
                firstEntry.intersectionRatio
            );

        if (!visibleSections.length) {
            return;
        }

        activateNavigationLink(`#${visibleSections[0].target.id}`);
    }, {

        rootMargin: "-25% 0px -55% 0px",
        threshold: [0.05, 0.2, 0.4, 0.6]
    });

    navigationItems.forEach(({ section }) => {
        sectionObserver.observe(section);
    });

    navigationLinks.forEach((link) => {

        link.addEventListener("click", () => {
            activateNavigationLink(link.getAttribute("href"));
        });
    });
}
