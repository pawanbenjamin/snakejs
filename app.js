// So I can use .forEach on elements
HTMLCollection.prototype.forEach = Array.prototype.forEach;
NodeList.prototype.forEach = Array.prototype.forEach;

// DOM Elements
const grid = document.querySelector(".grid");
const cells = document.getElementsByClassName("cell");
const gameStatus = document.querySelector(".game-over");
const scoreEl = document.querySelector(".score");

// Game Data
let gridSize = 20;
let score = 0;
let UP = [-1, 0];
let DOWN = [1, 0];
let LEFT = [0, -1];
let RIGHT = [0, 1];

// Global Variable for stopping setInterval
let stop;

// Game State
let state = {
  snake: [[0, 0]],
  DIRECTION: RIGHT,
  fruitCoords: [9, 9],
  gameState: "isPlaying",
};

function makeGrid() {
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      let cell = document.createElement("div");
      cell.classList.add("cell");
      cell.id = `${i}-${j}`;
      grid.appendChild(cell);
    }
  }
}

function renderSnake() {
  cells.forEach((el) => el.classList.remove("active"));
  state.snake.map((coordinate) => {
    let snakeSquare = document.getElementById(
      `${coordinate[0]}-${coordinate[1]}`
    );
    snakeSquare.classList.add("active");
  });
}

function renderFruit(coords) {
  cells.forEach((el) => el.classList.remove("fruit"));
  let fruitSquare = document.getElementById(`${coords[0]}-${coords[1]}`);
  fruitSquare.classList.add("fruit");
}

function move(dir) {
  let newHead = [state.snake[0][0] + dir[0], state.snake[0][1] + dir[1]];

  state.snake.forEach((coord) => {
    if (newHead[0] === coord[0] && newHead[1] === coord[1]) {
      cells.forEach((el) => el.classList.remove("snake"));
      cells.forEach((el) => el.classList.remove("fruit"));
      state.gameState = "game-over";
      gameStatus.innerText = "Game Over";
    }
  });

  if (newHead[0] < 0) {
    newHead[0] = gridSize - 1;
  }
  if (newHead[0] > gridSize - 1) {
    newHead[0] = 0;
  }
  if (newHead[1] < 0) {
    newHead[1] = gridSize - 1;
  }
  if (newHead[1] > gridSize - 1) {
    newHead[1] = 0;
  }

  const [x, y] = state.fruitCoords;
  if (newHead[0] === x && newHead[1] === y) {
    score++;
    updateScore(score);

    state.fruitCoords = setNewFruit();
    state.snake.unshift(newHead);
    renderFruit(state.fruitCoords);
  } else {
    state.snake.pop();
    state.snake.unshift(newHead);
  }
}

function setNewFruit() {
  let newX = Math.floor(Math.random() * (gridSize - 1));
  let newY = Math.floor(Math.random() * (gridSize - 1));
  return [newX, newY];
}

async function updateScore(score) {
  scoreEl.innerText = score;
}

function render() {
  if (state.gameState === "isPlaying") {
    renderSnake();
    move(state.DIRECTION);
    renderFruit(state.fruitCoords);
  } else {
    clearInterval(stop);
  }
}

document.addEventListener("keydown", (e) => {
  if (e.code === "ArrowUp") {
    state.DIRECTION = UP;
  } else if (e.code === "ArrowRight") {
    state.DIRECTION = RIGHT;
  } else if (e.code === "ArrowDown") {
    state.DIRECTION = DOWN;
  } else if (e.code === "ArrowLeft") {
    state.DIRECTION = LEFT;
  }
});

document.getElementById("render").addEventListener("click", () => {
  if ((state.gameState = "game-over")) {
    newHead = [0, 0];
    state.snake = [[0, 0]];
    state.DIRECTION = RIGHT;
    state.fruitCoords = [9, 9];
    score = 0;
    updateScore(score);
  }
  state.gameState = "isPlaying";
  gameStatus.innerText = "Snakey";
  stop = setInterval(render, 100);
});

makeGrid();
