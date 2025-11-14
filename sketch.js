// FINAL STATIC GROUP VERSION – Wheels of Fortune (Dot Structure Only)

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  noLoop();   // static image only
}

function draw() {
  background("#E7EFFA"); // clean bright background, no toggle

  let circleCount = 12;

  for (let i = 0; i < circleCount; i++) {
    let size = random(180, 340);
    let margin = size * 0.7;

    let x = random(margin, width - margin);
    let y = random(margin, height - margin);

    drawCircle(x, y, size);
  }
}

// Draw one multi-layer dot wheel
function drawCircle(x, y, size) {
  push();
  translate(x, y);

  // BACK GLOW
  noStroke();
  fill(0, 0, 0, 40);
  ellipse(0, 0, size * 1.18);

  // MAIN BIG CIRCLE
  fill(randomMainColor());
  ellipse(0, 0, size);

  // RING LINES
  stroke(randomRingColor());
  strokeWeight(2);
  noFill();
  for (let r = size * 0.55; r < size * 0.92; r += size * 0.07) {
    ellipse(0, 0, r);
  }

  // INNER DOT RING
  fill("#E3F2FD");
  stroke(255);
  let insideDots = 16;
  for (let i = 0; i < insideDots; i++) {
    let angle = (360 / insideDots) * i;
    let px = cos(angle) * (size * 0.38);
    let py = sin(angle) * (size * 0.38);
    ellipse(px, py, size * 0.09);
  }

  // OUTER DOT RING
  noStroke();
  fill("#FFB480");
  let outsideDots = 32;
  for (let i = 0; i < outsideDots; i++) {
    let angle = (360 / outsideDots) * i;
    let px = cos(angle) * (size * 0.58);
    let py = sin(angle) * (size * 0.58);
    ellipse(px, py, size * 0.045);
  }

  // SPOKE LINES
  stroke("#FFFFFF");
  strokeWeight(2);
  for (let i = 0; i < 8; i++) {
    let angle = i * 45;
    let px = cos(angle) * (size * 0.43);
    let py = sin(angle) * (size * 0.43);
    line(0, 0, px, py);
  }

  // CENTER DOT
  fill("#1e2c3a");
  stroke("#FFFFFF");
  ellipse(0, 0, size * 0.15);

  noStroke();
  fill("#FF0F95");
  ellipse(0, 0, size * 0.07);

  pop();
}

// Color palette for main circle
function randomMainColor() {
  let colors = [
    "#BBC34A", "#81D4FA", "#F48FB1",
    "#CE93DB", "#FFCC80", "#AED581"
  ];
  return random(colors);
}

// Color palette for ring lines
function randomRingColor() {
  let colors = [
    "#FF7043", "#FFB300",
    "#FDD835", "#FF8F00"
  ];
  return random(colors);
}

