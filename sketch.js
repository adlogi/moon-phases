const daysPerMonth = 30;
const earthD = 160;
const moonD = earthD / 3.7;
const earthMoonD = 380;
const timeOfDay = ['Midnight', 'Sunrise', 'Noon', 'Sunset'];
let night = 0;
let time = 0;
let globeDirection = 0;

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
  setInterval(() => {
    locationDisplayed = true;
    fade = 0;
    fadeAmount = 1;
  }, 15000);
}

function draw() {
  background(0);
  tint(255, 100);
  image(universe, 0, 0, width, height);
  noTint();
  noStroke();

  // Sun Placement
  const sunArcHeight = 0.02 * height;
  fill(255, 175, 50);
  // r = (h/2) + (c^2 / 8h)
  // theta = 2 * acos(c / 2r)
  // where h = r - distanceFromCenter, c: chord
  // see: https://planetcalc.com/1421/
  let r = sunArcHeight / 2 + ((width * width) / (8 * sunArcHeight));
  let theta = PI - (2 * Math.acos(width / (2 * r)));
  let numOfRays = 20;
  push();
  translate(width / 2, height + r - sunArcHeight);
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

  // Moon phase placement
  push();
  let phaseDisplayWidth = moonPhases[night].width / 2;
  let phaseDisplayHeight = moonPhases[night].height / 2;
  translate(width - 0.7 * phaseDisplayWidth, 0.7 * phaseDisplayHeight);
  image(
    moonPhases[night],
    -phaseDisplayWidth / 2,
    -phaseDisplayHeight / 2,
    phaseDisplayWidth,
    phaseDisplayHeight
  );
  pop();
  
  // Earth Placement
  push();
  translate(width / 2, height / 2);
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
  translate(width / 2, height / 2);
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

  fill(0, 0, 255);
  rect(40, 30, 20, 20);
  fill(255, 0, 0);
  rect(40, 70, 20, 20);
  textSize(16);
  textAlign(LEFT, TOP);
  fill('#CCCCCC');
  text("Moon's far side", 80, 33);
  text("Moon's dark side", 80, 73);
  
  textSize(20);
  textAlign(CENTER);
  fill(255);
  text("Time: " + timeOfDay[time], width / 2, 30);
  text("Night of Lunar Month: " + (night + 1), width - 0.7 * phaseDisplayWidth, 30);
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
