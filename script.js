// ==========================================
// GET WEBSITE ELEMENTS
// ==========================================

// Opening and birthday screens

const openingScreen = document.getElementById("openingScreen");
const birthdayScreen = document.getElementById("birthdayScreen");

// Music player

const musicPlayer = document.getElementById("musicPlayer");
const musicAudio = document.getElementById("musicAudio");
const playMusic = document.getElementById("playMusic");

const playerStatus = document.getElementById("playerStatus");
const songButtons = document.querySelectorAll(".song-button");

// Photo lightbox

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCaption = document.getElementById("lightboxCaption");
const closeLightbox = document.getElementById("closeLightbox");

// Contract elements

const signerName = document.getElementById("signerName");
const agreeContract = document.getElementById("agreeContract");
const moreOption = document.getElementById("moreOption");

const signContract = document.getElementById("signContract");
const contractError = document.getElementById("contractError");

const contractSigning = document.getElementById("contractSigning");
const contractCertificate = document.getElementById("contractCertificate");

const certificateName = document.getElementById("certificateName");
const futureStatus = document.getElementById("futureStatus");

// Interactive message elements

const openLetter = document.getElementById("openLetter");
const messageLetter = document.getElementById("messageLetter");
const envelopeHint = document.getElementById("envelopeHint");

const closeFeelings = document.getElementById("closeFeelings");
const finalLine = document.getElementById("finalLine");

// Review elements

const ratingStars = document.querySelectorAll(".rating-star");
const ratingDescription = document.getElementById("ratingDescription");

const reviewFeedback = document.getElementById("reviewFeedback");
const reviewError = document.getElementById("reviewError");

const submitReview = document.getElementById("submitReview");
const reviewPaper = document.querySelector(".review-paper");
const reviewReceipt = document.getElementById("reviewReceipt");

const receiptRating = document.getElementById("receiptRating");
const receiptFavorite = document.getElementById("receiptFavorite");
const receiptAgain = document.getElementById("receiptAgain");
const receiptFeedback = document.getElementById("receiptFeedback");

const finishReview = document.getElementById("finishReview");


// ==========================================
// MUSIC PLAYER
// ==========================================

const songs = {

    yellow: {
        source: "music/yellow.mp3",
        theme: "yellow-theme"
    },

    toothbrush: {
        source: "music/toothbrush.mp3",
        theme: "toothbrush-theme"
    }

};

let currentSong = "yellow";

function selectSong(songName) {

    if (!songs[songName]) {
        return;
    }

    const wasPlaying = !musicAudio.paused;

    currentSong = songName;

    songButtons.forEach(button => {

        button.classList.remove("active");

        if (button.dataset.song === songName) {
            button.classList.add("active");
        }

    });

    document.body.classList.remove(
        "yellow-theme",
        "toothbrush-theme"
    );

    document.body.classList.add(songs[songName].theme);

    const newSource = songs[songName].source;

    if (!musicAudio.src.endsWith(newSource)) {

        musicAudio.src = newSource;
        musicAudio.load();

    }

    if (songName === "yellow") {

        playerStatus.textContent = "Medjo clichet siya pero wtv. ☀";

    } else {

        playerStatus.textContent = "iykyk >:D. ✿";

    }

    if (wasPlaying) {

        musicAudio.play().catch(() => {

            playerStatus.textContent = "hehe";

        });

    }

}


// SONG BUTTON EVENTS

songButtons.forEach(button => {

    button.addEventListener("click", () => {

        selectSong(button.dataset.song);

    });

});


// PLAY AND PAUSE BUTTON

playMusic.addEventListener("click", () => {

    if (musicAudio.paused) {

        musicAudio.play().catch(() => {

            playerStatus.textContent = "Unable to play this song.";

        });

    } else {

        musicAudio.pause();

    }

});


// UPDATE BUTTON WHEN MUSIC PLAYS

musicAudio.addEventListener("play", () => {

    playMusic.textContent = "Ⅱ";
    playMusic.setAttribute("aria-label", "Pause");

    playerStatus.textContent = "heh";

});


// UPDATE BUTTON WHEN MUSIC PAUSES

musicAudio.addEventListener("pause", () => {

    playMusic.textContent = "▶";
    playMusic.setAttribute("aria-label", "Play");

    if (musicAudio.currentTime > 0) {

        playerStatus.textContent = "heh";

    }

});


// ==========================================
// OPENING SCREEN TRANSITION
// ==========================================

openingScreen.addEventListener("click", (event) => {

    const sunshine = document.createElement("div");

    sunshine.classList.add("sunshine");

    sunshine.style.left = event.clientX + "px";
    sunshine.style.top = event.clientY + "px";

    document.body.appendChild(sunshine);

    requestAnimationFrame(() => {

        sunshine.classList.add("expand");

    });

    openingScreen.style.pointerEvents = "none";

    setTimeout(() => {

        openingScreen.style.display = "none";

        birthdayScreen.style.display = "flex";

        musicPlayer.classList.add("visible");

        sunshine.remove();

    }, 1000);

});


// ==========================================
// SCROLL REVEAL ANIMATIONS
// ==========================================

const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            entry.target.classList.add("visible");

            revealObserver.unobserve(entry.target);

        }

    });

}, {

    threshold: 0.15

});

revealElements.forEach(element => {

    revealObserver.observe(element);

});


// ==========================================
// PHOTO CAPTION PANELS + LIGHTBOX
// ==========================================

const galleryPhotos = document.querySelectorAll(".gallery-photo");


// CLOSE ALL OPEN CAPTION PANELS

function closeAllPhotoNotes(exceptCard = null) {

    document.querySelectorAll(".photo-note-open").forEach(card => {

        if (card !== exceptCard) {

            card.classList.remove("photo-note-open");

        }

    });

}


// CREATE A PHOTO NOTE PANEL

function createPhotoNote(photo) {

    const card = photo.closest(".polaroid, .memory-card");

    if (!card) {
        return null;
    }

    let panel = card.querySelector(".photo-note-panel");

    if (!panel) {

        panel = document.createElement("div");

        panel.className = "photo-note-panel";

        const caption = photo.nextElementSibling;

        // Use the custom data-note from HTML first

        const message = photo.dataset.note ||
            (caption && caption.tagName === "P"
                ? caption.textContent.trim()
                : "A little moment worth remembering. ♡");

        const messageElement = document.createElement("p");

        messageElement.className = "photo-note-message";
        messageElement.textContent = message;

        const viewButton = document.createElement("button");

        viewButton.className = "photo-note-view";
        viewButton.type = "button";
        viewButton.textContent = "VIEW PHOTO ↗";

        panel.appendChild(messageElement);
        panel.appendChild(viewButton);

        card.appendChild(panel);

        viewButton.addEventListener("click", (event) => {

            event.stopPropagation();

            openPhotoLightbox(photo);

        });

    }

    return card;

}


// OPEN OR CLOSE A PHOTO NOTE

galleryPhotos.forEach(photo => {

    photo.addEventListener("click", (event) => {

        event.stopPropagation();

        const card = createPhotoNote(photo);

        if (!card) {
            return;
        }

        const isAlreadyOpen = card.classList.contains("photo-note-open");

        closeAllPhotoNotes(card);

        if (isAlreadyOpen) {

            card.classList.remove("photo-note-open");

        } else {

            card.classList.add("photo-note-open");

        }

    });

});


// CLICK OUTSIDE TO CLOSE NOTES

document.addEventListener("click", (event) => {

    if (!event.target.closest(".polaroid, .memory-card")) {

        closeAllPhotoNotes();

    }

});


// OPEN PHOTO LIGHTBOX

function openPhotoLightbox(photo) {

    lightboxImage.src = photo.src;
    lightboxImage.alt = photo.alt;

    const caption = photo.nextElementSibling;

    if (caption && caption.tagName === "P") {

        lightboxCaption.textContent = caption.textContent;

    } else {

        lightboxCaption.textContent = "";

    }

    lightbox.classList.add("active");

}


// CLOSE PHOTO LIGHTBOX

function hideLightbox() {

    lightbox.classList.remove("active");

}


// CLOSE BUTTON

closeLightbox.addEventListener("click", hideLightbox);


// CLICK OUTSIDE PHOTO

lightbox.addEventListener("click", (event) => {

    if (event.target === lightbox) {

        hideLightbox();

    }

});


// CLOSE WITH ESCAPE KEY

document.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {

        hideLightbox();

        closeAllPhotoNotes();

    }

});


// ==========================================
// 4LIFERS CONTRACT SIGNING
// ==========================================

signContract.addEventListener("click", () => {

    const name = signerName.value.trim();

    if (name === "") {

        contractError.textContent = "Please enter your name first.";

        signerName.focus();

        return;

    }

    if (!agreeContract.checked) {

        contractError.textContent =
            "You must agree to the 4Lifers terms first. :(";

        return;

    }

    contractError.textContent = "";

    certificateName.textContent = name;

    if (moreOption.checked) {

        futureStatus.textContent =
            "FUTURE POSSIBILITIES: OPEN TO EXPLORING ♡";

    } else {

        futureStatus.textContent =
            "FUTURE POSSIBILITIES: PENDING";

    }

    contractSigning.style.display = "none";

    contractCertificate.classList.add("show");

    contractCertificate.scrollIntoView({

        behavior: "smooth",
        block: "center"

    });

});


// ==========================================
// INTERACTIVE ENVELOPE
// ==========================================

openLetter.addEventListener("click", () => {

    if (openLetter.classList.contains("is-open")) {

        return;

    }

    openLetter.classList.add("is-open");

    openLetter.setAttribute("aria-expanded", "true");

    envelopeHint.textContent = "YOUR NOTE IS OPEN ♡";

    messageLetter.hidden = false;

    setTimeout(() => {

        messageLetter.scrollIntoView({

            behavior: "smooth",
            block: "center"

        });

    }, 450);

});


// ==========================================
// CLOSE THE LITTLE MESSAGE
// ==========================================

closeFeelings.addEventListener("click", () => {

    closeFeelings.textContent =
        "EMOTIONAL DAMAGE: MINIMAL ✓";

    closeFeelings.disabled = true;

    closeFeelings.style.cursor = "default";
    closeFeelings.style.opacity = "0.7";

});


// ==========================================
// EXPERIENCE REVIEW
// ==========================================

let selectedRating = 0;


// STAR RATING DESCRIPTIONS

const ratingMessages = {

    1: "We'll take that as constructive criticism. 😭",

    2: "Room for improvement, apparently.",

    3: "Not bad. We'll take it.",

    4: "Pretty good! Management approves.",

    5: "A five-star experience. Management is emotional. 🥹"

};


// STAR BUTTON EVENTS

ratingStars.forEach(star => {

    star.addEventListener("click", () => {

        selectedRating = Number(star.dataset.rating);

        ratingStars.forEach(button => {

            const rating = Number(button.dataset.rating);

            button.classList.toggle(
                "selected",
                rating <= selectedRating
            );

            button.setAttribute(
                "aria-pressed",
                rating === selectedRating ? "true" : "false"
            );

        });

        ratingDescription.textContent =
            ratingMessages[selectedRating];

        reviewError.textContent = "";

    });

});


// SUBMIT REVIEW

submitReview.addEventListener("click", () => {

    const favoriteMoment = document.querySelector(
        'input[name="favoriteMoment"]:checked'
    );

    const wouldDoAgain = document.querySelector(
        'input[name="again"]:checked'
    );

    // Check required answers

    if (selectedRating === 0) {

        reviewError.textContent =
            "Management requires an overall rating first. ⭐";

        return;

    }

    if (!favoriteMoment) {

        reviewError.textContent =
            "Please select your favorite part of the experience.";

        return;

    }

    if (!wouldDoAgain) {

        reviewError.textContent =
            "One last question! Would you do it all again?";

        return;

    }

    // Prepare receipt information

    receiptRating.textContent =
        selectedRating + " out of 5 stars";

    receiptFavorite.textContent =
        favoriteMoment.value;

    receiptAgain.textContent =
        wouldDoAgain.value;

    receiptFeedback.textContent =
        reviewFeedback.value.trim() ||
        "No additional comments. Management will assume we're perfect. :)";

    // Display receipt

    reviewError.textContent = "";

    reviewPaper.hidden = true;

    reviewReceipt.hidden = false;

    reviewReceipt.scrollIntoView({

        behavior: "smooth",
        block: "center"

    });

});


// ==========================================
// FINAL GOODBYE
// ==========================================

finishReview.addEventListener("click", () => {

    finalLine.hidden = false;

    finishReview.textContent =
        "EXPERIENCE COMPLETED ✓";

    finishReview.disabled = true;

    finishReview.style.opacity = "0.7";
    finishReview.style.cursor = "default";

    setTimeout(() => {

        finalLine.scrollIntoView({

            behavior: "smooth",
            block: "center"

        });

    }, 200);

});


// ==========================================
// INITIAL WEBSITE SETTINGS
// ==========================================

selectSong("yellow");
