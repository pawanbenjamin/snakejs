// Define Our Grid Size
let gridSize = 20;

//Define Coordinates of our Direction
let UP = [-1, 0];
let DOWN = [1, 0];
let LEFT = [0, -1];
let RIGHT = [0, 1];
let DIRECTION = RIGHT;

//Other Variables that we will us
let score = 0;
let highScore = 0;
let fruitCoords = [9, 9];
let snake = [[0, 0]];

//setting a global variable which will store the return of setInterval()
let clearInt;

//Append a new div with coordinates passed into our ID to our grid
function makeGrid() {
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      $(".grid").append(`<div id="${i}-${j}" class="cell"></div>`);
    }
  }
}

//Add the class of active to our snake coordinates
function renderSnake() {
  $(".grid div").removeClass("active");
  //for each coordinate in our snake array
  snake.map((coordinate) => {
    // add the active class to it to color it in
    $(`#${coordinate[0]}-${coordinate[1]}`).addClass("active");
  });
}

//Adds the class of fruit to the fruit coordinates
function renderFruit(fruitCoords) {
  $(".grid div").removeClass("fruit");
  $(`#${fruitCoords[0]}-${fruitCoords[1]}`).addClass("fruit");
}

// Move our snake!
function move(dir) {
  //Our new head of the snake will be the old coordinates with the direction added to each
  //   snake[0][0] is referring to the first nested array's (the head of the snake) first value
  //   snake [0][1] is referring to the head of our snake's second value
  //   we're adding the x and y values of the direction to each number and making that our newHead
  let newHead = [snake[0][0] + dir[0], snake[0][1] + dir[1]];

  snake.forEach((coord) => {
    // if our new head's x and y values are the same as any in our snake array (we collided with ourself)
    // then game over and we need to reset everything
    if (newHead[0] === coord[0] && newHead[1] === coord[1]) {
      if (score > highScore) highScore = score;
      // All of this here resets the global variables
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

  // these check if our snake is out of our grid boundary, if so, makes it appear on the opposite end
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

  //this pulls each coordinate from our current fruitCoords
  const [x, y] = fruitCoords;
  // if both these coordinates overlap with our new snake head, then we've eaten the fruit
  if (newHead[0] === x && newHead[1] === y) {
    score++;
    updateScore(score);
    fruitCoords = setNewFruit();
    //this adds the new head to the beggining of our snake array
    snake.unshift(newHead);
    //this places a new piece of fruit
    renderFruit(fruitCoords);
  } else {
    //else we remove the tail of our snake because we didnt eat a fruit
    snake.pop();
    //and we add our newHead to the beggining of the snake
    snake.unshift(newHead);
  }
}

//Query the score class, and update it with our global score
function updateScore(score) {
  $(".score").text(score);
}

// generates random fruit coordinates
function setNewFruit() {
  let newX = Math.floor(Math.random() * (gridSize - 1));
  let newY = Math.floor(Math.random() * gridSize);
  return [newX, newY];
}

//this needs to happen at a specific interval so the game can start
function render() {
  //move our snake
  move(DIRECTION);
  //build our snake
  renderSnake();
  //drop our fruit
  renderFruit(fruitCoords);
}

//invoke make grid to make our grid
makeGrid();

document.getElementById("render").addEventListener("click", () => {
  //setting the global to be the return of setInterval, so when it's called on line 61 we kill the game
  clearInt = setInterval(render, 50);
});

//listeners for key movements
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
