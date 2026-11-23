
// Get the website elements

const openingScreen = document.getElementById("openingScreen");
const birthdayScreen = document.getElementById("birthdayScreen");


// Detect when the opening screen is clicked

openingScreen.addEventListener("click", function(event) {

    // Get the position of the click

    const x = event.clientX;
    const y = event.clientY;


    // Create the expanding sunshine circle

    const sunshine = document.createElement("div");

    sunshine.classList.add("sunshine");

    sunshine.style.left = (x - 10) + "px";
    sunshine.style.top = (y - 10) + "px";


    // Add the circle to the website

    document.body.appendChild(sunshine);


    // Start the expansion animation

    requestAnimationFrame(function() {
        sunshine.classList.add("expand");
    });


    // Reveal the birthday screen

    setTimeout(function() {

        openingScreen.style.display = "none";

        birthdayScreen.style.display = "flex";

        sunshine.remove();

    }, 1000);


}, { once: true });
