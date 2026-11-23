
// GET WEBSITE ELEMENTS

const openingScreen = document.getElementById("openingScreen");
const birthdayScreen = document.getElementById("birthdayScreen");

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCaption = document.getElementById("lightboxCaption");
const closeLightbox = document.getElementById("closeLightbox");


// OPENING SCREEN INTERACTION

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


// SCROLL REVEAL ANIMATION

const revealElements = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(function(entries, observer) {

    entries.forEach(function(entry) {

        if (entry.isIntersecting) {

            entry.target.classList.add("visible");

            observer.unobserve(entry.target);

        }

    });

}, {
    threshold: 0.15
});

revealElements.forEach(function(element) {
    observer.observe(element);
});


// OPEN PHOTO LIGHTBOX

const galleryPhotos = document.querySelectorAll(".gallery-photo");

galleryPhotos.forEach(function(photo) {

    photo.addEventListener("click", function() {

        lightboxImage.src = photo.src;

        const caption = photo.parentElement.querySelector("p");

        if (caption) {
            lightboxCaption.textContent = caption.textContent;
        }

        lightbox.classList.add("active");

    });

});


// CLOSE PHOTO LIGHTBOX

function closePhotoPreview() {

    lightbox.classList.remove("active");

    lightboxImage.src = "";

}

closeLightbox.addEventListener("click", closePhotoPreview);


// CLOSE WHEN CLICKING OUTSIDE THE PHOTO

lightbox.addEventListener("click", function(event) {

    if (event.target === lightbox) {
        closePhotoPreview();
    }

});


// CLOSE USING ESCAPE KEY

document.addEventListener("keydown", function(event) {

    if (event.key === "Escape") {
        closePhotoPreview();
    }

});
