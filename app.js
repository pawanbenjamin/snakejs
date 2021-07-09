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
  } catch(err){
    console.error(err)
  }
})


let userObj = {}

// check if user is logged in 
auth.onAuthStateChanged((user) => {
  if(user){
    const {email, uid} = user
    userObj = { email, uid }
    console.log(`Hello, ${email}`)
    console.log(userObj)
    // console.log(db.collection("users").doc(userObj.uid))

  } else {
    console.log('login session expired')
  }
})


async function getUserFromFirestore(uid){
  let snapshot = await db.collection(`users`).doc(uid).get()
  console.log(snapshot.data())
}

getUserFromFirestore(userObj.uid)


let currUserDiv = $('#currentUser')
let allUsersDiv = $('#allUsers')



function renderJq(highScore, name, email){
    let element = $(`
      <div>
        <h4>${name}</h4>
        <h4>${email}</h4>
        <h4>${highScore}</h4>       
      </div>
    `)
return element
}


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
//update({HighScore: score})

  db.collection("users").doc(userObj.uid).update({ HighScore: score})

  $(".score").text(score);

  //check for our score



}

function render() {
  if (state.gameState === "isPlaying") {
    renderSnake();
    move(state.DIRECTION);
    renderFruit(state.fruitCoords);
  } else {
    clearInterval(stop);
  }
  db.collection('users').get().then(snapshot=>{
    allUsersDiv.empty()
    snapshot.docs.forEach(doc=>{
      const {HighScore, Name, Email} = doc.data()
      
      allUsersDiv.append(renderJq(HighScore,Name,Email))
  
    })
  })
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
