
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


// SELECT A SONG

function selectSong(songName) {

    if (!songs[songName]) {
        return;
    }

    const wasPlaying = !musicAudio.paused;

    currentSong = songName;

    // Update selected song button

    songButtons.forEach(button => {

        button.classList.remove("active");

        if (button.dataset.song === songName) {
            button.classList.add("active");
        }

    });

    // Change website theme

    document.body.classList.remove(
        "yellow-theme",
        "toothbrush-theme"
    );

    document.body.classList.add(songs[songName].theme);

    // Change audio source

    const newSource = songs[songName].source;

    if (!musicAudio.src.endsWith(newSource)) {

        musicAudio.src = newSource;

        musicAudio.load();

    }

    // Update player status

    if (songName === "yellow") {

        playerStatus.textContent = "A little sunshine for you. ☀";

    } else {

        playerStatus.textContent = "A little something different. ✿";

    }

    // Continue playing if music was already playing

    if (wasPlaying) {

        musicAudio.play().catch(() => {

            playerStatus.textContent = "Press play to continue.";

        });

    }

}


// SONG BUTTON EVENTS

songButtons.forEach(button => {

    button.addEventListener("click", () => {

        const selectedSong = button.dataset.song;

        selectSong(selectedSong);

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

    // Create sunshine animation

    const sunshine = document.createElement("div");

    sunshine.classList.add("sunshine");

    sunshine.style.left = event.clientX + "px";
    sunshine.style.top = event.clientY + "px";

    document.body.appendChild(sunshine);

    // Start animation

    requestAnimationFrame(() => {

        sunshine.classList.add("expand");

    });

    // Prevent multiple clicks

    openingScreen.style.pointerEvents = "none";

    // Reveal birthday screen and music player

    setTimeout(() => {

        openingScreen.style.display = "none";

        birthdayScreen.style.display = "flex";

        musicPlayer.classList.add("visible");

        // Remove transition element

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
// PHOTO LIGHTBOX
// ==========================================

const galleryPhotos = document.querySelectorAll(".gallery-photo");


// OPEN PHOTO

galleryPhotos.forEach(photo => {

    photo.addEventListener("click", () => {

        lightboxImage.src = photo.src;

        lightboxImage.alt = photo.alt;

        const caption = photo.nextElementSibling;

        if (caption && caption.tagName === "P") {

            lightboxCaption.textContent = caption.textContent;

        } else {

            lightboxCaption.textContent = "";

        }

        lightbox.classList.add("active");

    });

});


// CLOSE PHOTO

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

    }

});


// ==========================================
// 4LIFERS CONTRACT SIGNING
// ==========================================

signContract.addEventListener("click", () => {

    const name = signerName.value.trim();

    // Check if name was entered

    if (name === "") {

        contractError.textContent = "Please enter your name first.";

        signerName.focus();

        return;

    }

    // Check if agreement was accepted

    if (!agreeContract.checked) {

        contractError.textContent =
            "You must agree to the 4Lifers terms first. :(";

        return;

    }

    // Clear error message

    contractError.textContent = "";

    // Display signed name

    certificateName.textContent = name;

    // Update optional clause status

    if (moreOption.checked) {

        futureStatus.textContent =
            "FUTURE POSSIBILITIES: OPEN TO EXPLORING ♡";

    } else {

        futureStatus.textContent =
            "FUTURE POSSIBILITIES: PENDING";

    }

    // Hide signing form

    contractSigning.style.display = "none";

    // Reveal certificate

    contractCertificate.classList.add("show");

    // Scroll to certificate

    contractCertificate.scrollIntoView({

        behavior: "smooth",

        block: "center"

    });

});


// ==========================================
// INTERACTIVE ENVELOPE
// ==========================================

// OPEN THE ENVELOPE

openLetter.addEventListener("click", () => {

    // Prevent reopening

    if (openLetter.classList.contains("is-open")) {

        return;

    }

    // Play envelope opening animation

    openLetter.classList.add("is-open");

    // Update accessibility state

    openLetter.setAttribute("aria-expanded", "true");

    // Update envelope hint

    envelopeHint.textContent = "YOUR NOTE IS OPEN ♡";

    // Reveal the letter

    messageLetter.hidden = false;

    // Scroll to the revealed letter

    setTimeout(() => {

        messageLetter.scrollIntoView({

            behavior: "smooth",

            block: "center"

        });

    }, 450);

});


// ==========================================
// FINAL LITTLE MESSAGE
// ==========================================

// CLICK THE FEELINGS BUTTON

closeFeelings.addEventListener("click", () => {

    // Reveal the final message

    finalLine.hidden = false;

    // Change button text

    closeFeelings.textContent =
        "EMOTIONAL DAMAGE: MINIMAL ✓";

    // Disable button after clicking

    closeFeelings.disabled = true;

    closeFeelings.style.cursor = "default";

    closeFeelings.style.opacity = "0.7";

    // Scroll to final message

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

// Select the default song and theme

selectSong("yellow");

