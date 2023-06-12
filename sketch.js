var capture;
var trackingData;

var gameState = 'title';

var selectedColor;
var isColorTrackOn = false;

var score = 0;

var tutorialTimer = 0;  // 튜토리얼용 타이머
var tutorialPass = false;
var tutorialAgain = false;

var musicTimer = 0;
var pStrokeTimer = 0;   // 플레이어 stroke 시간 정보 저장
var ingameTimer = 0;    // 게임 시작 후 타이머
var gameStarted = false;
var musicStarted = false;

var noteTimer = 0;      // 애니메이션 프레임 계산용 노트 타이머

let trPosArr = [];

let notesArr = [];

const perfectThreshold = 10;
const goodThreshold = 30;
const missThreshold = 59;

function preload() {

    fontIngameL = loadFont('../src/fonts/KOFIH DrLEEJW_TTF-L.ttf');
    fontIngameB = loadFont('../src/fonts/KOFIH DrLEEJW_TTF-B.ttf');

    arrow_up = loadImage('../src/Notes/arrow_up.png');
    arrow_down = loadImage('../src/Notes/arrow_down.png');
    arrow_left = loadImage('../src/Notes/arrow_left.png');
    arrow_right = loadImage('../src/Notes/arrow_right.png');

    wand_red = loadImage('../src/MagicWand/magicWand_R.png');
    wand_blue = loadImage('../src/MagicWand/magicWand_B.png');
    wand_yellow = loadImage('../src/MagicWand/magicWand_Y.png');
    wand_sel = loadImage('../src/MagicWand/magicWand_Selected.png');

    trac_eff = loadImage('../src/mousePointer.png');

    bg_main = loadImage('../src/background/Main.png');
    bg_game = loadImage('../src/background/battle.png');
    bg_main.resize(800, 600);

    game_music = loadSound('../src/Sounds/InGameMusic.wav');
}

function modelLoaded() {
    console.log('Model Loaded!');
}

// 각 Phase 선택
function stateSelector() {

    switch (gameState) {

        case 'title':
            mainTitle();
            break;

        case 'story':
            story();
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
        background(64, 48, 74);
        image(bg_main, 0, 0);
    }
}

function story() {

}

function tutorial_1() {
    if (gameState === 'tutorial_1') {
        background(64, 48, 74);

        imageMode(CENTER);


        if (mouseX <= width / 3) {
            image(wand_sel, width / 3 / 2, (height / 2) - (height / 9));
        }
        else if (mouseX >= width / 3 && mouseX <= 2 * width / 3) {
            image(wand_sel, (2 * (width / 3)) - width / 3 / 2, (height / 2) - (height / 9));
        }
        else if (mouseX >= 2 * width / 3) {
            image(wand_sel, (3 * (width / 3)) - width / 3 / 2, (height / 2) - (height / 9));
        }

        image(wand_red, width / 3 / 2, (height / 2) - (height / 9));
        image(wand_blue, (2 * (width / 3)) - width / 3 / 2, (height / 2) - (height / 9));
        image(wand_yellow, (3 * (width / 3)) - width / 3 / 2, (height / 2) - (height / 9));


        textAlign(CENTER, CENTER);
        textFont(fontIngameL);
        textSize(24);
        fill(250, 239, 208);
        const colorInstructions1 = '사용할 마법 지팡이의 색을 골라주세요!';
        text(colorInstructions1, width / 2, 50 * (height / 60));

        textSize(18);
        const colorInstructions2 = '착용하신 옷, 장신구 등과 겹치지 않는 색을 선택하시는 것을 권장합니다.';
        text(colorInstructions2, width / 2, 54 * (height / 60));

    }
}

function tutorial_2() {
    if (gameState === 'tutorial_2') {
        background(64, 48, 74);

        const moveInstructions = '카메라를 향해 마법봉을 움직여보세요!';
        textAlign(CENTER, CENTER);
        textSize(28);
        fill(250, 239, 208);
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
        background(64, 48, 74);
        score = 0;

        if (!tutorialAgain) {
            const moveInstructions1 = '타이밍에 맞춰 마법봉을 움직이세요!';
            textAlign(CENTER, CENTER);
            textSize(28);
            fill(250, 239, 208);
            text(moveInstructions1, width / 2, height / 2 - 50);
        }
        else {
            const moveInstructions2 = '다시 움직여보세요!';
            textAlign(CENTER, CENTER);
            textSize(28);
            fill(250, 239, 208);
            text(moveInstructions2, width / 2, height / 2 - 50);
        }

        tutorialTimer++;

        switch (tutorialTimer) {

            case 120:
                const tutonote1 = createNote('Up', 120);
                break;

            case 240:
                const tutonote2 = createNote('Up', 240);
                break;

            case 360:
                const tutonote3 = createNote('Up', 360);
                break;

            default:
                break;
        }

        if (tutorialPass && tutorialTimer >= 460) {
            gameState = 'gameIngame';
        }
        else if (!tutorialPass && tutorialTimer >= 460) {
            tutorialTimer = 0;
            tutorialAgain = true;
        }

    }
}

function gameIngame() {
    if (gameState === 'gameIngame') {
        background(64, 48, 74);

        ingameTimer++;

        if (ingameTimer >= 60 && ingameTimer < 120) {
            const startInstructions0 = '5초 후 게임이 시작됩니다!';
            textAlign(CENTER, CENTER);
            textSize(28);
            fill(250, 239, 208);
            text(startInstructions0, width / 2, height / 2 - 50);
        }
        else if (ingameTimer >= 120 && ingameTimer < 180) {
            const startInstructions1 = '4초 후 게임이 시작됩니다!';
            textAlign(CENTER, CENTER);
            textSize(28);
            fill(250, 239, 208);
            text(startInstructions1, width / 2, height / 2 - 50);
        }
        else if (ingameTimer >= 180 && ingameTimer < 240) {
            const startInstructions2 = '3초 후 게임이 시작됩니다!';
            textAlign(CENTER, CENTER);
            textSize(28);
            fill(250, 239, 208);
            text(startInstructions2, width / 2, height / 2 - 50);
        }
        else if (ingameTimer >= 240 && ingameTimer < 300) {
            const startInstructions3 = '2초 후 게임이 시작됩니다!';
            textAlign(CENTER, CENTER);
            textSize(28);
            fill(250, 239, 208);
            text(startInstructions3, width / 2, height / 2 - 50);
        }
        else if (ingameTimer >= 300 && ingameTimer < 360) {
            const startInstructions4 = '1초 후 게임이 시작됩니다!';
            textAlign(CENTER, CENTER);
            textSize(28);
            fill(250, 239, 208);
            text(startInstructions4, width / 2, height / 2 - 50);
        }
        else if (ingameTimer >= 360 && !gameStarted) {
            gameStarted = true;
            musicStarted = true;
        }

        if (gameStarted) {

            if (musicStarted) {
                game_music.play();
                musicStarted = false;
            }

            imageMode(CORNER);
            bg_game.resize(800, 600);
            image(bg_game, 0, 0);
            musicTimer++;
            inGameAnim();

            switch (musicTimer) {

                case 112:
                    const gamenote1 = createNote('Down', 112);
                    console.log(musicTimer);
                    break;

                case 267:
                    const gamenote2 = createNote('Up', 267);
                    console.log(musicTimer);
                    break;

                case 702:
                    const gamenote3 = createNote('Up', 702);
                    console.log(musicTimer);
                    break;

                case 820:
                    const gamenote4 = createNote('Right', 820);
                    console.log(musicTimer);
                    break;

                case 949:
                    const gamenote5 = createNote('Left', 949);
                    console.log(musicTimer);
                    break;

                case 1077:
                    const gamenote6 = createNote('Down', 1077);
                    console.log(musicTimer);
                    break;

                case 1193:
                    const gamenote7 = createNote('Up', 1193);
                    console.log(musicTimer);
                    break;

                case 1305:
                    const gamenote8 = createNote('Up', 1305);
                    break;

                case 1411:
                    const gamenote9 = createNote('Down', 1411);
                    break;

                case 1532:
                    const gamenote10 = createNote('Down', 1532);
                    break;

                case 1637:
                    const gamenote11 = createNote('Up', 1637);
                    break;

                case 1746:
                    const gamenote12 = createNote('Left', 1746);
                    break;

                case 1857:
                    const gamenote13 = createNote('Right', 1857);
                    break;

                case 1958:
                    const gamenote14 = createNote('Left', 1958);
                    break;

                case 2065:
                    const gamenote15 = createNote('Right', 2065);
                    break;

                case 2168:
                    const gamenote16 = createNote('Up', 2168);
                    break;

                case 2264:
                    const gamenote17 = createNote('Left', 2264);
                    break;

                case 2364:
                    const gamenote18 = createNote('Down', 2364);
                    break;

                case 2458:
                    const gamenote19 = createNote('Up', 2458);
                    break;

                case 2565:
                    const gamenote20 = createNote('Right', 2565);
                    break;

                case 2651:
                    const gamenote21 = createNote('Left', 2651);
                    break;

                case 2749:
                    const gamenote22 = createNote('Right', 2749);
                    break;

                case 2838:
                    const gamenote23 = createNote('Up', 2838);
                    break;

                case 2925:
                    const gamenote24 = createNote('Up', 2925);
                    break;

                case 3013:
                    const gamenote25 = createNote('Down', 3013);
                    break;
                case 3102:
                    const gamenote26 = createNote('Right', 3102);
                    break;

                case 3188:
                    const gamenote27 = createNote('Right', 3188);
                    break;

                case 3358:
                    const gamenote28 = createNote('Up', 3358);
                    break;

                case 3442:
                    const gamenote29 = createNote('Up', 3442);
                    break;

                case 3526:
                    const gamenote30 = createNote('Right', 3526);
                    break;

                case 3607:
                    const gamenote31 = createNote('Left', 3607);
                    break;

                case 3692:
                    const gamenote32 = createNote('Up', 3692);
                    break;

                case 3768:
                    const gamenote33 = createNote('Left', 3768);
                    break;

                case 4007:
                    const gamenote34 = createNote('Up', 4007);
                    break;

                case 4083:
                    const gamenote35 = createNote('Down', 4083);
                    break;

                case 4200:
                    const gamenote36 = createNote('Right', 4200);
                    break;

                default:
                    break;
            }
        }

    }
}

function inGameAnim() {


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
            gameState = 'tutorial_1';
            break;

        case 'story':
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
    capture.position(0, 0); //move the capture to the top left
    capture.size(800, 600);
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

    console.log(frameRate());

}

// 마법봉 tracking 효과 그리기
function drawTrackingEffect() {
    if (isColorTrackOn === true) {
        var trackXavg = 0;
        var trackYavg = 0;
        if (trackingData) { //if there is tracking data to look at, then...
            for (var i = 0; i < trackingData.length; i++) { //loop through each of the detected colors
                // console.log( trackingData[i] );
                trackXavg += width - trackingData[i].x;
                trackYavg += trackingData[i].y;
                // trPosArr.push(createVector(width - trackingData[i].x, trackingData[i].y));
                // const eff = rect(width - trackingData[i].x, trackingData[i].y, trackingData[i].width, trackingData[i].height);
            }
            trackXavg = trackXavg / trackingData.length;
            trackYavg = trackYavg / trackingData.length;
            trPosArr.push(createVector(trackXavg, trackYavg));
        }
        if (trPosArr.length > 7) {
            trPosArr.shift();
        }

        beginShape();
        for (let i = 0; i < trPosArr.length; i++) {
            image(trac_eff, trPosArr[i].x, trPosArr[i].y);
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
        else if (dy <= -100) {
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
                tutorialPass = true;
                return "perfect";
            }
            else if (timeDiff < goodThreshold && this.direction == pstroke && !this.hit) {
                this.hit = true;
                console.log("good"); // DEBUG
                tutorialPass = true;
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

        noteTimer++;

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
            notesArr.splice(0, 1);
            if (indicator == 'perfect') {
                // show perfect effect

                noteTimer = 0;
            }
            else if (indicator == 'good') {
                // show good effect

                noteTimer = 0;
            }

        } else {
            this.indicatorSize -= 1;
            this.indicatorSize = constrain(this.indicatorSize, 0, maxIndicatorSize);
            if (gameState == 'tutorial_3' && this.ctiming + 90 <= tutorialTimer) {
                notesArr.splice(0, 1);
                // show miss effect

                noteTimer = 0;
            }
        }
    }
}

// 노트 찍기 함수
// createNote(방향, 시간);
// 시간 = musicTimer, 여기서 입력한 시간에 노트가 생성되고, 생성된 시점부터 60프레임 이후가 정확한 판정입니다.(따라서 60프레임 내에 여러 노트를 배치할 수 없음.) / (60 frame = 1초)
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
