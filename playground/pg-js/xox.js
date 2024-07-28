document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById('container');
    const boardElement = document.getElementById('board');
    const resetButton = document.getElementById('reset');
    const themeToggleButton = document.getElementById('theme-toggle');
    const boardSizeButtons = document.querySelectorAll('.board-size-button');
    const currentPlayerDisplay = document.getElementById('current-player');
    const aiMessage = document.getElementById('ai-message');
    const resultModal = document.createElement('div');
    const modalContent = document.createElement('div');
    let board = [];
    const USER = 'X';
    const AI = 'O';
    let currentPlayer = USER;
    let boardSize = 3;
    let winCondition = 3;

    function updateCurrentPlayer() {
        currentPlayerDisplay.textContent = `Current Player: ${currentPlayer}`;
    }

    function toggleTheme() {
        document.body.classList.toggle('light-mode');
    }

    themeToggleButton.addEventListener('click', toggleTheme);

    function resetBoard() {
        console.log(`Resetting board for size: ${boardSize}`);
        board = Array(boardSize * boardSize).fill(null);
        boardElement.innerHTML = '';
        boardElement.style.gridTemplateColumns = `repeat(${boardSize}, 100px)`;
        boardElement.style.gridTemplateRows = `repeat(${boardSize}, 100px)`;
        for (let i = 0; i < board.length; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.index = i;
            cell.addEventListener('click', handleClick);
            boardElement.appendChild(cell);
        }
        currentPlayer = USER;
        updateCurrentPlayer();
        aiMessage.textContent = '';  // Clear AI message on reset
        resultModal.style.display = 'none';  // Hide result modal
        console.log(`Board reset completed for size: ${boardSize}`);
    }

    function checkWinner(board) {
        const lines = [];

        // Horizontal lines
        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j <= boardSize - winCondition; j++) {
                const line = [];
                for (let k = 0; k < winCondition; k++) {
                    line.push(i * boardSize + j + k);
                }
                lines.push(line);
            }
        }

        // Vertical lines
        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j <= boardSize - winCondition; j++) {
                const line = [];
                for (let k = 0; k < winCondition; k++) {
                    line.push(i + (j + k) * boardSize);
                }
                lines.push(line);
            }
        }

        // Diagonal lines
        for (let i = 0; i <= boardSize - winCondition; i++) {
            for (let j = 0; j <= boardSize - winCondition; j++) {
                const diagonal1 = [];
                const diagonal2 = [];
                for (let k = 0; k < winCondition; k++) {
                    diagonal1.push((i + k) * (boardSize + 1) + j);
                    diagonal2.push((i + k) * (boardSize - 1) + (boardSize - 1 - j));
                }
                lines.push(diagonal1, diagonal2);
            }
        }

        // Check lines for a win
        for (let line of lines) {
            if (line.every(index => board[index] && board[index] === board[line[0]])) {
                return board[line[0]];
            }
        }

        return board.includes(null) ? null : 'Tie';
    }

    function minimax(board, depth, isMaximizing, maxDepth) {
        const winner = checkWinner(board);
        if (winner === USER) return -10 + depth;
        if (winner === AI) return 10 - depth;
        if (winner === 'Tie') return 0;

        if (depth >= maxDepth) return 0;

        if (isMaximizing) {
            let maxEval = -Infinity;
            for (let i = 0; i < board.length; i++) {
                if (board[i] === null) {
                    board[i] = AI;
                    let eval = minimax(board, depth + 1, false, maxDepth);
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
                    let eval = minimax(board, depth + 1, true, maxDepth);
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
        const maxDepth = boardSize === 3 ? 6 : boardSize === 4 ? 4 : 2;

        // Randomness
        if (Math.random() < 0.8) {
            const availableMoves = board.reduce((acc, val, idx) => {
                if (val === null) acc.push(idx);
                return acc;
            }, []);
            move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
            console.log(`Random move for AI: ${move}`);
            return move;
        }

        for (let i = 0; i < board.length; i++) {
            if (board[i] === null) {
                board[i] = AI;
                let score = minimax(board, 0, false, maxDepth);
                board[i] = null;
                if (score > bestScore) {
                    bestScore = score;
                    move = i;
                }
            }
        }
        console.log(`Best move for AI: ${move}`);
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
            if (aiMove === undefined) {
                console.error('AI move is undefined');
                return;
            }
            board[aiMove] = AI;
            document.querySelector(`.cell[data-index='${aiMove}']`).textContent = AI;
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

    boardSizeButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            boardSize = parseInt(event.target.dataset.size);
            winCondition = boardSize;
            console.log(`Board size set to ${boardSize}`);
            console.log(`Win condition set to ${winCondition}`);
            resetBoard();
        });
    });

    resetButton.addEventListener('click', resetBoard);

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
