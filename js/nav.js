export function initNavigation() {
    initMobileMenu();
}

function initMobileMenu() {
    const menuButton = document.querySelector(
        ".mobile-menu-button"
    );

    const mobileNavigation = document.getElementById(
        "mobile-navigation"
    );

    if (!menuButton || !mobileNavigation) {
        return;
    }

    const mobileLinks = Array.from(
        mobileNavigation.querySelectorAll("a")
    );

    function isMenuOpen() {
        return menuButton.getAttribute(
            "aria-expanded"
        ) === "true";
    }

    function setMenuState(
        isOpen,
        restoreButtonFocus = false
    ) {
        menuButton.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

        menuButton.setAttribute(
            "aria-label",
            isOpen
                ? "Close navigation menu"
                : "Open navigation menu"
        );

        mobileNavigation.classList.toggle(
            "is-open",
            isOpen
        );

        mobileNavigation.hidden = !isOpen;

        document.body.classList.toggle(
            "nav-open",
            isOpen
        );

        if (isOpen) {
            window.requestAnimationFrame(() => {
                mobileLinks[0]?.focus();
            });

            return;
        }

        if (restoreButtonFocus) {
            menuButton.focus();
        }
    }

    function closeMenu(restoreButtonFocus = false) {
        setMenuState(
            false,
            restoreButtonFocus
        );
    }

    function toggleMenu() {
        setMenuState(
            !isMenuOpen()
        );
    }

    menuButton.addEventListener(
        "click",
        toggleMenu
    );

    mobileLinks.forEach((link) => {
        link.addEventListener("click", () => {
            closeMenu(false);
        });
    });

    document.addEventListener("keydown", (event) => {
        if (
            event.key === "Escape" &&
            isMenuOpen()
        ) {
            event.preventDefault();

            closeMenu(true);

            return;
        }

        if (
            event.key !== "Tab" ||
            !isMenuOpen()
        ) {
            return;
        }

        const focusableElements = [
            menuButton,
            ...mobileLinks
        ];

        const firstElement =
            focusableElements[0];

        const lastElement =
            focusableElements[
            focusableElements.length - 1
            ];

        if (
            event.shiftKey &&
            document.activeElement === firstElement
        ) {
            event.preventDefault();
            lastElement.focus();

            return;
        }

        if (
            !event.shiftKey &&
            document.activeElement === lastElement
        ) {
            event.preventDefault();
            firstElement.focus();
        }
    });

    window.addEventListener("resize", () => {
        if (window.matchMedia("(min-width: 1121px)").matches) {
            closeMenu(false);
        }
    });

    closeMenu(false);
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
