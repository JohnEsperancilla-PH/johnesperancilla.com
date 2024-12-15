const dailyWords = [
    'apple', 'brave', 'crane', 'dwarf', 'eagle', // Add 365 words here
    // ...
];

const today = new Date();
const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
const targetWord = dailyWords[dayOfYear];

let currentGuess = '';
let guesses = [];
const maxGuesses = 6;

const gameBoard = document.getElementById('game-board');
const themeToggle = document.getElementById('theme-toggle');

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light');
});

function createBoard() {
    gameBoard.innerHTML = '';
    for (let i = 0; i < maxGuesses; i++) {
        const row = document.createElement('div');
        for (let j = 0; j < 5; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            row.appendChild(cell);
        }
        gameBoard.appendChild(row);
    }
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        if (currentGuess.length === 5) {
            guesses.push(currentGuess);
            checkGuess();
            currentGuess = '';
        }
    } else if (event.key === 'Backspace') {
        currentGuess = currentGuess.slice(0, -1);
    } else if (currentGuess.length < 5 && /^[a-zA-Z]$/.test(event.key)) {
        currentGuess += event.key.toLowerCase();
    }
    updateBoard();
}

function checkGuess() {
    const row = gameBoard.children[guesses.length - 1];
    for (let i = 0; i < 5; i++) {
        const cell = row.children[i];
        const letter = currentGuess[i];
        if (targetWord[i] === letter) {
            cell.classList.add('correct');
        } else if (targetWord.includes(letter)) {
            cell.classList.add('present');
        } else {
            cell.classList.add('absent');
        }
        cell.textContent = letter;
    }
    if (currentGuess === targetWord) {
        alert('You guessed it!');
    } else if (guesses.length === maxGuesses) {
        alert(`The word was: ${targetWord}`);
    }
}

function updateBoard() {
    const row = gameBoard.children[guesses.length];
    for (let i = 0; i < 5; i++) {
        const cell = row.children[i];
        cell.textContent = currentGuess[i] || '';
    }
}

createBoard();
document.addEventListener('keydown', handleKeyPress);
