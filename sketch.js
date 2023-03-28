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
let earth, moon, arrow, horizon;
let moonPhases = [];

function preload() {
  for (let i = 0; i < daysPerMonth; i++) {
    moonPhases[i] = loadImage('assets/moon-phases/' + (i + 1) + '.jpg');
  }
  earth = loadImage('assets/earth-0.png');
  moon = loadImage('assets/moon-above.png');
  horizon = loadImage('assets/horizon.png');
  arrow = loadImage('assets/arrow.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  // setInterval(changeWord, 1000);
}

function draw() {
  background(0);
  noStroke();
  
  // Sun Placement
  const sunArcHeight = 0.02 * windowHeight;
  fill(255, 175, 50);
  // r = (h/2) + (chordLength^2 / 8h)
  // theta = 2 * asin(l / 2r)
  // where h = r - distanceFromCenter
  let r = sunArcHeight / 2 + ((windowWidth * windowWidth) / (8 * sunArcHeight));
  let theta = 2 * Math.asin(windowWidth / (2 * r));
  arc(windowWidth / 2, -r + sunArcHeight, 2 * r, 2 * r, PI / 2 - theta, PI / 2 + theta, CHORD);

  // Moon phase placement
  push();
  let phaseDisplayWidth = moonPhases[night].width / 2;
  let phaseDisplayHeight = moonPhases[night].height / 2;
  translate(width - 0.7 * phaseDisplayWidth, height - 0.7 * phaseDisplayHeight);
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
  translate(windowWidth / 2, windowHeight / 2);
  rotate(-(PI / 2) * time);

  if (horizonDisplayed) {
    image(horizon, -(earthD * 5.22) / 2, -earthD * 0.3, earthD * 5.22, earthD);
  } else {
    image(earth, -earthD / 2, -earthD / 2, earthD, earthD);

    if (locationDisplayed) {
      tint(255, fade);
      image(arrow, 0, earthD / 4, earthD / 2, earthD / 2);
      // translate(earthD / 4, earthD * 4 / 5);
      rotate((PI / 2) * time);
      fill(204, 204, 204, fade);
      switch (time) {
        case 0:
          text("You are here!", earthD * 0.2, earthD * 0.8, 100, 100);
          break;
        case 1:
          text("You are here!", earthD * 0.75, -earthD * 0.6, 100, 100);
          break;
        case 2:
          text("You are here!", -earthD * 0.8, -earthD * 1.1, 100, 100);
          break;
        case 3:
          text("You are here!", -earthD * 1.3, earthD * 0.3, 100, 100);
          break;
        default:
          text("You are here!", 0, 0, 100, 100);
          break;
      }

      if (fade < 0) {
        fadeAmount = 10;
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
  translate(windowWidth / 2, windowHeight / 2);
  rotate(-(night + 1) * 2 * PI / daysPerMonth);
  translate(0, -earthMoonD);
  image(moon, -moonD / 2, -moonD / 2, moonD, moonD);
  
  // Moon's far side
  fill(0, 0, 255, 200);
  arc(0, 0, moonD, moonD, PI, 0);

  // Moon's dark side
  push();
  rotate((night + 1) * 2 * PI / daysPerMonth);
  fill(255, 0, 0, 200);
  arc(0, 0, moonD, moonD, 0, PI);
  pop();

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

  fill(255, 0, 0);
  rect(40, windowHeight - 80, 20, 20);
  fill(0, 0, 255);
  rect(40, windowHeight - 40, 20, 20);
  textSize(16);
  textAlign(LEFT, TOP);
  fill('#CCCCCC');
  text("Moon's dark side", 80, windowHeight - 80);
  text("Moon's far side", 80, windowHeight - 40);

  textSize(20);
  textAlign(CENTER);
  fill(255);
  text("Time: " + timeOfDay[time], windowWidth / 2, windowHeight - 40);
  text("Night of Lunar Month: " + (night + 1), width - 0.7 * phaseDisplayWidth, windowHeight - 40);
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
