let head, head2, left, left2, right, right2;
let fishImgs = [], fishes = [], fish4;
let light, light2, mid, mid2, dark, dark2;
let angleLight = 0, angleMid = 0, angleDark = 0;
let starImg, starImg2, coralImg, coralImg2, seaweedImg, seaweedImg2;
let stars = [], corals = [], seaweeds = [], particles = [];

let holoColors = ['#0A69CC', '#ED8495'];
let holoX = 0, holoY = 0;

let ambient1, ambient2, ambient3, ambient4, ambient5;
let clickSound;
let restoreSound;
let audioStarted = false;
let soundOn = true;

let sparkImg, sparks = [], draggingSpark = null;

let showInfo = true;
let logoImg;

let natureHealth = 1;
let targetHealth = 1;

let globeSize = 400;

let maxFish = 12;
let maxCorals = 5;
let maxSeaweeds = 7;
let maxStars = 5;

let populationTimer = 0;

// RESPONSIVE DESIGN
let designW = 1920;
let designH = 1080;
let scaleFactor = 1;
let offsetX = 0;
let offsetY = 0;


function preload() {
  // LOGO
  logoImg = loadImage('images/logo.png');

  // MAIN IMAGES
  head = loadImage('images/head.png');
  head2 = loadImage('images/head2.png');
  left = loadImage('images/left.png');
  left2 = loadImage('images/left2.png');
  right = loadImage('images/right.png');
  right2 = loadImage('images/right2.png');

  // FISH
  fishImgs.push(loadImage('images/fish1.png'));
  fishImgs.push(loadImage('images/fish2.png'));
  fishImgs.push(loadImage('images/fish3.png'));
  fish4 = loadImage('images/fish4.png');

  // ROTATING FISH SCHOOLS
  light = loadImage('images/light.png');
  light2 = loadImage('images/light2.png');
  mid = loadImage('images/mid.png');
  mid2 = loadImage('images/mid2.png');
  dark = loadImage('images/dark.png');
  dark2 = loadImage('images/dark2.png');

  // MARINE LIFE
  starImg = loadImage('images/star.png');
  starImg2 = loadImage('images/star2.png');
  coralImg = loadImage('images/coral.png');
  coralImg2 = loadImage('images/coral2.png');
  seaweedImg = loadImage('images/seaweed.png');
  seaweedImg2 = loadImage('images/seaweed2.png');

  // SPARK
  sparkImg = loadImage('images/spark.png');

  // SOUND
  ambient1 = loadSound('sounds/clothes_hook.wav');
  ambient2 = loadSound('sounds/wind_chime.wav');
  ambient3 = loadSound('sounds/water_splash.wav');
  ambient4 = loadSound('sounds/water_drop.wav');
  ambient5 = loadSound('sounds/echo.wav');
  clickSound = loadSound('sounds/glow.wav');
  restoreSound = loadSound('sounds/heal.wav');
}


function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  colorMode(HSB, 360, 100, 100, 100);
  noStroke();
  updateResponsiveScale();

  // INITIAL MARINE LIFE
  for (let i = 0; i < 4; i++) fishes.push(createFish());
  for (let i = 0; i < 3; i++) stars.push(createStarfish());
  corals.push(createCoral());
  for (let i = 0; i < 3; i++) seaweeds.push(createSeaweed());

  // PARTICLES
  for (let i = 0; i < 30; i++) particles.push(createParticle());

  // SPARKS
  for (let i = 0; i < 2; i++) sparks.push(createSpark());
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  updateResponsiveScale();
}


function updateResponsiveScale() {
  scaleFactor = min(width / designW, height / designH);
  offsetX = (width - designW * scaleFactor) / 2;
  offsetY = (height - designH * scaleFactor) / 2;
}


function getDesignMouseX() {
  return (mouseX - offsetX) / scaleFactor;
}


function getDesignMouseY() {
  return (mouseY - offsetY) / scaleFactor;
}


function draw() {
  // SMOOTH ECOSYSTEM HEALTH
  natureHealth = lerp(natureHealth, targetHealth, 0.04);
  let harm = 1 - natureHealth;

  updateEcosystemPopulation();
  drawBackground();

  // ORIGINAL 1920 x 1080 DESIGN SPACE
  push();
  translate(offsetX, offsetY);
  scale(scaleFactor);

  // HOLO
  push();
  translate(designW / 2 + holoX, designH / 2 + holoY);

  let sizes = [1050, 900, 750, 630];

  for (let i = 0; i < 4; i++) {
    let x = sin(frameCount * 0.012 + i * 1.5) * 20;
    let y = cos(frameCount * 0.015 + i * 1.2) * 20;
    let breathing = sin(frameCount * 0.02 + i * 1.5) * 20;
    let c;

    // LARGEST HOLO ALWAYS BLUE
    if (i === 0) {
      c = color('#0A69CC');
      c.setAlpha(20);
    }

    // SMALLER HOLOS
    else {
      // HEALTHY = PINK
      if (natureHealth > 0.5) {
        let pinkAlpha = map(natureHealth, 0.5, 1, 0, 20);
        c = color('#ED8495');
        c.setAlpha(pinkAlpha);
      }

      // HARMED = TURQUOISE
      else {
        let turquoiseAlpha = map(natureHealth, 0, 0.5, 20, 0);
        c = color('#2EC2B4');
        c.setAlpha(turquoiseAlpha);
      }
    }

    fill(c);
    ellipse(x, y, sizes[i] + breathing, sizes[i] + breathing);
  }

  pop();

  // PARTICLES
  updateParticles();

  // HEAD
  drawLayeredImage(head, head2, 840, 350, 199, 180, harm);

  // GLOBE
  let healthyLight = color('#FFFFFF');
  let healthyDark = color('#198DFF');
  let harmLight = color('#BBE8FB');
  let harmDark = color('#065274');

  let globeLight = lerpColor(healthyLight, harmLight, harm);
  let globeDark = lerpColor(healthyDark, harmDark, harm);

  radialGradient(
    designW / 2 - 40,
    designH / 2 - 120,
    0,
    designW / 2 - 40,
    designH / 2 - 120,
    380,
    globeLight,
    globeDark
  );

  ellipse(designW / 2, designH / 2, globeSize, globeSize);

  // ROTATING LIGHT FISH SCHOOL
  imageMode(CENTER);

  push();
  translate(designW / 2, designH / 2);
  rotate(angleLight);
  noTint();
  image(light, 0, 0);

  if (harm > 0.001) {
    tint(255, 255 * harm);
    image(light2, 0, 0);
    noTint();
  }

  pop();

  // ROTATING MID FISH SCHOOL
  push();
  translate(designW / 2, designH / 2);
  rotate(angleMid);
  noTint();
  image(mid, 0, 0);

  if (harm > 0.001) {
    tint(255, 255 * harm);
    image(mid2, 0, 0);
    noTint();
  }

  pop();

  // ROTATING DARK FISH SCHOOL
  push();
  translate(designW / 2, designH / 2);
  rotate(angleDark);
  noTint();
  image(dark, 0, 0);

  if (harm > 0.001) {
    tint(255, 255 * harm);
    image(dark2, 0, 0);
    noTint();
  }

  pop();

  angleLight -= 0.05;
  angleMid += 0.05;
  angleDark -= 0.05;

  // FISH
  for (let f of fishes) {
    f.update();
    f.show(harm);
  }

  // SAND
  let healthySand = color('#EBFBE9');
  let harmSand = color('#042549');
  let sandColor = lerpColor(healthySand, harmSand, harm);

  sandGradientArc(
    designW / 2,
    designH / 2 + 90,
    280,
    0,
    180,
    0.3,
    0.5,
    sandColor,
    sandColor
  );

  // STARFISH
  for (let s of stars) {
    drawLayeredImage(s.img, s.altImg, s.x, s.y, s.size, s.size, harm);
  }

  // CORAL
  for (let c of corals) {
    drawLayeredImage(c.img, c.altImg, c.x, c.y, c.size, c.size, harm);
  }

  // SEAWEED
  for (let w of seaweeds) {
    drawLayeredImage(w.img, w.altImg, w.x, w.y, w.size, w.size, harm);
  }

  // SIDE IMAGES
  drawLayeredImage(left, left2, 818, 560, 199, 264, harm);
  drawLayeredImage(right, right2, 1038, 430, 203, 218, harm);

  // SPARKS
  updateSparks();

  // DRAGGING SPARK
  if (draggingSpark) {
    draggingSpark.x = getDesignMouseX();
    draggingSpark.y = getDesignMouseY();
  }

  pop();

  // UI IS DRAWN AFTER THE ARTWORK
  drawUI();
}


// =====================================================
// BACKGROUND
// =====================================================

function drawBackground() {
  let healthyColor = color('#0A69CC');
  let harmColor = color('#065274');
  let darkColor = color('#021427');
  let topColor = lerpColor(harmColor, healthyColor, natureHealth);

  let g = drawingContext.createLinearGradient(0, 0, 0, height);
  g.addColorStop(0, topColor.toString());
  g.addColorStop(1, darkColor.toString());

  drawingContext.fillStyle = g;
  drawingContext.fillRect(0, 0, width, height);
}


// =====================================================
// IMAGE LAYERING
// =====================================================

function drawLayeredImage(baseImg, harmImg, x, y, w, h, harm) {
  imageMode(CENTER);
  noTint();
  image(baseImg, x, y, w, h);

  if (harm > 0.001) {
    tint(255, 255 * harm);
    image(harmImg, x, y, w, h);
    noTint();
  }
}


// =====================================================
// UI + POPUP
// =====================================================

function drawUI() {
  // LOGO
  imageMode(CENTER);
  image(logoImg, width - 60, 60, 70, 70);

  if (!showInfo) return;

  // OVERLAY
  let overlayColor = color('#021427');
  overlayColor.setAlpha(45);
  fill(overlayColor);
  rect(0, 0, width, height);

  // POPUP SIZE
  let popupW = min(850, width * 0.8);
  let popupH = min(900, height * 0.95);
  let popupX = width / 2 - popupW / 2;
  let popupY = height / 2 - popupH / 2;

  // RESPONSIVE FONT SIZES
  let titleSize = constrain(popupW * 0.045, 24, 42);
  let bodySize = constrain(popupW * 0.026, 17, 25);
  let closeSize = constrain(popupW * 0.042, 28, 36);
  let buttonSize = constrain(popupW * 0.021, 15, 18);

  // POPUP
  let popupColor = color('#021427');
  popupColor.setAlpha(50);
  fill(popupColor);
  rect(popupX, popupY, popupW, popupH, 25);

  // CLOSE X
  fill('#EBFBE9');
  textFont('Alata');
  textStyle(NORMAL);
  textAlign(CENTER, CENTER);
  textSize(closeSize);

  text(
    '×',
    popupX + popupW - 30,
    popupY + 30
  );

  // =====================================
  // CONTENT AREA
  // =====================================

  let contentX = popupX + 45;
  let contentW = popupW - 90;

  // Start position
  let y = popupY + popupH * 0.13;

  // =====================================
  // GAMEPLAY TITLE
  // =====================================

  fill('#BFF4B8');
  textFont('apotek-wide');
  textStyle(NORMAL);
  textAlign(CENTER, CENTER);
  textSize(titleSize);

  let titleText =
    'The ocean has given you its blessing!';

  let titleLines = wrapText(titleText, contentW);

  for (let line of titleLines) {
    text(line, width / 2, y);
    y += titleSize * 1.15;
  }

  // Space after title
  y += titleSize * 0.9;

  // =====================================
  // GAMEPLAY INSTRUCTIONS
  // =====================================

  fill('#EBFBE9');
  textFont('Alata');
  textStyle(NORMAL);
  textSize(bodySize);
  textLeading(bodySize * 1.35);

  let bodyText =
    'Drag and drop the spark onto the globe to accept its blessing ' +
    'and give something back as a gesture of thanks.\n\n' +
    'Click the spark to take it away.';

  let bodyLines = wrapText(bodyText, contentW);

  for (let line of bodyLines) {
    if (line === '') {
      y += bodySize * 0.8;
    } else {
      text(line, width / 2, y);
      y += bodySize * 1.35;
    }
  }

  // Space before project information
  y += bodySize * 1.2;

  // =====================================
  // EMBRACE TITLE
  // =====================================

  fill('#BFF4B8');
  textFont('apotek-wide');
  textStyle(NORMAL);
  textSize(titleSize);
  textAlign(CENTER, CENTER);

  // Same title size as gameplay title
  text(
    'Embrace',
    width / 2,
    y
  );

  y += titleSize * 1.35;

  // =====================================
  // MADE BY
  // =====================================

  fill('#EBFBE9');
  textFont('Alata');
  textStyle(NORMAL);
  textSize(bodySize);

  text(
    'Made by Trần Tùng Phương',
    width / 2,
    y
  );

  y += bodySize * 2.0;

  // =====================================
  // ABSTRACT TITLE
  // =====================================

  fill('#BFF4B8');
  textFont('Alata');
  textStyle(BOLD);
  textSize(bodySize);

  text(
    'Abstract',
    width / 2,
    y
  );

  y += bodySize * 1.6;

  // =====================================
  // ABSTRACT TEXT
  // =====================================

  fill('#EBFBE9');
  textFont('Alata');
  textStyle(NORMAL);
  textSize(bodySize);
  textLeading(bodySize * 1.35);

  let abstractText =
    'Embrace is an interactive generative artwork inspired by UN SDG 14.2, ' +
    'exploring how our actions can either support or harm marine ecosystems. ' +
    'Dragging the spark back to the globe represents giving something back to nature, ' +
    'while clicking it away represents taking without giving back.';

  let abstractLines = wrapText(
    abstractText,
    contentW
  );

  for (let line of abstractLines) {
    text(
      line,
      width / 2,
      y
    );

    y += bodySize * 1.35;
  }

  // Space before SDG section
  y += bodySize * 1.3;

  // =====================================
  // SDG 14.2 TITLE
  // =====================================

  fill('#BFF4B8');
  textFont('Alata');
  textStyle(BOLD);
  textSize(bodySize);

  text(
    'SDG 14.2: Protect and Restore Ecosystems',
    width / 2,
    y
  );

  y += bodySize * 1.6;

  // =====================================
  // SDG 14.2 TEXT
  // =====================================

  fill('#EBFBE9');
  textFont('Alata');
  textStyle(NORMAL);
  textSize(bodySize);
  textLeading(bodySize * 1.35);

  let sdgText =
    '“By 2020, sustainably manage and protect marine and coastal ecosystems ' +
    'to avoid significant adverse impacts, including by strengthening their ' +
    'resilience, and take action for their restoration in order to achieve ' +
    'healthy and productive oceans.”';

  let sdgLines = wrapText(
    sdgText,
    contentW
  );

  for (let line of sdgLines) {
    text(
      line,
      width / 2,
      y
    );

    y += bodySize * 1.35;
  }

  // Space before CTA
  y += bodySize * 1.3;

  // =====================================
  // CTA
  // =====================================

  fill('#BFF4B8');
  textFont('Alata');
  textStyle(BOLD);
  textSize(bodySize);

  text(
    'CTA: Change everyday habits to protect ocean health.',
    width / 2,
    y
  );

  // =====================================
  // SOUND BUTTON
  // =====================================

  let buttonW = constrain(
    popupW * 0.22,
    120,
    190
  );

  let buttonH = constrain(
    popupH * 0.07,
    42,
    50
  );

  let buttonX = popupX + 20;

  let buttonY =
    popupY +
    popupH -
    buttonH -
    20;

  let soundButtonColor = color('#021427');
  soundButtonColor.setAlpha(80);

  fill(soundButtonColor);

  rect(
    buttonX,
    buttonY,
    buttonW,
    buttonH,
    10
  );

  // SOUND BUTTON TEXT
  fill('#EBFBE9');
  textFont('Alata');
  textStyle(NORMAL);
  textSize(buttonSize);
  textAlign(CENTER, CENTER);

  text(
    soundOn ? 'Sound: ON' : 'Sound: OFF',
    buttonX + buttonW / 2,
    buttonY + buttonH / 2
  );
}


// =====================================
// TEXT WRAPPING FUNCTION
// =====================================

function wrapText(txt, maxWidth) {
  let paragraphs = txt.split('\n');
  let lines = [];

  for (let paragraph of paragraphs) {

    // Empty line = spacing between paragraphs
    if (paragraph === '') {
      lines.push('');
      continue;
    }

    let words = paragraph.split(' ');
    let currentLine = '';

    for (let word of words) {

      let testLine =
        currentLine === ''
          ? word
          : currentLine + ' ' + word;

      if (textWidth(testLine) <= maxWidth) {
        currentLine = testLine;
      } else {

        if (currentLine !== '') {
          lines.push(currentLine);
        }

        currentLine = word;
      }
    }

    if (currentLine !== '') {
      lines.push(currentLine);
    }
  }

  return lines;
}


// =====================================
// TEXT WRAPPING FUNCTION
// =====================================

function wrapText(txt, maxWidth) {
  let paragraphs = txt.split('\n');
  let lines = [];

  for (let paragraph of paragraphs) {
    if (paragraph === '') {
      lines.push('');
      continue;
    }

    let words = paragraph.split(' ');
    let currentLine = '';

    for (let word of words) {
      let testLine = currentLine === ''
        ? word
        : currentLine + ' ' + word;

      if (textWidth(testLine) <= maxWidth) {
        currentLine = testLine;
      } else {
        if (currentLine !== '') {
          lines.push(currentLine);
        }

        currentLine = word;
      }
    }

    if (currentLine !== '') {
      lines.push(currentLine);
    }
  }

  return lines;
}


// =====================================================
// MOUSE
// =====================================================

function mousePressed() {
  // POPUP BUTTONS
  if (showInfo) {
    let popupW = min(850, width * 0.8);
    let popupH = min(900, height * 0.95);
    let popupX = width / 2 - popupW / 2;
    let popupY = height / 2 - popupH / 2;

    // CLOSE X
    let closeX = popupX + popupW - 30;
    let closeY = popupY + 30;

    if (
      dist(mouseX, mouseY, closeX, closeY) < 35
    ) {
      showInfo = false;

      // Start audio only when closing popup
      if (soundOn && !audioStarted) startAudio();

      return;
    }

    // SOUND BUTTON
    let buttonW = constrain(popupW * 0.22, 120, 190);
    let buttonH = constrain(popupH * 0.07, 42, 50);

    let buttonX = popupX + 20;
    let buttonY = popupY + popupH - buttonH - 20;

    if (
      mouseX >= buttonX &&
      mouseX <= buttonX + buttonW &&
      mouseY >= buttonY &&
      mouseY <= buttonY + buttonH
    ) {
      toggleSound();
      return;
    }

    // DO NOTHING ELSE WHILE POPUP IS OPEN
    return;
  }

  // LOGO BUTTON
  if (
    mouseX > width - 110 &&
    mouseX < width &&
    mouseY > 0 &&
    mouseY < 120
  ) {
    showInfo = true;
    return;
  }

  // START AUDIO
  if (soundOn && !audioStarted) startAudio();

  // SPARK INTERACTION
  let mx = getDesignMouseX();
  let my = getDesignMouseY();

  for (let i = sparks.length - 1; i >= 0; i--) {
    let s = sparks[i];

    if (dist(mx, my, s.x, s.y) < s.size * 0.7) {
      draggingSpark = s;
      return;
    }
  }
}


function mouseReleased() {
  if (showInfo || !draggingSpark) return;

  let d = dist(
    draggingSpark.x,
    draggingSpark.y,
    designW / 2,
    designH / 2
  );

  // RETURN SPARK TO THE OCEAN
  if (d < globeSize / 2) {
    restoreNature();
  }

  // TAKE SPARK AWAY
  else {
    harmNature();
  }

  // REMOVE USED SPARK
  let index = sparks.indexOf(draggingSpark);

  if (index !== -1) sparks.splice(index, 1);

  // CREATE NEW SPARK
  sparks.push(createSpark());

  draggingSpark = null;
}


// =====================================================
// AUDIO
// =====================================================

function startAudio() {
  if (audioStarted || !soundOn) return;

  userStartAudio().then(() => {
    ambient1.setVolume(0.05);
    ambient2.setVolume(0.2);
    ambient3.setVolume(0.001);
    ambient4.setVolume(0.001);
    ambient5.setVolume(0.0008);
    clickSound.setVolume(0.05);
    restoreSound.setVolume(0.02);

    ambient1.loop();
    ambient2.loop();

    audioStarted = true;
  });
}


function toggleSound() {
  soundOn = !soundOn;

  // TURN SOUND OFF
  if (!soundOn) {
    ambient1.stop();
    ambient2.stop();
    ambient3.stop();
    ambient4.stop();
    ambient5.stop();
    clickSound.stop();
    restoreSound.stop();
    
    audioStarted = false;
    return;
  }

  // TURN SOUND ON
  startAudio();
}


// =====================================================
// NATURE INTERACTION
// =====================================================

function restoreNature() {
  targetHealth = min(1, targetHealth + 0.15);

  if (audioStarted && soundOn) {
  restoreSound.play();
}

  // FISH
  if (fishes.length < maxFish) {
    let amount = int(random(1, 3));

    for (let i = 0; i < amount && fishes.length < maxFish; i++) {
      fishes.push(createFish());
    }
  }

  // CORAL
  if (corals.length < maxCorals) {
    corals.push(createCoral());
  }

  // SEAWEED
  if (seaweeds.length < maxSeaweeds) {
    let amount = int(random(1, 2));

    for (let i = 0; i < amount && seaweeds.length < maxSeaweeds; i++) {
      seaweeds.push(createSeaweed());
    }
  }

  // STARFISH
  if (stars.length < maxStars) {
    stars.push(createStarfish());
  }

  // RESTORATION SOUNDS
  if (audioStarted && soundOn) {
    ambient3.play();
    ambient4.play();
  }
}


function harmNature() {
  targetHealth = max(0, targetHealth - 0.15);

  // HARM SOUND
  if (audioStarted && soundOn) {
    clickSound.play();
    ambient5.play();
  }
}


// =====================================================
// ECOSYSTEM POPULATION
// =====================================================

function updateEcosystemPopulation() {
  let fishLimit = map(natureHealth, 0, 1, 1, maxFish);
  let coralLimit = map(natureHealth, 0, 1, 0, maxCorals);
  let seaweedLimit = map(natureHealth, 0, 1, 0, maxSeaweeds);
  let starLimit = map(natureHealth, 0, 1, 0, maxStars);

  if (populationTimer > 0) {
    populationTimer--;
    return;
  }

  // FISH
  if (fishes.length > fishLimit) {
    removeWeakest(fishes);
    populationTimer = 25;
    return;
  }

  // CORAL
  if (corals.length > coralLimit) {
    removeWeakest(corals);
    populationTimer = 35;
    return;
  }

  // SEAWEED
  if (seaweeds.length > seaweedLimit) {
    removeWeakest(seaweeds);
    populationTimer = 30;
    return;
  }

  // STARFISH
  if (stars.length > starLimit) {
    removeWeakest(stars);
    populationTimer = 40;
    return;
  }
}


function removeWeakest(array) {
  if (array.length === 0) return;

  let weakestIndex = 0;

  for (let i = 1; i < array.length; i++) {
    if (array[i].survival < array[weakestIndex].survival) {
      weakestIndex = i;
    }
  }

  array.splice(weakestIndex, 1);
}


// =====================================================
// RANDOM POSITION
// =====================================================

function randomPointInCircle(cx, cy, radius) {
  let angle = random(360);
  let distance = sqrt(random());

  distance *= radius;

  return {
    x: cx + cos(angle) * distance,
    y: cy + sin(angle) * distance
  };
}


// =====================================================
// STARFISH
// =====================================================

function createStarfish() {
  let size = random(10, 30);
  let p = randomPointInCircle(designW / 2, designH / 2, 160);

  return {
    img: starImg,
    altImg: starImg2,
    x: p.x,
    y: p.y,
    size: size,
    survival: random(0.25, 1)
  };
}


// =====================================================
// CORAL
// =====================================================

function createCoral() {
  let size = random(70, 130);
  let x, y;

  do {
    let p = randomPointInCircle(designW / 2, designH / 2, 120);
    x = p.x;
    y = p.y;
  } while (y < designH / 2 + 40);

  return {
    img: coralImg,
    altImg: coralImg2,
    x: x,
    y: y,
    size: size,
    survival: random()
  };
}


// =====================================================
// SEAWEED
// =====================================================

function createSeaweed() {
  let size = random(90, 130);
  let x, y;

  do {
    let p = randomPointInCircle(designW / 2, designH / 2, 120);
    x = p.x;
    y = p.y;
  } while (y < designH / 2 + 40);

  return {
    img: seaweedImg,
    altImg: seaweedImg2,
    x: x,
    y: y,
    size: size,
    survival: random()
  };
}


// =====================================================
// FISH
// =====================================================

function createFish() {
  let img = random(fishImgs);
  let size = random(40, 100);
  let y;

  do {
    y = random(designH / 2 - 150, designH / 2 + 150);
  } while (
    dist(
      designW / 2,
      designH / 2,
      designW / 2 - 140,
      y
    ) > 150
  );

  let direction = random() < 0.5 ? 1 : -1;
  let x = direction > 0 ? designW / 2 - 140 : designW / 2 + 140;
  let speed = random(0.1, 0.6) * direction;

  return new Fish(img, fish4, size, x, y, speed, random());
}


class Fish {
  constructor(img, altImg, size, x, y, speed, survival) {
    this.img = img;
    this.altImg = altImg;
    this.size = size;
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.alive = true;
    this.survival = survival;
  }

  update() {
    this.x += this.speed;

    let d = dist(
      this.x,
      this.y,
      designW / 2,
      designH / 2
    );

    let globeRadius = globeSize / 2;
    let fishRadius = this.size / 2;

    if (d > globeRadius - fishRadius) this.alive = false;
  }

  show(harm) {
    if (!this.alive) return;

    let aspect = this.img.height / this.img.width;
    let w = this.size;
    let h = this.size * aspect;

    push();
    translate(this.x, this.y);

    if (this.speed < 0) scale(-1, 1);

    imageMode(CENTER);
    noTint();
    image(this.img, 0, 0, w, h);

    if (harm > 0.001) {
      tint(255, 255 * harm);
      image(this.altImg, 0, 0, w, h);
      noTint();
    }

    pop();
  }
}


// =====================================================
// PARTICLES
// =====================================================

function updateParticles() {
  for (let p of particles) {
    p.y -= p.speed;

    p.x += sin(frameCount * 0.5 + p.offset) * 0.15;

    if (p.y < -10) {
      p.y = designH + 10;
      p.x = random(designW);
    }

    noStroke();
    fill(255, p.opacity);
    ellipse(p.x, p.y, p.size, p.size);
  }
}


function createParticle() {
  return {
    x: random(designW),
    y: random(designH),
    size: random(3, 7),
    speed: random(0.1, 0.4),
    opacity: random(40, 100),
    offset: random(1000)
  };
}


// =====================================================
// SPARKS
// =====================================================

function createSpark() {
  let x, y;

  // KEEP SPARKS OUTSIDE GLOBE
  do {
    x = random(100, designW - 100);
    y = random(100, designH - 100);
  } while (
    dist(
      x,
      y,
      designW / 2,
      designH / 2
    ) < globeSize / 2 + 80
  );

  return {
    x: x,
    y: y,
    size: random(50, 180),
    angle: random(360),
    floatOffset: random(1000),
    speed: random(0.2, 0.6)
  };
}


function updateSparks() {
  for (let s of sparks) {
    // DON'T MOVE WHILE DRAGGING
    if (s !== draggingSpark) {
      s.y += sin(frameCount * 0.5 + s.floatOffset) * 0.3;
      s.x += cos(frameCount * 0.3 + s.floatOffset) * 0.2;
    }

    // PULSE
    let pulse = sin(frameCount * 2 + s.floatOffset) * 0.08;
    let currentSize = s.size * (1 + pulse);

    push();
    imageMode(CENTER);
    translate(s.x, s.y);
    rotate(s.angle);
    image(sparkImg, 0, 0, currentSize, currentSize);
    pop();
  }
}


// =====================================================
// RADIAL GRADIENT
// =====================================================

function radialGradient(x0, y0, r0, x1, y1, r1, c0, c1) {
  let gradient = drawingContext.createRadialGradient(x0, y0, r0, x1, y1, r1);
  gradient.addColorStop(0, c0.toString());
  gradient.addColorStop(1, c1.toString());
  drawingContext.fillStyle = gradient;
}


// =====================================================
// SAND
// =====================================================

function sandGradientArc(x, y, r, startAngle, endAngle, verticalScale, horizontalScale, c1, c2) {
  beginShape();

  for (let a = startAngle; a <= endAngle; a += 5) {
    let inter = map(a, startAngle, endAngle, 0, 1);
    let c = lerpColor(c1, c2, inter);
    fill(c);

    let rx = x + r * horizontalScale * cos(a);
    let ry = y + r * verticalScale * sin(a);

    vertex(rx, ry);
  }

  let steps = 20;

  let x1 = x + r * horizontalScale * cos(endAngle);
  let y1 = y + r * verticalScale * sin(endAngle);
  let x2 = x + r * horizontalScale * cos(startAngle);
  let y2 = y + r * verticalScale * sin(startAngle);

  for (let i = 0; i <= steps; i++) {
    let t = i / steps;
    let bx = lerp(x1, x2, t);
    let by = lerp(y1, y2, t);

    let n = noise(frameCount * 0.05, i * 0.5);
    let offset = map(n, 0, 1, -2, 2);

    vertex(bx, by + offset);
  }

  endShape(CLOSE);
}
