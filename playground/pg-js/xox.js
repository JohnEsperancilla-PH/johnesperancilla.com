document.addEventListener("DOMContentLoaded", () => {
    const cells = document.querySelectorAll('.cell');
    const resetButton = document.getElementById('reset');
    const themeToggleButton = document.getElementById('theme-toggle');
    const boardSizeButtons = document.querySelectorAll('.board-size-button');
    const currentPlayerDisplay = document.getElementById('current-player');
    const aiMessage = document.getElementById('ai-message');
    const resultModal = document.createElement('div');
    const modalContent = document.createElement('div');
    const boardElement = document.getElementById('board');
    let board = [];
    let currentPlayer = 'X';
    let boardSize = 3;

    function updateCurrentPlayer() {
        currentPlayerDisplay.textContent = `Current Player: ${currentPlayer}`;
    }

    function toggleTheme() {
        document.body.classList.toggle('light-mode');
    }

    themeToggleButton.addEventListener('click', toggleTheme);

    function resetBoard() {
        board = Array(boardSize * boardSize).fill(null);
        renderBoard();
        currentPlayer = 'X';
        updateCurrentPlayer();
        aiMessage.textContent = '';
        resultModal.style.display = 'none';
    }

    resetButton.addEventListener('click', resetBoard);

    function renderBoard() {
        boardElement.innerHTML = '';
        boardElement.style.setProperty('--grid-size', boardSize);
        boardElement.style.gridTemplateColumns = `repeat(${boardSize}, 1fr)`;
        board.forEach((_, index) => {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.index = index;
            cell.addEventListener('click', handleClick);
            boardElement.appendChild(cell);
        });
    }

    function checkWinner() {
        const winningCombos = generateWinningCombos(boardSize);
        for (let combo of winningCombos) {
            const [a, b, c, d, e] = combo;
            if (board[a] && board[a] === board[b] && board[a] === board[c] && (d === undefined || board[a] === board[d]) && (e === undefined || board[a] === board[e])) {
                return board[a];
            }
        }
        return board.includes(null) ? null : 'Tie';
    }

    function generateWinningCombos(size) {
        const combos = [];

        // Rows and columns
        for (let i = 0; i < size; i++) {
            const row = [];
            const col = [];
            for (let j = 0; j < size; j++) {
                row.push(i * size + j);
                col.push(j * size + i);
            }
            combos.push(row);
            combos.push(col);
        }

        // Diagonals
        const diag1 = [];
        const diag2 = [];
        for (let i = 0; i < size; i++) {
            diag1.push(i * size + i);
            diag2.push(i * size + (size - i - 1));
        }
        combos.push(diag1);
        combos.push(diag2);

        return combos;
    }

    function randomMove() {
        const emptyCells = board.map((cell, index) => cell === null ? index : null).filter(index => index !== null);
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        return emptyCells[randomIndex];
    }

    function showResult(message) {
        modalContent.textContent = message;
        resultModal.style.display = 'block';
    }

    function handleAI() {
        aiMessage.textContent = 'AI is thinking...';
        const delay = Math.random() * 1000 + 500;

        setTimeout(() => {
            const aiMove = randomMove();
            board[aiMove] = 'O';
            document.querySelector(`.cell[data-index='${aiMove}']`).textContent = 'O';
            aiMessage.textContent = '';

            const winner = checkWinner();
            if (winner) {
                showResult(winner === 'Tie' ? 'It\'s a Tie!' : `${winner} wins!`);
            } else {
                currentPlayer = 'X';
                updateCurrentPlayer();
            }
        }, delay);
    }

    function handleClick(event) {
        const index = event.target.dataset.index;
        if (board[index] === null && currentPlayer === 'X') {
            board[index] = 'X';
            event.target.textContent = 'X';
            const winner = checkWinner();
            if (winner) {
                showResult(winner === 'Tie' ? 'It\'s a Tie!' : `${winner} wins!`);
                return;
            }
            currentPlayer = 'O';
            updateCurrentPlayer();
            handleAI();
        }
    }

    boardSizeButtons.forEach(button => {
        button.addEventListener('click', () => {
            boardSize = parseInt(button.dataset.size);
            resetBoard();
        });
    });

    // Create and style result modal
    resultModal.style.position = 'fixed';
    resultModal.style.top = '50%';
    resultModal.style.left = '50%';
    resultModal.style.transform = 'translate(-50%, -50%)';
    resultModal.style.backgroundColor = '#333';
    resultModal.style.color = '#00ff00';
    resultModal.style.padding = '20px';
    resultModal.style.borderRadius = '5px';
    resultModal.style.display = 'none';
    resultModal.style.zIndex = '1000';
    document.body.appendChild(resultModal);
    resultModal.appendChild(modalContent);

    resetBoard();
});
