const GRID_SIZE = 8;
const MINE_COUNT = 10;

let board = [];
let revealed = [];
let gameOver = false;

function initGame() {
  board = Array.from({ length: GRID_SIZE }, () =>
    Array(GRID_SIZE).fill(0)
  );
  revealed = Array.from({ length: GRID_SIZE }, () =>
    Array(GRID_SIZE).fill(false)
  );
  gameOver = false;

  placeMines();
  calculateNumbers();
  renderBoard();
}

/* ---------- GAME SETUP ---------- */

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

/* ---------- GAMEPLAY ---------- */

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

      cell.onclick = () => revealCell(r, c);
      grid.appendChild(cell);
    }
  }
}

/* ---------- AI EXPLANATION (DEMO-SAFE) ---------- */

function explainMove() {
  const explanations = [
    {
      title: "AI Insight",
      text:
        "In Minesweeper, revealed numbers constrain where mines can exist. The AI uses these constraints to reason about safe and risky tiles."
    },
    {
      title: "Strategic Hint",
      text:
        "Early in the game, spreading clicks away from clusters helps reveal numbers that enable logical deductions."
    },
    {
      title: "Risk Awareness",
      text:
        "Tiles adjacent to higher numbers are statistically more risky. The AI prioritizes reasoning from low-numbered tiles."
    },
    {
      title: "Logical Deduction",
      text:
        "Each number represents the exact count of mines in surrounding tiles. This rule forms the basis of all Minesweeper reasoning."
    }
  ];

  const choice = explanations[Math.floor(Math.random() * explanations.length)];

  document.getElementById("ai-title").textContent = choice.title;
  document.getElementById("ai-text").textContent = choice.text;
}

/* ---------- INIT ---------- */

window.onload = initGame;
