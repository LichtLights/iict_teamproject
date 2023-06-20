var capture;
var trackingData;
var ctracker;

var gameState = 'title';

var selectedColor;
var isColorTrackOn = false;

var score = 0;
var scoreMax = 16000;
var healthWidth = 800;

var mainMusicStarted = false;
var introMusicStarted = false;
var endMusicStarted = false;

var battleBgChange = false;

var storyCutnum = 0;
var tutoCutnum = 0;
var endingCutnum = 0;

var tutorialTimer = 0;  // 튜토리얼용 타이머
var tutorialPass = false;
var tutorialAgain = false;

var musicTimer = 0;
var pStrokeTimer = 0;   // 플레이어 stroke 시간 정보 저장
var ingameTimer = 0;    // 게임 시작 후 타이머
var gameStarted = false;
var musicStarted = false;

var noteTimer = 0;      // 애니메이션 프레임 계산용 노트 타이머
var judgeEffTimer = 0;
var judgeVal = 'nothing';
var judgeDir = 'nothing';
var nextJudgeDir = 'nothing';

let trPosArr = [];

let notesArr = [];

const perfectThreshold = 5;
const goodThreshold = 15;
const missThreshold = 29;

function preload() {

    fontIngameL = loadFont('src/fonts/KOFIH DrLEEJW_TTF-L.ttf');
    fontIngameB = loadFont('src/fonts/KOFIH DrLEEJW_TTF-B.ttf');

    arrow_up = loadImage('src/Notes/arrow_up.png');
    arrow_down = loadImage('src/Notes/arrow_down.png');
    arrow_left = loadImage('src/Notes/arrow_left.png');
    arrow_right = loadImage('src/Notes/arrow_right.png');

    judge_perfect = loadImage('src/Effects/Judge/perfect.png');
    judge_good = loadImage('src/Effects/Judge/good.png');
    judge_miss = loadImage('src/Effects/Judge/miss.png');

    wand_red = loadImage('src/MagicWand/magicWand_R.png');
    wand_blue = loadImage('src/MagicWand/magicWand_B.png');
    wand_yellow = loadImage('src/MagicWand/magicWand_Y.png');
    wand_sel = loadImage('src/MagicWand/magicWand_Selected.png');

    trac_eff = loadImage('src/mousePointer.png');

    bg_main = loadImage('src/background/Main.png');
    bg_game = loadImage('src/background/battle.png');
    bg_game2 = loadImage('src/background/battle02.png');

    // cutscenes
    cut_tuto1 = loadImage('src/Cutscene/MoveGuide.png');
    cut_tuto2 = loadImage('src/Cutscene/MoveGuide02.png');
    cut_tuto3 = loadImage('src/Cutscene/PlayGuide.png');

    cut_intro01 = loadImage('src/Cutscene/intro01.png');
    cut_intro02 = loadImage('src/Cutscene/intro02.png');

    cut_clear = loadImage('src/Cutscene/clear_02.png')

    cut_ending01 = loadImage('src/Cutscene/Ending01.png');
    cut_ending02 = loadImage('src/Cutscene/Ending02.png');

    cut_retry = loadImage('src/Cutscene/retry.png');

    // buttons
    btn_nxt_normal = loadImage('src/Buttons/btn_nxt_normal.png');
    btn_nxt_pressed = loadImage('src/Buttons/btn_nxt_pressed.png');
    btn_skip = loadImage('src/Buttons/btn_skip.png');

    btn_retry = loadImage('src/Buttons/btn_retry.png');
    btn_retry_pressed = loadImage('src/Buttons/btn_retry_pressed.png');

    // bg musics
    game_music = loadSound('src/Sounds/InGameMusic.wav');
    main_music = loadSound('src/Sounds/mainMusic.wav');
    end_music = loadSound('src/Sounds/Ending.wav');
    intro_music = loadSound('src/Sounds/Opening.wav');

    // sfx
    sfx_stageClear = loadSound('src/Sounds/SE/StageClear.wav');
    sfx_KeySE1 = loadSound('src/Sounds/SE/KeySE1.mp3');
    sfx_KeySE2 = loadSound('src/Sounds/SE/KeySE2.mp3');
    sfx_KeySE3 = loadSound('src/Sounds/SE/KeySE3.mp3');

    // dog
    dog0_idle = loadImage('src/Dog/dog0_idle.png');
    dog0_ready = loadImage('src/Dog/dog0_ready.png');
    dog0_miss = loadImage('src/Dog/dog0_miss.png');

    dog1_up = loadImage('src/Dog/dog1_up.png');
    dog1_down = loadImage('src/Dog/dog1_down.png');
    dog1_left = loadImage('src/Dog/dog1_left.png');
    dog1_right = loadImage('src/Dog/dog1_right.png');

    // dragon
    dragon0_idle = loadImage('src/Dragon/dragon0_idle.png');
    dragon0_rdy_down = loadImage('src/Dragon/dragon0_rdy_down.png');
    dragon0_rdy_up_left = loadImage('src/Dragon/dragon0_rdy_up_left.png');

    dragon1_hit_down = loadImage('src/Dragon/dragon1_hit_down.png');
    dragon1_hit_right = loadImage('src/Dragon/dragon1_hit_right.png');
    dragon1_hit_up_left = loadImage('src/Dragon/dragon1_hit_up_left.png');

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

        case 'tutorial_2_1':
            tutorial_2_1();
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

        case 'gameEnding':
            gameEnding();
            break;

        case 'gameRetry':
            gameRetry();
            break;

        default:
            break;
    }

}

// 각 Phase 구현
function mainTitle() {

    if (gameState === 'title') {
        image(bg_main, 0, 0);
    }

    if (!mainMusicStarted) {
        main_music.loop();
        mainMusicStarted = true;
    }
}

function story() {

    if (gameState === 'story') {

        main_music.stop();
        if (!introMusicStarted) {
            intro_music.loop();
            introMusicStarted = true;
        }

        switch (storyCutnum) {

            case 0:
                cut_intro01.resize(800, 600);
                imageMode(CORNER);
                image(cut_intro01, 0, 0);

                image(btn_skip, 690, 0);

                const storyText1 = '강아지 토토는 오늘도 주인을 지키기 위해 마법의 나라로 모험을 떠납니다.';
                textAlign(CENTER, CENTER);

                textFont(fontIngameL);
                textSize(24);
                fill(0);
                text(storyText1, width / 2 + 2, 50 * (height / 60) + 2);

                textSize(24);
                fill(250, 239, 208);
                text(storyText1, width / 2, 50 * (height / 60));

                break;

            case 1:
                cut_intro02.resize(800, 600);
                imageMode(CORNER);
                image(cut_intro02, 0, 0);

                image(btn_skip, 690, 0);

                textAlign(CENTER, CENTER);
                textFont(fontIngameL);
                textSize(24);
                fill(0);
                const storyText2 = '주인의 잠을 깨우려는 무시무시한 드래곤과 조우하고,';
                const storyText3 = '토토는 맞서 싸울 준비를 합니다...!';
                text(storyText2, width / 2 + 2, 50 * (height / 60) + 2);
                text(storyText3, width / 2 + 2, 53 * (height / 60) + 2);

                textSize(24);
                fill(250, 239, 208);
                text(storyText2, width / 2, 50 * (height / 60));
                text(storyText3, width / 2, 53 * (height / 60));
                break;

            default:
                break;
        }
    }

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
        imageMode(CORNER);
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

        imageMode(CENTER);
        image(btn_nxt_normal, width / 2, 3 * height / 4);
        imageMode(CORNER);

        if (mouseX >= width / 2 - width / 4 / 2 && mouseX <= width / 2 + width / 4 / 2 && mouseY >= 3 * height / 4 - height / 6 && mouseY <= 3 * height / 4 + height / 6) {
            imageMode(CENTER);
            image(btn_nxt_pressed, width / 2, 3 * height / 4);
            imageMode(CORNER);
        }
    }
}

function tutorial_2_1() {
    if (gameState === 'tutorial_2_1') {

        switch (tutoCutnum) {

            case 0:
                cut_tuto1.resize(800, 600);
                imageMode(CORNER);
                image(cut_tuto1, 0, 0);
                break;

            case 1:
                cut_tuto2.resize(800, 600);
                imageMode(CORNER);
                image(cut_tuto2, 0, 0);
                break;

            case 2:
                cut_tuto3.resize(800, 600);
                imageMode(CORNER);
                image(cut_tuto3, 0, 0);
                break;

            default:
                break;
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

            case 60:
                const tutonote1 = createNote('Up', 60);
                break;

            case 120:
                const tutonote2 = createNote('Up', 120);
                break;

            case 180:
                const tutonote3 = createNote('Up', 180);
                break;

            default:
                break;
        }

        if (tutorialPass && tutorialTimer >= 230) {
            if (mainMusicStarted) {
                main_music.stop();
                mainMusicStarted = false;
            }
            tutorialTimer = 0;
            intro_music.stop();
            gameState = 'gameIngame';
        }
        else if (!tutorialPass && tutorialTimer >= 230) {
            tutorialTimer = 0;
            tutorialAgain = true;
        }

    }
}

function gameIngame() {
    if (gameState === 'gameIngame') {
        background(64, 48, 74);

        ingameTimer++;

        if (ingameTimer >= 30 && ingameTimer < 60) {
            const startInstructions0 = '5초 후 게임이 시작됩니다!';
            textAlign(CENTER, CENTER);
            textSize(28);
            fill(250, 239, 208);
            text(startInstructions0, width / 2, height / 2 - 50);
        }
        else if (ingameTimer >= 60 && ingameTimer < 90) {
            const startInstructions1 = '4초 후 게임이 시작됩니다!';
            textAlign(CENTER, CENTER);
            textSize(28);
            fill(250, 239, 208);
            text(startInstructions1, width / 2, height / 2 - 50);
        }
        else if (ingameTimer >= 90 && ingameTimer < 120) {
            const startInstructions2 = '3초 후 게임이 시작됩니다!';
            textAlign(CENTER, CENTER);
            textSize(28);
            fill(250, 239, 208);
            text(startInstructions2, width / 2, height / 2 - 50);
        }
        else if (ingameTimer >= 120 && ingameTimer < 150) {
            const startInstructions3 = '2초 후 게임이 시작됩니다!';
            textAlign(CENTER, CENTER);
            textSize(28);
            fill(250, 239, 208);
            text(startInstructions3, width / 2, height / 2 - 50);
        }
        else if (ingameTimer >= 150 && ingameTimer < 180) {
            const startInstructions4 = '1초 후 게임이 시작됩니다!';
            textAlign(CENTER, CENTER);
            textSize(28);
            fill(250, 239, 208);
            text(startInstructions4, width / 2, height / 2 - 50);
        }
        else if (ingameTimer >= 180 && !gameStarted) {
            gameStarted = true;
            musicStarted = true;
        }

        if (gameStarted) {

            if (musicStarted) {
                game_music.play();
                noteTimer = 0;
                musicStarted = false;
            }

            imageMode(CORNER);
            if (!battleBgChange) {
                bg_game.resize(800, 600);
                image(bg_game, 0, 0);
            }
            else {
                bg_game2.resize(800, 600);
                image(bg_game2, 0, 0);
            }

            musicTimer++;
            inGameAnim();

            if (keyIsPressed) {
                console.log(musicTimer);
            }

            const inGameScore = 'Score: ' + score;
            textAlign(CORNER);
            textSize(26);
            fill(250, 239, 208);
            text(inGameScore, 50, 50);
            textAlign(CENTER, CENTER);

            switch (musicTimer) {

                case 32:
                    const gamenote1 = createNote('Down', 32);
                    break;

                case 86:
                    const gamenote2 = createNote('Down', 86);
                    break;

                case 131:
                    const gamenote100 = createNote('Up', 131);
                    break;

                case 164:
                    const gamenote101 = createNote('Right', 164);
                    break;

                case 199:
                    const gamenote3 = createNote('Left', 199);
                    break;

                case 248:
                    const gamenote4 = createNote('Down', 248);
                    break;

                case 300:
                    const gamenote5 = createNote('Right', 300);
                    break;

                case 350:
                    const gamenote6 = createNote('Left', 350);
                    break;

                case 400:
                    const gamenote7 = createNote('Down', 400);
                    break;

                case 450:
                    const gamenote8 = createNote('Up', 450);
                    break;

                case 500:
                    const gamenote9 = createNote('Up', 500);
                    break;

                case 553:
                    const gamenote10 = createNote('Down', 553);
                    break;

                case 598:
                    const gamenote11 = createNote('Left', 598);
                    break;

                case 648:
                    const gamenote12 = createNote('Right', 648);
                    break;

                case 703:
                    const gamenote13 = createNote('Down', 703);
                    break;

                case 761:
                    const gamenote14 = createNote('Right', 761);
                    break;

                case 813:
                    const gamenote15 = createNote('Left', 813);
                    break;

                case 863:
                    const gamenote16 = createNote('Up', 863);
                    break;

                case 925:
                    const gamenote17 = createNote('Right', 925);
                    break;

                case 982:
                    const gamenote18 = createNote('Down', 982);
                    break;

                case 1034:
                    const gamenote19 = createNote('Left', 1034);
                    break;

                case 1089:
                    const gamenote20 = createNote('Down', 1089);
                    break;

                case 1149:
                    const gamenote21 = createNote('Up', 1149);
                    break;

                case 1207:
                    const gamenote22 = createNote('Right', 1207);
                    break;

                case 1264:
                    const gamenote23 = createNote('Left', 1264);
                    break;

                case 1323:
                    const gamenote24 = createNote('Down', 1323);
                    break;

                case 1379:
                    const gamenote25 = createNote('Up', 1379);
                    break;

                case 1435:
                    const gamenote26 = createNote('Left', 1435);
                    break;

                case 1490:
                    const gamenote27 = createNote('Down', 1490);
                    battleBgChange = true;
                    break;


                case 1547:
                    const gamenote28 = createNote('Right', 1547);
                    break;

                case 1607:
                    const gamenote29 = createNote('Right', 1607);
                    break;

                case 1660:
                    const gamenote30 = createNote('Up', 1660);
                    break;

                case 1725:
                    const gamenote33 = createNote('Left', 1725);
                    break;

                case 1778:
                    const gamenote34 = createNote('Down', 1778);
                    break;

                case 1833:
                    const gamenote35 = createNote('Right', 1833);
                    break;

                case 1888:
                    const gamenote36 = createNote('Right', 1888);
                    break;

                case 1913:
                    const gamenote37 = createNote('Down', 1913);
                    break;

                case 1945:
                    const gamenote38 = createNote('Up', 1945);
                    break;

                case 1998:
                    const gamenote39 = createNote('Right', 1998);
                    break;

                case 2056:
                    const gamenote40 = createNote('Down', 2056);
                    break;

                case 2109:
                    const gamenote042 = createNote('Left', 2109);
                    break;

                case 2169:
                    const gamenote040 = createNote('Up', 2169);
                    break;
    
                case 2220:
                    const gamenote41 = createNote('Down', 2220);
                    break;
    
                case 2275:
                    const gamenote42 = createNote('Left', 2275);
                    break;

                
                case 2331:
                    const gamenote43 = createNote('Down', 2331);
                    break;
        
                case 2387:
                    const gamenote44 = createNote('Right', 2387);
                    break;
        
                case 2444:
                    const gamenote45 = createNote('Up', 2444);
                    break;
        
                case 2504:
                    const gamenote46 = createNote('Up', 2504);
                    break;
                
                case 2650:
                    sfx_stageClear.play();
                    gameState = 'gameClear';
                    break;


                

                // case 2940:
                //     const gamenote47 = createNote('Down', 2940);
                //     break;

                // case 3000:
                //     const gamenote48 = createNote('Left', 3000);
                //     break;

                // case 3065:
                //     const gamenote49 = createNote('Up', 3065);
                //     break;

                // case 3140:
                //     const gamenote50 = createNote('Down', 3140);
                //     break;

                // case 3220:
                //     const gamenote51 = createNote('Right', 3220);
                //     break;

                // 3540 음악이 끝남
                // case 3570:
                //     sfx_stageClear.play();
                //     gameState = 'gameClear';
                //     break;

                default:
                    break;
            }
        }

    }
}

function inGameAnim() {

    if (gameStarted) {
        // idle
        if (noteTimer == 0 && judgeEffTimer == 0) {
            // dog
            dog0_idle.resize(800, 600);
            imageMode(CORNER);
            image(dog0_idle, 0, 0);

            // dragon
            dragon0_idle.resize(800, 600);
            imageMode(CORNER);
            image(dragon0_idle, 0, 0);
        }
        // rdy
        else if (noteTimer > 0 && judgeVal == 'nothing') {
            // dog
            dog0_ready.resize(800, 600);
            imageMode(CORNER);
            image(dog0_ready, 0, 0);

            if (nextJudgeDir == 'Up' || nextJudgeDir == 'Left') {
                // dragon
                dragon0_rdy_up_left.resize(800, 600);
                imageMode(CORNER);
                image(dragon0_rdy_up_left, 0, 0);
            }
            else if (nextJudgeDir == 'Down') {
                // dragon
                dragon0_rdy_down.resize(800, 600);
                imageMode(CORNER);
                image(dragon0_rdy_down, 0, 0);
            }
            else if (nextJudgeDir == 'Right') {
                // dragon
                dragon0_idle.resize(800, 600);
                imageMode(CORNER);
                image(dragon0_idle, 0, 0);
            }

        }
        // hit
        else if (judgeEffTimer > 0 && (judgeVal == 'perfect' || judgeVal == 'good')) {

            if (judgeDir == 'Up') {
                // dog
                dog1_up.resize(800, 600);
                imageMode(CORNER);
                image(dog1_up, 0, 0);

                // dragon
                dragon1_hit_up_left.resize(800, 600);
                imageMode(CORNER);
                image(dragon1_hit_up_left, 0, 0);
            }
            else if (judgeDir == 'Down') {
                // dog
                dog1_down.resize(800, 600);
                imageMode(CORNER);
                image(dog1_down, 0, 0);

                // dragon
                dragon1_hit_down.resize(800, 600);
                imageMode(CORNER);
                image(dragon1_hit_down, 0, 0);
            }
            else if (judgeDir == 'Left') {
                // dog
                dog1_left.resize(800, 600);
                imageMode(CORNER);
                image(dog1_left, 0, 0);

                // dragon
                dragon1_hit_up_left.resize(800, 600);
                imageMode(CORNER);
                image(dragon1_hit_up_left, 0, 0);
            }
            else if (judgeDir == 'Right') {
                // dog
                dog1_right.resize(800, 600);
                imageMode(CORNER);
                image(dog1_right, 0, 0);

                // dragon
                dragon1_hit_right.resize(800, 600);
                imageMode(CORNER);
                image(dragon1_hit_right, 0, 0);
            }

        }
        // miss
        else if (judgeEffTimer > 0 && judgeVal == 'miss') {
            // dog
            dog0_miss.resize(800, 600);
            imageMode(CORNER);
            image(dog0_miss, 0, 0);

            if (judgeDir == 'Up') {
                // dragon
                dragon1_hit_up_left.resize(800, 600);
                imageMode(CORNER);
                image(dragon1_hit_up_left, 0, 0);
            }
            else if (judgeDir == 'Down') {
                // dragon
                dragon1_hit_down.resize(800, 600);
                imageMode(CORNER);
                image(dragon1_hit_down, 0, 0);
            }
            else if (judgeDir == 'Left') {
                // dragon
                dragon1_hit_up_left.resize(800, 600);
                imageMode(CORNER);
                image(dragon1_hit_up_left, 0, 0);
            }
            else if (judgeDir == 'Right') {
                // dragon
                dragon1_hit_right.resize(800, 600);
                imageMode(CORNER);
                image(dragon1_hit_right, 0, 0);
            }
        }

    }


}

function gameClear() {
    if (gameState === 'gameClear') {
        background(64, 48, 74);

        imageMode(CORNER);
        cut_clear.resize(800, 600);
        image(cut_clear, 0, 0);

        imageMode(CENTER);
        image(btn_nxt_normal, width / 2, 3 * height / 4);
        imageMode(CORNER);

        if (mouseX >= width / 2 - width / 4 / 2 && mouseX <= width / 2 + width / 4 / 2 && mouseY >= 3 * height / 4 - height / 6 && mouseY <= 3 * height / 4 + height / 6) {
            imageMode(CENTER);
            image(btn_nxt_pressed, width / 2, 3 * height / 4);
            imageMode(CORNER);
        }

    }
}

function gameEnding() {
    if (gameState === 'gameEnding') {
        background(64, 48, 74);

        if (!endMusicStarted) {
            end_music.loop();
            endMusicStarted = true;
        }

        switch (endingCutnum) {

            case 0:
                cut_ending01.resize(800, 600);
                imageMode(CORNER);
                image(cut_ending01, 0, 0);

                image(btn_skip, 690, 0);

                textAlign(CENTER, CENTER);
                textFont(fontIngameL);
                textSize(24);
                fill(0);
                const endingText1 = '토토는 오늘도 무시무시한 드래곤을 물리치고 인간 세상을 지켜냈습니다.';
                const endingText2 = '동트는 하늘을 뒤로 하고 완전히 아침이 오기 전에 서둘러 집으로 돌아가야 해요.';
                text(endingText1, width / 2 + 2, 50 * (height / 60) + 2);
                text(endingText2, width / 2 + 2, 53 * (height / 60) + 2);

                textSize(24);
                fill(250, 239, 208);
                text(endingText1, width / 2, 50 * (height / 60));
                text(endingText2, width / 2, 53 * (height / 60));

                break;

            case 1:
                cut_ending02.resize(800, 600);
                imageMode(CORNER);
                image(cut_ending02, 0, 0);

                image(btn_skip, 690, 0);

                textAlign(CENTER, CENTER);
                textFont(fontIngameL);
                textSize(24);
                fill(0);
                const endingText3 = '사랑하는 주인이 반겨주는 집으로요!';
                text(endingText3, width / 2 + 2, 50 * (height / 60) + 2);

                textSize(24);
                fill(250, 239, 208);
                text(endingText3, width / 2, 50 * (height / 60));

                break;

            default:
                break;
        }
    }
}

function gameRetry() {
    if (gameState === 'gameRetry') {
        background(64, 48, 74);
        cut_retry.resize(800, 600);
        imageMode(CORNER);
        image(cut_retry, 0, 0);

        const endingInstructions = '플레이 해주셔서 감사합니다!';
        textAlign(CENTER, CENTER);
        textSize(28);
        fill(250, 239, 208);
        text(endingInstructions, width / 2, height / 2 - 50);

        imageMode(CENTER);
        image(btn_retry, width / 2, 3 * height / 4);
        imageMode(CORNER);

        if (mouseX >= width / 2 - width / 4 / 2 && mouseX <= width / 2 + width / 4 / 2 && mouseY >= 3 * height / 4 - height / 6 && mouseY <= 3 * height / 4 + height / 6) {
            imageMode(CENTER);
            image(btn_retry_pressed, width / 2, 3 * height / 4);
            imageMode(CORNER);
        }
    }
}

// 각 Phase interaction 구현
function mouseClicked() {

    switch (gameState) {

        case 'title':
            gameState = 'story';
            break;

        case 'story':
            if (mouseX >= 690 && mouseX <= 800 && mouseY >= 0 && mouseY <= 50) {
                gameState = 'tutorial_1';
            }
            else if (storyCutnum === 0) {
                storyCutnum = 1;
            }
            else if (storyCutnum === 1) {
                gameState = 'tutorial_1';

                storyCutnum = 0;
            }
            break;

        case 'tutorial_1':
            if (mouseX <= width / 3) {
                selectedColor = 'red';
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
                gameState = 'tutorial_2_1';
            }
            break;

        case 'tutorial_2_1':
            if (tutoCutnum === 0) {
                tutoCutnum = 1;
            }
            else if (tutoCutnum === 1) {
                tutoCutnum = 2;
            }
            else if (tutoCutnum === 2) {
                gameState = 'tutorial_3';
                tutoCutnum = 0;
            }
            break;

        case 'tutorial_3':
            break;

        case 'gameIngame':
            break;

        case 'gameClear':

            trackingStop();

            if (mouseX >= width / 2 - width / 4 / 2 && mouseX <= width / 2 + width / 4 / 2 && mouseY >= 3 * height / 4 - height / 6 && mouseY <= 3 * height / 4 + height / 6) {
                gameState = 'gameEnding';

                // 변수 초기화
                isColorTrackOn = false;

                score = 0;

                mainMusicStarted = false;
                introMusicStarted = false;
                endMusicStarted = false;

                battleBgChange = false;

                storyCutnum = 0;
                tutoCutnum = 0;
                endingCutnum = 0;

                tutorialTimer = 0;  // 튜토리얼용 타이머
                tutorialPass = false;
                tutorialAgain = false;

                musicTimer = 0;
                pStrokeTimer = 0;   // 플레이어 stroke 시간 정보 저장
                ingameTimer = 0;    // 게임 시작 후 타이머
                gameStarted = false;
                musicStarted = false;

                noteTimer = 0;      // 애니메이션 프레임 계산용 노트 타이머
                judgeEffTimer = 0;
                judgeVal = 'nothing';
                judgeDir = 'nothing';
                nextJudgeDir = 'nothing';

            }

            break;

        case 'gameEnding':
            if (mouseX >= 690 && mouseX <= 800 && mouseY >= 0 && mouseY <= 50) {
                gameState = 'gameRetry';
            }
            else if (endingCutnum === 0) {
                endingCutnum = 1;
            }
            else if (endingCutnum === 1) {
                gameState = 'gameRetry';

                endingCutnum = 0;
            }
            break;

        case 'gameRetry':
            if (mouseX >= width / 2 - width / 4 / 2 && mouseX <= width / 2 + width / 4 / 2 && mouseY >= 3 * height / 4 - height / 6 && mouseY <= 3 * height / 4 + height / 6) {
                end_music.stop();
                gameState = 'title';
            }
            break;

        default:
            break;
    }

}

/////////////////////////////////////////////////////////////////////////////////////////////////////

function setup() {
    let canvas = createCanvas(800, 600);
    frameRate(30);


    canvas.parent('canvas-container');

    // Center the canvas using CSS styles
    let container = select('#canvas-container');
    container.style('display', 'flex');
    container.style('justify-content', 'center');
    container.style('align-items', 'center');


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
    }

    ctracker = tracking.track('#myVideo', trackingColor); // start the tracking of the colors above on the camera in p5

    //start detecting the tracking
    trackingColor.on('track', function (event) { //this happens each time the tracking happens
        trackingData = event.data // break the trackingjs data into a global so we can access it with p5
    });
    isColorTrackOn = true;
}

function trackingStop() {
    ctracker.stop();
}

// 매 프레임 화면 다시 그리기
function draw() {

    stateSelector();
    drawTrackingEffect();
    noteUpdate();
    noteEffect();
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
            // trac_eff.resize(71 - i * 5, 82 - i * 5);
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
        this.timing = ctiming + 30;
        this.direction = direction;

        this.hit = false;
        this.indicatorSize = 200;

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

            if (timeDiff < perfectThreshold && this.direction == pstroke) {
                this.hit = true;
                sfx_KeySE3.play();
                console.log("perfect"); // DEBUG
                tutorialPass = true;
                return "perfect";
            }
            else if (timeDiff < goodThreshold && this.direction == pstroke) {
                this.hit = true;
                sfx_KeySE3.play();
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
                sfx_KeySE3.play();
                judgeDir = this.direction;
                score += 100;
                return "perfect";
            }
            else if (timeDiff < goodThreshold && this.direction == pstroke) {
                this.hit = true;
                sfx_KeySE3.play();
                judgeDir = this.direction;
                score += 50;
                return "good";
            }
        }
    }

    timingIndicatorDisplay() {
        const indicator = this.timingIndicator();
        const maxIndicatorSize = 200;
        const minIndicatorSize = 50;
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
                judgeVal = 'perfect';

                noteTimer = 0;
            }
            else if (indicator == 'good') {
                // show good effect
                judgeVal = 'good';

                noteTimer = 0;
            }

        } else {
            this.indicatorSize -= 1;
            this.indicatorSize = constrain(this.indicatorSize, 0, maxIndicatorSize);
            if (gameState == 'tutorial_3' && this.ctiming + 45 <= tutorialTimer) {
                notesArr.splice(0, 1);
                // show miss effect
                judgeVal = 'miss';

                noteTimer = 0;
            }
            else if (gameState == 'gameIngame' && this.ctiming + 45 <= musicTimer) {
                notesArr.splice(0, 1);
                // show miss effect
                judgeVal = 'miss';

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
            nextJudgeDir = 'Up';
            notesArr.push(noteUp);
            return (noteUp);

        case 'Down':
            const noteDown = new RhythmNote(time, 'Down');
            nextJudgeDir = 'Down';
            notesArr.push(noteDown);
            return (noteDown);

        case 'Left':
            const noteLeft = new RhythmNote(time, 'Left');
            nextJudgeDir = 'Left';
            notesArr.push(noteLeft);
            return (noteLeft);

        case 'Right':
            const noteRight = new RhythmNote(time, 'Right');
            nextJudgeDir = 'Right';
            notesArr.push(noteRight);
            return (noteRight);

        default:
            break;
    }

}

function noteEffect() {

    imageMode(CENTER);
    if (judgeVal === 'perfect' && judgeEffTimer <= 30) {
        image(judge_perfect, width / 2, height / 2);
        judgeEffTimer++;
    }
    else if (judgeVal === 'good' && judgeEffTimer <= 30) {
        image(judge_good, width / 2, height / 2);
        judgeEffTimer++;
    }
    else if (judgeVal === 'miss' && judgeEffTimer <= 30) {
        image(judge_miss, width / 2, height / 2);
        judgeEffTimer++;
    }
    else if (judgeEffTimer > 30) {
        judgeVal = 'nothing';
        judgeEffTimer = 0;
    }
    imageMode(CORNER);

}