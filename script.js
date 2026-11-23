
const openingScreen = document.getElementById("openingScreen");

openingScreen.addEventListener("click", function() {

    openingScreen.style.transition = "opacity 0.8s ease";
    openingScreen.style.opacity = "0";

    setTimeout(function() {
        openingScreen.style.display = "none";
    }, 800);

});
