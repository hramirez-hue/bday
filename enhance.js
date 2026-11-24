// ==========================================
// enhance.js - load AFTER script.js
// Adds fixes without touching the original code.
// ==========================================
(function () {
    "use strict";

    const byId = (id) => document.getElementById(id);
    const isActivateKey = (e) => e.key === "Enter" || e.key === " ";


    // ------------------------------------------
    // 1. PHOTOS: lazy loading + keyboard access
    // ------------------------------------------
    document.querySelectorAll(".gallery-photo").forEach((img) => {
        img.loading = "lazy";
        img.decoding = "async";

        img.tabIndex = 0;
        img.setAttribute("role", "button");
        img.setAttribute("aria-label", "Show the note for this photo");

        img.addEventListener("keydown", (e) => {
            if (isActivateKey(e)) {
                e.preventDefault();
                img.click();
            }
        });
    });


    // ------------------------------------------
    // 2. OPENING SCREEN: works with keyboard too
    // ------------------------------------------
    const opening = byId("openingScreen");
    let opened = false;

    opening.tabIndex = 0;
    opening.setAttribute("role", "button");
    opening.setAttribute("aria-label", "Click to continue");

    opening.addEventListener("click", () => { opened = true; });

    opening.addEventListener("keydown", (e) => {
        if (opened || !isActivateKey(e)) return;
        e.preventDefault();

        opening.dispatchEvent(new MouseEvent("click", {
            bubbles: true,
            clientX: window.innerWidth / 2,
            clientY: window.innerHeight / 2
        }));
    });


    // ------------------------------------------
    // 3. LIGHTBOX: dialog semantics, scroll lock, focus
    // ------------------------------------------
    const lightbox = byId("lightbox");
    const closeBtn = byId("closeLightbox");
    let lastFocused = null;

    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute("aria-label", "Photo viewer");

    closeBtn.tabIndex = 0;
    closeBtn.setAttribute("role", "button");
    closeBtn.setAttribute("aria-label", "Close photo");

    closeBtn.addEventListener("keydown", (e) => {
        if (isActivateKey(e)) {
            e.preventDefault();
            closeBtn.click();
        }
    });

    new MutationObserver(() => {
        const active = lightbox.classList.contains("active");

        document.body.style.overflow = active ? "hidden" : "";

        if (active) {
            lastFocused = document.activeElement;
            closeBtn.focus();
        } else if (lastFocused && lastFocused.focus) {
            lastFocused.focus();
            lastFocused = null;
        }
    }).observe(lightbox, { attributes: true, attributeFilter: ["class"] });


    // ------------------------------------------
    // 4. PHOTO NOTES: flip to the left if they'd be cut off
    // ------------------------------------------
    document.querySelectorAll(".gallery-photo").forEach((img) => {
        img.addEventListener("click", () => {
            const card = img.closest(".polaroid, .memory-card");
            if (!card) return;

            card.classList.remove("note-left");

            if (window.innerWidth > 700) {
                const rect = card.getBoundingClientRect();
                if (rect.right + 190 > window.innerWidth - 8) {
                    card.classList.add("note-left");
                }
            }
        });
    });


    // ------------------------------------------
    // 5. MUSIC PLAYER: minimize button
    //    (on phones it auto-minimizes once she scrolls past the intro)
    // ------------------------------------------
    const player = byId("musicPlayer");
    const heading = player.querySelector(".music-player-heading");

    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "player-toggle";
    heading.appendChild(toggle);

    function setMinimized(min) {
        player.classList.toggle("minimized", min);
        toggle.textContent = min ? "+" : "\u2013";
        toggle.setAttribute("aria-expanded", String(!min));
        toggle.setAttribute("aria-label", min ? "Expand music player" : "Minimize music player");
    }

    setMinimized(false);
    toggle.addEventListener("click", () => setMinimized(!player.classList.contains("minimized")));

    if (window.matchMedia("(max-width: 700px)").matches) {
        let autoDone = false;

        window.addEventListener("scroll", () => {
            if (!autoDone && window.scrollY > window.innerHeight * 0.6) {
                autoDone = true;
                setMinimized(true);
            }
        }, { passive: true });
    }


    // ------------------------------------------
    // 6. REVEAL: make sure very tall sections always appear
    // ------------------------------------------
    const tallObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                tallObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0 });

    document
        .querySelectorAll(".contract-container, .message-container, .review-container")
        .forEach((el) => tallObserver.observe(el));


    // ------------------------------------------
    // 7. CONTRACT: neutral wording if she skips Clause 07
    // ------------------------------------------
    byId("signContract").addEventListener("click", () => {
        const certificateShown = byId("contractCertificate").classList.contains("show");

        if (certificateShown && !byId("moreOption").checked) {
            byId("futureStatus").textContent =
                "FUTURE POSSIBILITIES: NOT SELECTED (no pressure \u2661)";
        }
    });


    // ------------------------------------------
    // 8. LETTER: "ok proceed" now actually proceeds
    // ------------------------------------------
    byId("closeFeelings").addEventListener("click", () => {
        setTimeout(() => {
            byId("reviewSection").scrollIntoView({ behavior: "smooth", block: "start" });
        }, 900);
    });


    // ------------------------------------------
    // 9. REVIEW RECEIPT: "copy my answers" button
    //    (easier than a screenshot of a long receipt)
    // ------------------------------------------
    const receipt = byId("reviewReceipt");
    const finishBtn = byId("finishReview");

    const copyBtn = document.createElement("button");
    copyBtn.type = "button";
    copyBtn.className = "review-submit receipt-copy";
    copyBtn.textContent = "COPY MY ANSWERS";
    receipt.insertBefore(copyBtn, finishBtn);

    function legacyCopy(text) {
        const area = document.createElement("textarea");
        area.value = text;
        area.style.position = "fixed";
        area.style.opacity = "0";
        document.body.appendChild(area);
        area.select();

        let ok = false;
        try { ok = document.execCommand("copy"); } catch (err) { ok = false; }

        area.remove();
        return ok;
    }

    copyBtn.addEventListener("click", async () => {
        const text = [
            "THE OFFICIAL EXPERIENCE REVIEW",
            "",
            "Overall rating: " + byId("receiptRating").textContent,
            "Favorite moment: " + byId("receiptFavorite").textContent,
            "Would do it again?: " + byId("receiptAgain").textContent,
            "Additional feedback: " + byId("receiptFeedback").textContent
        ].join("\n");

        let ok = false;

        try {
            await navigator.clipboard.writeText(text);
            ok = true;
        } catch (err) {
            ok = legacyCopy(text);
        }

        copyBtn.textContent = ok
            ? "COPIED \u2713 paste it in our chat"
            : "COULDN'T COPY - screenshot instead";
    });

})();
