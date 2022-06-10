let isAnimating = false;
let isDrawable = true;
let grid, columns, rows;
let h, w;
let buttonStartX = 0, fps = 20, nodeSize = 12, density = 100;
let currentRow = 0, currentColumn = 0;
let fpsSlider;
let randomizeSlider;




function reload() {
  window.location = document.URL;
}
function windowResized() {
  reload();
}
function toggleAnimation() {
  isAnimating = !isAnimating;
}
function toggleDrawErase() {
  isAnimating = false;
  isDrawable = !isDrawable;
}
function makeArray(columns, rows) {
  let grid = new Array(columns);
  for (let i = 0; i < grid.length; i++) {
    grid[i] = new Array(rows);
  }
  return grid;
}

function makeEmpty() {
  isAnimating = false;
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j] = 0;
    }
  }
}
function makeRandom() {
  isAnimating = false;
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      let random = Math.floor(Math.random() * 100) + 1;
      let threshold = 100 - density;
      if (j * nodeSize < 110) grid[i][j] = 0;
      else if (random > threshold) grid[i][j] = 1;
      else grid[i][j] = 0;
    }
  }
}
function createPlayPauseButton() {
  button = createButton('Play / Pause');
  button.position(buttonStartX, 50);
  button.size(100, 25);
  button.style('background-color', color(0));
  button.style('color', color(230));
  button.style('font-weight', 600);
  button.style('border-radius: 5px;');
  button.mousePressed(toggleAnimation);
}
function createActionButton() {
  button = createButton('Draw / Erase');
  button.position(buttonStartX + 110, 50);
  button.size(100, 25);
  button.style('background-color', color(0));
  button.style('color', color(230));
  button.style('font-weight', 600);
  button.style('border-radius: 5px;');
  button.mousePressed(toggleDrawErase);
}
function createEmptyButton() {
  button = createButton('Empty');
  button.position(buttonStartX, 80);
  button.size(100, 25);
  button.style('background-color', color(0));
  button.style('color', color(230));
  button.style('font-weight', 600);
  button.style('border-radius: 5px;');
  button.mousePressed(makeEmpty);
}
function createRandomizeButton() {
  button = createButton('Randomize');
  button.position(buttonStartX + 110, 80);
  button.size(100, 25);
  button.style('background-color', color(0));
  button.style('color', color(230));
  button.style('font-weight', 600);
  button.style('border-radius: 5px;');
  button.mousePressed(makeRandom);
}
function displayText() {
  stroke(114,137,218);
  fill(25, 33, 41);
  rect(0, 0, w, 40);
  fill(230);
  let state, action;
  if (isAnimating) state = 'Playing ';
  else state = 'Paused ';
  if (isDrawable) action = 'Draw ';
  else action = 'Erase ';
  textStyle(BOLD);
  strokeWeight(0);
  textSize(15);
  text('Status : ' + state + '  |  Action : ' + action, w / 2 - 120, 25);
  strokeWeight(1);
}



function createButtonContainer() {

  let width = 250;
  let xPosition = w / 2 - width / 2;
  let container = createButton("");
  container.position(xPosition, 45);
  container.size(width, 65);
  container.style('background-color', color(40,43,48));
  container.style('color', color(230));
  container.style('font-weight', 600);
  container.style('border-radius: 5px;');

}
function createSliderContainer() {
  
  let width = floor(windowWidth) / 3;
  let xPosition = w / 2 - width / 2;
  let container = createButton("");
  container.position(xPosition - 10, h-70);
  container.size(width + 20, 65);
  container.style('background-color', color(40,43,48));
  container.style('color', color(230));
  container.style('font-weight', 600);
  container.style('border-radius: 5px;');


  fpsSlider = createSlider(1, 60, 60);
  fpsSlider.position(xPosition, h - 30);
  fpsSlider.style('width', `${width}px`);

  randomizeSlider = createSlider(1, 100, 100);
  randomizeSlider.position(xPosition, h - 60);
  randomizeSlider.style('width', `${width}px`);

}

function updateGridFromInput() {

  if (mouseX > 0 && mouseX < w && mouseY > 0 && mouseY < h) {
    currentColumn = floor(mouseX / nodeSize);
    currentRow = floor(mouseY / nodeSize);
  }
  if (currentRow != rows && currentColumn != columns) {
    if (isDrawable && mouseIsPressed) grid[currentColumn][currentRow] = 1;
    else if (!isDrawable && mouseIsPressed) grid[currentColumn][currentRow] = 0;
  }
}
function countSurroundingNodes(grid, columnPassed, rowPassed) {
  let Nodes = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      let col = (columnPassed + i + columns) % columns;
      let row = (rowPassed + j + rows) % rows;
      Nodes += grid[col][row];
    }
  }
  Nodes -= grid[columnPassed][rowPassed];
  return Nodes;
}



function setup() {
  h = windowHeight - 1;
  w = windowWidth - 1;
  var canvas = createCanvas(w, h);
  canvas.style('display', 'block')
  buttonStartX = w / 2 - 100;
  createButtonContainer();
  createEmptyButton();
  createPlayPauseButton();
  createActionButton();
  createRandomizeButton();
  createSliderContainer();
  columns = floor(w / nodeSize);
  rows = floor(h / nodeSize);
  grid = makeArray(columns, rows);
  makeEmpty();
}
function draw() {

  frameRate(fpsSlider.value());
  density = randomizeSlider.value();
  background(25, 33, 41);
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      let colPos = i * nodeSize;
      let rowPos = j * nodeSize;
      if (grid[i][j] == 1) {
        fill(62, 76, 89);
        stroke(114,137,218);
        rect(colPos, rowPos, nodeSize - 1, nodeSize - 1);
      }
    }
  }

  let updatedGrid = makeArray(columns, rows);
  if (isAnimating) {
    for (let i = 0; i < columns; i++) {
      for (let j = 0; j < rows; j++) {
        let state = grid[i][j];
        let surroundingNodes = countSurroundingNodes(grid, i, j);
        if (state == 0 && surroundingNodes == 3) {
          updatedGrid[i][j] = 1;
        } else if (state == 1 && (surroundingNodes < 2 || surroundingNodes > 3)) {
          updatedGrid[i][j] = 0;
        } else {
          updatedGrid[i][j] = state;
        }
      }
    }
    grid = updatedGrid;
  }
  updateGridFromInput();
  displayText();
}



