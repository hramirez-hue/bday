
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

// Review elements

const starButtons = document.querySelectorAll(".rating-star");
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
const finalLine = document.getElementById("finalLine");


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

        playerStatus.textContent = "A little sunshine for you. ☀";

    } else {

        playerStatus.textContent = "A little something different. ✿";

    }

    if (wasPlaying) {

        musicAudio.play().catch(() => {

            playerStatus.textContent = "Press play to continue.";

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
    playMusic.setAttribute("aria-label", "Pause music");

    playerStatus.textContent = "Now playing. ♫";

});


// UPDATE BUTTON WHEN MUSIC PAUSES

musicAudio.addEventListener("pause", () => {

    playMusic.textContent = "▶";
    playMusic.setAttribute("aria-label", "Play music");

    if (musicAudio.currentTime > 0) {

        playerStatus.textContent = "Paused. Take your time.";

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


// CREATE A PHOTO NOTE PANEL

function createPhotoNote(photo) {

    const card = photo.closest(".polaroid, .memory-card");

    if (!card) {
        return null;
    }

    let panel = card.querySelector(".photo-note");

    // Create the panel only once

    if (!panel) {

        panel = document.createElement("div");

        // IMPORTANT: This matches the CSS class name

        panel.className = "photo-note";

        // Use the message stored in the image's data-note

        const message = photo.dataset.note ||
            "A little moment worth remembering. ♡";

        const messageElement = document.createElement("p");

        messageElement.className = "photo-note-message";
        messageElement.textContent = message;

        const viewButton = document.createElement("button");

        viewButton.className = "photo-note-view";
        viewButton.type = "button";
        viewButton.textContent = "VIEW PHOTO ↗";

        // Add the message and button to the panel

        panel.appendChild(messageElement);
        panel.appendChild(viewButton);

        card.appendChild(panel);

        // Give the panel a neat little layout

        panel.style.flexDirection = "column";
        panel.style.gap = "10px";

        messageElement.style.margin = "0";

        viewButton.style.padding = "7px 10px";
        viewButton.style.border = "1px solid currentColor";
        viewButton.style.borderRadius = "20px";
        viewButton.style.background = "transparent";
        viewButton.style.color = "inherit";
        viewButton.style.fontFamily = "Arial, sans-serif";
        viewButton.style.fontSize = "9px";
        viewButton.style.letterSpacing = "1px";
        viewButton.style.cursor = "pointer";

        // Open the enlarged photo when this button is clicked

        viewButton.addEventListener("click", (event) => {

            event.stopPropagation();

            openPhotoLightbox(photo);

        });

    }

    return card;

}


// CLICK PHOTO TO OPEN OR CLOSE ITS NOTE

galleryPhotos.forEach(photo => {

    photo.addEventListener("click", (event) => {

        event.stopPropagation();

        const card = createPhotoNote(photo);

        if (!card) {
            return;
        }

        const isAlreadyOpen =
            card.classList.contains("photo-note-open");

        closeAllPhotoNotes(card);

        if (isAlreadyOpen) {

            card.classList.remove("photo-note-open");

        } else {

            card.classList.add("photo-note-open");

        }

    });

});


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

        contractError.textContent =
            "Please enter your name first.";

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
// MOVE FROM LETTER TO REVIEW
// ==========================================

closeFeelings.addEventListener("click", () => {

    document.getElementById("reviewSection").scrollIntoView({

        behavior: "smooth",
        block: "start"

    });

});


// ==========================================
// EXPERIENCE REVIEW: STAR RATING
// ==========================================

let selectedRating = 0;

const ratingMessages = {

    1: "We'll pretend we didn't see that. 😭",
    2: "Room for improvement. Management is listening.",
    3: "Not bad! We'll take it.",
    4: "A pretty good experience, apparently. ♡",
    5: "PERFECTION. Management is emotional. 🏆"

};


// HANDLE STAR CLICKS

starButtons.forEach(button => {

    button.addEventListener("click", () => {

        selectedRating = Number(button.dataset.rating);

        starButtons.forEach(star => {

            const starRating = Number(star.dataset.rating);

            if (starRating <= selectedRating) {

                star.style.color = "#e3b951";
                star.style.transform = "scale(1.15)";

            } else {

                star.style.color = "";
                star.style.transform = "scale(1)";

            }

        });

        ratingDescription.textContent =
            ratingMessages[selectedRating];

        reviewError.textContent = "";

    });

});


// ==========================================
// EXPERIENCE REVIEW: SUBMIT
// ==========================================

submitReview.addEventListener("click", () => {

    // Rating is the only required answer

    if (selectedRating === 0) {

        reviewError.textContent =
            "You forgot to give us a rating! Management is waiting. :(";

        return;

    }

    // Get the selected favorite moment

    const favoriteChoice =
        document.querySelector('input[name="favoriteMoment"]:checked');

    // Get the selected answer for doing it again

    const againChoice =
        document.querySelector('input[name="again"]:checked');

    // Get written feedback

    const feedback = reviewFeedback.value.trim();

    // Fill in the receipt

    receiptRating.textContent =
        `${selectedRating} / 5 stars`;

    receiptFavorite.textContent =
        favoriteChoice
            ? favoriteChoice.value
            : "No answer provided.";

    receiptAgain.textContent =
        againChoice
            ? againChoice.value
            : "No answer provided.";

    receiptFeedback.textContent =
        feedback !== ""
            ? feedback
            : "No additional comments.";

    // Hide the form and show the receipt

    reviewError.textContent = "";

    reviewPaper.style.display = "none";

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

    finishReview.style.cursor = "default";
    finishReview.style.opacity = "0.7";

    finalLine.scrollIntoView({

        behavior: "smooth",
        block: "center"

    });

});


// ==========================================
// INITIAL WEBSITE SETTINGS
// ==========================================

selectSong("yellow");
