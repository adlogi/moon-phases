const daysPerMonth = 30;
const earthD = 160;
const moonD = earthD / 3.7;
const earthMoonD = 380;
const timeOfDay = ['Midnight', 'Sunrise', 'Noon', 'Sunset'];
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
  createCanvas(windowWidth, windowHeight);
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
  rotate((2 - time) * PI / 2);

  if (horizonDisplayed) {
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
  pop();

  // Moon phase panel
  let phasePanelWidth = (1 - universePanelRatio) * width;
  let phaseWidth = 0.8 * phasePanelWidth;
  let phaseHeight = phaseWidth;
  push();
  translate(width - phasePanelWidth, 0);
  image(
    moonPhases[night],
    0.5 * (phasePanelWidth - phaseWidth),
    0.5 * (phasePanelWidth - phaseWidth) + 30,
    phaseWidth,
    phaseHeight
  );

  textAlign(CENTER);
  fill(255);
  textSize(100);
  text((night + 1), phasePanelWidth / 2, phaseHeight + 140 + 40);
  textSize(20);
  text("Night of the Lunar Month", phasePanelWidth / 2, phaseHeight + 200 + 40);
  textSize(40);
  text(timeOfDay[time], phasePanelWidth / 2, phaseHeight + 320 + 40);
  textSize(20);
  text("Dubai's Time", phasePanelWidth / 2, phaseHeight + 360 + 40);

  fill(0, 0, 255);
  rect(40, height - 120, 20, 20);
  fill(255, 0, 0);
  rect(40, height - 80, 20, 20);
  fill(255, 175, 50);
  rect(40, height - 40, 20, 20);
  textSize(16);
  textAlign(LEFT, TOP);
  fill('#CCCCCC');
  text("Moon's far side", 80, height - 120 + 3);
  text("Moon's dark side", 80, height - 80 + 3);
  text("The Sun", 80, height - 40 + 3);
  
  pop();
}

function keyPressed() {
  switch (keyCode) {
    case (UP_ARROW):
      time = (time + 1) % 4;
      break;
    case (DOWN_ARROW):
      time = (time - 1) < 0 ? 3 : time - 1;
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
