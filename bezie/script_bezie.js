const config = {
  waveSpeed: 1,
  wavesToBlend: 4,
  curvesNum: 30,
  framesToMove: 120,
};

class waveNoise {
  constructor() {
    this.wavesSet = [];
  }
  addWaves(requiredWaves) {
    for (let i = 0; i < requiredWaves; i++) {
      let randomAngle = Math.random() * 360;
      this.wavesSet.push(randomAngle);
    }
  }
  getWave() {
    let blendedWave = 0;
    for (let e of this.wavesSet) {
      blendedWave += Math.sin((e / 180) * Math.PI);
    }
    return (blendedWave / this.wavesSet.length + 1) / 2;
  }
  update() {
    this.wavesSet.forEach((element, i) => {
      let r = Math.random() * (i + 1) * config.waveSpeed;
      this.wavesSet[i] = (element + r) % 360;
    });
  }
}
class Animation {
  constructor() {
    this.cnv = null;
    this.ctx = null;
    this.size = { w: 0, h: 0, cx: 0, cy: 0 };
    this.controls = [];
    this.controlsNum = 3;
    this.framesCounter = 0;
    this.typeStart = 0;
    this.typeEnd = 0;
  }
  init() {
    this.createCanvas();
    this.createControls();
    this.updateAnimation();
  }
  createControls() {
    for (let i = 0; i < this.controlsNum + config.curvesNum; i++) {
      let control = new waveNoise();
      control.addWaves(config.wavesToBlend);
      this.controls.push(control);
    }
  }
  createCanvas() {
    this.cnv = document.querySelector("canvas");
    this.ctx = this.cnv.getContext("2d");
    this.setCanvasSize();
    window.addEventListener("resize", () => this.setCanvasSize());
  }
  setCanvasSize() {
    this.size.w = this.cnv.width = window.innerWidth;
    this.size.h = this.cnv.height = window.innerHeight;
    this.size.cx = this.size.w / 2;
    this.size.cy = this.size.h / 2;
  }
  updateCurves() {
    let sevedControls = this.controls;
    let _controlX1 = sevedControls[0].getWave() * this.size.w;
    let _controlY1 = sevedControls[1].getWave() * this.size.h;
    let _controlX2 = sevedControls[2].getWave() * this.size.w;

    for (let i = 0; i < config.curvesNum; i++) {
      let _controlY2 = sevedControls[3 + i].getWave();

      let curveParam = {
        startX: 0,
        startY: this.getYPlacementType(this.typeStart, i),
        controlX1: _controlX1,
        controlX2: _controlX2,
        controlY1: _controlY1,
        controlY2: _controlY2 * this.size.h,
        endX: this.size.w,
        endY: this.size.h,
        alfa: _controlY2,
      };
      this.drowCurve(curveParam);
    }
  }
  drowCurve({
    startX,
    startY,
    controlX1,
    controlX2,
    controlY1,
    controlY2,
    endX,
    endY,
    alfa,
  }) {
    this.ctx.strokeStyle = "rgba(255, 255, 255, " + alfa + ")";
    this.ctx.beginPath();
    this.ctx.moveTo(startX, startY);
    this.ctx.bezierCurveTo(
      controlX1,
      controlY1,
      controlX2,
      controlY2,
      endX,
      endY
    );
    this.ctx.stroke();
  }
  updateCanvas() {
    this.ctx.fillStyle = "#333";
    this.ctx.fillRect(0, 0, this.size.w, this.size.h);
  }
  updateControls() {
    this.controls.forEach((control) => {
      control.update();
    });
  }
  updateFrameCounter() {
    this.framesCounter = (this.framesCounter + 1) % config.framesToMove;
    if (this.framesCounter == 0) {
      this.typeStart = Math.random();
      this.typeEnd = Math.random();
    }
  }
  getYPlacementType(type, i) {
    if (i > 0.6) {
      return (this.size.h / config.curvesNum) * i;
    } else if (i > 0.4) {
      return this.size.h;
    } else if (i > 0.2) {
      return this.size.cy;
    } else {
      return 0;
    }
  }
  updateAnimation() {
    this.updateFrameCounter();
    this.updateCanvas();
    this.updateCurves();
    this.updateControls();
    window.requestAnimationFrame(() => this.updateAnimation());
  }
}

window.onload = () => {
  new Animation().init();
};
