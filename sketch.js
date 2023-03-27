const daysPerMonth = 30;
const earthD = 160;
const moonD = earthD / 3.7;
const earthMoonD = 380;
const timeOfDay = ['Midnight', 'Sunrise', 'Noon', 'Sunset'];
let night = 0;
let time = 0;
let globeDirection = 0;

// images
let moonPhases = [];
let earth, moon;

function preload() {
  for (let i = 0; i < daysPerMonth; i++) {
    moonPhases[i] = loadImage('assets/moon-phases/' + (i + 1) + '.jpg');
  }
  earth = loadImage('assets/earth.png');
  // plainEarth = loadImage('assets/earth-0.png');
  moon = loadImage('assets/moon-above.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  console.log(windowWidth)
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

  // Moon Placement - end

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
  // image(plainEarth, -earthD / 2, -earthD / 2, earthD, earthD);
  image(earth, -(earthD * 5.22)/ 2, -earthD / 2, earthD * 5.22, earthD);
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

  // Text placement
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
  }
}
