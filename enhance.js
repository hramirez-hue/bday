// ==========================================
// enhance.js - load AFTER script.js
// Adds fixes without touching the original code.
// ==========================================
(function () {
    "use strict";

    // ---- SETTINGS ----------------------------------
    // true  = every photo starts covered and must be clicked to reveal
    // false = photos start visible (original behavior)
    const COVER_PHOTOS = true;

    // true = drifting petals on the opening + birthday screens
    const PETALS = true;
    // true = confetti when she enters the site and when she signs the contract
    const CONFETTI = true;
    // ------------------------------------------------

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
    // 1b. COVERED PHOTOS: click once to reveal,
    //     click again to see the note + caption
    // ------------------------------------------
    if (COVER_PHOTOS) {
        document.querySelectorAll(".polaroid, .memory-card").forEach((card) => {
            const img = card.querySelector(".gallery-photo");
            if (!img) return;

            card.classList.add("photo-covered");
            img.setAttribute("aria-label", "Reveal this photo");

            // Capture phase: runs BEFORE script.js's click handler,
            // so the first click only reveals and doesn't open the note.
            card.addEventListener("click", (e) => {
                if (!card.classList.contains("photo-covered")) return;
                if (e.target !== img) return;

                e.stopPropagation();
                card.classList.remove("photo-covered");
                img.setAttribute("aria-label", "Show the note for this photo");
            }, true);
        });
    }


    // ------------------------------------------
    // 2. OPENING SCREEN: works with keyboard too
    // ------------------------------------------
    const opening = byId("openingScreen");
    let opened = false;

    opening.tabIndex = 0;
    opening.setAttribute("role", "button");
    opening.setAttribute("aria-label", "Click to continue");

    opening.addEventListener("click", () => {
        if (!opened && typeof launchWelcomeConfetti === "function") {
            launchWelcomeConfetti();
        }
        opened = true;
    });

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

        if (certificateShown && CONFETTI) {
            setTimeout(() => {
                confettiBurst(window.innerWidth / 2, window.innerHeight * 0.65, 110);
            }, 350);
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

    // ------------------------------------------
    // 10. DRIFTING PETALS (opening + birthday screens)
    // ------------------------------------------
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (PETALS && !reduceMotion) {
        const shapes = ["\u273F", "\u2740", "\u2727", "\u2661"];

        [byId("openingScreen"), byId("birthdayScreen")].forEach((host) => {
            if (!host) return;

            const layer = document.createElement("div");
            layer.className = "petal-layer";
            layer.setAttribute("aria-hidden", "true");

            for (let i = 0; i < 16; i++) {
                const petal = document.createElement("span");
                petal.className = "petal";
                petal.textContent = shapes[Math.floor(Math.random() * shapes.length)];

                petal.style.left = (Math.random() * 100) + "%";
                petal.style.fontSize = (13 + Math.random() * 16) + "px";
                petal.style.animationDuration = (10 + Math.random() * 10) + "s";
                petal.style.animationDelay = "-" + (Math.random() * 18) + "s";
                petal.style.setProperty("--sway", (Math.random() * 90 - 45) + "px");

                layer.appendChild(petal);
            }

            host.insertBefore(layer, host.firstChild);
        });
    }


    // ------------------------------------------
    // 11. CONFETTI
    // ------------------------------------------
    const confettiColors = ["#e3b951", "#f4d58e", "#ed91b8", "#d49be9", "#fff3cf", "#a879c5", "#f2a48a"];
    let confettiLayer = null;

    function confettiBurst(x, y, count) {
        if (!CONFETTI || reduceMotion) return;

        if (!confettiLayer) {
            confettiLayer = document.createElement("div");
            confettiLayer.className = "confetti-layer";
            confettiLayer.setAttribute("aria-hidden", "true");
            document.body.appendChild(confettiLayer);
        }

        for (let i = 0; i < count; i++) {
            const piece = document.createElement("i");
            const w = 6 + Math.random() * 6;
            const h = w * (1.2 + Math.random());

            piece.style.cssText =
                "position:absolute;left:" + x + "px;top:" + y + "px;" +
                "width:" + w + "px;height:" + h + "px;" +
                "background:" + confettiColors[Math.floor(Math.random() * confettiColors.length)] + ";" +
                "border-radius:" + (Math.random() < 0.3 ? "50%" : "1px") + ";";

            confettiLayer.appendChild(piece);

            const angle = (-90 + (Math.random() - 0.5) * 140) * Math.PI / 180;
            const speed = 180 + Math.random() * 320;
            const dx = Math.cos(angle) * speed;
            const up = Math.sin(angle) * speed;
            const fall = 380 + Math.random() * 320;
            const spin = (Math.random() - 0.5) * 900;
            const duration = 1800 + Math.random() * 1400;

            const anim = piece.animate([
                { transform: "translate(0,0) rotate(0deg)", opacity: 1 },
                { transform: "translate(" + (dx * 0.7) + "px," + up + "px) rotate(" + (spin * 0.4) + "deg)", opacity: 1, offset: 0.35 },
                { transform: "translate(" + dx + "px," + (up + fall) + "px) rotate(" + spin + "deg)", opacity: 0 }
            ], { duration: duration, easing: "cubic-bezier(0.25, 0.6, 0.4, 1)", fill: "forwards" });

            anim.onfinish = () => piece.remove();
        }
    }

    // Called by the opening-screen click handler (section 2) after the sunshine transition
    function launchWelcomeConfetti() {
        setTimeout(() => {
            confettiBurst(window.innerWidth * 0.25, window.innerHeight * 0.8, 70);
            confettiBurst(window.innerWidth * 0.75, window.innerHeight * 0.8, 70);
        }, 1100);
    }
    window.launchWelcomeConfetti = launchWelcomeConfetti;


    // ------------------------------------------
    // 12. SPINNING VINYL in the music player
    // ------------------------------------------
    const musicAudioEl = byId("musicAudio");
    const vinylHost = heading.querySelector("span:first-child");

    if (vinylHost) {
        vinylHost.textContent = "";
        const vinyl = document.createElement("span");
        vinyl.className = "vinyl";
        vinyl.setAttribute("aria-hidden", "true");
        vinylHost.appendChild(vinyl);
    }

    ["play", "playing"].forEach((evt) =>
        musicAudioEl.addEventListener(evt, () => player.classList.add("is-playing")));
    ["pause", "ended"].forEach((evt) =>
        musicAudioEl.addEventListener(evt, () => player.classList.remove("is-playing")));

})();
