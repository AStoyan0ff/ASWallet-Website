export function initMobileShowcaseAnimation() {
    const mobileShowcase = document.querySelector("[data-mobile-showcase]");

    if (!mobileShowcase) {
        return;
    }

    const revealElements = [
        mobileShowcase.querySelector(
            ".mobile-showcase-eyebrow"
        ),

        mobileShowcase.querySelector(
            ".mobile-showcase-title"
        ),

        mobileShowcase.querySelector(
            ".mobile-showcase-description"
        ),

        mobileShowcase.querySelector(
            ".mobile-showcase-badges"
        ),

        ...mobileShowcase.querySelectorAll(
            ".mobile-feature-item"
        ),

        mobileShowcase.querySelector(
            ".mobile-showcase-actions"
        ),

        mobileShowcase.querySelector(
            ".mobile-preview"
        )
    ].filter(Boolean);

    revealElements.forEach((element, index) => {

        element.classList.add("mobile-reveal");
        element.style.setProperty("--mobile-reveal-delay", `${index * 90}ms`); }
    );

    mobileShowcase.classList.add("has-mobile-animation");

    if (!("IntersectionObserver" in window)) {

        mobileShowcase.classList.add(
            "is-mobile-visible",
            "is-mobile-active"
        );

        return;
    }

    const mobileShowcaseObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {

            mobileShowcase.classList.toggle(
                "is-mobile-active",
                entry.isIntersecting
            );

            if (entry.isIntersecting) {
                mobileShowcase.classList.add(
                    "is-mobile-visible"
                );
            }
        });
    },
        {
            threshold: 0.05,
            rootMargin: "180px 0px 180px 0px"
        }
    );

    mobileShowcaseObserver.observe(mobileShowcase);
   
}
