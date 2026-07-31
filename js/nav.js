export function initNavigation() {
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
