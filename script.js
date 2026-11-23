
// Get website elements

const openingScreen = document.getElementById("openingScreen");
const birthdayScreen = document.getElementById("birthdayScreen");


// Opening screen interaction

openingScreen.addEventListener("click", function(event) {

    const x = event.clientX;
    const y = event.clientY;

    // Create sunshine animation

    const sunshine = document.createElement("div");

    sunshine.classList.add("sunshine");

    sunshine.style.left = (x - 10) + "px";
    sunshine.style.top = (y - 10) + "px";

    document.body.appendChild(sunshine);

    // Expand the circle

    requestAnimationFrame(function() {
        sunshine.classList.add("expand");
    });

    // Reveal birthday greeting

    setTimeout(function() {

        openingScreen.style.display = "none";

        birthdayScreen.style.display = "flex";

        sunshine.remove();

    }, 1000);

}, { once: true });
