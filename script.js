const GRID_SIZE = 8;
const MINE_COUNT = 10;

let board = [];
let revealed = [];
let gameOver = false;

function initGame() {
  board = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0));
  revealed = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(false));
  gameOver = false;

  placeMines();
  calculateNumbers();
  renderBoard();
}

function placeMines() {
  let placed = 0;
  while (placed < MINE_COUNT) {
    const r = Math.floor(Math.random() * GRID_SIZE);
    const c = Math.floor(Math.random() * GRID_SIZE);
    if (board[r][c] !== "M") {
      board[r][c] = "M";
      placed++;
    }
  }
}

function calculateNumbers() {
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (board[r][c] === "M") continue;

      let count = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr;
          const nc = c + dc;
          if (
            nr >= 0 &&
            nr < GRID_SIZE &&
            nc >= 0 &&
            nc < GRID_SIZE &&
            board[nr][nc] === "M"
          ) {
            count++;
          }
        }
      }
      board[r][c] = count;
    }
  }
}

function revealCell(r, c) {
  if (revealed[r][c] || gameOver) return;

  revealed[r][c] = true;

  if (board[r][c] === "M") {
    alert("Game Over");
    gameOver = true;
    return;
  }

  renderBoard();
}

function renderBoard() {
  const grid = document.getElementById("grid");
  grid.innerHTML = "";

  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const cell = document.createElement("div");
      cell.className = "cell";

      if (revealed[r][c]) {
        cell.classList.add("revealed");
        if (board[r][c] !== 0) {
          cell.textContent = board[r][c];
        }
      }

      cell.addEventListener("click", () => revealCell(r, c));
      grid.appendChild(cell);
    }
  }
}

/* -------- AI EXPLANATION LOGIC -------- */

function explainMove() {
  // Try to explain any revealed numbered cell
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (revealed[r][c]) {
        if (board[r][c] > 0) {
          showExplanation(
            "AI Reasoning",
            `This tile shows the number ${board[r][c]}, meaning exactly ${board[r][c]} mine(s) exist in the surrounding eight tiles. The AI uses this constraint to reason about safe and risky moves.`
          );
          return;
        }
      }
    }
  }

  // If no numbered tiles exist yet
  showExplanation(
    "Early Game Strategy",
    "No numbered tiles are revealed yet. In Minesweeper, early moves rely on spreading out to uncover numbers that enable logical deductions."
  );
}

