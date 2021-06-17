let gridSize = 20;
let score = 0;

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

let snake = [[0, 0]];
function renderSnake() {
  $(".grid div").removeClass("active");
  snake.map((coordinate) => {
    $(`#${coordinate[0]}-${coordinate[1]}`).addClass("active");
  });
}

let UP = [-1, 0];
let DOWN = [1, 0];
let LEFT = [0, -1];
let RIGHT = [0, 1];
let DIRECTION = RIGHT;

let fruitCoords = [9, 9];

function renderFruit(fruitCoords) {
  $(".grid div").removeClass("fruit");
  $(`#${fruitCoords[0]}-${fruitCoords[1]}`).addClass("fruit");
}

function move(dir) {
  let newHead = [snake[0][0] + dir[0], snake[0][1] + dir[1]];

  snake.forEach((coord) => {
    if (newHead[0] === coord[0] && newHead[1] === coord[1]) {
      $(".grid div").removeClass("snake");
      $(".grid div").removeClass("fruit");
      clearInterval(clearInt);
      score = 0;
      updateScore(score);
      snake = [[0, 0]];
      fruitCoords = [9, 9];
      render();
      return;
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

  const [x, y] = fruitCoords;
  if (newHead[0] === x && newHead[1] === y) {
    score++;
    updateScore(score);
    fruitCoords = setNewFruit();
    snake.unshift(newHead);
    renderFruit(fruitCoords);
  } else {
    snake.pop();
    snake.unshift(newHead);
  }
}

document.addEventListener("keydown", (e) => {
  if (e.code === "ArrowUp") {
    DIRECTION = UP;
  } else if (e.code === "ArrowRight") {
    DIRECTION = RIGHT;
  } else if (e.code === "ArrowDown") {
    DIRECTION = DOWN;
  } else if (e.code === "ArrowLeft") {
    DIRECTION = LEFT;
  }
  console.log(DIRECTION);
});

function render() {
  move(DIRECTION);
  renderSnake();
  renderFruit(fruitCoords);
}

makeGrid();
let clearInt = setInterval(render, 100);

document.getElementById("render").addEventListener("click", () => {
  render();
});

function setNewFruit() {
  let newX = Math.floor(Math.random() * (gridSize - 1));
  let newY = Math.floor(Math.random() * gridSize);
  return [newX, newY];
}
