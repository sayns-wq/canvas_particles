class GradientAnimation {
  constructor() {
    this.cnv = document.querySelector("canvas");
    this.ctx = this.cnv.getContext("2d");
    this.circlesNum = 20;
    this.speed = 0.005;
    this.minRadius = 400;
    this.maxRadius = 800;
    this.setCanvasSize();
    this.createCircles();
    window.onresize = () => {
      this.setCanvasSize();
      this.createCircles();
    };
    this.drawAnimation();
  }
  setCanvasSize() {
    this.w = this.cnv.width = innerWidth;
    this.h = this.cnv.height = innerHeight;
  }
  createCircles() {
    this.circles = [];
    for (let i = 0; i < this.circlesNum; i++) {
      this.circles.push(
        new Circle(this.w, this.h, this.minRadius, this.maxRadius)
      );
    }
  }
  drawCircles() {
    this.circles.forEach((circle) => {
      circle.draw(this.ctx, this.speed);
    });
  }
  drawAnimation() {
    this.clearCanvas();
    this.drawCircles();
    window.requestAnimationFrame(() => this.drawAnimation());
  }
  clearCanvas() {
    this.ctx.clearRect(0, 0, this.w, this.h);
  }
}

class Circle {
  constructor(w, h, minR, maxR) {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.radius = Math.random() * (maxR - minR) + minR;
    this.angle = Math.random() * 2 * Math.PI;
    this.firstColor = `hsla(${Math.random() * 360}, 100%, 50%, 1)`;
    this.secondColor = `hsla(${Math.random() * 360}, 100%, 50%, 0)`;
  }
  draw(ctx, speed) {
    this.angle += speed;
    const x = this.x + Math.cos(this.angle) * 200;
    const y = this.y + Math.sin(this.angle) * 200;
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, this.radius);
    gradient.addColorStop(0, this.firstColor);
    gradient.addColorStop(1, this.secondColor);
    ctx.globalCompositeOperation = `saturation`;
    // ctx.globalCompositeOperation = `overlay`;
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
  }
}
new GradientAnimation();
