// ==========================================
// themes.js - load AFTER enhance.js
// Gives each song its own floating effects and a
// color wipe when she switches between them.
//   yellow     -> slow twinkling stars
//   toothbrush -> rising bubbles + popping sparkles
// ==========================================
(function () {
    "use strict";

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isSmall = window.matchMedia("(max-width: 700px)").matches;
    const rand = (min, max) => min + Math.random() * (max - min);

    const layer = document.createElement("div");
    layer.className = "theme-fx";
    layer.setAttribute("aria-hidden", "true");
    document.body.appendChild(layer);

    function currentTheme() {
        return document.body.classList.contains("toothbrush-theme") ? "toothbrush" : "yellow";
    }

    function buildEffects(theme) {
        layer.textContent = "";
        if (reduceMotion) return;

        const count = isSmall ? 9 : 16;

        if (theme === "yellow") {
            const stars = ["\u2726", "\u2727", "\u2736"];

            for (let i = 0; i < count; i++) {
                const star = document.createElement("span");
                star.className = "fx-star";
                star.textContent = stars[Math.floor(Math.random() * stars.length)];
                star.style.left = rand(2, 98) + "%";
                star.style.top = rand(2, 98) + "%";
                star.style.fontSize = rand(10, 22) + "px";
                star.style.animationDuration = rand(3.5, 7) + "s";
                star.style.animationDelay = "-" + rand(0, 7) + "s";
                layer.appendChild(star);
            }
            return;
        }

        // toothbrush: bubbles
        for (let i = 0; i < count; i++) {
            const bubble = document.createElement("span");
            const size = rand(14, 46);
            bubble.className = "fx-bubble";
            bubble.style.width = size + "px";
            bubble.style.height = size + "px";
            bubble.style.left = rand(0, 98) + "%";
            bubble.style.setProperty("--sway", rand(-40, 40) + "px");
            bubble.style.animationDuration = rand(9, 18) + "s";
            bubble.style.animationDelay = "-" + rand(0, 18) + "s";
            layer.appendChild(bubble);
        }

        // toothbrush: a few sparkles that pop
        const sparks = ["\u2605", "\u2661", "\u2726"];
        const sparkCount = isSmall ? 4 : 7;

        for (let i = 0; i < sparkCount; i++) {
            const spark = document.createElement("span");
            spark.className = "fx-spark";
            spark.textContent = sparks[Math.floor(Math.random() * sparks.length)];
            spark.style.left = rand(3, 96) + "%";
            spark.style.top = rand(5, 92) + "%";
            spark.style.fontSize = rand(14, 26) + "px";
            spark.style.animationDelay = "-" + rand(0, 3) + "s";
            spark.style.animationDuration = rand(2.2, 3.6) + "s";
            layer.appendChild(spark);
        }
    }

    // A circle of color grows out of the song button that was just clicked
    function colorWipe(theme) {
        if (reduceMotion) return;

        const button = document.querySelector(".song-button.active");
        const rect = button
            ? button.getBoundingClientRect()
            : { left: window.innerWidth / 2, top: 40, width: 0, height: 0 };

        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        const wipe = document.createElement("div");
        wipe.className = "theme-wipe " + theme;
        wipe.setAttribute("aria-hidden", "true");
        document.body.appendChild(wipe);

        const anim = wipe.animate([
            { clipPath: "circle(0px at " + x + "px " + y + "px)", opacity: 0.85 },
            { clipPath: "circle(150vmax at " + x + "px " + y + "px)", opacity: 0 }
        ], { duration: 1000, easing: "cubic-bezier(0.2, 0.7, 0.2, 1)" });

        anim.onfinish = () => wipe.remove();
    }

    let activeTheme = currentTheme();
    buildEffects(activeTheme);

    // script.js swaps the body class when a song is picked; react to that
    new MutationObserver(() => {
        const next = currentTheme();
        if (next === activeTheme) return;

        activeTheme = next;
        buildEffects(next);
        colorWipe(next);
    }).observe(document.body, { attributes: true, attributeFilter: ["class"] });

})();
