let gridSize = 20;
let score = 0;
let UP = [-1, 0];
let DOWN = [1, 0];
let LEFT = [0, -1];
let RIGHT = [0, 1];

let state = {
  snake: [[0, 0]],
  DIRECTION: RIGHT,
  fruitCoords: [9, 9],
  gameState: "isPlaying",
};

function updateScore(score) {
  $(".score").text(score);
}

function makeGrid() {
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      $(".grid").append(`<div id="${i}-${j}" class="cell"></div>`);
    }
  }
}

// let snake = [[0, 0]];
function renderSnake() {
  $(".grid div").removeClass("active");
  state.snake.map((coordinate) => {
    $(`#${coordinate[0]}-${coordinate[1]}`).addClass("active");
  });
}

// let UP = [-1, 0];
// let DOWN = [1, 0];
// let LEFT = [0, -1];
// let RIGHT = [0, 1];
// let DIRECTION = RIGHT;

// let fruitCoords = [9, 9];

function renderFruit(coords) {
  $(".grid div").removeClass("fruit");
  $(`#${coords[0]}-${coords[1]}`).addClass("fruit");
}

// function resetGame() {
//   state.snake = [[0, 0]];
//   state.DIRECTION = RIGHT;
//   state.fruitCoords = [9, 9];
//   score = 0;
//   updateScore(score);
//   clearInterval(stop);
//   return;
// }

function move(dir) {
  let newHead = [state.snake[0][0] + dir[0], state.snake[0][1] + dir[1]];

  state.snake.forEach((coord) => {
    if (newHead[0] === coord[0] && newHead[1] === coord[1]) {
      $(".grid div").removeClass("snake");
      $(".grid div").removeClass("fruit");
      newHead = [0, 0];
      state.snake = [[0, 0]];
      state.DIRECTION = RIGHT;
      state.fruitCoords = [9, 9];
      score = 0;
      updateScore(score);
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

//Helper Function
function setNewFruit() {
  let newX = Math.floor(Math.random() * (gridSize - 1));
  let newY = Math.floor(Math.random() * gridSize);
  return [newX, newY];
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

function render() {
  renderSnake();
  move(state.DIRECTION);
  renderFruit(state.fruitCoords);
}

makeGrid();
let stop;

stop = setInterval(render, 100);

//start / test button
document.getElementById("render").addEventListener("click", () => {
  console.log(state);
  render();
});
