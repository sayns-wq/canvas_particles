const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const config = {
  dotMinRad: 6,
  ditMaxRad: 20,
  sphereRad: 350,
  massFactor: 0.002,
  defaultColor: "rgba(250, 10, 30, 0.9)",
  smooth: 0.75,
  bigDotRad: 35,
  mouseSize: 160,
};

const TWO_PI = Math.PI * 2;

let height = (canvas.height = innerHeight);
let width = (canvas.width = innerWidth);
let mouse = { x: width / 2, y: height / 2, isClicked: false };

class Dot {
  constructor(standRad) {
    this.pos = { x: mouse.x, y: mouse.y };
    this.speed = { x: 0, y: 0 };
    this.rad =
      standRad ||
      Math.random() * (config.ditMaxRad - config.dotMinRad) + config.dotMinRad;
    this.mass = this.rad * config.massFactor;
    this.color = config.defaultColor;
  }
  drow(x, y) {
    this.pos.x = x || this.pos.x + this.speed.x;
    this.pos.y = y || this.pos.y + this.speed.y;
    createCircle(this.pos.x, this.pos.y, this.rad, true, this.color);
    createCircle(this.pos.x, this.pos.y, this.rad, false, config.defaultColor);
  }
}

let dots = [];
dots.push(new Dot(config.bigDotRad));

function createCircle(x, y, rad, fill, color) {
  ctx.fillStyle = ctx.strokeStyle;
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, rad, 0, TWO_PI);
  ctx.closePath();
  fill ? ctx.fill() : ctx.stroke();
}

function loop() {
  ctx.clearRect(0, 0, width, height);

  if (mouse.isClicked) {
    dots.push(new Dot());
  }
  updateDots();

  window.requestAnimationFrame(loop);
}

function updateDots() {
  for (let i = 1; i < dots.length; i++) {
    let acc = { x: 0, y: 0 };

    for (let j = 0; j < dots.length; j++) {
      if (i == j) continue;
      let [a, b] = [dots[i], dots[j]];

      let delta = { x: b.pos.x - a.pos.x, y: b.pos.y - a.pos.y };
      let dist = Math.sqrt(delta.x * delta.x + delta.y * delta.y) || 1;
      let force = ((dist - config.sphereRad) / dist) * b.mass;

      if (j == 0) {
        let alpha = config.mouseSize / dist;
        a.color = `rgba(250, 10, 30, ${alpha}`;

        dist < config.mouseSize
          ? (force = (dist - config.mouseSize) * b.mass)
          : (force = a.mass);
      }

      acc.x += delta.x * force;
      acc.y += delta.y * force;
    }

    dots[i].speed.x = dots[i].speed.x * config.smooth + acc.x * dots[i].mass;
    dots[i].speed.y = dots[i].speed.y * config.smooth + acc.y * dots[i].mass;
  }
  dots.forEach((element) => {
    element == dots[0] ? element.drow(mouse.x, mouse.y) : element.drow();
  });
}
loop();

function setPos({ layerX, layerY }) {
  [mouse.x, mouse.y] = [layerX, layerY];
}

function isDown() {
  mouse.isClicked = !mouse.isClicked;
}

canvas.addEventListener(`mousemove`, setPos);
window.addEventListener(`mousedown`, isDown);
window.addEventListener(`mouseup`, isDown);
