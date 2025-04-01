let keys = {};
let canvas = document.getElementById("canvasGame");
let ctx = canvas.getContext("2d");

window.addEventListener("keydown", (e) => (keys[e.key] = true));
window.addEventListener("keyup", (e) => (keys[e.key] = false));

ctx.canvas.width = window.innerWidth / 4;
ctx.canvas.height = window.innerHeight / 4;

let player = {
  x: canvas.width / 2 - 5,
  y: canvas.height / 2 - 5,
  w: 10,
  h: 10,
  speed: 1,
};

let objects = [
  {
    x: -30,
    y: 75,
    w: 50,
    h: 50,
    color: "blue",
  },
];

let background = JSON.parse(localStorage.getItem("background"));
if (!background) {
  background = {
    x: 0,
    y: 0,
    w: canvas.width,
    h: canvas.height,
    speed: 1,
    displayX: 0,
    displayY: 0,
  };
  localStorage.setItem("background", JSON.stringify(background));
}

let diffX = background.w - Math.floor(window.innerWidth / 4);
let diffY = background.h - Math.floor(window.innerHeight / 4);

console.log(diffX, diffY, ctx.canvas.height, window.innerHeight);
ctx.canvas.width = window.innerWidth / 4;
ctx.canvas.height = window.innerHeight / 4;

player = {
  ...player,
  x: ctx.canvas.width / 2 - 5,
  y: ctx.canvas.height / 2 - 5,
};
background = {
  ...background,
  displayX: background.displayX + diffX / 2,
  displayY: background.displayY + diffY / 2,
  w: ctx.canvas.width,
  h: ctx.canvas.height,
};
localStorage.setItem("background", JSON.stringify(background));

window.addEventListener("resize", handleResize);

function handleResize() {
  let diffX = ctx.canvas.width - Math.floor(window.innerWidth / 4);
  let diffY = ctx.canvas.height - Math.floor(window.innerHeight / 4);

  console.log(diffX, diffY, ctx.canvas.height, window.innerHeight);
  ctx.canvas.width = window.innerWidth / 4;
  ctx.canvas.height = window.innerHeight / 4;

  player = {
    ...player,
    x: ctx.canvas.width / 2 - 5,
    y: ctx.canvas.height / 2 - 5,
  };
  background = {
    ...background,
    displayX: background.displayX + diffX / 2,
    displayY: background.displayY + diffY / 2,
    w: ctx.canvas.width,
    h: ctx.canvas.height,
  };
  localStorage.setItem("background", JSON.stringify(background));
}

function update() {
  let dir = { x: 0, y: 0 };

  if (keys["ArrowUp"]) dir.y -= player.speed;
  if (keys["ArrowDown"]) dir.y += player.speed;
  if (keys["ArrowLeft"]) dir.x -= player.speed;
  if (keys["ArrowRight"]) dir.x += player.speed;

  if (dir.x !== 0 && dir.y !== 0) {
    dir.x *= Math.SQRT1_2;
    dir.y *= Math.SQRT1_2;
  }

  background.displayX += dir.x;
  background.displayY += dir.y;

  localStorage.setItem("background", JSON.stringify(background));
}

function drawBackground() {
  objects.forEach((obj) => {
    if (
      obj.x + obj.w > background.displayX &&
      obj.y + obj.h > background.displayY &&
      obj.x < background.displayX + background.w &&
      obj.y < background.displayY + background.h
    ) {
      ctx.fillStyle = obj.color;
      ctx.fillRect(
        obj.x - background.displayX,
        obj.y - background.displayY,
        obj.w,
        obj.h
      );
    }
  });
}
function drawPlayer() {
  ctx.fillStyle = "red";
  ctx.fillRect(player.x, player.y, player.w, player.h);
}
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();
  drawPlayer();
}
