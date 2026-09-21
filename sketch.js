let head, head2, left, left2, right, right2;
let fishImgs = [], fishes = [], fish4;
let light, light2, mid, mid2, dark, dark2;
let angleLight = 0, angleMid = 0, angleDark = 0;
let starImg, starImg2, coralImg, coralImg2, seaweedImg, seaweedImg2;
let stars = [], corals = [], seaweeds = [], particles = [];
let holoX = 0, holoY = 0;
let ambient1, ambient2, ambient3, ambient4, ambient5;
let clickSound, restoreSound, popupSound;
let audioStarted = false, soundOn = true;
let sparkImg, sparks = [], draggingSpark = null;
let showInfo = true, logoImg;
let natureHealth = 1, targetHealth = 1;
let globeSize = 400;
let maxFish = 12, maxCorals = 5, maxSeaweeds = 7, maxStars = 5;
let populationTimer = 0;
let designW = 1920, designH = 1080;
let scaleFactor = 1, offsetX = 0, offsetY = 0;
let activeTab = 0, targetTab = 0, tabSlide = 0;
let warningActive = false, warningThreshold = 0.35;
let warningAlpha = 0, warningLetters = [];
let warningLines = ['STOP TAKING', 'THINGS FOR GRANTED'];

function preload() {
  logoImg = loadImage('images/logo.png');

  head = loadImage('images/head.png');
  head2 = loadImage('images/head2.png');
  left = loadImage('images/left.png');
  left2 = loadImage('images/left2.png');
  right = loadImage('images/right.png');
  right2 = loadImage('images/right2.png');

  fishImgs.push(loadImage('images/fish1.png'));
  fishImgs.push(loadImage('images/fish2.png'));
  fishImgs.push(loadImage('images/fish3.png'));
  fish4 = loadImage('images/fish4.png');

  light = loadImage('images/light.png');
  light2 = loadImage('images/light2.png');
  mid = loadImage('images/mid.png');
  mid2 = loadImage('images/mid2.png');
  dark = loadImage('images/dark.png');
  dark2 = loadImage('images/dark2.png');

  starImg = loadImage('images/star.png');
  starImg2 = loadImage('images/star2.png');
  coralImg = loadImage('images/coral.png');
  coralImg2 = loadImage('images/coral2.png');
  seaweedImg = loadImage('images/seaweed.png');
  seaweedImg2 = loadImage('images/seaweed2.png');

  sparkImg = loadImage('images/spark.png');

  ambient1 = loadSound('sounds/clothes_hook.wav');
  ambient2 = loadSound('sounds/wind_chime.wav');
  ambient3 = loadSound('sounds/water_splash.wav');
  ambient4 = loadSound('sounds/water_drop.wav');
  ambient5 = loadSound('sounds/echo.wav');

  clickSound = loadSound('sounds/glow.wav');
  restoreSound = loadSound('sounds/heal.wav');
  popupSound = loadSound('sounds/popup.wav');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  colorMode(HSB, 360, 100, 100, 100);
  noStroke();
  updateResponsiveScale();

  for (let i = 0; i < 4; i++) fishes.push(createFish());
  for (let i = 0; i < 3; i++) stars.push(createStarfish());
  corals.push(createCoral());
  for (let i = 0; i < 3; i++) seaweeds.push(createSeaweed());
  for (let i = 0; i < 30; i++) particles.push(createParticle());
  for (let i = 0; i < 2; i++) sparks.push(createSpark());

  createWarningTypography();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  updateResponsiveScale();
  createWarningTypography();
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
  natureHealth = lerp(natureHealth, targetHealth, 0.04);
  let harm = 1 - natureHealth;

  updateEcosystemPopulation();
  drawBackground();

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

    if (i === 0) {
      c = color('#0A69CC');
      c.setAlpha(20);
    } else if (natureHealth > 0.5) {
      let pinkAlpha = map(natureHealth, 0.5, 1, 0, 20);
      c = color('#ED8495');
      c.setAlpha(pinkAlpha);
    } else {
      let turquoiseAlpha = map(natureHealth, 0, 0.5, 20, 0);
      c = color('#2EC2B4');
      c.setAlpha(turquoiseAlpha);
    }

    fill(c);
    ellipse(x, y, sizes[i] + breathing, sizes[i] + breathing);
  }

  pop();

  updateParticles();
  drawLayeredImage(head, head2, 840, 350, 199, 180, harm);

  // GLOBE
  let healthyLight = color('#FFFFFF');
  let healthyDark = color('#198DFF');
  let harmLight = color('#BBE8FB');
  let harmDark = color('#065274');

  let globeLight = lerpColor(healthyLight, harmLight, harm);
  let globeDark = lerpColor(healthyDark, harmDark, harm);

  radialGradient(
    designW / 2 - 40, designH / 2 - 120, 0,
    designW / 2 - 40, designH / 2 - 120, 380,
    globeLight, globeDark
  );

  ellipse(designW / 2, designH / 2, globeSize, globeSize);

  // FISH SCHOOLS
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
    designW / 2, designH / 2 + 90,
    280, 0, 180, 0.3, 0.5,
    sandColor, sandColor
  );

  // MARINE LIFE
  for (let s of stars) {
    drawLayeredImage(s.img, s.altImg, s.x, s.y, s.size, s.size, harm);
  }

  for (let c of corals) {
    drawLayeredImage(c.img, c.altImg, c.x, c.y, c.size, c.size, harm);
  }

  for (let w of seaweeds) {
    drawLayeredImage(w.img, w.altImg, w.x, w.y, w.size, w.size, harm);
  }

  drawLayeredImage(left, left2, 818, 560, 199, 264, harm);
  drawLayeredImage(right, right2, 1038, 430, 203, 218, harm);

  // SPARKS
  updateSparks();

  if (draggingSpark && touches.length === 0) {
    draggingSpark.x = getDesignMouseX();
    draggingSpark.y = getDesignMouseY();
  }

  // WARNING
  warningActive = natureHealth <= warningThreshold;
  updateWarningTypography();

  if (warningAlpha > 1) {
    drawWarningTypography();
  }

  pop();
  drawUI();
}

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

function playPopupSound() {
  if (!soundOn || !popupSound) return;
  popupSound.setVolume(0.2);
  popupSound.stop();
  popupSound.play();
}
function drawUI() {
  imageMode(CENTER);
  image(logoImg, width - 60, 60, 70, 70);

  if (!showInfo) return;

  let overlayColor = color('#021427');
  overlayColor.setAlpha(45);
  fill(overlayColor);
  rect(0, 0, width, height);

  let popupW = min(850, width * 0.8);
  let popupH = min(900, height * 0.95);
  let popupX = width / 2 - popupW / 2;
  let popupY = height / 2 - popupH / 2;

  let titleSize = constrain(popupW * 0.045, 24, 42);
  let bodySize = constrain(popupW * 0.026, 17, 25);
  let closeSize = constrain(popupW * 0.042, 28, 36);
  let tabSize = constrain(popupW * 0.025, 18, 24);
  let buttonSize = constrain(popupW * 0.021, 15, 18);

  let popupColor = color('#021427');
  popupColor.setAlpha(50);
  fill(popupColor);
  rect(popupX, popupY, popupW, popupH, 25);

  fill('#EBFBE9');
  textFont('Alata');
  textStyle(NORMAL);
  textAlign(CENTER, CENTER);
  textSize(closeSize);
  text('×', popupX + popupW - 30, popupY + 30);

  // TABS
  let tabW = popupW * 0.42;
  let tabH = 70;
  let tabY = popupY + 35;
  let leftTabX = popupX + 20;
  let rightTabX = popupX + popupW - tabW - 20;

  tabSlide = lerp(tabSlide, targetTab, 0.12);
  let selectedX = lerp(leftTabX, rightTabX, tabSlide);

  let tabColor = color('#021427');
  tabColor.setAlpha(80);
  fill(tabColor);
  rect(selectedX, tabY, tabW, tabH, 18);

  fill('#EBFBE9');
  textFont('Alata');
  textStyle(NORMAL);
  textSize(tabSize);
  textAlign(CENTER, CENTER);
  text('Instruction', leftTabX + tabW / 2, tabY + tabH / 2);
  text('About', rightTabX + tabW / 2, tabY + tabH / 2);

  let contentX = popupX + 45;
  let contentW = popupW - 90;
  let contentTop = tabY + tabH + 55;

  // INSTRUCTION
  if (activeTab === 0) {
    fill('#BFF4B8');
    textFont('apotek-wide');
    textStyle(NORMAL);
    textSize(titleSize);
    textAlign(CENTER, CENTER);

    let instructionTitle = 'The ocean has given you its blessing!';
    let titleLines = wrapText(instructionTitle, contentW);

    fill('#EBFBE9');
    textFont('Alata');
    textStyle(NORMAL);
    textSize(bodySize);
    textLeading(bodySize * 1.45);

    let instructionText =
      'Drag and drop the spark onto the globe to accept its blessing ' +
      'and give something back as a gesture of thanks.\n\n' +
      'Click the spark to take it away.';

    let instructionLines = wrapText(instructionText, contentW);

    let titleHeight = titleLines.length * titleSize * 1.15;
    let titleGap = titleSize * 0.8;
    let bodyHeight = 0;

    for (let line of instructionLines) {
      bodyHeight += line === ''
        ? bodySize * 0.8
        : bodySize * 1.45;
    }

    let finalGap = bodySize * 1.5;
    let finalTextHeight = bodySize * 1.45;
    let totalHeight =
      titleHeight + titleGap + bodyHeight +
      finalGap + finalTextHeight;

    let y = popupY + popupH / 2 - totalHeight / 2;

    fill('#BFF4B8');
    textFont('apotek-wide');
    textStyle(NORMAL);
    textSize(titleSize);

    for (let line of titleLines) {
      text(line, width / 2, y);
      y += titleSize * 1.15;
    }

    y += titleGap;

    fill('#EBFBE9');
    textFont('Alata');
    textStyle(NORMAL);
    textSize(bodySize);
    textLeading(bodySize * 1.45);

    for (let line of instructionLines) {
      if (line === '') {
        y += bodySize * 0.8;
      } else {
        text(line, width / 2, y);
        y += bodySize * 1.45;
      }
    }

    y += finalGap;

    fill('#BFF4B8');
    textFont('Alata');
    textStyle(BOLD);
    textSize(bodySize);
    text(
      'Give something back as a gesture of thanks.',
      width / 2, y
    );
  }

  // ABOUT
  if (activeTab === 1) {
    let y = contentTop + 35;
    let headingGap = bodySize * 0.8;
    let sectionGap = bodySize * 1.5;

    fill('#BFF4B8');
    textFont('apotek-wide');
    textStyle(NORMAL);
    textSize(titleSize);
    textAlign(CENTER, CENTER);
    text('Embrace', width / 2, y);

    y += titleSize * 1.15 + headingGap;

    fill('#EBFBE9');
    textFont('Alata');
    textStyle(NORMAL);
    textSize(bodySize);
    text('Made by Trần Tùng Phương', width / 2, y);

    y += sectionGap;

    fill('#BFF4B8');
    textStyle(BOLD);
    textSize(bodySize);
    text('Abstract', width / 2, y);

    y += bodySize * 1.45 + headingGap;

    fill('#EBFBE9');
    textStyle(NORMAL);
    textLeading(bodySize * 1.4);

    let abstractText =
      'Embrace is an interactive generative artwork inspired by UN SDG 14.2, ' +
      'exploring how our actions can either support or harm marine ecosystems. ' +
      'Dragging the spark back to the globe represents giving something back to nature, ' +
      'while clicking it away represents taking without giving back.';

    let abstractLines = wrapText(abstractText, contentW);

    for (let line of abstractLines) {
      text(line, width / 2, y);
      y += bodySize * 1.4;
    }

    y += sectionGap;

    fill('#BFF4B8');
    textStyle(BOLD);
    textSize(bodySize);
    text(
      'SDG 14.2: Protect and Restore Ecosystems',
      width / 2, y
    );

    y += bodySize * 1.45 + headingGap;

    fill('#EBFBE9');
    textStyle(NORMAL);
    textLeading(bodySize * 1.4);

    let sdgText =
      '“By 2020, sustainably manage and protect marine and coastal ecosystems ' +
      'to avoid significant adverse impacts, including by strengthening their ' +
      'resilience, and take action for their restoration in order to achieve ' +
      'healthy and productive oceans.”';

    let sdgLines = wrapText(sdgText, contentW);

    for (let line of sdgLines) {
      text(line, width / 2, y);
      y += bodySize * 1.4;
    }

    y += sectionGap;

    fill('#BFF4B8');
    textStyle(BOLD);
    textSize(bodySize);
    text(
      'CTA: Change everyday habits to protect ocean health.',
      width / 2, y
    );
  }

  // SOUND BUTTON
  let buttonW = constrain(popupW * 0.22, 120, 190);
  let buttonH = constrain(popupH * 0.07, 42, 50);
  let buttonX = popupX + 20;
  let buttonY = popupY + popupH - buttonH - 20;

  let soundButtonColor = color('#021427');
  soundButtonColor.setAlpha(80);
  fill(soundButtonColor);
  rect(buttonX, buttonY, buttonW, buttonH, 10);

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
      let testLine =
        currentLine === '' ? word : currentLine + ' ' + word;

      if (textWidth(testLine) <= maxWidth) {
        currentLine = testLine;
      } else {
        if (currentLine !== '') lines.push(currentLine);
        currentLine = word;
      }
    }

    if (currentLine !== '') lines.push(currentLine);
  }

  return lines;
}

function createWarningTypography() {
  warningLetters = [];

  let typeSize = getWarningTypographySize();
  textFont('apotek-wide');
  textSize(typeSize);
  textAlign(CENTER, CENTER);

  let spacing = typeSize * 0.05;
  let lineSpacing = typeSize * 0.2;
  let totalHeight =
    warningLines.length * typeSize +
    (warningLines.length - 1) * lineSpacing;

  let firstY =
    designH / 2 - totalHeight / 2 + typeSize / 2;

  for (let lineIndex = 0; lineIndex < warningLines.length; lineIndex++) {
    let message = warningLines[lineIndex];
    let totalWidth =
      textWidth(message) +
      spacing * (message.length - 1);

    let startX = designW / 2 - totalWidth / 2;
    let x = startX;
    let y = firstY + lineIndex * (typeSize + lineSpacing);

    for (let i = 0; i < message.length; i++) {
      let char = message[i];
      let charWidth = textWidth(char);

      warningLetters.push({
        char: char,
        homeX: x + charWidth / 2,
        homeY: y,
        x: x + charWidth / 2,
        y: y,
        vx: 0,
        vy: 0,
        angle: 0,
        angularVelocity: 0,
        size: typeSize
      });

      x += charWidth + spacing;
    }
  }
}

function getWarningTypographySize() {
  let maxWidth = designW * 0.7;
  let size = 90;

  textFont('apotek-wide');

  while (size > 30) {
    textSize(size);
    let longestWidth = 0;

    for (let line of warningLines) {
      let spacing = size * 0.05;
      let lineWidth =
        textWidth(line) +
        spacing * (line.length - 1);

      longestWidth = max(longestWidth, lineWidth);
    }

    if (longestWidth <= maxWidth) break;
    size -= 1;
  }

  return size;
}
function getWarningInteractionX() {
  if (touches.length > 0) {
    return (touches[0].x - offsetX) / scaleFactor;
  }
  return getDesignMouseX();
}

function getWarningInteractionY() {
  if (touches.length > 0) {
    return (touches[0].y - offsetY) / scaleFactor;
  }
  return getDesignMouseY();
}

function updateWarningTypography() {
  let targetAlpha = warningActive ? 255 : 0;
  warningAlpha = lerp(warningAlpha, targetAlpha, 0.04);

  if (warningLetters.length === 0) {
    createWarningTypography();
  }

  let interactionX = getWarningInteractionX();
  let interactionY = getWarningInteractionY();
  let interactionRadius = 150;

  for (let l of warningLetters) {
    let d = dist(
      interactionX, interactionY,
      l.x, l.y
    );

    if (d < interactionRadius && d > 0) {
      let dx = l.x - interactionX;
      let dy = l.y - interactionY;
      let force = map(d, interactionRadius, 0, 0, 2.5);

      dx /= d;
      dy /= d;

      l.vx += dx * force;
      l.vy += dy * force;
      l.angularVelocity += random(-0.03, 0.03);
    }

    l.vx *= 0.92;
    l.vy *= 0.92;
    l.angularVelocity *= 0.92;

    l.x += l.vx;
    l.y += l.vy;

    let returnStrength = 0.015;
    l.vx += (l.homeX - l.x) * returnStrength;
    l.vy += (l.homeY - l.y) * returnStrength;
    l.angle += l.angularVelocity;
  }
}

function drawWarningTypography() {
  push();
  textAlign(CENTER, CENTER);
  textFont('apotek-wide');

  let warningColor = color('#8FEC83');
  warningColor.setAlpha(warningAlpha);
  fill(warningColor);

  for (let l of warningLetters) {
    push();
    translate(l.x, l.y);
    rotate(l.angle);
    textSize(l.size);
    text(l.char, 0, 0);
    pop();
  }

  pop();
}

// MOUSE
function mousePressed() {
  if (showInfo) {
    let popupW = min(850, width * 0.8);
    let popupH = min(900, height * 0.95);
    let popupX = width / 2 - popupW / 2;
    let popupY = height / 2 - popupH / 2;

    let closeX = popupX + popupW - 30;
    let closeY = popupY + 30;

    if (dist(mouseX, mouseY, closeX, closeY) < 35) {
      playPopupSound();
      showInfo = false;

      if (soundOn && !audioStarted) {
        startAudio();
      }

      return;
    }

    let tabW = popupW * 0.42;
    let tabH = 70;
    let tabY = popupY + 35;
    let leftTabX = popupX + 20;
    let rightTabX = popupX + popupW - tabW - 20;

    if (
      mouseX >= leftTabX &&
      mouseX <= leftTabX + tabW &&
      mouseY >= tabY &&
      mouseY <= tabY + tabH
    ) {
      playPopupSound();
      activeTab = 0;
      targetTab = 0;
      return;
    }

    if (
      mouseX >= rightTabX &&
      mouseX <= rightTabX + tabW &&
      mouseY >= tabY &&
      mouseY <= tabY + tabH
    ) {
      playPopupSound();
      activeTab = 1;
      targetTab = 1;
      return;
    }

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
      playPopupSound();
      toggleSound();
      return;
    }

    return;
  }

  // LOGO
  if (
    mouseX > width - 110 &&
    mouseX < width &&
    mouseY > 0 &&
    mouseY < 120
  ) {
    playPopupSound();
    showInfo = true;
    return;
  }

  if (soundOn && !audioStarted) {
    startAudio();
  }

  // FIND SPARK
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

  if (d < globeSize / 2) {
    restoreNature();
  } else {
    harmNature();
  }

  let index = sparks.indexOf(draggingSpark);

  if (index !== -1) {
    sparks.splice(index, 1);
  }

  sparks.push(createSpark());
  draggingSpark = null;
}

function touchStarted() {
  if (touches.length === 0) return false;

  let tx = (touches[0].x - offsetX) / scaleFactor;
  let ty = (touches[0].y - offsetY) / scaleFactor;

  if (showInfo) return false;

  if (soundOn && !audioStarted) {
    startAudio();
  }

  for (let i = sparks.length - 1; i >= 0; i--) {
    let s = sparks[i];

    if (dist(tx, ty, s.x, s.y) < s.size * 0.7) {
      draggingSpark = s;
      return false;
    }
  }

  return false;
}

function touchMoved() {
  if (!draggingSpark || touches.length === 0) return false;

  let tx = (touches[0].x - offsetX) / scaleFactor;
  let ty = (touches[0].y - offsetY) / scaleFactor;

  draggingSpark.x = tx;
  draggingSpark.y = ty;

  return false;
}

function touchEnded() {
  if (!draggingSpark) return false;

  let d = dist(
    draggingSpark.x,
    draggingSpark.y,
    designW / 2,
    designH / 2
  );

  if (d < globeSize / 2) {
    restoreNature();
  } else {
    harmNature();
  }

  let index = sparks.indexOf(draggingSpark);

  if (index !== -1) {
    sparks.splice(index, 1);
  }

  sparks.push(createSpark());
  draggingSpark = null;

  return false;
}

function startAudio() {
  if (audioStarted || !soundOn) return;

  userStartAudio().then(() => {
    ambient1.setVolume(0.5);
    ambient2.setVolume(1);
    ambient3.setVolume(0.1);
    ambient4.setVolume(0.1);
    ambient5.setVolume(0.05);
    clickSound.setVolume(0.5);
    restoreSound.setVolume(0.2);

    ambient1.loop();
    ambient2.loop();
    audioStarted = true;
  });
}

function toggleSound() {
  soundOn = !soundOn;

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

  startAudio();
}

// NATURE INTERACTION
function restoreNature() {
  targetHealth = min(1, targetHealth + 0.15);

  if (audioStarted && soundOn) {
    restoreSound.play();
  }

  if (fishes.length < maxFish) {
    let amount = int(random(1, 3));

    for (
      let i = 0;
      i < amount && fishes.length < maxFish;
      i++
    ) {
      fishes.push(createFish());
    }
  }

  if (corals.length < maxCorals) {
    corals.push(createCoral());
  }

  if (seaweeds.length < maxSeaweeds) {
    let amount = int(random(1, 2));

    for (
      let i = 0;
      i < amount && seaweeds.length < maxSeaweeds;
      i++
    ) {
      seaweeds.push(createSeaweed());
    }
  }

  if (stars.length < maxStars) {
    stars.push(createStarfish());
  }

  if (audioStarted && soundOn) {
    ambient3.play();
    ambient4.play();
  }
}

function harmNature() {
  targetHealth = max(0, targetHealth - 0.15);

  if (audioStarted && soundOn) {
    clickSound.play();
    ambient5.play();
  }
}

// ECOSYSTEM POPULATION
function updateEcosystemPopulation() {
  let fishLimit = map(natureHealth, 0, 1, 1, maxFish);
  let coralLimit = map(natureHealth, 0, 1, 0, maxCorals);
  let seaweedLimit = map(natureHealth, 0, 1, 0, maxSeaweeds);
  let starLimit = map(natureHealth, 0, 1, 0, maxStars);

  if (populationTimer > 0) {
    populationTimer--;
    return;
  }

  if (fishes.length > fishLimit) {
    removeWeakest(fishes);
    populationTimer = 25;
    return;
  }

  if (corals.length > coralLimit) {
    removeWeakest(corals);
    populationTimer = 35;
    return;
  }

  if (seaweeds.length > seaweedLimit) {
    removeWeakest(seaweeds);
    populationTimer = 30;
    return;
  }

  if (stars.length > starLimit) {
    removeWeakest(stars);
    populationTimer = 40;
  }
}

function removeWeakest(array) {
  if (array.length === 0) return;

  let weakestIndex = 0;

  for (let i = 1; i < array.length; i++) {
    if (
      array[i].survival <
      array[weakestIndex].survival
    ) {
      weakestIndex = i;
    }
  }

  array.splice(weakestIndex, 1);
}

// RANDOM POSITION
function randomPointInCircle(cx, cy, radius) {
  let angle = random(360);
  let distance = sqrt(random());
  distance *= radius;

  return {
    x: cx + cos(angle) * distance,
    y: cy + sin(angle) * distance
  };
}

// STARFISH
function createStarfish() {
  let size = random(10, 30);
  let p = randomPointInCircle(
    designW / 2,
    designH / 2,
    160
  );

  return {
    img: starImg,
    altImg: starImg2,
    x: p.x,
    y: p.y,
    size: size,
    survival: random(0.25, 1)
  };
}

// CORAL
function createCoral() {
  let size = random(70, 130);
  let x, y;

  do {
    let p = randomPointInCircle(
      designW / 2,
      designH / 2,
      120
    );

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

// SEAWEED
function createSeaweed() {
  let size = random(90, 130);
  let x, y;

  do {
    let p = randomPointInCircle(
      designW / 2,
      designH / 2,
      120
    );

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

// FISH
function createFish() {
  let img = random(fishImgs);
  let size = random(40, 100);
  let y;

  do {
    y = random(
      designH / 2 - 150,
      designH / 2 + 150
    );
  } while (
    dist(
      designW / 2,
      designH / 2,
      designW / 2 - 140,
      y
    ) > 150
  );

  let direction = random() < 0.5 ? 1 : -1;
  let x = direction > 0
    ? designW / 2 - 140
    : designW / 2 + 140;

  let speed = random(0.1, 0.6) * direction;

  return new Fish(
    img,
    fish4,
    size,
    x,
    y,
    speed,
    random()
  );
}

class Fish {
  constructor(
    img,
    altImg,
    size,
    x,
    y,
    speed,
    survival
  ) {
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

    if (d > globeRadius - fishRadius) {
      this.alive = false;
    }
  }

  show(harm) {
    if (!this.alive) return;

    let aspect = this.img.height / this.img.width;
    let w = this.size;
    let h = this.size * aspect;

    push();
    translate(this.x, this.y);

    if (this.speed < 0) {
      scale(-1, 1);
    }

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

// PARTICLES
function updateParticles() {
  for (let p of particles) {
    p.y -= p.speed;
    p.x += sin(
      frameCount * 0.5 + p.offset) * 0.15;

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

// SPARKS
function createSpark() {
  let x, y;

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
    if (s !== draggingSpark) {
      s.y += sin(
        frameCount * 0.5 +
        s.floatOffset
      ) * 0.3;

      s.x += cos(
        frameCount * 0.3 +
        s.floatOffset
      ) * 0.2;
    }

    let pulse =
      sin(frameCount * 2 + s.floatOffset) * 0.08;

    let currentSize =
      s.size * (1 + pulse);

    push();
    imageMode(CENTER);
    translate(s.x, s.y);
    rotate(s.angle);
    image(
      sparkImg,
      0,
      0,
      currentSize,
      currentSize
    );
    pop();
  }
}

// GRADIENTS
function radialGradient(
  x0, y0, r0,
  x1, y1, r1,
  c0, c1
) {
  let gradient =
    drawingContext.createRadialGradient(
      x0, y0, r0,
      x1, y1, r1
    );

  gradient.addColorStop(
    0,
    c0.toString()
  );

  gradient.addColorStop(
    1,
    c1.toString()
  );

  drawingContext.fillStyle = gradient;
}

function sandGradientArc(
  x, y, r,
  startAngle, endAngle,
  verticalScale,
  horizontalScale,
  c1, c2
) {
  beginShape();

  for (
    let a = startAngle;
    a <= endAngle;
    a += 5
  ) {
    let inter = map(
      a,
      startAngle,
      endAngle,
      0,
      1
    );

    let c = lerpColor(
      c1,
      c2,
      inter
    );

    fill(c);

    let rx =
      x +
      r *
      horizontalScale *
      cos(a);

    let ry =
      y +
      r *
      verticalScale *
      sin(a);

    vertex(rx, ry);
  }

  let steps = 20;

  let x1 =
    x +
    r *
    horizontalScale *
    cos(endAngle);

  let y1 =
    y +
    r *
    verticalScale *
    sin(endAngle);

  let x2 =
    x +
    r *
    horizontalScale *
    cos(startAngle);

  let y2 =
    y +
    r *
    verticalScale *
    sin(startAngle);

  for (let i = 0; i <= steps; i++) {
    let t = i / steps;

    let bx = lerp(x1, x2, t);
    let by = lerp(y1, y2, t);

    let n = noise(
      frameCount * 0.05,
      i * 0.5);

    let offset = map(n,0,1,-2,2);

    vertex(bx,by + offset);
  }

  endShape(CLOSE);
}
