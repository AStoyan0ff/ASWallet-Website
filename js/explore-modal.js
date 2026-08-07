export function initExploreModal() {
    const modal = document.querySelector("[data-explore-modal]");
    const triggers = [...document.querySelectorAll("[data-explore-trigger]")];

    if (!modal || !triggers.length) {
        return;
    }

    const dialog = modal.querySelector(".modal-dialog");
    const closeElements = [...modal.querySelectorAll("[data-explore-close]")];
    let lastFocus = null;

    const openModal = () => {
        lastFocus = document.activeElement;
        modal.hidden = false;
        document.body.classList.add("modal-open");
        dialog?.focus?.();

        const closeButton = modal.querySelector(".modal-close");
        closeButton?.focus();
    };

    const closeModal = () => {
        modal.hidden = true;
        document.body.classList.remove("modal-open");

        if (lastFocus && typeof lastFocus.focus === "function") {
            lastFocus.focus();
        }
    };

    triggers.forEach((trigger) => {
        trigger.addEventListener("click", (event) => {
            event.preventDefault();
            openModal();
        });
    });

    closeElements.forEach((element) => {
        element.addEventListener("click", closeModal);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !modal.hidden) {
            closeModal();
        }
    });
}
