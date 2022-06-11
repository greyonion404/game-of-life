let isAnimating = false;
let isDrawable = true;
let grid, columns, rows;
let h, w;
let buttonStartX = 0, fps = 20, nodeSize = 12, density = 72;
let currentRow = 0, currentColumn = 0;
let fpsSlider, randomizeSlider;
let playPauseButton, actionButton, randomizeButton, emptyButton;
let buttonContainer, sliderContainer;

let buttonHeight = 25, buttonWidth = 100;
let buttonContainerHeight = 100, buttonContainerWidth = 100;

let backgroundColor, nodeColor, nodeStrokeColor, containerFillcolor;


function setColors() {
  nodeColor =
    color(30,33,36);

  nodeStrokeColor =
    color(79, 95, 152);

  backgroundColor =
    color(66, 69, 73);

  containerFillcolor = "#1e2124";
}



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
  // isAnimating = false;
  isDrawable = !isDrawable;
  playPauseButton.html(getAnimationEmoji());
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
  playPauseButton.size(buttonWidth, buttonHeight);
  playPauseButton.mousePressed(toggleAnimation);
}

function createActionButton() {
  actionButton = createButton(getDrawEmoji());
  actionButton.size(buttonWidth, buttonHeight);
  actionButton.mousePressed(toggleDraw);
}

function createEmptyButton() {
  emptyButton = createButton('⦰');
  emptyButton.size(buttonWidth, buttonHeight);
  emptyButton.mousePressed(generateEmptyGrid);
}
function createRandomizeButton() {
  randomizeButton = createButton(getRandomButtonEmoji());
  randomizeButton.size(buttonWidth, buttonHeight);
  randomizeButton.mousePressed(generateRandomizedGrid);
}



function createButtonContainer() {
  let buttonContainer = createDiv('');
  playPauseButton.parent(buttonContainer);
  emptyButton.parent(buttonContainer);
  randomizeButton.parent(buttonContainer);
  actionButton.parent(buttonContainer);
  buttonContainer.position(0, 0);
  let buttonContainerStyle = `
  background-color: ${containerFillcolor};  
  width: 100%;
  height: max-content; 
  padding: 10px; 
  display: flex; 
  justify-content: center;
  `;


  buttonContainer.style(buttonContainerStyle);


}
function createSliders() {

  let containerWidthPercentage = 80;
  let xPosition = ((100 - containerWidthPercentage) / 2) * windowWidth * (1 / 100);

  let LabelDivStyle = `
  display: flex;
  justify-content: space-between;
  color: snow; 
  text-align: center; 
  font-weight: bold; 
  background-color: ${containerFillcolor};  
  height: max-content; 
  padding: 5px;
  width: ${containerWidthPercentage}%;
  `;

  let sliderStyle = `
  width: 70%;
  `;

  let fpsLabel = createDiv('FPS : ');
  fpsLabel.position(xPosition, h - 40);
  fpsLabel.style(LabelDivStyle);

  fpsSlider = createSlider(1, 60, fps);
  fpsSlider.parent(fpsLabel);
  fpsSlider.parent(fpsLabel);
  fpsSlider.style(sliderStyle);


  let randomizeLabel = createDiv('Density : ');
  randomizeLabel.position(xPosition, h - 80);
  randomizeLabel.style(LabelDivStyle);
  randomizeSlider = createSlider(1, 100, density);
  randomizeSlider.parent(randomizeLabel);
  randomizeSlider.style(sliderStyle);

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

  setColors();
  canvas.style('display', 'block')
  createEmptyButton();
  createPlayPauseButton();
  createActionButton();
  createRandomizeButton();
  createButtonContainer();
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
        fill(nodeColor)
        stroke(nodeStrokeColor);
        rect(colPos, rowPos, nodeSize - 1, nodeSize - 1);
      }
    }
  }
}


function draw() {

  fps = fpsSlider.value()
  frameRate(fps);
  density = randomizeSlider.value();
  randomizeButton.html(getRandomButtonEmoji());
  background(backgroundColor);
  animateGrid();
  if (isAnimating) executeGridUpdationLogic();
  updateGridFromInput();
}



