var capture;
var trackingData;

var gameState = 'title';

var selectedColors;
var isColorOn = false;

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
            tutorial_1();
            break;

        case 'tutorial_3':
            tutorial_1();
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
            fill('red');
            quad(0, 0,
                width / 3, 0,

                width / 3, height,
                0, height);
        }
        else if (mouseX >= width / 3 && mouseX <= 2 * width / 3) {
            fill('green');
            quad(width / 3, 0,
                2 * width / 3, 0,

                2 * width / 3, height,
                width / 3, height);
        }
        else if (mouseX >= 2 * width / 3) {
            fill('blue');
            quad(2 * width / 3, 0,
                width, 0,

                width, height,
                2 * width / 3, height);
        }

    }
}

function tutorial_2() {
    if (gameState === 'tutorial_2') {
        background(0);
        
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
                selectedColors = 'magenta';
            }
            else if (mouseX >= width / 3 && mouseX <= 2 * width / 3) {
                selectedColors = 'green';
            }
            else if (mouseX >= 2 * width / 3) {
                selectedColors = 'blue';
            }
            isColorOn = true;
            gameState = 'tutorial_2';
            break;

        case 'tutorial_2':
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

function draw() {

    stateSelector();
    drawTrackingEffect();

}

function trackingStart() {
    if (isColorOn === true) {
        // colors = new tracking.ColorTracker(['magenta', 'cyan', 'yellow']);
        selectedColors = new tracking.ColorTracker(['magenta']);

        tracking.track('#myVideo', selectedColors); // start the tracking of the colors above on the camera in p5

        //start detecting the tracking
        selectedColors.on('track', function (event) { //this happens each time the tracking happens
            trackingData = event.data // break the trackingjs data into a global so we can access it with p5
        });
    }
}

function drawTrackingEffect() {
    if (gameState != 'title' && gameState != 'tutorial_1') {
        if (trackingData) { //if there is tracking data to look at, then...
            for (var i = 0; i < trackingData.length; i++) { //loop through each of the detected colors
                // console.log( trackingData[i] )
                rect(width - trackingData[i].x, trackingData[i].y, trackingData[i].width, trackingData[i].height)
            }
        }
    }
}