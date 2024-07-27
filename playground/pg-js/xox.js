document.addEventListener("DOMContentLoaded", () => {
    const cells = document.querySelectorAll('.cell');
    const resetButton = document.getElementById('reset');
    const themeToggleButton = document.getElementById('theme-toggle');
    const difficultySelector = document.getElementById('difficulty');
    const currentPlayerDisplay = document.getElementById('current-player');
    const aiMessage = document.getElementById('ai-message');
    const resultModal = document.createElement('div');
    const modalContent = document.createElement('div');
    let board = Array(9).fill(null);
    const USER = 'X';
    const AI = 'O';
    let currentPlayer = USER;
    let difficulty = 'medium'; // Default difficulty

    function updateCurrentPlayer() {
        currentPlayerDisplay.textContent = `Current Player: ${currentPlayer}`;
    }

    function toggleTheme() {
        document.body.classList.toggle('light-mode');
    }

    themeToggleButton.addEventListener('click', toggleTheme);

    function resetBoard() {
        board.fill(null);
        cells.forEach(cell => cell.textContent = '');
        currentPlayer = USER;
        updateCurrentPlayer();
        aiMessage.textContent = '';  // Clear AI message on reset
        resultModal.style.display = 'none';  // Hide result modal
    }

    resetButton.addEventListener('click', resetBoard);

    function checkWinner(board) {
        const winningCombos = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        for (let combo of winningCombos) {
            const [a, b, c] = combo;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }

        return board.includes(null) ? null : 'Tie';
    }

    function minimax(board, depth, isMaximizing) {
        const winner = checkWinner(board);
        if (winner === USER) return -10 + depth;
        if (winner === AI) return 10 - depth;
        if (winner === 'Tie') return 0;

        const maxDepth = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 3 : 6;

        if (depth >= maxDepth) return 0;

        if (isMaximizing) {
            let maxEval = -Infinity;
            for (let i = 0; i < board.length; i++) {
                if (board[i] === null) {
                    board[i] = AI;
                    let eval = minimax(board, depth + 1, false);
                    board[i] = null;
                    maxEval = Math.max(maxEval, eval);
                }
            }
            return maxEval;
        } else {
            let minEval = Infinity;
            for (let i = 0; i < board.length; i++) {
                if (board[i] === null) {
                    board[i] = USER;
                    let eval = minimax(board, depth + 1, true);
                    board[i] = null;
                    minEval = Math.min(minEval, eval);
                }
            }
            return minEval;
        }
    }

    function bestMove() {
        let bestScore = -Infinity;
        let move;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === null) {
                board[i] = AI;
                let score = minimax(board, 0, false);
                board[i] = null;
                if (score > bestScore) {
                    bestScore = score;
                    move = i;
                }
            }
        }
        return move;
    }

    function showResult(message) {
        modalContent.textContent = message;
        resultModal.style.display = 'block';
    }

    function handleAI() {
        aiMessage.textContent = 'AI is thinking...';
        const delay = Math.random() * 1000 + 500;  // Random delay between 500ms and 1500ms

        setTimeout(() => {
            const aiMove = bestMove();
            board[aiMove] = AI;
            cells[aiMove].textContent = AI;
            aiMessage.textContent = '';

            const winner = checkWinner(board);
            if (winner) {
                showResult(winner === 'Tie' ? 'It\'s a Tie!' : `${winner} wins!`);
            } else {
                currentPlayer = USER;
                updateCurrentPlayer();
            }
        }, delay);
    }

    function handleClick(event) {
        const index = event.target.dataset.index;
        if (board[index] === null && currentPlayer === USER) {
            board[index] = USER;
            event.target.textContent = USER;
            const winner = checkWinner(board);
            if (winner) {
                showResult(winner === 'Tie' ? 'It\'s a Tie!' : `${winner} wins!`);
                return;
            }
            currentPlayer = AI;
            updateCurrentPlayer();
            handleAI();
        }
    }

    cells.forEach(cell => cell.addEventListener('click', handleClick));

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

    // Update difficulty on selection change
    difficultySelector.addEventListener('change', (event) => {
        difficulty = event.target.value;
        resetBoard(); // Reset the board when difficulty changes
    });

    updateCurrentPlayer();
});
