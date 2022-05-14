var board = []; //2d array
var lines = 0;
var minesCount = 0;
var minesLocations = []; //on 2d array
var tilesClicked = 0; //win when lines*lines-mines == 0
var flagToggled = false; //to flag tiles
var gameOver = false;
var mineClass = "fa-bomb"; // added when mine is flagged

var gameStarted = false; //used is setMines() just to make sure the first tile clicked is not a mine

// first fired when the start button is clicked
// removes input form and sets values
function start(){
  minesCount = document.getElementById("mn").value;
  lines = document.getElementById("tpl").value;
  var form = document.getElementsByTagName("form")[0];
  form.style.display = "none";
  startGame();
}

// divides the board into tiles with some attributes
function startGame() {
  document.getElementById("mines-count").innerText = minesCount;
  document.getElementById("flag-button").addEventListener("click", toggleFlag);

  for (let r = 0; r < lines; r++) {
    let row = [];
    for (let c = 0; c < lines; c++) {
      // creating <div> tiles
      let tile = document.createElement("div");
      // creating <i> element inside every <div> tile and adding font awesome basics for when a tile is flagged we only need to add "fa-bomb"
      let mineSetting = document.createElement("i");
      mineSetting.classList.add("fa-xs");
      mineSetting.classList.add("fa-solid");
      tile.append(mineSetting);
      // giving each <div> an id, EventListener and some styling
      tile.id = r.toString() +"-"+ c.toString();
      tile.addEventListener("click", clickTile);
      tile.style.width = 100 / lines+ "%";
      tile.style.height = 100 / lines+"%";
      // appening the tile onto the board
      document.getElementById("board").append(tile);
      row.push(tile);
    }
    board.push(row);
  }
}

// sets default values and starts a new game when the smilie button is clicked
function newGame(){
  if(flagToggled){toggleFlag();}
  gameOver = true;
  
  for(let i=0; i<lines * lines; i++){
    document.getElementById("board").children[1].remove();
    // 1 not 0 because i used form as the first child of the board element, using 0 will result in an error
  }
  document.getElementById("smile").children[0].classList.remove("fa-face-frown");
  document.getElementById("smile").children[0].classList.remove("fa-face-grin-stars");
  document.getElementById("smile").children[0].classList.remove("fa-face-smile-beam");
  document.getElementById("smile").children[0].classList.add("fa-face-smile-beam");
  gameStarted = false;
  gameOver = false;
  tilesClicked = 0;
  minesLocations = [];
  board = [];
  
  startGame();
}

// randomly spreads mines except for the first tile clicked
function setMines(tile) {
  let minesLeft = minesCount;
  while (minesLeft > 0) {
    let r = Math.floor(Math.random() * lines);
    let c = Math.floor(Math.random() * lines);
    let id = r.toString() +"-"+ c.toString();
    if (!minesLocations.includes(id) && (id != tile.id)) {
      minesLocations.push(id);
      minesLeft -= 1;
    }
  }
}

// toggles flag button
function toggleFlag() {
  if (flagToggled) {
    flagToggled = false;
    document.getElementById("flag-button").style.backgroundColor = "#ccc";
  } else {
    flagToggled = true;
    document.getElementById("flag-button").style.backgroundColor = "#555";
  }
}

// first fired when a tile is ckicked
function clickTile() {
  let tile = this;
  let mc = document.getElementById("mines-count").innerText;
  if(!gameStarted){
    setMines(tile);
    gameStarted = true;
  }
  if (gameOver || (tile.children[0].classList.contains(mineClass) && !flagToggled)){
    return;
  }
  if (flagToggled) {
    if (!tile.children[0].classList.contains(mineClass) && mc > 0) {
      tile.children[0].classList.add(mineClass);
      document.getElementById("mines-count").innerText -=1;
    } else {
      if (tile.children[0].classList.contains(mineClass)) {
        tile.children[0].classList.remove(mineClass);
        document.getElementById("mines-count").innerText = parseInt(mc) + 1;
      }
      return;
    }
  } else {
    if (minesLocations.includes(tile.id)) {
      gameOver = true;
      document.getElementById("smile").children[0].classList.remove("fa-face-smile-beam");
      document.getElementById("smile").children[0].classList.add("fa-face-frown");
      revealMines("red");
      alert("GAME OVER");
      return;
    } 
    let coords = tile.id.split("-"); //"2-3" => [2,3]
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);
    checkMine(r, c);
  }}

// reveals mines when lose or win
function revealMines(clr) {
  for (let r = 0; r < lines; r++) {
    for (let c = 0; c < lines; c++) {
      let tile = board[r][c];
      if (minesLocations.includes(tile.id)) {
        tile.children[0].classList.add(mineClass);
        tile.style.backgroundColor = clr;
        tile.style.borderColor = clr;
      }
    }
  }
}

// basically everything
function checkMine(r, c) {
  // makes sure to stay inside the board
  if (r < 0 || r >= lines || c < 0 || c >= lines) {
    return;
  }
  // do nothing if this tile is clicked
  if (board[r][c].classList.contains("tile-clicked")) {
    return;
  }
  board[r][c].classList.add("tile-clicked");
  board[r][c].style.border = "1px solid whitesmoke";
  board[r][c].style.backgroundColor = "#666";
  
  // checking how many mines are around this tile
  tilesClicked += 1;
  let minesFound = 0;
  minesFound += checkTile(r-1, c-1); //top left
  minesFound += checkTile(r-1, c); //top
  minesFound += checkTile(r-1, c+1); //top right
  minesFound += checkTile(r, c-1); //left
  minesFound += checkTile(r, c+1); //right
  minesFound += checkTile(r+1, c-1); //bottom left
  minesFound += checkTile(r+1, c); //bottom
  minesFound += checkTile(r+1, c+1); //bottom right
  // sets an appropriate number if mines found around this tile
  if (minesFound > 0) {
    board[r][c].innerText = minesFound;
    board[r][c].classList.add("x"+minesFound.toString());
    board[r][c].classList.add("tile-clicked");
  board[r][c].style.border = "1px solid whitesmoke";
  board[r][c].style.backgroundColor = "#666";
  } else {
    // if no mines found around, it keeps opening blank tiles
    checkMine(r-1, c-1); //top left
    checkMine(r-1, c); //top
    checkMine(r-1, c+1); //top right
    checkMine(r, c-1); //left
    checkMine(r, c+1); //right
    checkMine(r+1, c-1); //bottom left
    checkMine(r+1, c); //bottom
    checkMine(r+1, c+1); //bottom right
  }
  // you win when all tiles but mines are clicked
  if (tilesClicked == (lines * lines - minesCount)) {
    document.getElementById("mines-count").innerText = "0";
    document.getElementById("smile").children[0].classList.remove("fa-face-smile-beam");
    document.getElementById("smile").children[0].classList.add("fa-face-grin-stars");
    revealMines("limegreen");
    gameOver = true;
  }
}

// adds 1 to checkMine() for every mine found
function checkTile(r, c) {
  if (r < 0 || r >= lines || c < 0 || c >= lines) {
    return 0;
  }
  if (minesLocations.includes(r.toString()+"-"+ c.toString())) {
    return 1;
  }
  return 0;
}

// taking user input: minesCount and lines
// mines number
function setMN() {
  let mn = document.getElementById("mn");
  let mnVal = document.getElementById("mn-val");
  mnVal.innerText = mn.value;
}
//tiles per line, board's width and height
function setTPL() {
  let tpl = document.getElementById("tpl");
  let tplVal = document.getElementById("tpl-val");
  tplVal.innerText = tpl.value;
}
