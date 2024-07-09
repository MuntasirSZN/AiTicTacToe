// Helper function to check for a winner
function checkWinner(board, player) {
    for (let i = 0; i < 3; i++) {
        if (board[i].every(cell => cell === player) || board.every(row => row[i] === player)) {
            return true;
        }
    }
}

// Helper function to check if the board is full
function isBoardFull(board) {
    return board.flat().every(cell => cell !== " ");
}

// Minimax algorithm for AI move with depth consideration and logging
function minimax(board, depth, isMaximizing) {
    if (checkWinner(board, "X")) return -10 + depth;
    if (checkWinner(board, "O")) return 10 - depth;
    if (isBoardFull(board)) return 0;

    if (isMaximizing) {
        let maxEval = -Infinity;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === " ") {
                    board[i][j] = "O";
                    let eval = minimax(board, depth + 1, false);
                    board[i][j] = " ";
                    maxEval = Math.max(maxEval, eval);
                }
            }
        }
    } else {
        let minEval = Infinity;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === " ") {
                    board[i][j] = "X";
                    let eval = minimax(board, depth + 1, true);
                    board[i][j] = " ";
                    minEval = Math.min(minEval, eval);
                }
            }
        }
    }
}

// Find the best move for AI with logging
function bestMove(board) {
    let bestVal = -Infinity;
    let move = null;

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] === " ") {
                board[i][j] = "O";
                let moveVal = minimax(board, 0, false);
                board[i][j] = " ";
                if (moveVal > bestVal) {
                    bestVal = moveVal;
                    move = { i, j };
                }
            }
        }
    }
}

// Update the board UI
function updateBoard() {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            const cell = document.getElementById(`${i}-${j}`);
            cell.textContent = board[i][j];
            cell.className = `cell ${board[i][j].toLowerCase()}`;
        }
    }
}

// Reset the board
function resetBoard() {
    board = Array.from({ length: 3 }, () => Array(3).fill(" "));
    updateBoard();
}

// Make a move
function makeMove(event) {
    const cellId = event.target.id;
    const [row, col] = cellId.split('-').map(Number);
    if (board[row][col] === " ") {
        board[row][col] = "X";
        updateBoard();
        if (checkWinner(board, "X")) {
            alert("You win!");
            resetBoard();
        } else if (isBoardFull(board)) {
            alert("It's a draw!");
            resetBoard();
        } else {
            aiMove();
        }
    } else {
        alert("Invalid move");
    }
}

// AI makes a move
function aiMove() {
    const move = bestMove(board);
    if (move) {
        board[move.i][move.j] = "O";
        updateBoard();
        if (checkWinner(board, "O")) {
            alert("AI wins!");
            resetBoard();
        } else if (isBoardFull(board)) {
            alert("It's a draw!");
            resetBoard();
        }
    }
}

// Initialize the game
let board = Array.from({ length: 3 }, () => Array(3).fill(" "));
const gameBoard = document.getElementById("game-board");

for (let i = 0; i < 3; i++) {
    const row = document.createElement("div");
    row.className = "row";
    for (let j = 0; j < 3; j++) {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.id = `${i}-${j}`;
        cell.addEventListener("click", makeMove);
        row.appendChild(cell);
    }
    gameBoard.appendChild(row);
}

updateBoard();
