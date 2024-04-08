(() => {
  const cnv = document.querySelector("canvas");
  const ctx = cnv.getContext("2d");

  let cw, ch, cx, cy;

  const config = {
    bgFillColor: "rgba(50, 50, 50, 0.05)",
    dirsCount: 4,
    stepsToTurn: 15,
    dotSize: 2,
    dotsCount: 400,
    dotVilocity: 2,
    distance: 70,
    hue: 0,
    gradientLength: 5,
    gridAngle: 0,
  };

  function drowRect(
    color,
    x,
    y,
    w,
    h,
    shadowColor = "black",
    shadowBlur = "1"
  ) {
    ctx.shadowColor = shadowColor;
    ctx.shadowBlur = shadowBlur;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
  }
  function resizeCanvas() {
    cw = cnv.width = innerWidth;
    ch = cnv.height = innerHeight;
    cx = cw / 2;
    cy = ch / 2;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  class Dot {
    constructor() {
      this.pos = {
        x: cx,
        y: cy,
      };
      this.dir =
        config.dirsCount == 6
          ? ((Math.random() * 3) | 0) * 2
          : (Math.random() * config.dirsCount) | 0;
      this.step = 0;
    }

    redrowDot() {
      let xy = Math.abs(this.pos.x - cx) + Math.abs(this.pos.y - cy);
      let makeHue = (config.hue + xy / config.gradientLength) % 360;
      let color = `hsl(${makeHue}, 100%, 50%)`;
      let size = config.dotSize;
      let blur = config.dotSize - Math.sin(xy / 2) * 2;
      let x = this.pos.x - size / 2;
      let y = this.pos.y - size / 2;

      drowRect(color, x, y, size, size, color, blur);
    }
    moveDot() {
      this.step++;
      this.pos.x += dirsList[this.dir].x * config.dotVilocity;
      this.pos.y += dirsList[this.dir].y * config.dotVilocity;
    }
    changeDir() {
      if (this.step % config.stepsToTurn == 0) {
        this.dir =
          Math.random() > 0.5
            ? (this.dir + 1) % config.dirsCount
            : (this.dir + config.dirsCount - 1) % config.dirsCount;
      }
    }
    killDot(index) {
      let percent = Math.random() * Math.exp(this.step / config.distance);
      if (percent > 100) {
        dotsList.splice(index, 1);
      }
    }
  }

  let dirsList = [];
  function creatDirs() {
    for (let i = 0; i < 360; i += 360 / config.dirsCount) {
      let angle = config.gridAngle + i;
      let x = Math.cos((angle * Math.PI) / 180);
      let y = Math.sin((angle * Math.PI) / 180);
      dirsList.push({
        x,
        y,
      });
    }
  }
  creatDirs();

  let dotsList = [];

  function addDot() {
    if (dotsList.length < config.dotsCount && Math.random() > 0.7) {
      dotsList.push(new Dot());
      config.hue = (config.hue + 1) % 360;
    }
  }

  function refreshDots() {
    dotsList.forEach((dot, index) => {
      dot.moveDot();
      dot.redrowDot();
      dot.changeDir();
      dot.killDot(index);
    });
  }

  function loop() {
    drowRect(config.bgFillColor, 0, 0, cw, ch);
    addDot();
    refreshDots();

    window.requestAnimationFrame(loop);
  }

  loop();
})();
