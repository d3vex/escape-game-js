
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}
loop();
//code after that will be executed
