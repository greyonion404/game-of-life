let isAnimating = false;
let isDrawable = true;
let grid, columns, rows;
let h, w;
let buttonStartX = 0, fps = 20, nodeSize = 12, density = 72;
let currentRow = 0, currentColumn = 0;
let fpsSlider, randomizeSlider;
let playPauseButton, actionButton, randomizeButton, emptyButton;
let buttonContainer, sliderContainer;


function getAnimationEmoji() {
  return `${!isAnimating ? "▶" : " | | "}`;
}

function getDrawEmoji() {
  return `${isDrawable ? "✎" : "⎚"}`;
}

function getRandomButtonEmoji() {
  return `⋙ ${density}%`;
}


function reload() {
  window.location = document.URL;
}
function windowResized() {
  reload();
}
function toggleAnimation() {
  isAnimating = !isAnimating;
  playPauseButton.html(getAnimationEmoji());
}
function toggleDraw() {
  isAnimating = false;
  isDrawable = !isDrawable;
  actionButton.html(getDrawEmoji());
}

function makeArray(columns, rows) {
  let grid = new Array(columns);
  for (let i = 0; i < grid.length; i++) {
    grid[i] = new Array(rows);
  }
  return grid;
}

function generateEmptyGrid() {
  isAnimating = false;
  playPauseButton.html(getAnimationEmoji());
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j] = 0;
    }
  }
}
function generateRandomizedGrid() {
  isAnimating = false;
  playPauseButton.html(getAnimationEmoji());
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      let random = Math.floor(Math.random() * 100) + 1;
      let threshold = 100 - density;
      if (random > threshold) grid[i][j] = 1;
      else grid[i][j] = 0;
    }
  }
}
function createPlayPauseButton() {
  playPauseButton = createButton(getAnimationEmoji());
  playPauseButton.position(buttonStartX, 50);
  playPauseButton.size(100, 25);
  playPauseButton.style('background-color', color(0));
  playPauseButton.style('color', color(230));
  playPauseButton.style('font-weight', 600);
  playPauseButton.style('border-radius: 5px;');
  playPauseButton.mousePressed(toggleAnimation);
}

function createActionButton() {
  actionButton = createButton(getDrawEmoji());
  actionButton.position(buttonStartX + 110, 50);
  actionButton.size(100, 25);
  actionButton.style('background-color', color(0));
  actionButton.style('color', color(230));
  actionButton.style('font-weight', 600);
  actionButton.style('border-radius: 5px;');
  actionButton.mousePressed(toggleDraw);
}

function createEmptyButton() {
  emptyButton = createButton('⦰');
  emptyButton.position(buttonStartX, 80);
  emptyButton.size(100, 25);
  emptyButton.style('background-color', color(0));
  emptyButton.style('color', color(230));
  emptyButton.style('font-weight', 600);
  emptyButton.style('border-radius: 5px;');
  emptyButton.mousePressed(generateEmptyGrid);
}
function createRandomizeButton() {
  randomizeButton = createButton(getRandomButtonEmoji());
  randomizeButton.position(buttonStartX + 110, 80);
  randomizeButton.size(100, 25);
  randomizeButton.style('background-color', color(0));
  randomizeButton.style('color', color(230));
  randomizeButton.style('font-weight', 600);
  randomizeButton.style('border-radius: 5px;');
  randomizeButton.mousePressed(generateRandomizedGrid);
}



function createButtonContainer() {
  let width = 250;
  let xPosition = w / 2 - width / 2;
  buttonContainer = createButton("");
  buttonContainer.position(xPosition, 45);
  buttonContainer.size(width, 65);
  buttonContainer.style('background-color', color(40, 43, 48));
  buttonContainer.style('color', color(230));
  buttonContainer.style('font-weight', 600);
  buttonContainer.style('border-radius: 5px;');
}
function createSliders() {

  let width = floor(windowWidth) / 3;
  let xPosition = w / 2 - width / 2;
  sliderContainer = createButton("");
  sliderContainer.position(xPosition - 10, h - 70);
  sliderContainer.size(width + 20, 65);
  sliderContainer.style('background-color', color(40, 43, 48));
  sliderContainer.style('color', color(230));
  sliderContainer.style('font-weight', 600);
  sliderContainer.style('border-radius: 5px;');


  fpsSlider = createSlider(1, 60, 60);
  fpsSlider.position(xPosition, h - 30);
  fpsSlider.style('width', `${width}px`);

  randomizeSlider = createSlider(1, 100, density);
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
  createSliders();
  columns = floor(w / nodeSize);
  rows = floor(h / nodeSize);
  grid = makeArray(columns, rows);
  generateEmptyGrid();
}


function executeGridUpdationLogic() {

  let updatedGrid = makeArray(columns, rows);

  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {

      let state = grid[i][j];
      let surroundingNodes = countSurroundingNodes(grid, i, j);

      if (state == 0 && surroundingNodes == 3) updatedGrid[i][j] = 1;
      else if (state == 1 && (surroundingNodes < 2 || surroundingNodes > 3)) updatedGrid[i][j] = 0;
      else updatedGrid[i][j] = state;
    }
  }
  grid = updatedGrid;
}


function animateGrid() {
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      let colPos = i * nodeSize;
      let rowPos = j * nodeSize;
      if (grid[i][j] == 1) {
        fill(62, 76, 89);
        stroke(114, 137, 218);
        stroke(40);
        rect(colPos, rowPos, nodeSize - 1, nodeSize - 1);
      }
    }
  }
}


function draw() {

  frameRate(fpsSlider.value());
  density = randomizeSlider.value();
  randomizeButton.html(getRandomButtonEmoji());
  background(25, 33, 41);
  animateGrid();
  if (isAnimating) executeGridUpdationLogic();
  updateGridFromInput();
}



