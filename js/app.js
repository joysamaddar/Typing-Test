const words = document.querySelectorAll(".textarea");
const progressbar = document.querySelector(".words-progress");
const timer = document.querySelector(".time-box span");
const input = document.querySelector(".type-box");
const wpm = document.querySelector(".wpm span");
const keystrokes = document.querySelector(".keystrokes span");
const correct = document.querySelector(".correct span");
const wrong = document.querySelector(".wrong span");

let isRunning = false;
let wordsArray;
let currentWordNr = 0;
let keystrokesnr = 0;
let correctnr = 0;
let wrongnr = 0;
let wpmnr = 0;
let correctkeystrokes = 0;
let time;

//GET INITIAL WORDS ON GAME START FROM API
function getWords() {
  fetch("https://random-word-api.herokuapp.com/word?number=200")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      wordsArray = data;
      initialFill(wordsArray);
    });
}

//FILL INITIAL WORDS ON GAME START
function initialFill(wordsArray) {
  words.forEach((word, index) => {
    word.innerHTML = wordsArray[`${index - 2}`];
    if (word.innerHTML === "undefined") {
      word.innerHTML = "";
    }
    currentWordNr = index - 1;
  });
}

//LOAD WORDS ON PAGE LOAD
window.addEventListener("DOMContentLoaded", () => {
  getWords();
});

function wordsShiftLeft() {
  words.forEach((word, index, words) => {
    if (index <= 3) {
      word.innerHTML = words[index + 1].innerHTML;
    } else {
      word.innerHTML = wordsArray[currentWordNr];
      currentWordNr++;
    }
  });
}

//START GAME ON KEYPRESS
input.addEventListener("keyup", (e) => {
  if (!isRunning) {
    wpm.innerHTML = 0;
    keystrokes.innerHTML = 0;
    correct.innerHTML = 0;
    wrong.innerHTML = 0;
    time = 10;
    keystrokesnr = 0;
    correctnr = 0;
    wrongnr = 0;
    wpmnr = 0;
    correctkeystrokes = 0;
    let countdown = setInterval(() => {
      time--;
      timer.innerHTML = time;
      progressbar.style.width = `${(time / 10) * 100}%`;

      if (progressbar.style.width <= "20%") {
        progressbar.style.background = "rgb(236, 73, 73)";
      } else if (progressbar.style.width <= "50%") {
        progressbar.style.background = "yellow";
      }
      if (time == 0) {
        clearInterval(countdown);
        input.value = "";
        isRunning = false;
        getWords();
        input.style.background = "rgb(54, 54, 54)";
        input.style.color = "white";
        input.value = "Type to try again...";
        input.setAttribute("disabled", true);
        setTimeout(() => {
          input.style.background = "white";
          input.style.color = "black";
          input.value = "";
          timer.innerHTML = 60;
          input.removeAttribute("disabled");
          progressbar.style.width = "100%";
          progressbar.style.background = "rgb(60, 200, 60)";
        }, 2000);
      }
    }, 1000);
  }
  isRunning = true;
  if (
    !(
      e.code === "ShiftLeft" ||
      e.code === "CapsLock" ||
      e.code === "Backspace" ||
      e.code === "Enter" ||
      e.code === "ShiftRight"
    )
  ) {
    keystrokesnr++;
  }
  keystrokes.innerHTML = keystrokesnr;
  if (words[2].innerHTML.startsWith(input.value)) {
    input.style.background = "white";
    input.style.color = "black";
  } else {
    input.style.background = "rgb(236, 73, 73)";
    input.style.color = "white";
  }
  if (input.value.endsWith(" ")) {
    input.style.background = "white";
    input.style.color = "black";
    if (input.value === words[2].innerHTML + " ") {
      correctkeystrokes += input.value.length;
      correctnr++;
    } else {
      wrongnr++;
    }
    //WPM algo is not accurate
    wpmnr = Math.floor(correctkeystrokes / 5 - wrongnr);
    wpm.innerHTML = wpmnr;
    correct.innerHTML = correctnr;
    wrong.innerHTML = wrongnr;
    input.value = "";
    wordsShiftLeft();
  }
});
