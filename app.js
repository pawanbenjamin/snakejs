let gridSize = 20;

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

function move(dir) {
  let newHead = [snake[0][0] + dir[0], snake[0][1] + dir[1]];

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

  snake.pop();
  snake.unshift(newHead);
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
}

makeGrid();

// setInterval(render, 100);
