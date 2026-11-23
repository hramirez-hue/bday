
const openButton = document.getElementById("openButton");
const envelope = document.querySelector(".envelope");
const heading = document.querySelector("h1");
const description = document.querySelector(".welcome > p");

openButton.addEventListener("click", function() {

    envelope.classList.add("open");

    heading.textContent = "Happy Birthday! ♡";
    description.textContent = "Today is all about you. I hope you enjoy this little surprise.";

    openButton.textContent = "Let's go!";
});
