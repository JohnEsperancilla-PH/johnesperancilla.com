document.addEventListener("DOMContentLoaded", () => {
    const resetButton = document.getElementById('reset');
    const themeToggleButton = document.getElementById('theme-toggle');
    const currentPlayerDisplay = document.getElementById('current-player');
    const aiMessage = document.getElementById('ai-message');
    const boardElement = document.getElementById('board');
    const greenScoreDisplay = document.getElementById('green-score');
    const whiteScoreDisplay = document.getElementById('white-score');
    let board = Array(64).fill(null);
    let currentPlayer = 'green';

    // Initialize the board
    function initBoard() {
        board[27] = 'white';
        board[28] = 'green';
        board[35] = 'green';
        board[36] = 'white';
    }

    // Update the current player display
    function updateCurrentPlayer() {
        currentPlayerDisplay.textContent = `Current Player: ${currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)}`;
    }

    // Toggle theme between light and dark mode
    function toggleTheme() {
        document.body.classList.toggle('light-mode');
    }

    themeToggleButton.addEventListener('click', toggleTheme);

    // Reset the board
    function resetBoard() {
        board.fill(null);
        initBoard();
        renderBoard();
        currentPlayer = 'green';
        updateCurrentPlayer();
        aiMessage.textContent = '';
        updateScore();
        lastPlacedDisk = null; // Reset last placed disk
    }

    // Render the board
    function renderBoard() {
        boardElement.innerHTML = '';
        board.forEach((cell, index) => {
            const cellElement = document.createElement('div');
            cellElement.classList.add('cell');
            cellElement.dataset.index = index;
            cellElement.addEventListener('click', handleClick);
            if (cell) {
                const diskElement = document.createElement('div');
                diskElement.classList.add('disk', cell);

                cellElement.appendChild(diskElement);
            }
            boardElement.appendChild(cellElement);
        });
    }

    // Check for valid moves
    function getValidMoves(player) {
        const validMoves = [];
        const opponent = player === 'green' ? 'white' : 'green';
        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1], [0, 1],
            [1, -1], [1, 0], [1, 1]
        ];

        board.forEach((cell, index) => {
            if (cell === null) {
                for (let [dx, dy] of directions) {
                    let x = index % 8 + dx;
                    let y = Math.floor(index / 8) + dy;
                    let foundOpponent = false;

                    while (x >= 0 && x < 8 && y >= 0 && y < 8) {
                        const otherIndex = y * 8 + x;
                        if (board[otherIndex] === null) {
                            break;
                        } else if (board[otherIndex] === opponent) {
                            foundOpponent = true;
                        } else if (foundOpponent && board[otherIndex] === player) {
                            validMoves.push(index);
                            break;
                        } else {
                            break;
                        }
                        x += dx;
                        y += dy;
                    }
                }
            }
        });

        return validMoves;
    }

    // Make a move and flip the discs
    function makeMove(index, player) {
        const opponent = player === 'green' ? 'white' : 'green';
        board[index] = player;

        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1], [0, 1],
            [1, -1], [1, 0], [1, 1]
        ];

        for (let [dx, dy] of directions) {
            let x = index % 8 + dx;
            let y = Math.floor(index / 8) + dy;
            let toFlip = [];

            while (x >= 0 && x < 8 && y >= 0 && y < 8) {
                const otherIndex = y * 8 + x;
                if (board[otherIndex] === null) {
                    break;
                } else if (board[otherIndex] === opponent) {
                    toFlip.push(otherIndex);
                } else if (toFlip.length > 0 && board[otherIndex] === player) {
                    toFlip.forEach(indexToFlip => {
                        board[indexToFlip] = player;
                    });
                    break;
                } else {
                    break;
                }
                x += dx;
                y += dy;
            }
        }

        lastPlacedDisk = player; // Set the last placed disk to the current player
    }

    // Update the score display
    function updateScore() {
        const greenCount = board.filter(cell => cell === 'green').length;
        const whiteCount = board.filter(cell => cell === 'white').length;
        greenScoreDisplay.textContent = `Green: ${greenCount}`;
        whiteScoreDisplay.textContent = `White: ${whiteCount}`;
    }

    // Handle AI's turn with a delay
    function handleAI() {
        aiMessage.textContent = 'AI is thinking...';
        const delay = Math.random() * 1000 + 500;

        setTimeout(() => {
            const validMoves = getValidMoves('white');

            if (validMoves.length === 0) {
                currentPlayer = 'green';
                updateCurrentPlayer();
                aiMessage.textContent = '';
                updateScore();
                return;
            }

            // Aggressive AI: Choose the move that flips the most disks
            let bestMove = null;
            let maxFlipped = 0;
            for (let move of validMoves) {
                const flipped = getFlippedDisks(move, 'white');
                if (flipped.length > maxFlipped) {
                    bestMove = move;
                    maxFlipped = flipped.length;
                }
            }

            makeMove(bestMove, 'white');
            renderBoard();

            const winner = checkWinner();
            if (winner) {
                showResult(winner === 'Tie' ? 'It\'s a Tie!' : `${winner.charAt(0).toUpperCase() + winner.slice(1)} wins!`);
            } else {
                currentPlayer = 'green';
                updateCurrentPlayer();
            }
            aiMessage.textContent = '';
            updateScore();
        }, delay);
    }

    // Handle player's click
    function handleClick(event) {
        const index = event.target.dataset.index;
        const validMoves = getValidMoves(currentPlayer);
        if (validMoves.includes(parseInt(index))) {
            makeMove(parseInt(index), currentPlayer);
            renderBoard();
            const winner = checkWinner();
            if (winner) {
                showResult(winner === 'Tie' ? 'It\'s a Tie!' : `${winner.charAt(0).toUpperCase() + winner.slice(1)} wins!`);
                return;
            }
            currentPlayer = currentPlayer === 'green' ? 'white' : 'green';
            updateCurrentPlayer();
            updateScore();
            handleAI();
        }
    }

    // Get the disks that will be flipped for a given move
    function getFlippedDisks(index, player) {
        const opponent = player === 'green' ? 'white' : 'green';
        const flipped = [];

        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1], [0, 1],
            [1, -1], [1, 0], [1, 1]
        ];

        for (let [dx, dy] of directions) {
            let x = index % 8 + dx;
            let y = Math.floor(index / 8) + dy;
            let foundOpponent = false;

            while (x >= 0 && x < 8 && y >= 0 && y < 8) {
                const otherIndex = y * 8 + x;
                if (board[otherIndex] === null) {
                    break;
                } else if (board[otherIndex] === opponent) {
                    foundOpponent = true;
                    flipped.push(otherIndex);
                } else if (foundOpponent && board[otherIndex] === player) {
                    break;
                } else {
                    break;
                }
                x += dx;
                y += dy;
            }
        }

        return flipped;
    }

    // Check for the winner
    function checkWinner() {
        const greenCount = board.filter(cell => cell === 'green').length;
        const whiteCount = board.filter(cell => cell === 'white').length;
        if (greenCount + whiteCount === 64) {
            return greenCount > whiteCount ? 'green' : whiteCount > greenCount ? 'white' : 'Tie';
        }
        return null;
    }

    // Show the result
    function showResult(message) {
        const resultModal = document.createElement('div');
        resultModal.style.position = 'fixed';
        resultModal.style.top = '50%';
        resultModal.style.left = '50%';
        resultModal.style.transform = 'translate(-50%, -50%)';
        resultModal.style.backgroundColor = '#333';
        resultModal.style.color = '#00ff00';
        resultModal.style.padding = '20px';
        resultModal.style.borderRadius = '5px';
        resultModal.style.display = 'block';
        resultModal.style.zIndex = '1000';
        resultModal.textContent = message;
        document.body.appendChild(resultModal);
    }

    resetButton.addEventListener('click', resetBoard);

    resetBoard();
});
