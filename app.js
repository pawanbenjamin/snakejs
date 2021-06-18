// Game Data
let gridSize = 20;
let score = 0;
let UP = [-1, 0];
let DOWN = [1, 0];
let LEFT = [0, -1];
let RIGHT = [0, 1];

// Global Variable for storing returned value of setInterval
let stop;

// Game State
let state = {
  snake: [[0, 0]],
  DIRECTION: RIGHT,
  fruitCoords: [9, 9],
  gameState: "isPlaying",
};

// Place cells with id of grid coordinates x-y in our CSS grid
function makeGrid() {
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      $(".grid").append(`<div id="${i}-${j}" class="cell"></div>`);
    }
  }
}

// Change the div with our snake coordinates to have a black background
function renderSnake() {
  $(".grid div").removeClass("active");
  state.snake.map((coordinate) => {
    $(`#${coordinate[0]}-${coordinate[1]}`).addClass("active");
  });
}

// Change the div with the passed in coordinates to our fruit
function renderFruit(coords) {
  $(".grid div").removeClass("fruit");
  $(`#${coords[0]}-${coords[1]}`).addClass("fruit");
}

// What happens when we move
function move(dir) {
  // add our directions coordinates to our snake head to find our new head
  let newHead = [state.snake[0][0] + dir[0], state.snake[0][1] + dir[1]];

  // For each cooridnate of our snake we want to check if our head collided with it
  state.snake.forEach((coord) => {
    // If our newHead x and y is equal to our snake coordinates x and y
    if (newHead[0] === coord[0] && newHead[1] === coord[1]) {
      //reset all information
      $(".grid div").removeClass("snake");
      $(".grid div").removeClass("fruit");
      newHead = [0, 0];
      state.snake = [[0, 0]];
      state.DIRECTION = RIGHT;
      state.fruitCoords = [9, 9];
      score = 0;
      updateScore(score);
      state.gameState = "game-over";
      $(".game-over").text("GAME OVER");
    }
  });

  // If our new head is out of our grid bounds, have it show up on the other side
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

  // Deconstruction of our fruit coordinates
  const [x, y] = state.fruitCoords;
  // If our new head have the same coordinates as our fruit
  if (newHead[0] === x && newHead[1] === y) {
    // Increment score, place newHead at the begning of our snake and place a new fruit
    score++;
    updateScore(score);
    state.fruitCoords = setNewFruit();
    state.snake.unshift(newHead);
    renderFruit(state.fruitCoords);
  } else {
    // Or else we keep the snake the same length by removing the last element
    state.snake.pop();
    // Replacing our head with our newHead coordinates
    state.snake.unshift(newHead);
  }
}

// Generate random coordinates to place our fruit
function setNewFruit() {
  let newX = Math.floor(Math.random() * (gridSize - 1));
  let newY = Math.floor(Math.random() * (gridSize - 1));
  return [newX, newY];
}

// Update our score in the DOM
function updateScore(score) {
  $(".score").text(score);
}

// If our game state isPlaying, render our game, if not stop it
function render() {
  if (state.gameState === "isPlaying") {
    renderSnake();
    move(state.DIRECTION);
    renderFruit(state.fruitCoords);
  } else {
    // Uses the global stop variable and pass it to this clearInterval function
    clearInterval(stop);
  }
}

// Listen for key presses from the user
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

// Click the button to start the game
document.getElementById("render").addEventListener("click", () => {
  state.gameState = "isPlaying";
  $(".game-over").text("Snakey Sssnake");
  stop = setInterval(render, 100);
});

// Call our makeGrid function and place all of our cells
makeGrid();
