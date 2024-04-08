(() => {
  const cnv = document.querySelector("canvas");
  const ctx = cnv.getContext("2d");

  const numRings = 3;
  const radius = 200;
  const waveCount = 7;
  const waveHeight = 17;
  const colors = ["#771122", "#0077ff", "#ffcc00"];
  const waveOffset = 15;
  let startAngle = 0;
  function init() {
    cnv.width = window.innerWidth;
    cnv.height = window.innerHeight;
  }

  init();
  const centerX = cnv.width / 2;
  const centerY = cnv.height / 2;
  function drawRing(ringRadius, color, offsetAngle) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 9;
    ctx.beginPath();
    for (let i = -180; i < 180; i++) {
      let currentAngle = ((i + startAngle) * Math.PI) / 180;
      let displacement = 0;
      let now = Math.abs(i);
      if (now > 70) {
        displacement = (now - 70) / 70;
      }
      if (displacement >= 1) {
        displacement = 1;
      }
      let waveAmplitude =
        ringRadius +
        displacement *
          Math.sin((currentAngle + offsetAngle) * waveCount) *
          waveHeight;
      let x = centerX + Math.cos(currentAngle) * waveAmplitude;
      let y = centerY + Math.sin(currentAngle) * waveAmplitude;
      i > -180 ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
  }
  const ringRadiusOffseet = 7;

  function updeteRings() {
    for (let i = 0; i < numRings; i++) {
      let ringRadius = radius + i * ringRadiusOffseet;
      let offsetAngle = i * waveOffset * (Math.PI / 180);
      drawRing(ringRadius, colors[i], offsetAngle);
    }
    if (startAngle >= 360) {
      startAngle = 1;
    } else {
      startAngle++;
    }
  }

  function loop() {
    ctx.clearRect(0, 0, cnv.width, cnv.height);
    updeteRings();
    requestAnimationFrame(loop);
  }
  loop();
  window.addEventListener("resize", init);
})();
