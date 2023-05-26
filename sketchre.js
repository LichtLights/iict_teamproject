let video;
let trackingColor;
let notes = [];
let noteIndex = 0;
let score = 0;
let gameState = 'title';
let countdown = 5;
let countdownInterval;
let startTime;
let selectedColor;
let trackingRect = {
  x: 0,
  y: 0,
  width: 100,
  height: 100
};
let ctrackStarted = false;

const perfectThreshold = 5;
const goodThreshold = 10;

function preload() {
  // bgMusic = loadSound('bgMusic.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Initialize video capture
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  // Set up color tracking
  trackingColor = color(255, 0, 0); // Set default tracking color

  // Start the game
  showTitleScreen();
}

function draw() {
  if (gameState === 'game') {
    background(0);
    image(video, 0, 0, width, height);
    trackingEffect();
    drawNotes();
    drawTimingIndicator();
    drawScore();
  }
}

function keyPressed() {
  if (gameState === 'game') {
    if (notes.length > 0 && noteIndex < notes.length) {
      const currentNote = notes[noteIndex];
      const judgement = calculateJudgement(currentNote.appearanceTime);

      if (
        (keyCode === UP_ARROW && currentNote.direction === 'Up') ||
        (keyCode === DOWN_ARROW && currentNote.direction === 'Down') ||
        (keyCode === LEFT_ARROW && currentNote.direction === 'Left') ||
        (keyCode === RIGHT_ARROW && currentNote.direction === 'Right')
      ) {
        handleJudgement(judgement);
      } else {
        handleJudgement('Miss');
      }

      noteIndex++;
    }
  }
}

function handleJudgement(judgement) {
  if (judgement === 'Perfect') {
    score += 100;
    // Add visual and audio feedback for a Perfect judgement
  } else if (judgement === 'Good') {
    score += 50;
    // Add visual and audio feedback for a Good judgement
  } else if (judgement === 'Miss') {
    // Add visual and audio feedback for a Miss judgement
  }
}

function calculateJudgement(noteTime) {
  const elapsedTime = millis() - noteTime;
  if (elapsedTime <= perfectThreshold) {
    return 'Perfect';
  } else if (elapsedTime <= goodThreshold) {
    return 'Good';
  } else {
    return 'Miss';
  }
}

function showTitleScreen() {
  background(0);
  // Add your code here to display the title screen

  // Add event listener for the start button
  // When clicked, start the tutorial
  const startButton = createButton('Start Game');
  startButton.mousePressed(startTutorial);
}

function startTutorial() {
  gameState = 'tutorial';

  // Step 0: Pick one of the colors (red, green, or blue)
  const colorInstructions = 'Pick a color: Press "R" for red, "G" for green, or "B" for blue.';
  textAlign(CENTER, CENTER);
  textSize(24);
  fill(255);
  text(colorInstructions, width / 2, height / 2 - 50);

  selectedColor = null;

  // Add event listeners for color selection
  document.addEventListener('keydown', selectColor);

  function selectColor(event) {
    if (event.key === 'r' || event.key === 'R') {
      selectedColor = 'red';
      ctrackStarted = true;
      document.removeEventListener('keydown', selectColor);
      startColorTracking();
    } else if (event.key === 'g' || event.key === 'G') {
      selectedColor = 'green';
      ctrackStarted = true;
      document.removeEventListener('keydown', selectColor);
      startColorTracking();
    } else if (event.key === 'b' || event.key === 'B') {
      selectedColor = 'blue';
      ctrackStarted = true;
      document.removeEventListener('keydown', selectColor);
      startColorTracking();
    }
  }
}

function trackingEffect() {
  if(ctrackStarted === true) {
    const rectX = width / 2 - trackingRect.width / 2;
    const rectY = height / 2 - trackingRect.height / 2;
    stroke(255, 0, 0);
    noFill();
    rect(rectX, rectY, trackingRect.width, trackingRect.height);
  }
}

function startColorTracking() {
  // Set up color tracking based on selected color
  if (selectedColor === 'red') {
    trackingColor = color(255, 0, 0);
  } else if (selectedColor === 'green') {
    trackingColor = color(0, 255, 0);
  } else if (selectedColor === 'blue') {
    trackingColor = color(0, 0, 255);
  }

  // Step 1: Move color object so that tracking is working
  background(0);
  const trackingInstructions = 'Move the color object within the tracking rectangle.';
  textAlign(CENTER, CENTER);
  textSize(24);
  fill(255);
  text(trackingInstructions, width / 2, height / 2 - 50);

  // Display the tracking rectangle
  const rectX = width / 2 - trackingRect.width / 2;
  const rectY = height / 2 - trackingRect.height / 2;
  stroke(255, 0, 0);
  noFill();
  rect(rectX, rectY, trackingRect.width, trackingRect.height);

  // Add your code here to guide the player to move the color object
  // For example, you can display arrows or instructions on how to move the object

  // Step 2: Give a random note to confirm that the judgement system is working properly
  const testNote = {
    direction: random(['Up', 'Down', 'Left', 'Right']),
    appearanceTime: millis() + 2000, // Appearance time after 2 seconds
  };
  notes.push(testNote);

  // Step 3: Start the game after 5 seconds with a countdown
  countdown = 5;
  countdownInterval = setInterval(() => {
    countdown--;
    if (countdown === 0) {
      clearInterval(countdownInterval);
      bgMusic.loop();
      startGame();
    }
  }, 1000);

  // Add your code here to display the countdown
}

function startGame() {
  gameState = 'game';
  score = 0;
  noteIndex = 0;

  // Start the rhythm notes
  setTimeout(startNotes, 1000); // Delay the notes by 1 second
}

function startNotes() {
  // Generate random notes
  for (let i = 0; i < 10; i++) {
    const direction = random(['Up', 'Down', 'Left', 'Right']);
    const appearanceTime = millis() + random(1000, 3000); // Random appearance time between 1-3 seconds
    const note = { direction, appearanceTime };
    notes.push(note);
  }
}

function drawNotes() {
  for (const note of notes) {
    const elapsedTime = millis() - note.appearanceTime;
    if (elapsedTime < 0) continue; // Skip notes that haven't appeared yet

    const noteSize = map(elapsedTime, 0, 1000, 50, 10);
    const noteColor = color(255, 255, 255, map(elapsedTime, 0, 1000, 255, 0));
    const x = width / 2;
    const y = height / 2;

    push();
    fill(noteColor);
    noStroke();
    ellipse(x, y, noteSize);
    pop();
  }
}

function drawTimingIndicator() {
  // Add your code here to draw the timing indicator
}

function drawScore() {
  textSize(20);
  fill(255);
  textAlign(LEFT, TOP);
  text(`Score: ${score}`, 10, 10);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
