// Create library
let musicLibrary = [{band: 'nirvana', song: 'smells like teen spirit',}, {band: 'papa roach', song: 'last resort',}, {band: 'asking alexandria', song: 'into the fire',}];
let songNumber = 1;


const audio = document.querySelector('audio');
  audio.loadedmetadata = () => {
  }  

const songTitle = document.querySelector('.songTitle');

const playButton = document.querySelector('.playButton');
  playButton.dataset.status = 'inactive';

const pickup = document.querySelector('.pickup');
  pickup.dataset.status = 'inactive';
  let pickupMoveTimer;

const label = document.querySelector('.label');
const disk = document.querySelector('.disk'); 
  disk.dataset.status = 'unset';
const vinilla = document.querySelector('.disk img'); 

const moveLeft = document.querySelector('.collection__moveLeft');
const moveRight = document.querySelector('.collection__moveRight'); 

// Initiate timer and set first value
const timer = document.querySelector('.timer');
  let normalDuration, currentTime, normalCurrentTime;
  resetTimer ();
  let timerId;
  let listenerId;

label.onclick = () => {
  moveDisk ();
}

playButton.onclick = () => { 
  playAndPause ();
}

moveLeft.onclick = () => {
  if (songNumber > 1 && disk.dataset.status === 'unset') {
    songNumber--;
    showAndChangeArrowsStatus ();
    initiateSong();
  }
}

moveRight.onclick = () => {
  if (songNumber < musicLibrary.length && disk.dataset.status === 'unset') {
    songNumber++;
    showAndChangeArrowsStatus ();
    initiateSong();
  }
}

disk.onclick = (e) => {
  if (playButton.dataset.status === 'active') {
  let cursorPosition;

  console.log(e.clientY);
  
  // Очень важно, что проект не предусмотрен под response и функция перемотки может работать некорректно по Y 
  // на других разрешениях или мобильной версии

  if ((e.clientX-55) >= 0 && (e.clientX-55) <= 100) {
    cursorPosition = e.clientX-55;
  } else if ((e.clientX-55) >= 250 && (e.clientX-55) <= 350) {
    cursorPosition = ((e.clientX-55)-350)*(-1);
  } else if ((e.clientY-170) >= 0 && (e.clientY-170) <= 100) {
    cursorPosition = e.clientY-170;
  } else if ((e.clientY-170) >= 250 && (e.clientY-170) <= 350) {
    cursorPosition = ((e.clientY-170)-350)*(-1);
  }

  if (cursorPosition < 0) {
    cursorPosition = 0;
  } else if (cursorPosition > 100) {
    cursorPosition = 100;
  }

  let songPosition = Math.floor(Math.floor(audio.duration)*(cursorPosition/100));

  currentTime = songPosition;
  audio.currentTime = songPosition;
  timer.textContent = `${normalCurrentTime} / ${normalDuration}`;
  clearInterval(pickupMoveTimer);
  listenerId = setInterval (listener, 1000);
  changePickupPosition ();
  }

}


function playAndPause () {
  if (playButton.dataset.status === 'inactive' && disk.dataset.status === 'set') {
    switchPlayer ();

    pickup.dataset.status = 'play'
    changePickupPosition ();

    showTitle ();
    setTimeout(showTitle, 6000);
    
    timerId = setInterval (changeTime ,1000);

    listenerId = setInterval (listener, 1000);

    vinilla.classList.add('rotateDisk');

    audio.play();
  } else if (playButton.dataset.status === 'active') {
    switchPlayer ();
    
    clearInterval(timerId);

    clearInterval(pickupMoveTimer);

    vinilla.classList.remove('rotateDisk'); 

    audio.pause();
  } else {
    switchPlayer ();
  }
}

function stopMusic () {
  audio.pause();
  audio.currentTime = 0.0;
  currentTime = 0;
  songTitle.classList.remove('showSong');
  resetTimer ();
}

function moveDisk () {
  if (disk.dataset.status === 'unset') {
    disk.dataset.status = 'set';
    disk.classList.add('moveDisk');
    setTimer ();
  } else if (disk.dataset.status === 'set') {
    disk.dataset.status = 'unset';
    disk.classList.remove('moveDisk');
    
    stopMusic ();
    clearInterval(timerId);

    clearInterval(listenerId);

    clearInterval(pickupMoveTimer);
    pickup.dataset.status = 'inactive';
    changePickupPosition ();

    vinilla.classList.remove('rotateDisk'); 
  }
}

function normaliseTime (time) {
  time = Math.floor(time);
  let min = Math.floor(time/60);
    if (min < 10) {
      min = `0${min}`;
    }
  let sec = (time - min*60);
    if (sec < 10) {
      sec = `0${sec}`;
    }
  let notmalTimeFormat = `${min}.${sec}`;
  return notmalTimeFormat;
}

function changeTime () {
  currentTime++;
  normalCurrentTime = normaliseTime (currentTime);
  timer.textContent = `${normalCurrentTime} / ${normalDuration}`;
}

function initiateSong () {
  label.src = `img/${musicLibrary[songNumber-1].band}.jpg`;
  audio.src = `music/${musicLibrary[songNumber-1].band} - ${musicLibrary[songNumber-1].song}.mp3`;
  songTitle.textContent = `${musicLibrary[songNumber-1].band} - ${musicLibrary[songNumber-1].song}`;
}

function setTimer () {
  normalDuration = normaliseTime (audio.duration);
  currentTime = 0;
  normalCurrentTime = normaliseTime (currentTime);
  timer.textContent = `${normalCurrentTime} / ${normalDuration}`;
}

function resetTimer () {
  timer.textContent = `00.00 / 00.00`;
}

function listener () {
  if (currentTime === Math.floor(audio.duration)) {
    stopMusic ();

    clearInterval(timerId);
    setTimer ();

    switchPlayer ();

    vinilla.classList.remove('rotateDisk'); 

    clearInterval(pickupMoveTimer);
    pickup.dataset.status = 'startPosition';
    changePickupPosition ();

    clearInterval(listenerId);


  }
}

function switchPlayer () {
  if (playButton.dataset.status === 'inactive') {
    playButton.dataset.status = 'active';
    playButton.classList.add('playButton_active');
    timer.classList.add('timer_active');
  } else if (playButton.dataset.status === 'active') {
    playButton.dataset.status = 'inactive';
    playButton.classList.remove('playButton_active');
    timer.classList.remove('timer_active');
  }
}

function showAndChangeArrowsStatus () {
  if (songNumber === 1) {
    moveLeft.classList.add('inactiveArrow');
  } else if (songNumber > 1 && songNumber < musicLibrary.length) {
    moveLeft.classList.remove('inactiveArrow');
    moveRight.classList.remove('inactiveArrow');
  } else if (songNumber === musicLibrary.length) {
    moveRight.classList.add('inactiveArrow');
  }
}

function changePickupPosition () {
  if (pickup.dataset.status === 'inactive') {
    pickup.style.transform = 'rotate(0deg)';
    pickup.style.zIndex = '1';
  } else if (pickup.dataset.status === 'play' && disk.dataset.status === 'set') {
    pickup.style.zIndex = '3';
    movePickup ();
    pickupMoveTimer = setInterval(movePickup, 1000);
  } else if (pickup.dataset.status === 'startPosition') {
    pickup.style.zIndex = '3';
    pickup.style.transform = `rotate(15deg)`;
  }
}

function movePickup () {
  let degree = (15 + ( 17 * currentTime )/Math.floor(audio.duration));
  pickup.style.transform = `rotate(${degree}deg)`;
}

function showTitle () {
  songTitle.classList.toggle('showSong');
}