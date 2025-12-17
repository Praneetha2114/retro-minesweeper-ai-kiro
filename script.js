const GRID_SIZE = 8;
const MINE_COUNT = 10;

let board = [];
let revealed = [];
let gameOver = false;

function initGame() {
  board = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(0));
  revealed = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(false));
  gameOver = false;

  placeMines();
  calculateNumbers();
  renderBoard();
}

function placeMines() {
  let placed = 0;
  while (placed < MINE_COUNT) {
    let r = Math.floor(Math.random() * GRID_SIZE);
    let c = Math.floor(Math.random() * GRID_SIZE);
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
          let nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE) {
            if (board[nr][nc] === "M") count++;
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
        cell.textContent = board[r][c] === 0 ? "" : board[r][c];
      }
      cell.onclick = () => revealCell(r, c);
      grid.appendChild(cell);
    }
  }
}

/* ---------- AI LOGIC ---------- */

function explainMove() {
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (revealed[r][c] && board[r][c] > 0) {
        let unrevealed = [];

        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            let nr = r + dr, nc = c + dc;
            if (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE) {
              if (!revealed[nr][nc]) unrevealed.push([nr, nc]);
            }
          }
        }

        if (unrevealed.length === board[r][c]) {
          return showExplanation(
            "Risky Move",
            "This number equals the count of adjacent unrevealed tiles, so one of them is likely a mine."
          );
        }

        if (unrevealed.length > board[r][c]) {
          return showExplanation(
            "Likely Safe Area",
            "This tile shows a low number relative to its surrounding unrevealed tiles, making some nearby moves statistically safer."
          );
        }
      }
    }
  }

  showExplanation(
    "No Guaranteed Move",
    "There is no logically guaranteed safe or risky move yet. The AI recommends revealing tiles away from clustered numbers."
  );
}

function showExplanation(title, message) {
  document.getElementById("ai-title").textContent = title;
  document.getElementById("ai-text").textContent = message;
}

window.onload = initGame;

