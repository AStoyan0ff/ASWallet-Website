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
    const navigationLinks = Array.from(
        document.querySelectorAll(
            [
                '.main-navigation a[href^="#"]',
                '.mobile-navigation a[href^="#"]',
                '.footer-nav a[href^="#"]'
            ].join(",")
        )
    );

    const navigationItems = navigationLinks
        .map((link) => {

            const sectionId = link.getAttribute("href");

            if (!sectionId || sectionId === "#") {
                return null;
            }

            const section = document.querySelector(sectionId);

            if (!section) { return null; }

            return { link, section, sectionId };
            
        })
        .filter(Boolean);

    if (!navigationItems.length) {
        return;
    }

    const sections = Array
        .from(new Set(navigationItems
        .map(({ section }) => section))
    );

    function activateNavigationLink(sectionId) {
        navigationItems.forEach(({ link, sectionId: linkSectionId }) => {

            const isActive = linkSectionId === sectionId;
            link.classList.toggle("active", isActive);

            if (isActive) {
                link.setAttribute("aria-current", "page");

            } else {
                link.removeAttribute("aria-current");
            }
        });
    }

    navigationLinks.forEach((link) => {
        
        link.addEventListener("click", () => {
            activateNavigationLink(link.getAttribute("href"));
        });
    });

    const initialSectionId = window.location.hash && document.querySelector(window.location.hash)
        ? window.location.hash
        : "#home";

    activateNavigationLink(initialSectionId);

    if (!("IntersectionObserver" in window)) {
        return;
    }

    const sectionVisibility = new Map(sections.map((section) => {
        return [section, 0];

    }));

    const sectionObserver =
        new IntersectionObserver((entries) => {

            entries.forEach((entry) => {
                sectionVisibility.set(entry.target, entry.isIntersecting
                    
                    ? entry.intersectionRatio
                    : 0
                );
            });

            const activeSection = Array
                .from(sectionVisibility.entries())
                .filter(([, ratio]) => ratio > 0)
                .sort(([, firstRatio], [, secondRatio]) =>
                    secondRatio - firstRatio)[0];

            if (!activeSection) {
                return;
            }

            activateNavigationLink(`#${activeSection[0].id}`);
        },
            {
                rootMargin: "-25% 0px -55% 0px",
                threshold: [0, 0.05, 0.2, 0.4, 0.6]
            }
        );

    sections.forEach((section) => {
        sectionObserver.observe(section);
    });
}
