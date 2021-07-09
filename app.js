// Firebase Login

const signupForm = document.getElementById('signup-form')
const logoutButton = document.getElementById('logout')



signupForm.addEventListener('submit', async (e)=>{

  e.preventDefault()

  //pulling these id's from the form elements
  const name = signupForm['name'].value
  const email = signupForm['email'].value
  const password = signupForm['password'].value

  signupForm.reset()

  try {
    let creds = await auth.createUserWithEmailAndPassword(email, password)
    console.log(creds)
    db.collection('users').doc(creds.user.uid).set({
      Name: name,
      Email: email,
      HighScore: score > 0 ? score : 0,
  })
    console.log(`Added ${name} to the database!`)
  } catch(err){
    console.error(err)
  }

})

logoutButton.addEventListener('click', async ()=>{
  try{
    await auth.signOut()
    location.reload()
  } catch(err){
    console.error(err)
  }
})

let currentUserId
// check if user is logged in 
auth.onAuthStateChanged((user) => {
  if(user){
    cuurentUserId = user.uid
    console.log(user.uid)
  } else {
    alert('login session expired')
  }
})

let currUserDiv = $('#currentUser')
let allUsersDiv = $('#allUsers')
// listen for db changes
// db.collection('users').get().then(snapshot=>{
//   snapshot.docs.forEach(doc=>{
//     let data = doc.data()
//     console.log(data)
//     console.log(auth)
//     let userBlock = $(`<div><h1>${data.Name}</h1><h1 id="highScore">${data.HighScore}</h1></div>`)
//     allUsersDiv.append(userBlock)
//     if(data.Email === auth.currentUser.email){
//       let userBlock = $(`<div><h1>${data.Name}</h1><h1>${data.HighScore}</h1></div>`)
//       currUserDiv.append(userBlock)
//     }
//   })
// })



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
      $(".grid").append(`<div id="${i}-${j}" class="cell"></div>`);
    }
  }
}

function renderSnake() {
  $(".grid div").removeClass("active");
  state.snake.map((coordinate) => {
    $(`#${coordinate[0]}-${coordinate[1]}`).addClass("active");
  });
}

function renderFruit(coords) {
  $(".grid div").removeClass("fruit");
  $(`#${coords[0]}-${coords[1]}`).addClass("fruit");
}

function move(dir) {
  let newHead = [state.snake[0][0] + dir[0], state.snake[0][1] + dir[1]];

  state.snake.forEach((coord) => {
    if (newHead[0] === coord[0] && newHead[1] === coord[1]) {
      $(".grid div").removeClass("snake");
      $(".grid div").removeClass("fruit");
      state.gameState = "game-over";
      $(".game-over").text("GAME OVER");



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

function updateScore(score) {

  if(currentUserId !== undefined){
    let userHighScore = $('#highSchore').val()
    if(score > userHighScore){
      // update the user high score in the database
      db.collection('users').doc(currentUserId).update({
        HighScore: score
      })
    }
  }

  $(".score").text(score);


      //check if our score is higher than currentUser's score

      //if it is, updata it in our db
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
  if(state.gameState="game-over"){
      newHead = [0, 0];
      state.snake = [[0, 0]];
      state.DIRECTION = RIGHT;
      state.fruitCoords = [9, 9];
      score = 0;
      updateScore(score);
  }
  state.gameState = "isPlaying";
  $(".game-over").text("Snakey Sssnake");
  stop = setInterval(render, 100);
});

makeGrid();
