"use-strict";

/*  Love Saroha
    lovesaroha1994@gmail.com (email address)
    https://www.lovesaroha.com (website)
    https://github.com/lovesaroha  (github)
*/

// Themes.
const themes = [
  {
      normal: "#5468e7",
      dark: "#4c5ed0",
      light: "#98a4f1",
      veryLight: "#eef0fd"
  }, {
      normal: "#e94c2b",
      dark: "#d24427",
      veryLight: "#fdedea",
      light: "#f29480"
  }
];

// Choose random color theme.
let colorTheme = themes[Math.floor(Math.random() * themes.length)];

// This function set random color theme.
function setTheme() {
  // Change css values.
  document.documentElement.style.setProperty("--primary", colorTheme.normal);
}

// Set random theme.
setTheme();

// Get canvas info from DOM.
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

// Define values.
var rows = 10;
var cols = 10;
var cellWidth = 500 / cols;
var grid = [];
var stack = [];
function Cell(i, j) {
  this.i = i;
  this.j = j;
  this.x = j * cellWidth;
  this.y = i * cellWidth;
  this.walls = [true, true, true, true];
  this.visited = false;
  this.current = false;
}

// Show cell.
Cell.prototype.display = function () {
  if (this.walls[0]) {
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x + cellWidth, this.y);
    ctx.strokeStyle = colorTheme.normal;
    ctx.lineWidth = 5;
    ctx.stroke();
  }
  if (this.walls[1]) {
    ctx.beginPath();
    ctx.moveTo(this.x + cellWidth, this.y);
    ctx.lineTo(this.x + cellWidth, this.y + cellWidth);
    ctx.strokeStyle = colorTheme.normal;
    ctx.lineWidth = 5;
    ctx.stroke();
  }
  if (this.walls[2]) {
    ctx.beginPath();
    ctx.moveTo(this.x, this.y + cellWidth);
    ctx.lineTo(this.x + cellWidth, this.y + cellWidth);
    ctx.strokeStyle = colorTheme.normal;
    ctx.lineWidth = 5;
    ctx.stroke();
  }
  if (this.walls[3]) {
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x, this.y + cellWidth);
    ctx.strokeStyle = colorTheme.normal;
    ctx.lineWidth = 5;
    ctx.stroke();
  }
  if (this.current) {
    ctx.fillStyle = colorTheme.light;
    ctx.fillRect(this.x, this.y, cellWidth, cellWidth);
  }
}

// Make grid.
function makeGrid() {
  for (let i = 0; i < rows; i++) {
    grid[i] = [];
    for (let j = 0; j < cols; j++) {
      grid[i].push(new Cell(i, j));
    }
  }
}
makeGrid();
var current = grid[0][0];
current.visited = true;
current.current = true;

// Show grid.
function showGrid() {
  ctx.clearRect(0, 0, 500, 500); 
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      grid[i][j].display();
    }
  }
}


// Choose neighbor.
Cell.prototype.selectNeighbor = function () {
  let neighbors = [];
  if (this.j > 0) {
    let left = grid[this.i][(this.j - 1)];
    if (left && left.visited == false) {
      neighbors.push(left);
    }
  }
  if (this.i > 0) {
    let top = grid[(this.i - 1)][this.j];
    if (top && top.visited == false) {
      neighbors.push(top);
    }
  }
  if (this.i < rows - 1) {
    let bottom = grid[(this.i + 1)][this.j];
    if (bottom && bottom.visited == false) {
      neighbors.push(bottom);
    }
  }
  if (this.j < cols - 1) {
    let right = grid[this.i][(this.j + 1)];
    if (right && right.visited == false) {
      neighbors.push(right);
    }
  }
  if (neighbors.length > 0) {
    return neighbors[Math.floor(Math.random() * neighbors.length)];
  } else {
    return undefined;
  }
}

function draw() {
  ctx.globalCompositeOperation = 'destination-over';
  ctx.clearRect(0, 0, canvas.width, canvas.height); 
  showGrid();
  let next = current.selectNeighbor();
  if (next) {
    stack.push(next);
    removeWalls(next, current);
    next.visited = true;
    current.current = false;
    current = next;
    current.current = true;
  } else {
    stack[(stack.length - 1)].current = false;
    stack.splice((stack.length - 1), 1);
    if (stack.length == 0) {
      showGrid();
      return;
    } else {
      current = stack[(stack.length - 1)];
      current.current = true;
    }
  }
  window.requestAnimationFrame(draw);
}

draw();

// Remove walls.
function removeWalls(next, current) {
  if (next.i == (current.i - 1) && next.j == current.j) {
    next.walls[2] = false;
    current.walls[0] = false;
  }
  if (next.i == current.i && next.j == (current.j - 1)) {
    next.walls[1] = false;
    current.walls[3] = false;
  }
  if (next.i == current.i && next.j == (current.j + 1)) {
    next.walls[3] = false;
    current.walls[1] = false;
  }
  if (next.j == current.j && next.i == (current.i + 1)) {
    next.walls[0] = false;
    current.walls[2] = false;
  }
}