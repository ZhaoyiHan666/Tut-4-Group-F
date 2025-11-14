// -----------------------------------------------------------------------------
// Static group baseline – 9 dot wheels inspired by Pacita Abad & Yayoi Kusama
// -----------------------------------------------------------------------------
// Visual concept:
// - Radial "wheel" structure is inspired by Pacita Abad's “Wheels of Fortune”.
// - Dense dot composition and slight positional jitter are inspired by Yayoi
//   Kusama's immersive dot installations (e.g. "The Obliteration Room").
// Technical note:
// - Several layout and distribution techniques in this file go beyond basic
//   course examples (e.g. jittered grid layout, dot-based spokes, layered
//   clusters). They are documented inline where used.
// -----------------------------------------------------------------------------

let SEED = 20251114;
let wheels = [];
let palette;

const CFG = {
  COUNT: 9,                 // 9 wheels in a loose grid
  GRID_COLS: 3,
  GRID_ROWS: 3,
  MARGIN_RATIO: 0.08,
  BG_LIGHT: [220, 10, 97, 100] // soft background in HSB
};

// High-saturation HSB palettes loosely inspired by Pacita Abad's color use.
// This palette system is not from the course and is used to keep colors
// coherent while allowing variation between wheels.
const PALETTES = [
  [ [355,85,95],[45,95,95],[195,70,90],[115,70,90],[270,50,90] ],
  [ [  5,90,95],[35,95,95],[200,70,92],[140,60,92],[290,55,90] ],
  [ [355,80,96],[28,95,96],[210,55,95],[150,55,92],[300,45,92] ]
];

// ---------- helpers ----------------------------------------------------------

function clamp(x, lo, hi) { return Math.max(lo, Math.min(hi, x)); }

function pick(arr) {
  return arr[Math.floor(random(arr.length))];
}

// Palette selector. The index is fixed for the static group version so
// that the overall color mood is stable across runs.
function getPalette(i = 0) {
  return PALETTES[clamp(i, 0, PALETTES.length - 1)];
}

// Compute a content rectangle based on the smaller window dimension so that
// the layout scales proportionally when the browser is resized.
// This layout helper is not from the course and is used to keep margins
// visually consistent on different screens.
function contentRect(marginRatio) {
  const unit = Math.min(windowWidth, windowHeight);
  const m = unit * marginRatio;
  return { x: m, y: m, w: windowWidth - 2*m, h: windowHeight - 2*m, unit, margin: m };
}

// Generate grid-based positions with jitter so that the wheels roughly
// follow a 3x3 grid but do not look mechanically aligned.
// The jitter technique is not covered in class; it is used here to mimic
// hand-placed compositions and avoid perfectly rigid spacing.
function gridCenters(n, rect, cols, rows) {
  const pts = [];
  const cw = rect.w / cols, ch = rect.h / rows;
  let idx = 0;
  outer: for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cx = rect.x + c*cw + cw*0.5 + random(-cw*0.15, cw*0.15);
      const cy = rect.y + r*ch + ch*0.5 + random(-ch*0.15, ch*0.15);
      pts.push({ x: cx, y: cy });
      idx++; if (idx >= n) break outer;
    }
  }
  return pts;
}

// ---------- Wheel class (dot-only wheel structure) --------------------------

// Wheel represents one circular motif built entirely out of dots:
// - a dense core cluster
// - several dotted rings
// - dotted spokes connecting center to the outer ring
// Using a class to encapsulate this structure goes a bit beyond the most
// basic class examples from the course and is used to keep the code modular
// and readable.
class Wheel {
  constructor(cfg) {
    // expects: x, y, radius, baseHue
    Object.assign(this, cfg);
  }

  draw() {
    this.drawCoreCluster();
    this.drawRingClusters();
    this.drawSpokeChains();
  }

  // Dense cluster near the center. Dots are placed with random polar
  // coordinates to create an organic, non-uniform density.
  drawCoreCluster() {
    push();
    noStroke();
    const n = 50;
    const rMax = this.radius * 0.35;

    for (let i = 0; i < n; i++) {
      const a = random(TWO_PI);
      const r = random(rMax) * random(0.2, 1);
      const x = this.x + r * cos(a);
      const y = this.y + r * sin(a);

      const h = (this.baseHue + random([-20,-10,0,10,20])) % 360;
      const s = 70 + random(-10, 15);
      const b = 95 + random(-10, 0);
      const d = random(this.radius*0.05, this.radius*0.11);

      fill(h, clamp(s,40,100), clamp(b,50,100), 100);
      ellipse(x, y, d, d);
    }
    pop();
  }

  // Several dotted bands suggesting concentric rings. Instead of drawing
  // solid strokes, each ring is composed of many small circles whose radius
  // is slightly jittered to avoid a perfectly smooth outline. This creates
  // a hand-made, Kusama-like dot halo.
  drawRingClusters() {
    push();
    noStroke();
    const bands = 3; // fixed for a clean structure

    for (let i = 0; i < bands; i++) {
      const t = (bands <= 1) ? 0 : i / (bands - 1); // 0..1
      const R = this.radius * (0.55 + 0.4 * t);
      const count = 60;
      const baseSize = lerp(this.radius*0.04, this.radius*0.10, t);

      for (let j = 0; j < count; j++) {
        const a = random(TWO_PI);
        const jitterR = random(-this.radius*0.03, this.radius*0.03);
        const r = R + jitterR;

        const x = this.x + r * cos(a);
        const y = this.y + r * sin(a);

        const h = (this.baseHue + random([-12,-6,0,6,12])) % 360;
        const s = 65 + random(-15, 15);
        const b = 90 + random(-15, 10);
        const d = baseSize * random(0.75, 1.25);

        fill(h, clamp(s,35,100), clamp(b,40,100), 100);
        ellipse(x, y, d, d);
      }
    }
    pop();
  }

  // Chains of dots forming implied spokes. Instead of a single line,
  // each spoke is represented by a sequence of circles that gradually
  // shrink from center to outer ring. This dot-based line rendering is
  // not part of the course examples; it is used here to stay consistent
  // with the dotted visual language.
  drawSpokeChains() {
    push();
    noFill();
    const spokeCount = 8;
    const steps = 11;
    const innerR = this.radius * 0.2;
    const outerR = this.radius * 0.9;

    for (let i = 0; i < spokeCount; i++) {
      const a = i * 360 / spokeCount;
      for (let k = 0; k <= steps; k++) {
        const t = k / steps;
        const r = lerp(innerR, outerR, t) + random(-this.radius*0.01, this.radius*0.01);
        const x = this.x + r * cos(a);
        const y = this.y + r * sin(a);

        const h = (this.baseHue + random([-5,0,5])) % 360;
        const s = 30 + t*55 + random(-10, 10);
        const b = 100 - t*45 + random(-5, 5);
        const d = lerp(this.radius*0.09, this.radius*0.03, t) * random(0.85, 1.1);

        noStroke();
        fill(h, clamp(s,20,100), clamp(b,40,100), 100);
        ellipse(x, y, d, d);
      }
    }
    pop();
  }
}

// ---------- p5 setup / draw --------------------------------------------------

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  noLoop();           // static group baseline (no animation, no interaction)
  regenerateScene();  // generate once
}

function draw() {
  background(...CFG.BG_LIGHT);
  for (const w of wheels) w.draw();
}

// On resize, rebuild the scene so that the wheels keep a similar layout
// relative to the new window size.
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  regenerateScene();
}

// Build 9 wheels with clearly different sizes, using a predefined set of
// radius factors. This guarantees visible variation instead of relying only
// on small random differences.
function regenerateScene() {
  randomSeed(SEED);
  noiseSeed(SEED);

  const rect = contentRect(CFG.MARGIN_RATIO);
  const centers = gridCenters(CFG.COUNT, rect, CFG.GRID_COLS, CFG.GRID_ROWS);
  const unit = rect.unit;

  palette = getPalette(0); // fixed palette for the static group version
  wheels = [];

  const radiusFactors = [
    0.14, 0.18, 0.24,
    0.20, 0.26, 0.16,
    0.22, 0.13, 0.28
  ];

  centers.forEach((p, idx) => {
    const factor = radiusFactors[idx % radiusFactors.length];
    const radius = unit * factor;
    const base = pick(palette);

    wheels.push(new Wheel({
      x: p.x,
      y: p.y,
      radius,
      baseHue: base[0]
    }));
  });

  redraw();
}
