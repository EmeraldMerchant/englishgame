let mode = new URLSearchParams(window.location.search).get("mode") || "1";
let data = {};
let word = "";
let revealed = [];
let guessedLetters = new Set();

const inputBox = document.getElementById("customInput");
console.log("Script loaded!");


inputBox.addEventListener("keydown", (e) => {
  let letter = e.key.toLowerCase();
  if (!letter.match(/^[a-z]$/)) return;

  inputBox.textContent = letter;
  let correct = false;

  if (!guessedLetters.has(letter)) {
    guessedLetters.add(letter);
    [...word].forEach((char, index) => {
      if (char === letter) {
        revealed[index] = letter;
        correct = true;
      }
    });
  }

  updateDisplay(letter, correct);

  if (revealed.join('') === word) {
    document.getElementById("chinese").textContent = data.chinese;
    document.getElementById("nextBtn").style.display = "inline-block";
  }
});

inputBox.addEventListener("click", () => {
  inputBox.focus();
});

document.getElementById("nextBtn").addEventListener("click", () => {
  window.location.href = "?mode=" + (parseInt(mode) + 1);
});

function updateDisplay(newLetter, correct) {
  console.log(`updated "${newLetter}"`)
  const container = document.getElementById("wordDisplay");
  container.innerHTML = "";

  for (let i = 0; i < word.length; i++) {
    let span = document.createElement("span");
    span.className = "letter";
    span.textContent = revealed[i] || "_";
    if (revealed[i] === newLetter && correct) {
      span.classList.add("recent");
      setTimeout(() => span.classList.remove("recent"), 2000);
    }
    container.appendChild(span);
  }

  // Apply color effect to input box text
  if (correct) {
    inputBox.style.color = "orange";
    setTimeout(() => inputBox.style.color = "white", 2000);
  } else {
    inputBox.style.color = "red"; // stays red for incorrect
  }
}

fetch("words.json")
  .then(res => res.json())
  .then(json => {
    if (!json[mode]) {
      mode = 1
    }
    data = json[mode];
    word = data.word.toLowerCase();
    revealed = Array(word.length).fill("");
    document.getElementById("wordImage").src = data.image;
    updateDisplay("", true);
    updateDisplay(" ", true);
  });
