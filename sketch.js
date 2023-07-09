let start;

let Botx1, Boty1, largbot1, altbot1;
let tela = 0;

let hasClicked = false;
let isInutil = false;

let dateStart, dateEnd;

let posX, posY;

const VELOCITY = 1;

let xmod = 1, ymod = 1;

let ranking = [];

let rankingButton;
let rankingScreenVisible = false;

let nameInput;
let submitButton;

function now(milliseconds) {
  const seconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const leftoverSeconds = seconds % 60;

  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(leftoverSeconds).padStart(2, '0');

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

function preload() {
  start = loadImage("start.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  dateStart = Date.now();

  posX = Math.floor(windowWidth * 0.1);
  posY = Math.floor(windowHeight * 0.02);

  Botx1 = Math.floor(windowWidth * 0.34);
  Boty1 = Math.floor(windowHeight * 0.46);
  largbot1 = Math.floor(windowWidth * 0.328);
  altbot1 = Math.floor(windowHeight * 0.08);

  rankingButton = createButton('Ranking');
  rankingButton.position(windowWidth - 100, 20);
  rankingButton.hide();
  rankingButton.mousePressed(showRanking);

  nameInput = createInput();
  nameInput.position(windowWidth / 2 - 50, windowHeight / 2 + 40);
  nameInput.hide();

  submitButton = createButton('Submit');
  submitButton.position(windowWidth / 2 - 30, windowHeight / 2 + 70);
  submitButton.hide();
  submitButton.mousePressed(submitTime);
}

function mousePressed() {
  if (!hasClicked && mouseX >= Botx1 && mouseY >= Boty1 && mouseX <= Botx1 + largbot1 && mouseY <= Boty1 + altbot1) {
    dateStart = Date.now();
    hasClicked = true;
  }

  if (hasClicked && mouseX >= windowWidth - 30 && mouseY <= 30) {
    dateEnd = Date.now();
    isInutil = true;

    const time = Math.abs(dateEnd - dateStart);
    ranking.push({ time, name: '' });
    ranking.sort((a, b) => a.time - b.time);

    console.log("Ranking:");
    for (let i = 0; i < ranking.length; i++) {
      console.log(`${i + 1}. ${now(ranking[i].time)} - ${ranking[i].name}`);
    }
  }
}

function draw() {
  clear();
  background(0);
  fill(255);

  if (!hasClicked) {
    image(start, Botx1, Boty1, largbot1, altbot1);
  }

  if (isInutil) {
    textSize(36);
    const lineHeight = 36 * 1.5;
    const startY = windowHeight - Math.floor(windowHeight * 0.5);
    textAlign(CENTER, CENTER);
    text(`Parabéns!`, windowWidth / 2, startY - lineHeight);
    text(`Você passou`, windowWidth / 2, startY);
    text(`${now(Math.abs(dateEnd - dateStart))}`, windowWidth / 2, startY + lineHeight);
    text(`sendo inútil`, windowWidth / 2, startY + 2 * lineHeight);

    rankingButton.show();
  }

  if (hasClicked && !isInutil) {
    strokeWeight(2);
    stroke(255, 0, 0);
    rect(windowWidth - 30, -1, windowWidth, 30);
    textAlign(CENTER, CENTER);
    text("x", windowWidth - 15, 15);

    noStroke();
    fill(255);

    if (posX + Math.floor(windowWidth * 0.1) >= windowWidth || posX <= 0) {
      xmod *= -1;
      if (Math.ceil(random(-5, 1)) >= 1) {
        ymod *= -1;
      }
    }
    if (posY + Math.floor(windowHeight * 0.02) >= windowHeight || posY <= 0) {
      ymod *= -1;
      if (Math.ceil(random(-5, 1)) >= 1) {
        xmod *= -1;
      }
    }

    posX += xmod * VELOCITY;
    posY += ymod * VELOCITY;

    const textX = windowWidth - posX;
    const textY = posY;

    push();
    textSize(36 * 3); // Aumenta o tamanho do texto em três vezes
    text(now(Math.abs(Date.now() - dateStart)), textX, textY);
    pop();
  }

  push();
  fill(255);
  circle(mouseX, mouseY, 10);
  pop();

  if (!hasClicked && mouseX >= Botx1 && mouseY >= Boty1 && mouseX <= Botx1 + largbot1 && mouseY <= Boty1 + altbot1) {
    noFill();
    stroke(255, 255, 255);
    rect(Botx1, Boty1, largbot1, altbot1);
  }

  if (rankingScreenVisible) {
    drawRankingScreen();
  }
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  posX = Math.floor(windowWidth * 0.1);
  posY = Math.floor(windowHeight * 0.02);
}

function showRanking() {
  rankingScreenVisible = true;
  rankingButton.hide();
  nameInput.show();
  submitButton.show();
}

function drawRankingScreen() {
  background(0);
  fill(255);
  textSize(24);
  textAlign(CENTER, TOP);
  text("Top 10 Maiores Tempos", windowWidth / 2, 50);

  for (let i = 0; i < Math.min(10, ranking.length); i++) {
    const entry = ranking[i];
    const y = 80 + i * 30;
    text(`${i + 1}. ${now(entry.time)} - ${entry.name}`, windowWidth / 2, y);
  }
}

function submitTime() {
  const name = nameInput.value();
  const lastIndex = ranking.length - 1;

  ranking[lastIndex].name = name;

  ranking.sort((a, b) => a.time - b.time);

  console.log("Ranking:");
  for (let i = 0; i < ranking.length; i++) {
    console.log(`${i + 1}. ${now(ranking[i].time)} - ${ranking[i].name}`);
  }
}
