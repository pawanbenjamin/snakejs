let grid = [];
let gridSize = 20;

function makeGrid() {
  let count = 1;
  for (let i = 0; i < gridSize; i++) {
    grid[i] = [];
    for (let j = 0; j < gridSize; j++) {
      grid[i][j] = "cell";
      $(".grid").append(`<div id="${i}${j}" class="cell"></div>`);
    }
  }
}

makeGrid();

let snake = [[0, 0]];
function renderSnake() {
  $(".grid div").removeClass("active");
  snake.forEach((coordinate) => {
    $(`#${coordinate[0]}${coordinate[1]}`).addClass("active");
    // grid[coordinate[0]][coordinate[1]] = "S";
  });
}

let UP = [-1, 0];
let DOWN = [1, 0];
let LEFT = [0, -1];
let RIGHT = [0, 1];
let DIRECTION = RIGHT;

function move(dir) {
  snake[0][0] = snake[0][0] + dir[0];
  snake[0][1] = snake[0][1] + dir[1];
  //   snake.forEach((point) => {
  //     point[0] = point[0] + dir[0];
  //     point[1] = point[1] + dir[1];
  //   });
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

// function renderToDom() {
//   $(".grid div").removeClass("active");
//   for (let i = 0; i < gridSize; i++) {
//     for (let j = 0; j < gridSize; j++) {
//       if (grid[i][j] === "S") {
//         $(`#${i}${j}`).addClass("active");
//       }
//     }
//   }
// }

makeGrid();

function render() {
  move(DIRECTION);
  renderSnake();
}

// setInterval(render, 500);
