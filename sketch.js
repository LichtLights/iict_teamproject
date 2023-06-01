var capture;
var trackingData;

var gameState = 'title';

var selectedColor;
var isColorTrackOn = false;

var score = 0;

var tutorialTimer = 0;  // 튜토리얼용 타이머
var musicTimer = 0;
var pStrokeTimer = 0;   // 플레이어 stroke 시간 정보 저장
var ingameTimer = 0;    // 게임 시작 후 타이머

let trPosArr = [];

let notesArr = [];

const perfectThreshold = 10;
const goodThreshold = 30;

function preload() {
    arrow_up = loadImage('../arrow_up.png');
    arrow_down = loadImage('../arrow_down.png');
    arrow_left = loadImage('../arrow_left.png');
    arrow_right = loadImage('../arrow_right.png');
}

// 각 Phase 선택
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

// 각 Phase 구현
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
        score = 0;

        const moveInstructions = '타이밍에 맞춰 마법봉을 움직이세요!';
        textAlign(CENTER, CENTER);
        textSize(24);
        fill(255);
        text(moveInstructions, width / 2, height / 2 - 50);

        tutorialTimer++;

        switch(tutorialTimer) {

            case 120:
                const tutonote1 = createNote('Right', 120);
                break;

            case 240:
                const tutonote2 = createNote('Left', 240);
                break;

            case 360:
                const tutonote3 = createNote('Down', 360);
                break;

            default:
                break;
        }

    }
}

function gameIngame() {
    if (gameState === 'gameIngame') {
        background(0);

        const startInstructions = '게임이 시작됩니다!';
        textAlign(CENTER, CENTER);
        textSize(24);
        fill(255);
        text(moveInstructions, width / 2, height / 2 - 50);

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

// 각 Phase interaction 구현
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

// 마법봉 tracking
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

// 매 프레임 화면 다시 그리기
function draw() {

    stateSelector();
    drawTrackingEffect();
    noteUpdate();

}

// 마법봉 tracking 효과 그리기
function drawTrackingEffect() {
    if (isColorTrackOn === true) {
        if (trackingData) { //if there is tracking data to look at, then...
            for (var i = 0; i < trackingData.length; i++) { //loop through each of the detected colors
                // console.log( trackingData[i] );
                trPosArr.push(createVector(width - trackingData[i].x, trackingData[i].y));
                // const eff = rect(width - trackingData[i].x, trackingData[i].y, trackingData[i].width, trackingData[i].height);
            }
        }
        if (trPosArr.length > 7) {
            trPosArr.shift();
        }

        beginShape();
        for (let i = 0; i < trPosArr.length; i++) {
            ellipse(trPosArr[i].x, trPosArr[i].y, 30, 30);
        }
        endShape();
    }
}

// 리듬 노트 다시 그리기
function noteUpdate() {

    if (notesArr.length > 0) {
        for (let notes of notesArr) {
            notes.display();
            notes.timingIndicator();
            notes.timingIndicatorDisplay();
        }
    }
}

// 플레이어 input
function playerStroke() {
    if (isColorTrackOn === true) {
        const dx = trPosArr[6].x - trPosArr[0].x;
        const dy = trPosArr[6].y - trPosArr[0].y;

        if (dx >= 100) {
            if (gameState == 'tutorial_3') { pStrokeTimer = tutorialTimer; }
            if (gameState == 'gameIngame') { pStrokeTimer = musicTimer; }
            return 'Right';
        }
        else if (dx <= -100) {
            if (gameState == 'tutorial_3') { pStrokeTimer = tutorialTimer; }
            if (gameState == 'gameIngame') { pStrokeTimer = musicTimer; }
            return 'Left';
        }
        else if (dy >= 100) {
            if (gameState == 'tutorial_3') { pStrokeTimer = tutorialTimer; }
            if (gameState == 'gameIngame') { pStrokeTimer = musicTimer; }
            return 'Down';
        }
        else if (dy <= 100) {
            if (gameState == 'tutorial_3') { pStrokeTimer = tutorialTimer; }
            if (gameState == 'gameIngame') { pStrokeTimer = musicTimer; }
            return 'Up';
        }
        else {
            return 'Nothing';
        }
    }
}

class RhythmNote {
    constructor(ctiming, direction) {
        this.size = 100;
        this.color = 'white';
        this.ctiming = ctiming;
        this.timing = ctiming + 60;
        this.direction = direction;

        this.hit = false;
        this.indicatorSize = 300;

        this.x = width / 2;
        this.y = height / 4;
    }

    display() {
        fill(this.color);
        ellipse(this.x, this.y, this.size);

        // draw arrow for direction
        imageMode(CENTER);
        switch (this.direction) {

            case 'Up':
                arrow_up.resize(this.size, this.size);
                image(arrow_up, this.x, this.y);
                break;

            case 'Down':
                arrow_down.resize(this.size, this.size);
                image(arrow_down, this.x, this.y);
                break;

            case 'Left':
                arrow_left.resize(this.size, this.size);
                image(arrow_left, this.x, this.y);
                break;

            case 'Right':
                arrow_right.resize(this.size, this.size);
                image(arrow_right, this.x, this.y);
                break;

            default:
                break;
        }

    }

    timingIndicator() {
        if (gameState == 'tutorial_3') {
            const currentTime = tutorialTimer;
            const timeDiff = Math.abs(this.timing - currentTime);
            const pstroke = playerStroke();

            if (timeDiff < perfectThreshold && this.direction == pstroke && !this.hit) {
                this.hit = true;
                console.log("perfect"); // DEBUG
                return "perfect";
            }
            else if (timeDiff < goodThreshold && this.direction == pstroke && !this.hit) {
                this.hit = true;
                console.log("good"); // DEBUG
                return "good";
            }
        }
        else if (gameState == 'gameIngame') {
            const currentTime = musicTimer;
            const timeDiff = Math.abs(this.timing - currentTime);
            const pstroke = playerStroke();

            if (timeDiff < perfectThreshold && this.direction == pstroke) {
                this.hit = true;
                score += 100;
                return "perfect";
            }
            else if (timeDiff < goodThreshold && this.direction == pstroke) {
                this.hit = true;
                score += 50;
                return "good";
            }
        }
    }

    timingIndicatorDisplay() {
        const indicator = this.timingIndicator();
        const maxIndicatorSize = 300;
        const minIndicatorSize = 100;
        const indicatorColor = color(255, 255, 255);
        const indicatorStrokeWeight = 5;

        push();
        noFill();
        stroke(indicatorColor);
        strokeWeight(indicatorStrokeWeight);

        const adjustedSize = map(this.indicatorSize, minIndicatorSize, maxIndicatorSize, minIndicatorSize, maxIndicatorSize);

        const sizeDiff = adjustedSize - minIndicatorSize;

        translate(this.x, this.y);
        scale(adjustedSize / maxIndicatorSize);
        ellipse(0, 0, sizeDiff);
        pop();

        // Update the indicator size & check hit.
        if (this.hit) {
            this.indicatorSize = 0;
            notesArr.splice(0,1);
            if(indicator == 'perfect') {
                // show perfect effect

            }
            else if(indicator == 'good') {
                // show good effect

            }

        } else {
            this.indicatorSize -= 1;
            this.indicatorSize = constrain(this.indicatorSize, 0, maxIndicatorSize);
            if(gameState == 'tutorial_3' && this.ctiming + 90 <= tutorialTimer) {
                notesArr.splice(0,1);
                // show miss effect

            }
        }
    }
}

function createNote(direction, time) {

    switch (direction) {

        case 'Up':
            const noteUp = new RhythmNote(time, 'Up');
            notesArr.push(noteUp);
            return (noteUp);

        case 'Down':
            const noteDown = new RhythmNote(time, 'Down');
            notesArr.push(noteDown);
            return (noteDown);

        case 'Left':
            const noteLeft = new RhythmNote(time, 'Left');
            notesArr.push(noteLeft);
            return (noteLeft);

        case 'Right':
            const noteRight = new RhythmNote(time, 'Right');
            notesArr.push(noteRight);
            return (noteRight);

        default:
            break;
    }

}
