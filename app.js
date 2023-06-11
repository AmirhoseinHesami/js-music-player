const playPauseBtn = document.querySelector("#play-pause");
const nextBtn = document.querySelector("#next");
const previousBtn = document.querySelector("#previous");
const music = document.querySelector("#music");
const volumeValue = document.querySelector("#volume");
const demo = document.querySelector("#demo");
const progress = document.querySelector(".progress");
const progressContainer = document.querySelector(".progress-container");
const endTime = document.querySelector("#end-time");
const current = document.querySelector(".current");
const shuffle = document.querySelector("#shuffle");
const repeat = document.querySelector("#repeat");
const nightMode = document.querySelector(".night-mode");
const fileInput = document.getElementById("fileInput");
const body = document.body;
const removeBtn = document.querySelector(".remove");

let songs = [];
let newAudio = new Audio();
let currentSong = 0;
newAudio.volume = 0.5;
let firstLoad = true;

fileInput.addEventListener("change", function () {
  songs = songs.concat([...fileInput.files]);

  if (firstLoad && songs.length > 0) {
    changeSong();
    firstLoad = false;
    removeBtn.classList.add("open");
  }

  songs.length > 0
    ? (current.textContent = `${currentSong + 1} / ${songs.length}`)
    : null;
});

function playPuaseFunctionality() {
  if (newAudio.paused && songs.length > 0) {
    newAudio.play();
    playPauseBtn.innerHTML = "||";
  } else {
    newAudio.pause();
    playPauseBtn.innerHTML = "▶";
  }
}

playPauseBtn.addEventListener("click", function () {
  playPuaseFunctionality();
});

function formatSongName(name, size) {
  // Remove the file extension and these (- _ .) characters
  const formatted = name
    .substr(0, name.lastIndexOf("."))
    .replace(/[-_.]/g, " ");
  return formatted.slice(0, size);
}

function changeSong() {
  playPauseBtn.innerHTML = "||";
  current.innerHTML = `${currentSong + 1} / ${songs.length}`;
  // newAudio.src = songs[currentSong].path;
  newAudio.src = URL.createObjectURL(songs[currentSong]);
  music.innerHTML = `${formatSongName(songs[currentSong].name, 65)}`;

  document.title = formatSongName(songs[currentSong].name, 30);

  newAudio.load();
  newAudio.play();
  // newAudio.playbackRate = 2;
}

function nextSong() {
  currentSong++;

  if (currentSong > songs.length - 1) {
    currentSong = 0;
  }
  changeSong();
}

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

nextBtn.addEventListener("click", function () {
  if (songs.length <= 1) return;
  nextSong();
});

function backToPreviousSong() {
  if (songs.length <= 1) return;
  currentSong--;

  if (currentSong < 0) {
    currentSong = songs.length - 1;
  }
  changeSong();
}

previousBtn.addEventListener("click", function () {
  backToPreviousSong();
});

volumeValue.addEventListener("input", function () {
  newAudio.volume = this.value;
  demo.innerHTML = this.value * 100;
});

newAudio.addEventListener("timeupdate", function () {
  let percent = (newAudio.currentTime / newAudio.duration) * 100;
  progress.style.width = percent + "%";
  if (percent >= 100 && songs.length >= 1) nextSong();
});

newAudio.addEventListener("loadeddata", function () {
  let totalDuration = Math.floor(newAudio.duration % (60 * 60));
  let minutes = Math.floor(totalDuration / 60);
  let seconds = Math.floor(totalDuration % 60);

  endTime.innerHTML = `${String(minutes)
    .padStart(2, "0")
    .padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
});

progressContainer.addEventListener("click", function (e) {
  if (songs.length < 1) return;

  let progressWidth = e.offsetX;
  let progressPercent = (progressWidth / progressContainer.offsetWidth) * 100;
  progress.style.width = progressPercent + "%";
  newAudio.currentTime = (progressPercent / 100) * newAudio.duration;
  if (newAudio.paused) {
    newAudio.play();
    playPauseBtn.innerHTML = "||";
  }
});

shuffle.addEventListener("click", function () {
  if (songs.length <= 1) return;

  let newSong = randomNumber(0, songs.length - 1);

  while (newSong === currentSong) {
    newSong = randomNumber(0, songs.length - 1);
  }

  // TODO - FIXME : shuffle songs after the current one ends
  currentSong = newSong;
  // console.log(currentSong);
  changeSong();
});

repeat.addEventListener("click", function () {
  if (!newAudio.hasAttribute("loop")) {
    newAudio.setAttribute("loop", "");
    repeat.classList.add("active");
  } else {
    newAudio.removeAttribute("loop");
    repeat.classList.remove("active");
  }
});

nightMode.addEventListener("click", function () {
  if (document.body.className !== "dark") {
    document.body.classList.add("dark");
    nightMode.innerHTML = "🌞";
  } else {
    document.body.classList.remove("dark");
    nightMode.innerHTML = "🌙";
  }
});

// keyboard functionality
body.addEventListener("keyup", function (e) {
  if (e.key == " " || e.code == "Space") playPuaseFunctionality();
  else if (e.keyCode == "39" && songs.length > 1) nextSong();
  else if (e.keyCode == "37") backToPreviousSong();
  e.preventDefault();
});

removeBtn.addEventListener("click", function () {
  songs.splice(currentSong, 1);

  if (songs.length <= 0) {
    newAudio.pause();
    playPauseBtn.innerHTML = "▶";
    current.innerHTML = ``;
    newAudio.src = "";
    music.innerHTML = `...`;
    removeBtn.classList.remove("open");
    endTime.innerHTML = `00:00`;
    progress.style.width = 0;
    firstLoad = true;

    return;
  }

  if (currentSong == songs.length) currentSong = songs.length - 1;

  changeSong();
  current.innerHTML = `${currentSong + 1} / ${songs.length}`;
});
