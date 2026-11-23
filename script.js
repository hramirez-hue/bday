
// GET WEBSITE ELEMENTS

const openingScreen = document.getElementById("openingScreen");
const birthdayScreen = document.getElementById("birthdayScreen");

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCaption = document.getElementById("lightboxCaption");
const closeLightbox = document.getElementById("closeLightbox");


// MUSIC PLAYER ELEMENTS

const musicAudio = document.getElementById("musicAudio");
const playMusic = document.getElementById("playMusic");

const songTitle = document.getElementById("songTitle");
const songArtist = document.getElementById("songArtist");
const musicMessage = document.getElementById("musicMessage");

const songButtons = document.querySelectorAll(".song-button");


// SONG INFORMATION

const songs = {

    yellow: {
        title: "Yellow",
        artist: "Coldplay",
        file: "music/yellow.mp3",
        theme: "yellow-theme",
        message: "This song reminds me of you."
    },

    toothbrush: {
        title: "Toothbrush",
        artist: "DANCE!",
        file: "music/toothbrush.mp3",
        theme: "toothbrush-theme",
        message: "A little something for a little fun."
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

    // Change the song information

    songTitle.textContent = song.title;
    songArtist.textContent = song.artist;
    musicMessage.textContent = song.message;

    // Change the active song button

    songButtons.forEach(function(button) {

        button.classList.remove("active");

        if (button.dataset.song === songName) {
            button.classList.add("active");
        }

    });

    // Change the website theme

    document.body.classList.remove(
        "yellow-theme",
        "toothbrush-theme"
    );

    document.body.classList.add(song.theme);

    // Load the selected song

    musicAudio.src = song.file;
    musicAudio.load();

    playMusic.textContent = "▶";

    // Keep playing if music was already playing

    if (wasPlaying) {

        musicAudio.play().then(function() {
            playMusic.textContent = "Ⅱ";
        }).catch(function(error) {
            console.log("Playback could not start:", error);
            playMusic.textContent = "▶";
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

        }).catch(function(error) {

            console.log("Unable to play audio:", error);

            playMusic.textContent = "▶";

            alert("The song couldn't play. Please check the music file.");

        });

    } else {

        musicAudio.pause();

        playMusic.textContent = "▶";

    }

});


// UPDATE BUTTON WHEN AUDIO STOPS

musicAudio.addEventListener("pause", function() {
    playMusic.textContent = "▶";
});

musicAudio.addEventListener("play", function() {
    playMusic.textContent = "Ⅱ";
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


// INITIALIZE DEFAULT SONG

selectSong("yellow");
