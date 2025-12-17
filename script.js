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
  let explained = false;

  for (let r = 0; r < GRID_SIZE && !explained; r++) {
    for (let c = 0; c < GRID_SIZE && !explained; c++) {
      if (revealed[r][c] && board[r][c] > 0) {
        let unrevealed = [];

        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr;
            const nc = c + dc;
            if (
              nr >= 0 &&
              nr < GRID_SIZE &&
              nc >= 0 &&
              nc < GRID_SIZE &&
              !revealed[nr][nc]
            ) {
              unrevealed.push([nr, nc]);
            }
          }
        }

        if (unrevealed.length === board[r][c]) {
          showExplanation(
            "Risky Area",
            "This number matches the count of adjacent unrevealed tiles, so one of them is likely a mine."
          );
        } else if (unrevealed.length > board[r][c]) {
          showExplanation(
            "Constrained Area",
            "This numbered tile limits how mines can be placed nearby. Some adjacent tiles are safer than others."
          );
        } else {
          showExplanation(
            "Logical Constraint",
            "This tile shows how nearby unrevealed tiles are constrained by the number displayed."
          );
        }

        explained = true;
      }
    }
  }

  if (!explained) {
    showExplanation(
      "Early Game Insight",
      "Not enough information yet. Revealing tiles away from clusters can help uncover useful numbers."
    );
  }
}


