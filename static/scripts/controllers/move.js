let keys = {};
let canvas = document.getElementById("canvasGame");
let ctx = canvas.getContext("2d");


window.addEventListener('keydown', (e) => keys[e.key] = true)
window.addEventListener('keyup', (e) => keys[e.key] = false)



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

let background = {
  x: 0,
  y: 0,
  w: canvas.width,
  h: canvas.height,
  speed: 1,
  displayX: 0,
  displayY: 0,
};

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
}

function drawBackground() {
  objects.forEach((obj) => {

    if (
      obj.x + obj.w > background.displayX &&
      obj.y + obj.h > background.displayY &&
      obj.x < background.displayX+background.w &&
      obj.y < background.displayY+background.h
    
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
