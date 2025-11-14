 //  Iteration 2
function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  noLoop(); 
}

function draw() {
  background("#1e2c3a");

  // how many circles we want to draw on the screen
  let circleCount = 15;

  for (let i = 0; i < circleCount; i++) {

    // random size for each circle
    let size = random(180, 320);

    // keep circles away from the edges
    let margin = size * 0.7;
    let x = random(margin, width - margin);
    let y = random(margin, height - margin);

    // draw one circle design
    drawCircle(x, y, size);
  }
}

// draw one circle with many patterns
function drawCircle(x, y, size) {
  push();
  translate(x, y);

  // Back glow
  noStroke();
  fill(0, 0, 0, 60); 
  ellipse(0, 0, size * 1.18);

  // main circle
  fill(randomMainColor()); 
  ellipse(0, 0, size);

  // ring lines around the circle
  stroke(randomRingColor()); 
  strokeWeight(2);
  noFill();
  for (let r = size * 0.55; r < size * 0.92; r += size * 0.07) {
    ellipse(0, 0, r);
  }

  // inside dots
  fill("#E3F2FD");
  stroke(255);
  let insideDots = 16;

  for (let i = 0; i < insideDots; i++) {
    let angle = i * (360 / insideDots);
    let px = cos(angle) * (size * 0.38);
    let py = sin(angle) * (size * 0.38);
    ellipse(px, py, size * 0.09);
  }

  // outside dots
  noStroke();
  fill("#FF8A80");
  let outsideDots = 32;

  for (let i = 0; i < outsideDots; i++) {
    let angle = i * (360 / outsideDots);
    let px = cos(angle) * (size * 0.58);
    let py = sin(angle) * (size * 0.58);
    ellipse(px, py, size * 0.045);
  }

  // 8 lines like wheel spokes
  stroke("#FFFFFF");
  for (let i = 0; i < 8; i++) {
    let angle = i * 45;
    let px = cos(angle) * (size * 0.43);
    let py = sin(angle) * (size * 0.43);
    line(0, 0, px, py);
  }

  // center dots
  fill("#1e2c3a");
  stroke("#FFFFFF");
  ellipse(0, 0, size * 0.15);

  noStroke();
  fill("#F0FF95");
  ellipse(0, 0, size * 0.07);

  pop();
}

// random color for the main big circle
function randomMainColor() {
  let colors = ["#8BC34A", "#81D4FA", "#F48FB1", "#CE93D8", "#FFCC80", "#AED581"];
  return random(colors);
}

// random color for ring lines
function randomRingColor() {
  let colors = ["#FFB300", "#FF7043", "#FDD835", "#FF8F00"];
  return random(colors);
}
