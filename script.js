var board = []; //2d array
var lines;
var minesCount = 0;
var minesLocations = []; //on 2d array
var tilesClicked = 0; //win when lines*lines-mines == 0
var flagToggled = false; //to flag tiles
var gameOver = false;

function start(){
  minesCount = document.getElementById("mn").value;
  lines = document.getElementById("tpl").value;
  var form = document.getElementsByTagName("form")[0];
  form.style.display = "none";
  startGame();
}

function setMines() {
  let minesLeft = minesCount;
  while (minesLeft > 0) {
    let r = Math.floor(Math.random() * lines);
    let c = Math.floor(Math.random() * lines);
    let id = r.toString() +"-"+ c.toString();
    if (!minesLocations.includes(id)) {
      minesLocations.push(id);
      minesLeft -= 1;
    }
  }
}

function startGame() {
  document.getElementById("mines-count").innerText = minesCount;
  document.getElementById("flag-button").addEventListener("click", toggleFlag);
  setMines();

  for (let r = 0; r < lines; r++) {
    let row = [];
    for (let c = 0; c < lines; c++) {
      let tile = document.createElement("div");
      tile.id = r.toString() +"-"+ c.toString();
      tile.addEventListener("click", clickTile);
      tile.style.width = 100 / lines+ "%";
      tile.style.height = 100 / lines+"%";
      document.getElementById("board").append(tile);
      row.push(tile);
    }
    board.push(row);
  }
}

function toggleFlag() {
  if (flagToggled) {
    flagToggled = false;
    document.getElementById("flag-button").style.backgroundColor = "lightgray";
  } else {
    flagToggled = true;
    document.getElementById("flag-button").style.backgroundColor = "darkgray";
  }
}

function clickTile() {
  let tile = this;
  if (gameOver || tile.classList.contains("tile-clicked")) {
    return;
  }
  if (flagToggled) {
    if (tile.innerText == "") {
      tile.innerText = "♧";
    } else {
      if (tile.innerText == "♧") {
        tile.innerText = "";
      }
      return;
    }
  } else {
    if (minesLocations.includes(tile.id)) {
      gameOver = true;
      revealMines("red");
      alert("GAME OVER");
      return;
    }

    let coords = tile.id.split("-"); //"2-3" => [2,3]
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);
    checkMine(r, c);
  }}

function revealMines(clr) {
  for (let r = 0; r < lines; r++) {
    for (let c = 0; c < lines; c++) {
      let tile = board[r][c];
      if (minesLocations.includes(tile.id)) {
        tile.innerText = "♧"
        tile.style.backgroundColor = clr;
      }
    }
  }
}

function checkMine(r, c) {
  if (r < 0 || r >= lines || c < 0 || c >= lines) {
    return;
  }
  if (board[r][c].classList.contains("tile-clicked")) {
    return;
  }
  board[r][c].classList.add("tile-clicked");
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
  if (minesFound > 0) {
    board[r][c].innerText = minesFound;
    board[r][c].classList.add("x"+minesFound.toString());
    board[r][c].classList.add("tile-clicked");
  } else {
    checkMine(r-1, c-1); //top left
    checkMine(r-1, c); //top
    checkMine(r-1, c+1); //top right
    checkMine(r, c-1); //left
    checkMine(r, c+1); //right
    checkMine(r+1, c-1); //bottom left
    checkMine(r+1, c); //bottom
    checkMine(r+1, c+1); //bottom right
  }
  if (tilesClicked == (lines * lines - minesCount)) {
    document.getElementById("mines-count").innerText = "Cleared";
    revealMines("limegreen");
    gameOver = true;
  }
}

function checkTile(r, c) {
  if (r < 0 || r >= lines || c < 0 || c >= lines) {
    return 0;
  }
  if (minesLocations.includes(r.toString()+"-"+ c.toString())) {
    return 1;
  }
  return 0;
}


function setMN() {
  let mn = document.getElementById("mn");
  let mnVal = document.getElementById("mn-val");
  mnVal.innerText = mn.value;
}

function setTPL() {
  let tpl = document.getElementById("tpl");
  let tplVal = document.getElementById("tpl-val");
  tplVal.innerText = tpl.value;
}