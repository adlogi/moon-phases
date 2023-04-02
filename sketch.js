let canvas;
let ctx;

const daysPerMonth = 30;
const earthD = 160;
const moonD = earthD / 3.7;
const earthMoonD = 380;
const timeOfDay = [
  'Midnight',
  'Post-Midnight',
  'Sunrise',
  'Morning',
  'Noon',
  'Afternoon',
  'Sunset',
  'Evening'
];
const phaseNames = [
  'Waxing Crescent',
  'First Quarter',
  'Waxing Gibbous',
  'Full Moon',
  'Waning Gibbous',
  'Last Quarter',
  'Waning Crescent',
  'New Moon'
];

const colors = [
  [0, '00000c', 1, '00000c'],
  [0, '020111', 1, '191621'],
  [0, '020111', 1, '20202c'],
  [0, '020111', 1, '3a3a52'],
  [0, '20202c', 1, '515175'],
  [0, '40405c', 0.8, '6f71aa', 1, '8a76ab'],
  [0, '4a4969', 0.5, '7072ab', 1, 'cd82a0'],
  [0, '757abf', 0.6, '8583be', 1, 'eab0d1'],
  [0, '82addb', 1, 'ebb2b1'],
  [0, '94c5f8', 0.7, 'a6e6ff', 1, 'b1b5ea'],
  [0, 'b7eaff', 1, '94dfff'],
  [0, '9be2fe', 1, '67d1fb'],
  [0, '90dffe', 1, '38a3d1'],
  [0, '57c1eb', 1, '246fa8'],
  [0, '2d91c2', 1, '1e528e'],
  [0, '2473ab', 0.7, '1e528e', 1, '5b7983'],
  [0, '1e528e', 0.5, '265889', 1, '9da671'],
  [0, '1e528e', 0.5, '728a7c', 1, 'e9ce5d'],
  [0, '154277', 0.3, '576e71', 0.7, 'e1c45e', 1, 'b26339'],
  [0, '163C52', 0.3, '4F4F47', 0.6, 'C5752D', 0.8, 'B7490F', 1, '2F1107'],
  [0, '071B26', 0.3, '071B26', 0.8, '8A3B12',1, '240E03'],
  [0.3, '010A10', 0.8, '59230B', 1, '2F1107'],
  [0.5, '090401', 1, '4B1D06'],
  [0.8, '00000c', 1, '150800'],
];
// Source: https://codepen.io/billyysea/pen/nLroLY

let night = 0;
let time = 0;
let universePanelRatio = 0.8;
let uWidth;

let fade = 0;
let fadeAmount = 1
let horizonDisplayed = false;
let locationDisplayed = false;

// images
let earth, moon, arrow, horizon, ray, universe;
let moonPhases = [];

function preload() {
  for (let i = 0; i < daysPerMonth; i++) {
    moonPhases[i] = loadImage('assets/moon-phases/' + (i + 1) + '.jpg');
  }
  earth = loadImage('assets/earth-0.png');
  moon = loadImage('assets/moon-above.png');
  horizon = loadImage('assets/horizon.png');
  arrow = loadImage('assets/arrow.png');
  ray = loadImage('assets/ray.png');
  universe = loadImage('assets/universe.jpg');
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  ctx = canvas.drawingContext;
  uWidth = width * universePanelRatio;
  setInterval(() => {
    locationDisplayed = true;
    fade = 0;
    fadeAmount = 1;
  }, 15000);
}

function draw() {
  background(0);
  tint(255, 100);
  image(universe, 0, 0, uWidth, height);
  noTint();
  noStroke();

  // Sun Placement
  const sunArcHeight = 0.02 * height;
  fill(255, 175, 50);
  // r = (h/2) + (c^2 / 8h)
  // theta = 2 * acos(c / 2r)
  // where h = r - distanceFromCenter, c: chord
  // see: https://planetcalc.com/1421/
  let r = sunArcHeight / 2 + ((uWidth * uWidth) / (8 * sunArcHeight));
  let theta = PI - (2 * Math.acos(uWidth / (2 * r)));
  let numOfRays = 20;
  push();
  translate(uWidth / 2, height + r - sunArcHeight);
  arc(
    0,
    0,
    2 * r,
    2 * r,
    -PI / 2 - theta / 2,
    -PI / 2 + theta / 2,
    CHORD
  );
  for (let i = 0; i < numOfRays; i++) {
    push();
    rotate(PI + ((i - 10) / 20 * theta));
    image(ray, 0, r + 5, 7, 50);
    pop();
  }
  pop();
  
  // Earth Placement
  push();
  translate(uWidth / 2, height / 2);
  rotate(PI - time * PI / 12)

  if (horizonDisplayed) {
    // For creating radial gradients see: https://codepen.io/pelletierauger/pen/GqJRXE
    // Also: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/createRadialGradient
    let gradient = ctx.createRadialGradient(0, -150, 200, 0, 50, 400);
    for (let i = 0; i < colors[time].length / 2; i++) {
      gradient.addColorStop(1 - colors[time][i * 2], '#' + colors[time][i * 2 + 1] + 'CC');
    }
    ctx.fillStyle = gradient;
    arc(0, 0 - 40, earthD * 5.22, earthD * 5.22, 0 + PI / 58, PI - PI / 58);
    image(horizon, -(earthD * 5.22) / 2, -earthD * 0.3, earthD * 5.22, earthD);
  } else {
    image(earth, -earthD / 2, -earthD / 2, earthD, earthD);

    if (locationDisplayed) {
      tint(255, fade);
      image(arrow, 0, earthD / 4, earthD / 2, earthD / 2);
      rotate((time - 2) * PI / 2);
      fill(204, 204, 204, fade);
      textSize(20);
      textAlign(CENTER);
      switch (time) {
        case 0:
          text("You are here!", -earthD * 0.8, -earthD * 1.1, 100, 100);
          break;
        case 1:
          text("You are here!", -earthD * 1.3, earthD * 0.3, 100, 100);
          break;
        case 2:
          text("You are here!", earthD * 0.2, earthD * 0.8, 100, 100);
          break;
        case 3:
          text("You are here!",earthD * 0.75, -earthD * 0.6, 100, 100);
          break;
        default:
          text("You are here!", 0, 0, 100, 100);
          break;
      }

      if (fade < 0) {
        // fadeAmount = 10;
        locationDisplayed = false;
      }
      if (fade > 255) {
        fadeAmount = -1;
      }
      fade += fadeAmount;
    }
  }
  pop();

  // Moon Placement
  push();
  translate(uWidth / 2, height / 2);
  rotate(PI - (night + 1) * 2 * PI / daysPerMonth);
  translate(0, -earthMoonD);

  if (horizonDisplayed) {
    // mask the moon phase image
    // See: https://www.youtube.com/watch?v=Wdz71QzcdyY
    let cnv = createGraphics(moonD, moonD);
    let littleMoon = moonPhases[night].get();
    cnv.ellipse(cnv.width / 2, cnv.height / 2, moonD * 0.95, moonD * 0.95);
    littleMoon.mask(cnv);
    image(littleMoon, -moonD / 2, -moonD / 2, moonD, moonD);
  } else {
    image(moon, -moonD / 2, -moonD / 2, moonD, moonD);
  
    // Moon's dark side
    push();
    rotate((night + 1) * 2 * PI / daysPerMonth);
    fill(255, 0, 0, 200);
    arc(0, 0, moonD, moonD, 0, PI);
    pop();

    // Moon's far side
    fill(0, 0, 255, 200);
    arc(0, 0, moonD, moonD, PI, 0);

    // Moon's dark and far sides in one arc
    /*
    fill(0, 0, 0, 200);
    if (night < 15) {
      arc(0, 0, moonD, moonD, (2 * PI / 30) * (night  + 1), 0);
    } else if (night < 29) {
      arc(0, 0, moonD, moonD, PI, (2 * PI / 30) * (night  + 1) - PI);
    } else {
      arc(0, 0, moonD, moonD, 0, 2 * PI);
    }
    */
  }
  pop();

  // Moon phase panel
  let phasePanelWidth = (1 - universePanelRatio) * width;
  let phaseWidth = 0.8 * phasePanelWidth;
  let phaseHeight = phaseWidth;
  const phaseOffset = 30;
  const timeOffset = 380;
  const keyOffset = height - 120;
  push();
  translate(width - phasePanelWidth, 0);
  image(
    moonPhases[night],
    0.5 * (phasePanelWidth - phaseWidth),
    0.5 * (phasePanelWidth - phaseWidth) + phaseOffset,
    phaseWidth,
    phaseHeight
  );

  textAlign(CENTER);
  fill(255);
  textSize(100);
  text((night + 1), phasePanelWidth / 2, phaseHeight + 140 + 40);
  textSize(20);
  text("Night" + (night === 0 ? '' : 's') + " of the Lunar Month", phasePanelWidth / 2, phaseHeight + 200 + 40);
  textSize(30);
  let moonPhaseName = phaseNames[0];
  if (night < 7) {
    moonPhaseName = phaseNames[0];
  } else if (night < 8) {
    moonPhaseName = phaseNames[1];
  } else if (night < 14) {
    moonPhaseName = phaseNames[2];
  } else if (night < 15) {
    moonPhaseName = phaseNames[3];
  } else if (night < 22) {
    moonPhaseName = phaseNames[4];
  } else if (night < 23) {
    moonPhaseName = phaseNames[5];
  } else if (night < 29) {
    moonPhaseName = phaseNames[6];
  } else {
    moonPhaseName = phaseNames[7];
  }
  text('( ' + moonPhaseName + ' )', phasePanelWidth / 2, phaseHeight + 240 + 40);
  
  textSize(40);
  let tod = timeOfDay[0];
  if (time < 1) {
    tod = timeOfDay[0];
  } else if (time < 6) {
    tod = timeOfDay[1];
  } else if (time < 7) {
    tod = timeOfDay[2];
  } else if (time < 12) {
    tod = timeOfDay[3];
  } else if (time < 13) {
    tod = timeOfDay[4];
  } else if (time < 18) {
    tod = timeOfDay[5];
  } else if (time < 19) {
    tod = timeOfDay[6];
  } else {
    tod = timeOfDay[7];
  }
  text(tod, phasePanelWidth / 2, phaseHeight + timeOffset);
  
  textSize(20);
  text("Dubai's Time", phasePanelWidth / 2, phaseHeight + timeOffset + 40);

  fill(0, 0, 255);
  rect(40, keyOffset, 20, 20);
  fill(255, 0, 0);
  rect(40, keyOffset + 30, 20, 20);
  fill(255, 175, 50);
  rect(40, keyOffset + 60, 20, 20);
  textSize(16);
  textAlign(LEFT, TOP);
  fill('#CCCCCC');
  text("Moon's far side", 80, keyOffset + 3);
  text("Moon's dark side", 80, keyOffset + 30 + 3);
  text("The Sun", 80, keyOffset + 60 + 3);
  
  pop();
}

function keyPressed() {
  switch (keyCode) {
    case (UP_ARROW):
      time = (time + 1) % 24;
      break;
    case (DOWN_ARROW):
      time = (time - 1) < 0 ? 23 : time - 1;
      break;
    case (RIGHT_ARROW):
      night = (night + 1) % daysPerMonth;
      break;
    case (LEFT_ARROW):
      night = (night - 1) < 0 ? 29 : night - 1;
      break;
    case (32): // Space
      horizonDisplayed = !horizonDisplayed;
      break;
  }
}
