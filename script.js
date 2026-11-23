
// GET WEBSITE ELEMENTS

const openingScreen = document.getElementById("openingScreen");
const birthdayScreen = document.getElementById("birthdayScreen");

const musicPlayer = document.getElementById("musicPlayer");
const musicAudio = document.getElementById("musicAudio");
const playMusic = document.getElementById("playMusic");

const playerStatus = document.getElementById("playerStatus");
const songButtons = document.querySelectorAll(".song-button");

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCaption = document.getElementById("lightboxCaption");
const closeLightbox = document.getElementById("closeLightbox");


// SONG INFORMATION
// The actual song names are kept out of the visible player.

const songs = {

    yellow: {
        file: "music/yellow.mp3",
        theme: "yellow-theme"
    },

    toothbrush: {
        file: "music/toothbrush.mp3",
        theme: "toothbrush-theme"
    }

};

let currentSong = "yellow";


// CHANGE SONG AND WEBSITE THEME

function selectSong(songName) {

    const song = songs[songName];

    if (!song) {
        return;
    }

    const wasPlaying = !musicAudio.paused;

    currentSong = songName;

    // Update selected button

    songButtons.forEach(function(button) {

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

    document.body.classList.add(song.theme);

    // Load selected song

    musicAudio.pause();

    musicAudio.src = song.file;
    musicAudio.load();

    playMusic.textContent = "▶";

    playerStatus.textContent = "Your choice, your soundtrack.";

    // Continue playing if the previous song was playing

    if (wasPlaying) {

        musicAudio.play().then(function() {

            playMusic.textContent = "Ⅱ";
            playerStatus.textContent = "Playing your pick...";

        }).catch(function(error) {

            console.log("Playback could not start:", error);

            playerStatus.textContent = "Press play when you're ready.";

        });

    }

}


// SONG SELECTION BUTTONS

songButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        selectSong(button.dataset.song);

    });

});


// PLAY AND PAUSE BUTTON

playMusic.addEventListener("click", function() {

    if (musicAudio.paused) {

        musicAudio.play().then(function() {

            playMusic.textContent = "Ⅱ";
            playerStatus.textContent = "Playing your pick...";

        }).catch(function(error) {

            console.log("Unable to play audio:", error);

            playMusic.textContent = "▶";
            playerStatus.textContent = "Couldn't load the song. Check the file.";

        });

    } else {

        musicAudio.pause();

        playMusic.textContent = "▶";
        playerStatus.textContent = "Paused. Take your time.";

    }

});


// AUDIO PLAYBACK EVENTS

musicAudio.addEventListener("play", function() {
    playMusic.textContent = "Ⅱ";
});

musicAudio.addEventListener("pause", function() {
    playMusic.textContent = "▶";
});


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

    // Expand the sunshine circle

    requestAnimationFrame(function() {
        sunshine.classList.add("expand");
    });

    // Reveal birthday section and music player

    setTimeout(function() {

        openingScreen.style.display = "none";

        birthdayScreen.style.display = "flex";

        sunshine.remove();

        // Reveal music player after transition

        musicPlayer.classList.add("visible");

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


// INITIALIZE DEFAULT SONG

selectSong("yellow");
