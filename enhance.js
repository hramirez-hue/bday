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

    // true  = the 4 extra review questions (04-07) must be answered
    // false = they are optional (she can skip them)
    const NEW_QUESTIONS_REQUIRED = true;
    // ------------------------------------------------

    // ---- THE FORTUNE COOKIE JAR --------------------
    // EDIT THESE! One message per cookie. Add as many as you like.
    // Add or remove lines freely. Keep the quotes and the commas.
    const FORTUNES = [
        "Your smile.",
        "Your laugh.",
        "The way you talk.",
        "Your sense of humor.",
        "Your random thoughts.",
        "Your little rants.",
        "The way you tell stories.",
        "Your reactions to things.",
        "Your voice.",
        "Your choice of words.",
        "Your random updates.",
        "The way you get excited.",
        "Your silly side.",
        "The way you make simple conversations fun.",
        "Your facial expressions.",
        "Your unfiltered thoughts.",
        "Your kindness.",
        "Your patience.",
        "Your thoughtfulness.",
        "Your independence.",
        "Your maturity.",
        "Your personality.",
        "Your generosity.",
        "Your ability to make people comfortable.",
        "How you remain yourself.",
        "The person you're becoming.",
        "The fact that we've known each other since the pandemic.",
        "How we've managed to stay in each other's lives.",
        "All the random conversations we've had.",
        "The memories we've made.",
        "Our inside jokes.",
        "The stupid things we laugh about.",
        "How there's always something to talk about.",
        "How comfortable our conversations can be.",
        "The way we can pick up conversations.",
        "All the times you've made me laugh.",
        "The little updates you share with me.",
        "The fact that I got to know you.",
        "How our friendship has grown.",
        "All the moments that became memories.",
        "Having someone like you around.",
        "How you make time pass faster (lowkey di ako ganahan pero geh dkn).",
        "The random things that remind me of you.",
        "The fact that you're still here after all these years.",
        "How you randomly cross my mind.",
        "How seeing your name pop up makes me happy.",
        "67676767676767676767 (asmr)",
        "tiguwang tiguwang tiguwang tiguwang tiguwang tiguwang tiguwang tiguwang tiguwang tiguwang",
        "How I never really get tired of talking to you.",
        "How I sometimes wish our conversations were longer.",
        "How I remember the little things you tell me.",
        "How certain songs remind me of you.",
        "How I find myself wanting to tell you random things.",
        "How your happiness makes me happy.",
        "How I could listen to you talk about practically anything.",
        "How you make ordinary days feel special.",
        "crush tkw dugay na",
        "How I sometimes catch myself smiling at our conversations.",
        "How you're one of my favorite people to talk to.",
        "How I genuinely look forward to seeing you.",
        "How you have a special place in my life.",
        "Your ability to make me laugh.",
        "Your random recommendations.",
        "Your taste in music.",
        "Your presence.",
        "Your uniqueness.",
        "Your beautiful mind.",
        "The way you make things feel a little less boring.",
        "The memories I associate with you.",
        "The little things that make you you.",
        "The fact that I get to call you my friend.",
        "The years of friendship we've shared.",
        "The person you've been throughout all these years.",
        "The person you're growing into.",
        "Every version of you I've gotten to know.",
        "The opportunity to have you in my life.",
        "Simply because you're Hyacinth."
    ];
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
        .querySelectorAll(".contract-container, .message-container, .review-container, .jar-container")
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
            "Humor rating: " + byId("receiptHumor").textContent,
            "Favorite part of the website: " + byId("receiptPart").textContent,
            "Better song: " + byId("receiptSong").textContent,
            "Effort rating: " + byId("receiptEffort").textContent,
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

    // ------------------------------------------
    // 13. FORTUNE COOKIE JAR
    //     click the jar -> a cookie pops out
    //     click the cookie -> it cracks open and shows a message
    // ------------------------------------------
    const jarBtn = byId("jar");

    if (jarBtn) {
        const hint = byId("jarHint");
        const stage = byId("cookieStage");
        const slip = byId("fortuneSlip");
        const slipText = byId("fortuneText");

        let bag = [];
        let lastMessage = "";
        let currentCookie = null;

        // Every message shows once before any message repeats
        function nextMessage() {
            if (bag.length === 0) {
                bag = FORTUNES.slice();
                for (let i = bag.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [bag[i], bag[j]] = [bag[j], bag[i]];
                }
                // don't start a new round with the message she just saw
                if (bag.length > 1 && bag[bag.length - 1] === lastMessage) {
                    bag.unshift(bag.pop());
                }
            }
            lastMessage = bag.pop();
            return lastMessage;
        }

        function pulse(el, cls, ms) {
            el.classList.remove(cls);
            void el.offsetWidth;
            el.classList.add(cls);
            setTimeout(() => el.classList.remove(cls), ms);
        }

        function openCookie(cookie, message) {
            if (cookie.classList.contains("open")) return;

            cookie.classList.add("open");
            cookie.setAttribute("aria-label", "Opened fortune cookie");

            slipText.textContent = message;
            slip.classList.remove("show");
            void slip.offsetWidth;
            slip.classList.add("show");

            hint.textContent = "CLICK THE JAR FOR ANOTHER";
        }

        jarBtn.addEventListener("click", () => {
            pulse(jarBtn, "shake", 500);

            // she hasn't opened the last cookie yet: just nudge it
            if (currentCookie && !currentCookie.classList.contains("open")) {
                pulse(currentCookie, "wiggle", 600);
                return;
            }

            const message = nextMessage();

            stage.textContent = "";
            slip.classList.remove("show");

            const cookie = document.createElement("button");
            cookie.type = "button";
            cookie.className = "stage-cookie";
            cookie.setAttribute("aria-label", "Open your fortune cookie");
            cookie.innerHTML = '<span class="half half-l"></span><span class="half half-r"></span>';
            cookie.addEventListener("click", () => openCookie(cookie, message));

            stage.appendChild(cookie);
            currentCookie = cookie;

            hint.textContent = "NOW CLICK THE COOKIE";
        });
    }


    // ------------------------------------------
    // 14. EXTRA REVIEW QUESTIONS (04 - 07)
    // ------------------------------------------
    const humorStars = document.querySelectorAll(".mini-star");
    const humorDesc = byId("humorDescription");
    const effortBtns = document.querySelectorAll(".score-btn");
    const effortDesc = byId("effortDescription");
    const reviewErrorEl = byId("reviewError");

    // What shows under the humor stars (edit these!)
    const humorMessages = {
        1: "damn ok",
        2: ":C",
        3: "so u hate me",
        4: "e full dkn pls",
        5: "yey"
    };

    // What shows under the effort scale (edit these!)
    function effortMessage(n) {
        if (n <= 2) return "k wtv";
        if (n <= 4) return "kalain";
        if (n <= 6) return "na dayun";
        if (n <= 8) return "dont be shy";
        return "yieeeeee";
    }

    let humorValue = 0;
    let effortValue = 0;

    humorStars.forEach((star) => {
        star.addEventListener("click", () => {
            humorValue = Number(star.dataset.rating);

            humorStars.forEach((s) => {
                const r = Number(s.dataset.rating);
                s.classList.toggle("selected", r <= humorValue);
                s.setAttribute("aria-pressed", r === humorValue ? "true" : "false");
            });

            humorDesc.textContent = humorMessages[humorValue];
            reviewErrorEl.textContent = "";
        });
    });

    effortBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            effortValue = Number(btn.dataset.score);

            effortBtns.forEach((b) => {
                const on = b === btn;
                b.classList.toggle("selected", on);
                b.setAttribute("aria-pressed", on ? "true" : "false");
            });

            effortDesc.textContent = effortMessage(effortValue);
            reviewErrorEl.textContent = "";
        });
    });

    document
        .querySelectorAll('input[name="favoritePart"], input[name="betterSong"]')
        .forEach((input) => {
            input.addEventListener("change", () => { reviewErrorEl.textContent = ""; });
        });

    // Runs BEFORE script.js's submit handler (capture phase on the form),
    // so we can check the new questions and fill in the receipt.
    document.querySelector(".review-paper").addEventListener("click", (e) => {
        if (!e.target.closest("#submitReview")) return;

        // If an original question is missing, let script.js show its own message
        const originalDone =
            document.querySelector(".rating-star.selected") &&
            document.querySelector('input[name="favoriteMoment"]:checked') &&
            document.querySelector('input[name="again"]:checked');

        if (!originalDone) return;

        const part = document.querySelector('input[name="favoritePart"]:checked');
        const song = document.querySelector('input[name="betterSong"]:checked');

        if (NEW_QUESTIONS_REQUIRED) {
            let problem = "";

            if (!humorValue) problem = "rate my humor first";
            else if (!part) problem = "pick ur fav part naa";
            else if (!song) problem = "pili naay ng kanta";
            else if (!effortValue) problem = "rate my website";

            if (problem) {
                reviewErrorEl.textContent = problem;
                e.stopPropagation();
                e.preventDefault();
                return;
            }
        }

        const skipped = "No answer (k)";

        byId("receiptHumor").textContent = humorValue ? humorValue + " out of 5 stars" : skipped;
        byId("receiptPart").textContent = part ? part.value : skipped;
        byId("receiptSong").textContent = song ? song.value : skipped;
        byId("receiptEffort").textContent = effortValue ? effortValue + " out of 10" : skipped;
    }, true);

})();
