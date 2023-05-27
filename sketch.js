var capture;
var trackingData;

var gameState = 'title';

var selectedColor;
var isColorTrackOn = false;

var score = 0;

const perfectThreshold = 5;
const goodThreshold = 10;

function preload() {

}

function stateSelector() {

    switch (gameState) {

        case 'title':
            mainTitle();
            break;

        case 'tutorial_1':
            tutorial_1();
            break;

        case 'tutorial_2':
            tutorial_2();
            break;

        case 'tutorial_3':
            tutorial_3();
            break;

        case 'gameIngame':
            gameIngame();
            break;

        case 'gameClear':
            gameClear();
            break;

        case 'gameDefeat':
            gameDefeat();
            break;

        default:
            break;
    }

}

function mainTitle() {

    if (gameState === 'title') {
        background(0);

        rectMode(CENTER);
        fill(255);
        rect(width / 2, 3 * height / 4, width / 4, height / 6);

        if (mouseX >= width / 2 - width / 4 / 2 && mouseX <= width / 2 + width / 4 / 2 && mouseY >= 3 * height / 4 - height / 6 && mouseY <= 3 * height / 4 + height / 6) {
            rectMode(CENTER);
            fill(120);
            rect(width / 2, 3 * height / 4, width / 4, height / 6);
        }
    }
}

function tutorial_1() {
    if (gameState === 'tutorial_1') {
        background(0);

        fill(0);
        quad(0, 0,
            width / 3, 0,

            width / 3, height,
            0, height);

        quad(width / 3, 0,
            2 * width / 3, 0,

            2 * width / 3, height,
            width / 3, height);

        quad(2 * width / 3, 0,
            width, 0,

            width, height,
            2 * width / 3, height);

        if (mouseX <= width / 3) {
            fill('magenta');
            quad(0, 0,
                width / 3, 0,

                width / 3, height,
                0, height);
        }
        else if (mouseX >= width / 3 && mouseX <= 2 * width / 3) {
            fill('cyan');
            quad(width / 3, 0,
                2 * width / 3, 0,

                2 * width / 3, height,
                width / 3, height);
        }
        else if (mouseX >= 2 * width / 3) {
            fill('yellow');
            quad(2 * width / 3, 0,
                width, 0,

                width, height,
                2 * width / 3, height);
        }

        const colorInstructions = '마법봉의 색을 골라주세요!';
        textAlign(CENTER, CENTER);
        textSize(24);
        fill(255);
        text(colorInstructions, width / 2, height / 2 - 50);

    }
}

function tutorial_2() {
    if (gameState === 'tutorial_2') {
        background(0);

        const moveInstructions = '카메라를 향해 마법봉을 움직여보세요!';
        textAlign(CENTER, CENTER);
        textSize(24);
        fill(255);
        text(moveInstructions, width / 2, height / 2 - 50);



        rectMode(CENTER);
        fill(255);
        rect(width / 2, 3 * height / 4, width / 4, height / 6);

        if (mouseX >= width / 2 - width / 4 / 2 && mouseX <= width / 2 + width / 4 / 2 && mouseY >= 3 * height / 4 - height / 6 && mouseY <= 3 * height / 4 + height / 6) {
            rectMode(CENTER);
            fill(120);
            rect(width / 2, 3 * height / 4, width / 4, height / 6);
        }
    }
}

function tutorial_3() {
    if (gameState === 'tutorial_3') {
        background(0);


        

    }
}

function gameIngame() {
    if (gameState === 'gameIngame') {
        background(0);

    }
}

function gameClear() {
    if (gameState === 'gameClear') {
        background(0);

    }
}

function gameDefeat() {
    if (gameState === 'gameDefeat') {
        background(0);

    }
}

function mouseClicked() {

    switch (gameState) {

        case 'title':
            if (mouseX >= width / 2 - width / 4 / 2 && mouseX <= width / 2 + width / 4 / 2 && mouseY >= 3 * height / 4 - height / 6 && mouseY <= 3 * height / 4 + height / 6) {
                gameState = 'tutorial_1';
            }
            break;

        case 'tutorial_1':
            if (mouseX <= width / 3) {
                selectedColor = 'magenta';
            }
            else if (mouseX >= width / 3 && mouseX <= 2 * width / 3) {
                selectedColor = 'cyan';
            }
            else if (mouseX >= 2 * width / 3) {
                selectedColor = 'yellow';
            }
            gameState = 'tutorial_2';
            trackingStart();
            break;

        case 'tutorial_2':
            if (mouseX >= width / 2 - width / 4 / 2 && mouseX <= width / 2 + width / 4 / 2 && mouseY >= 3 * height / 4 - height / 6 && mouseY <= 3 * height / 4 + height / 6) {
                gameState = 'tutorial_3';
            }
            break;

        case 'tutorial_3':
            break;

        case 'gameIngame':
            break;

        case 'gameClear':
            break;

        case 'gameDefeat':
            break;

        default:
            break;
    }

}

/////////////////////////////////////////////////////////////////////////////////////////////////////

function setup() {
    createCanvas(800, 600);

    capture = createCapture(VIDEO); //capture the webcam
    capture.position(0, 0) //move the capture to the top left
    capture.style('opacity', 0)// use this to hide the capture later on (change to 0 to hide)...
    capture.id("myVideo"); //give the capture an ID so we can use it in the tracker below.
}

function trackingStart() {
    if (isColorTrackOn == false) {
        // colors = new tracking.ColorTracker(['magenta', 'cyan', 'yellow']);
        trackingColor = new tracking.ColorTracker(selectedColor);

        tracking.track('#myVideo', trackingColor); // start the tracking of the colors above on the camera in p5

        //start detecting the tracking
        trackingColor.on('track', function (event) { //this happens each time the tracking happens
            trackingData = event.data // break the trackingjs data into a global so we can access it with p5
        });
        isColorTrackOn = true;
    }
}

function draw() {

    stateSelector();
    drawTrackingEffect();

}

function drawTrackingEffect() {
    if (isColorTrackOn === true) {
        if (trackingData) { //if there is tracking data to look at, then...
            for (var i = 0; i < trackingData.length; i++) { //loop through each of the detected colors
                // console.log( trackingData[i] )
                rect(width - trackingData[i].x, trackingData[i].y, trackingData[i].width, trackingData[i].height)
            }
        }
    }
}

function playerStroke() {

    
}

class RhythmNote {
    constructor(x, y, size, color, timing) {
      this.x = x;
      this.y = y;
      this.size = size;
      this.color = color;
      this.timing = timing;
    }
  
    display() {
      fill(this.color);
      ellipse(this.x, this.y, this.size);
    }
  
    checkTiming(playerTiming) {
      // Compare the player's timing with the rhythm note's timing
      // You can use the perfectThreshold and goodThreshold constants to define the timing windows
      if (abs(playerTiming - this.timing) <= perfectThreshold) {
        // Player hit the note perfectly
        score += 100;
        return 'perfect';
      } else if (abs(playerTiming - this.timing) <= goodThreshold) {
        // Player hit the note within the good threshold
        score += 60;
        return 'good';
      } else {
        // Player missed the note
        return 'miss';
      }
    }
  }
  