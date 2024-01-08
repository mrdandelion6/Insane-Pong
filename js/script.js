document.addEventListener('DOMContentLoaded', function () {
    var MTPosition = { // MT: Mouse/Touch position. current pixel position of mouse/finger on view port
        x: null,
        y: null,
    }
    var vw;
    var openButton = document.getElementById('openbutton');
    var popMenu = document.getElementById('popmenu');
    var menuButtons = popMenu.querySelectorAll('a');
    var firstRun = true;
    var animations = [];
    var pongPreview = document.querySelector("#pongPreview");
    var pongPreviewButton = document.querySelector("#cupTitle");
    
    // pong tray buttons
    var settingsButton = document.querySelector("#pongSettingsIcon");
    var volumeButton = document.querySelector("#pongVolumeIcon");
    var volumeCross = document.querySelector("#pongVolumeCross");
    var backButton = document.querySelector("#pongBackIcon");
    var exitButton = document.querySelector("#pongExitIcon");
    var resumeButton = document.querySelector("#pongResumeIcon");
    var restartButton = document.querySelector("#pongRestartIcon");

    // pong slider buttons
    var musicAdjust = document.querySelector("#musicSlider")
    var musicKnob = document.querySelector("#musicKnob");
    var musicSlider = document.querySelector("#musicRange");
    var musicAdjustS = document.querySelector("#musicSliderS")
    var musicKnobS = document.querySelector("#musicKnobS");
    var musicSliderS = document.querySelector("#musicRangeS");
    var musicVol = 100;

    var soundAdjust = document.querySelector("#soundSlider")
    var soundKnob = document.querySelector("#soundKnob");
    var soundSlider = document.querySelector("#soundRange");
    var soundAdjustS = document.querySelector("#soundSliderS")
    var soundKnobS = document.querySelector("#soundKnobS");
    var soundSliderS = document.querySelector("#soundRangeS");
    var soundVol = 100;

    // pong music numbers
    var pongMusic = document.querySelector("#pongMusic");
    var pongSound = document.querySelector("#pongSound");
    var pongMusicS = document.querySelector("#pongMusicS");
    var pongSoundS = document.querySelector("#pongSoundS");

    // pong screens
    var pong = document.querySelector("#gameStuff");
    var mainMenu = document.querySelector("#pongMenu");
    var singlePlayerMenu = document.querySelector("#singleMenu");
    var multiplayerMenu = document.querySelector("#multiMenu");
    var settingsMenu = document.querySelector("#pongSettings");
    var pauseMenu = document.querySelector("#pausedScreen");
    var gameCanvas = document.querySelector("#pongGame");
    var ctx = gameCanvas.getContext("2d");
    var pongExitPopup = document.querySelector("#pongExitPrompt"); 
    var pongBackToSPPopup = document.querySelector("#pongSPPrompt"); 
    var pongBackToMPPopup = document.querySelector("#pongMPPrompt"); 
    var pongBackToMainMenuPopup = document.querySelector("#backToMenuPrompt");
    
    // managing screen
    let currentScreen;
    let lastScreen;
    let extraScreen;

    // pong text buttons
    var confirmExit = document.querySelector("#exitY"); // exit popup
    var rejectExit = document.querySelector("#exitN");
    var confirmBackSP = document.querySelector("#difficultyY");
    var rejectBackSP = document.querySelector("#difficultyN");
    var confirmBackMP = document.querySelector("#speedY");
    var rejectBackMP = document.querySelector("#speedN");

    var confirmBackMainMenu = document.querySelector("#mainMenuY");
    var rejectBackMainMenu = document.querySelector("#mainMenuN");

    var selectMP = document.querySelector("#chooseMP"); // main menu
    var selectSP = document.querySelector("#chooseSP");

    var easyModeSP = document.querySelector("#SPeasy"); // single player menu
    var mediumModeSP = document.querySelector("#SPmed");
    var hardModeSP = document.querySelector("#SPhard");
    var impossibleModeSP = document.querySelector("#SPimpossible");

    var slowModeMP = document.querySelector("#MPslow"); // multiplayer menu
    var mediumModeMP = document.querySelector("#MPmed");
    var fastModeMP = document.querySelector("#MPfast");
    var blitzModeMP = document.querySelector("#MPblitz");

    var bindings = document.querySelector("#bindings"); // settings menu
    var musicToggle = document.querySelector("#musicToggle");
    var soundToggle = document.querySelector("#soundToggle");

    var bindingsP = document.querySelector("#bindingsP"); // pause menu
    var musicToggleP = document.querySelector("#musicToggleP");
    var soundToggleP = document.querySelector("#soundToggleP");
    var exitButtonP = document.querySelector("#exitP");

    // pong items
    var pongIsOpen = false;
    var playingPong = 0; // 0 for not playing, 1 for SP, 2 for MP
    var pongIsPaused = false;
    var resumingID = null;
    var currentCD = null;
    var difficulty = null;
    var up1 = "ArrowUp";
    var down1 = "ArrowDown";
    var up2 = "w";
    var down2 = "s";
    var pressedKeys = {"1": false,
                       "2": false,
                       "3": false,
                       "4": false,
                       up1: false,
                       down1: false,
                       up2: false,
                       down2: false,
                       "Escape": false,
                       "m": false, 
                       "p": false,
                       "y": false,
                       "n": false}
    let slider1 = {
        width: 10,
        height: 100,
        y: gameCanvas.height / 2 - 50,
        x: 0, // calc x in drawSlider()
        speed: 6,
        velocityY: 0,
        dash: false,
        held: false
    }
    let slider2 = {
        width: 10,
        height: 100,
        y: gameCanvas.height / 2 - 50,
        x: 10,
        speed: 6,
        velocityY: 0,
        dash: false,
        held: false
    }
    let ball = {
        exists: false,
        serve: true,
        width: 10,
        height: 10,
        x: gameCanvas.width / 2 - 10,
        y: gameCanvas.height / 2 - 10,
        startSpeed: 4,
        regSpeed: 4, // increment this on selected mode!
        velocityY: 0,
        velocityX: 0,
        onFire: false,
        xRelative: 50 // percentage relative to canvas size. 50 is 50% across canvas so halfway. used to adjust the ball's position on resizing.
    }
    var upDashWindow1 = false; // tapping a key during dash window gives u boost
    var downDashWindow1 = false;
    var upDashWindow2 = false;
    var downDashWindow2 = false;
    var dashWindowID1 = null;
    var dashWindowID2 = null;
    var trailCD = false; // a cooldown for drawing trails
    var playerOneScore = 0;
    var playerTwoScore = 0;
    var gameID;

    function trackCursorOrTouchPosition(e) {
        let inputEvent = e.touches ? e.touches[0] : e; // take first touch if touch event, else take the mousemovement
        MTPosition.x = inputEvent.clientX;
        MTPosition.y = inputEvent.clientY;
    }

    document.addEventListener('mousemove', trackCursorOrTouchPosition); // constantly track mouse position
    document.addEventListener('touchmove', trackCursorOrTouchPosition); // constantly track touch position (both mouse and touch position are tracked in same value)

    openButton.addEventListener('click', function () {
        popMenu.classList.toggle('hidden');
    });

    menuButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            popMenu.classList.add('hidden');
        });
    });

    loopAnimation();
    flashingText();
    let iconLoop = setInterval(loopAnimation, 4800);

    function updateVolumeTextValues() {
        pongMusic.innerHTML = Math.round(musicVol);
        pongMusicS.innerHTML = Math.round(musicVol);
        pongSound.innerHTML = Math.round(soundVol);
        pongSoundS.innerHTML = Math.round(soundVol);
    }

    function adjustSlidersSmallWidth() {
        musicAdjust.style.left = "calc(12vw + 190px)";
        musicSlider.style.width = "calc(55px + 3vw)";
        soundAdjust.style.left = "calc(12vw + 190px)";
        soundSlider.style.width = "calc(55px + 3vw)";
        musicAdjustS.style.left = "calc(12vw + 190px)";
        musicSliderS.style.width = "calc(55px + 3vw)";
        soundAdjustS.style.left = "calc(12vw + 190px)";
        soundSliderS.style.width = "calc(55px + 3vw)";
    }

    function adjustVolumeMusicSliderPositions() {
        updateVolumeTextValues();
        soundSlider.style.width = "calc(25px + 8vw)";
        musicSlider.style.width = "calc(25px + 8vw)";
        soundSliderS.style.width = "calc(25px + 8vw)";
        musicSliderS.style.width = "calc(25px + 8vw)";

        if (playingPong) {
            if (gameCanvas.width <= 450) {
                adjustSlidersSmallWidth();
            }
        }
   
        else if (currentScreen == settingsMenu) {
            let tempRect = settingsMenu.getBoundingClientRect();
            if (tempRect.width <= 450) {
                adjustSlidersSmallWidth();
            }
        }


        let sliderReference = musicSlider.getBoundingClientRect();
        let sliderReference2 = musicSliderS.getBoundingClientRect();
        let hPos1 = musicVol / 100 * sliderReference.width - 4;
        let hPos2 = soundVol / 100 * sliderReference.width - 4;
        let h2Pos1 = musicVol / 100 * sliderReference2.width - 4;
        let h2Pos2 = soundVol / 100 * sliderReference2.width - 4;
        musicKnob.style.left = hPos1 + "px";
        soundKnob.style.left = hPos2 + "px";
        musicKnobS.style.left = h2Pos1 + "px";
        soundKnobS.style.left = h2Pos2 + "px";
        console.log(`sound volume is ${soundVol}`);
        console.log(`sliderReferenceWidth is ${sliderReference.width}`);
    }

    // RESIZING EVENT
    window.addEventListener("resize", () => {
        // pong preview
        clearInterval(iconLoop);
        loopAnimation(); // call again immediately to avoid delay
        iconLoop = setInterval(loopAnimation, 4800);

        if (playingPong) {
            adjustVolumeMusicSliderPositions();
            adjustBallPosition();
            drawBoard();
            redrawSliders();
            redrawBall();
            drawCurrentCD();
        }

        else if (currentScreen == settingsMenu) {
            adjustVolumeMusicSliderPositions();
        }

        function adjustBallPosition() {
            if (ball.exists) {
                ball.x = ball.xRelative * gameCanvas.width;
            }
        }
    });

    // preview button
    pongPreviewButton.addEventListener("click", () => {
        pongIsOpen = true;
        pongPreview.classList.toggle("hidden"); // we can still toggle class for this because we used !important in .hidden in style.css
        pong.classList.toggle("hidden");
        mainMenu.classList.toggle("hidden");
        currentScreen = mainMenu;
        lastScreen = null;
    });


    // ============ PONG BUTTONS ============

    // exit button
    exitButton.addEventListener("click", () => {
        pongExitPopup.classList.toggle("hidden");
        extraScreen = currentScreen;
        currentScreen = pongExitPopup; // dont set last screen
    });

    confirmExit.addEventListener("click", exitPong);
    rejectExit.addEventListener("click", cancelExit);

    function cancelExit() {
        pongExitPopup.classList.toggle("hidden")
        currentScreen = extraScreen;
    }

    // sp popups
    confirmBackSP.addEventListener("click", confirmSPexit);
    function confirmSPexit() {
        endGame();
        hideVolumeBars();
        if (lastScreen == pauseMenu) {
            pauseMenu.classList.toggle("hidden");
        }
        gameCanvas.classList.toggle("hidden");
        currentScreen.classList.toggle("hidden");  // popup is curr screen
        singlePlayerMenu.classList.toggle("hidden");
        lastScreen = currentScreen;
        currentScreen = singlePlayerMenu;
    }

    rejectBackSP.addEventListener("click", rejectSPexit);
    function rejectSPexit() {
        pongBackToSPPopup.classList.toggle("hidden");
        if (lastScreen == gameCanvas) {
            resumeGame();
        }
        currentScreen = lastScreen;
    }

    // mp popups
    confirmBackMP.addEventListener("click", confirmMPexit);
    function confirmMPexit() {
        endGame();
        hideVolumeBars();
        if (lastScreen == pauseMenu) {
            pauseMenu.classList.toggle("hidden");
        }
        gameCanvas.classList.toggle("hidden");
        currentScreen.classList.toggle("hidden");  // popup is curr screen
        multiplayerMenu.classList.toggle("hidden");
        lastScreen = currentScreen;
        currentScreen = multiplayerMenu;
    }

    rejectBackMP.addEventListener("click", rejectMPexit);
    function rejectMPexit() {
        pongBackToMPPopup.classList.toggle("hidden");
        if (lastScreen == gameCanvas) {
            resumeGame();
        }
        currentScreen = lastScreen;
    }

    // main menu popups
    exitButtonP.addEventListener("click", popupExitPaused);
    function popupExitPaused() {
        if (pongBackToMainMenuPopup.classList.contains("hidden")) {
            pongBackToMainMenuPopup.classList.toggle("hidden");
            lastScreen = currentScreen;
            currentScreen = pongBackToMainMenuPopup;
        }
    }

    confirmBackMainMenu.addEventListener("click", confirmMMexit);
    function confirmMMexit() {
        hideVolumeBars();
        currentScreen.classList.toggle("hidden");
        pauseMenu.classList.toggle("hidden");
        gameCanvas.classList.toggle("hidden");
        endGame();
        mainMenu.classList.toggle("hidden");
        lastScreen = currentScreen;
        currentScreen = mainMenu;
        backButton.classList.toggle("hidden");
    }

    rejectBackMainMenu.addEventListener("click", rejectMMexit);
    function rejectMMexit() {
        pongBackToMainMenuPopup.classList.toggle("hidden");
        lastScreen = currentScreen
        currentScreen = pauseMenu;
    }

    // volume button
    function toggleVolume() {
        volumeCross.classList.toggle("hidden");
        // TODO: implement volume muting and unmuting
    }
    volumeButton.addEventListener("click", toggleVolume);
    volumeCross.addEventListener("click", toggleVolume);

    // settings button
    settingsButton.addEventListener("click", openSettings);
    function openSettings() {
        if (currentScreen != settingsMenu) {
            if (currentScreen == gameCanvas) { // esc during game
                pauseGame();
                showVolumeBars();
            }

            else if (currentScreen == pauseMenu) { // esc during pause
                resumeGame();
                currentScreen.classList.toggle("hidden");
                lastScreen = currentScreen;
                currentScreen = gameCanvas;
                hideVolumeBars();
            }

            else {
                if (currentScreen == mainMenu) { // esc any other time (except on settings menu ofc)
                    backButton.classList.toggle("hidden");
                }
                currentScreen.classList.toggle("hidden");
                settingsMenu.classList.toggle("hidden");
                lastScreen = currentScreen;
                currentScreen = settingsMenu;
                setTimeout(adjustVolumeMusicSliderPositions, 1);
                showVolumeBars2();
            }
        }
    }

    // back button 
    backButton.addEventListener("click", goBack);
    function goBack() {
        switch(true) {
            case currentScreen == settingsMenu:
                currentScreen.classList.toggle("hidden");
                lastScreen.classList.toggle("hidden");
                currentScreen = lastScreen;
                lastScreen = settingsMenu;
                hideVolumeBars2();
                break;

            case currentScreen == singlePlayerMenu || currentScreen == multiplayerMenu:
                currentScreen.classList.toggle("hidden");
                mainMenu.classList.toggle("hidden");
                lastScreen = currentScreen;
                currentScreen = mainMenu;
                break;
            case currentScreen == gameCanvas || currentScreen == pauseMenu:
                if (playingPong === 1) {
                    lastScreen = currentScreen;
                    currentScreen = pongBackToSPPopup;
                    backToSPMenu();
                }
                else if (playingPong === 2) {
                    lastScreen = currentScreen;
                    currentScreen = pongBackToMPPopup;
                    backToMPMenu();
                }
                else {
                    console.log(`ERROR, NOT PLAYING PONG?`);
                }
        }

        if (currentScreen == mainMenu) {
            backButton.classList.toggle("hidden");
        }
    }

    // music and sound buttons
    musicToggle.addEventListener("click", quickToggleMusic);
    musicToggleP.addEventListener("click", quickToggleMusic);
    function quickToggleMusic() {
        if (musicVol != 0) {
            musicVol = 0;
        }

        else {
            musicVol = 100;
        }

        adjustVolumeMusicSliderPositions();
    }
    
    soundToggle.addEventListener("click", quickToggleSound);
    soundToggleP.addEventListener("click", quickToggleSound);
    function quickToggleSound() {
        if (soundVol != 0) {
            soundVol = 0;
        }

        else {
            soundVol = 100;
        }

        adjustVolumeMusicSliderPositions();
    }

    // select one player
    selectSP.addEventListener("click", selectSinglePlayer);
    function selectSinglePlayer() {
        currentScreen.classList.toggle("hidden");
        singlePlayerMenu.classList.toggle("hidden");
        lastScreen = currentScreen;
        currentScreen = singlePlayerMenu;
        backButton.classList.toggle("hidden");
    }

    // select two player    
    selectMP.addEventListener("click", selectMultiplayer);
    function selectMultiplayer() {
        currentScreen.classList.toggle("hidden");
        multiplayerMenu.classList.toggle("hidden");
        lastScreen = currentScreen;
        currentScreen = multiplayerMenu;
        backButton.classList.toggle("hidden");
    }

    // single player menu buttons
    easyModeSP.addEventListener("click", () => {
        difficulty = 1;
        startSinglePlayer();
    });
    mediumModeSP.addEventListener("click", () => {
        difficulty = 2;
        startSinglePlayer();
    });
    hardModeSP.addEventListener("click", () => {
        difficulty = 3;
        startSinglePlayer();
    });
    impossibleModeSP.addEventListener("click", () => {
        difficulty = 4;
        startSinglePlayer();
    });
    // multiplayer menu buttons
    slowModeMP.addEventListener("click", () => {
        difficulty = 1;
        startMultiplayer();
    });
    mediumModeMP.addEventListener("click", () => {
        difficulty = 2;
        startMultiplayer();
    });
    fastModeMP.addEventListener("click", () => {
        difficulty = 3;
        startMultiplayer();
    });
    blitzModeMP.addEventListener("click", () => {
        difficulty = 4;
        startMultiplayer();
    });

    // ============ PONG BUTTONS ============

    // ============ KEY PRESS HANDLING ============

    // check if key is being held, only want one trigger
    document.addEventListener("keydown", (event) => {
        let key = event.key;
        if (["1", "2", "3", "4", "Escape", "m", "p", "y", "n"].includes(key)) {
            if (!pressedKeys[key]) {
                pressedKeys[key] = true;
                handleKeyPress(event);
            } 
        } 

        else { // don't need to check if it's being held as these are for sliders (holding is normal)
            switch(key) { // we have a switch for this because we still want to set up1, up2, down1, down2 to true 
                case up1:
                    pressedKeys.up1 = true;
                    handleKeyPress(event);
                    break;
                case down1:
                    pressedKeys.down1 = true;
                    handleKeyPress(event);
                    break;
                case up2:
                    pressedKeys.up2 = true;
                    handleKeyPress(event);
                    break;
                case down2:
                    pressedKeys.down2 = true;
                    handleKeyPress(event);
                    break;
                default:
                    break;
            }
        }
    });

    // update key pressed status when key is released, also manage dash window
    document.addEventListener("keyup", (event) => {
        let key = event.key;
        if (["1", "2", "3", "4", "Escape", "m", "p", "y", "n"].includes(key)) {
            pressedKeys[key] = false;
        } 

        else { 
            switch(key) { 
                case up1:
                    pressedKeys.up1 = false;
                    if (slider1.dash) {
                        slider1.dash = false; // if we were just in a dash, then a keyup shouldnt create another window!
                    }
                    else {
                        upDashWindow1 = true;
                        dashWindowID = setTimeout(() => upDashWindow1 = false, 100);
                    }
                    break;
                case down1:
                    pressedKeys.down1 = false;
                    if (slider1.dash) {
                        slider1.dash = false;
                    }
                    else {
                        downDashWindow1 = true;
                        dashWindowID = setTimeout(() => downDashWindow1 = false, 100);
                    }
                    break;
                case up2:
                    pressedKeys.up2 = false;
                    if (slider2.dash) {
                        slider2.dash = false;
                    }
                    else {
                        upDashWindow2 = true;
                        dashWindowID = setTimeout(() => upDashWindow2 = false, 100);
                    }
                    break;
                case down2:
                    pressedKeys.down2 = false;
                    if (slider2.dash) {
                        slider2.dash = false;
                    }
                    else {
                        downDashWindow2 = true;
                        dashWindowID = setTimeout(() => downDashWindow2 = false, 100);
                    }
                    break;
                default:
                    break;
            }
        }
    });

    // handle the key taps
    function handleKeyPress(event) {
        key = event.key
        switch(key) {
            case "1":
                switch(currentScreen) {
                    case mainMenu:
                        selectSinglePlayer();
                        backButton.classList.toggle("hidden");
                        break;
                    case singlePlayerMenu:
                        difficulty = 1;
                        startSinglePlayer();
                        break;
                    case multiplayerMenu:
                        difficulty = 1;
                        startMultiplayer();
                        break;
                    case pauseMenu: // BINDINGS TODO
                        break;
                    default:
                        break;
                }
                break;
            case "2":
                switch(currentScreen) {
                    case mainMenu:
                        selectMultiplayer();
                        backButton.classList.toggle("hidden");
                        break;
                    case singlePlayerMenu:
                        difficulty = 2;
                        startSinglePlayer();
                        break;
                    case multiplayerMenu:
                        difficulty = 2;
                        startMultiplayer();
                        break;
                    case pauseMenu:
                        popupExitPaused();
                        break;
                    default:
                        break;
                }
                break;
            case "3":
                switch(currentScreen) {
                    case singlePlayerMenu:
                        difficulty = 3;
                        startSinglePlayer();
                        break;
                    case multiplayerMenu:
                        difficulty = 3;
                        startMultiplayer();
                        break;
                    default:
                        break;
                }
                break;
            case "4":
                switch(currentScreen) {
                    case singlePlayerMenu:
                        difficulty = 4;
                        startSinglePlayer(); // impossible mode
                        break;
                    case multiplayerMenu:
                        difficulty = 4;
                        startMultiplayer(); // blitz mode
                        break;
                    default:
                        break;
                }
                break;

            case "Escape":
                if (pongIsOpen) {
                    openSettings();
                }
                break;
            case "m":
                if (pongIsOpen) {
                    toggleVolume();
                }
                break;
            case "y":
                switch(currentScreen) {
                    case pongBackToSPPopup:
                        confirmSPexit();
                        break;
                    case pongBackToMPPopup:
                        confirmMPexit();
                        break;
                    case pongBackToMainMenuPopup:
                        confirmMMexit();
                        break;
                    default:
                        break;
                }
                break;
            case "n":
                switch(currentScreen) {
                    case pongBackToSPPopup:
                        rejectSPexit();
                        break;
                    case pongBackToMPPopup:
                        rejectMPexit();
                        break;
                    case pongBackToMainMenuPopup:
                        rejectMMexit();
                        break;
                    default:
                        break;
                }
                break;
            

            // for the movement keys, handleKeyPress() disables the default behaviour of those keys, in case they keys include up arrow and down arrow.
            // the actual slider movement happens in drawSliders()
            // handleKeyPress() also manages dashing windows

            case up1:
                if (playingPong) {
                    event.preventDefault();
                    if (upDashWindow1) { // handle dash
                        slider1.dash = true;
                    }
                    else {
                        clearTimeout(dashWindowID1); // clear timer as we are closing window now anyways (this step isnt necessary, just to prevent clog)
                        downDashWindow1 = false; // kill the down dash window
                        slider1.dash = false; // kill a current dash
                    }
                }
                break;
            case down1:
                if (playingPong) {
                    event.preventDefault();
                    if (downDashWindow1) { 
                        slider1.dash = true;
                    }
                    else {
                        clearTimeout(dashWindowID1);
                        upDashWindow1 = false;
                        slider1.dash = false;
                    }
                }
                break;

            case up2:
                if (playingPong == 2) {
                    event.preventDefault();
                    if (upDashWindow2) {
                        slider2.dash = true;
                    }
                    else {
                        clearTimeout(dashWindowID2);
                        downDashWindow2 = false;
                        slider2.dash = false;
                    }
                }
                break;
            case down2:
                if (playingPong == 2) {
                    event.preventDefault();
                    if (downDashWindow2) { 
                        slider2.dash = true;
                    }
                    else {
                        clearTimeout(dashWindowID2);
                        upDashWindow2 = false;
                        slider2.dash = false;
                    }
                }
                break;

            default:
                break;
        }
    }
    // ============ KEY PRESS HANDLING ============


    // ============ VOLUME SLIDERS ============
    let draggingID = null;

    musicKnob.addEventListener("mousedown", () => startDragging("music"));
    soundKnob.addEventListener("mousedown", () => startDragging("sound"));
    musicKnobS.addEventListener("mousedown", () => startDragging("music2"));
    soundKnobS.addEventListener("mousedown", () => startDragging("sound2"));

    musicKnob.addEventListener("touchstart", () => startDragging("music"));
    soundKnob.addEventListener("touchstart", () => startDragging("sound"));
    musicKnobS.addEventListener("touchstart", () => startDragging("music2"));
    soundKnobS.addEventListener("touchstart", () => startDragging("sound2"));
    window.addEventListener("mouseup", stopDragging);

    function hideVolumeBars() {
        if (!musicAdjust.classList.contains("hidden")) {
            musicAdjust.classList.toggle("hidden");
        }
        if (!soundAdjust.classList.contains("hidden")) {
            soundAdjust.classList.toggle("hidden");
        }
    }
    function showVolumeBars() {
        if (musicAdjust.classList.contains("hidden")) {
            musicAdjust.classList.toggle("hidden");
        }
        if (soundAdjust.classList.contains("hidden")) {
            soundAdjust.classList.toggle("hidden");
        }
    }
    function hideVolumeBars2() {
        if (!musicAdjustS.classList.contains("hidden")) {
            musicAdjustS.classList.toggle("hidden");
        }
        if (!soundAdjustS.classList.contains("hidden")) {
            soundAdjustS.classList.toggle("hidden");
        }
    }
    function showVolumeBars2() {
        if (musicAdjustS.classList.contains("hidden")) {
            musicAdjustS.classList.toggle("hidden");
        }
        if (soundAdjustS.classList.contains("hidden")) {
            soundAdjustS.classList.toggle("hidden");
        }
    }

    function startDragging(type) {
        if (!(type == "sound" || type !=="music" || type !=="sound2" || type !=="music2")) {
            console.log("ERROR, WRONG TYPE TO DRAG!!");
            return;
        }

        draggingID = setInterval(() => {
            let sliderReference = musicSlider.getBoundingClientRect(); // both sliders will have same x and width, doesnt matter which we take
            let sliderReference2 = musicSliderS.getBoundingClientRect(); // both sliders will have same x and width, doesnt matter which we take
            let horizontalPos = (MTPosition.x - sliderReference.left - 4);
            let horizontalPos2 = (MTPosition.x - sliderReference2.left - 4);
            if (horizontalPos < -4) {
                horizontalPos = -4;
            }
            else if (horizontalPos > sliderReference.width - 4) {
                horizontalPos = sliderReference.width - 4;
            }
            if (horizontalPos2 < -4) {
                horizontalPos2 = -4;
            }
            else if (horizontalPos2 > sliderReference2.width - 4) {
                horizontalPos2 = sliderReference2.width - 4;
            }

            if (type === "music") {
                musicKnob.style.left = horizontalPos + "px";
                musicVol = 100 * (horizontalPos + 4) / sliderReference.width;
            }
            else if (type === "music2") {
                musicKnobS.style.left = horizontalPos2 + "px";
                musicVol = 100 * (horizontalPos2 + 4) / sliderReference2.width;
            }
            else if (type == "sound") {
                soundKnob.style.left = horizontalPos + "px";
                soundKnobS.style.left = (horizontalPos2 + 4) + "px";
                soundVol = 100 * horizontalPos / sliderReference.width;
            }
            else if (type == "sound2") {
                soundKnobS.style.left = horizontalPos2 + "px";
                soundVol = 100 * (horizontalPos2 + 4) / sliderReference2.width;
            }
    
            updateVolumeTextValues();
        }, 10);
    }

    function stopDragging() {
        if (draggingID != null) {
            clearInterval(draggingID);
        }
        draggingID = null;
        slider1.held = false;
        slider2.held = false;
    }
    // ============ VOLUME SLIDERS ============

    // ============ PONG SLIDERS ============
    gameCanvas.addEventListener("mousedown", dragSlider);
    gameCanvas.addEventListener("touchstart", dragSlider);

    function dragSlider() {
        let rectCanvas = gameCanvas.getBoundingClientRect();
        let x = MTPosition.x - rectCanvas.left; // x, y position in canvas
        let y = MTPosition.y - rectCanvas.top;

        if (insideSlider1(x, y)) {
            console.log("you clicked slider 1");
            slider1.held = true;
            startDraggingPong("slider1");
        }

        else if (insideSlider2(x, y)) {
            console.log("you clicked slider 2");
            slider2.held = true;
            startDraggingPong("slider2");
        }

        function startDraggingPong(type) {
            let velID = null;
            draggingID = setInterval(() => {
                let currY = MTPosition.y - rectCanvas.top;
                let bddY = Math.min(Math.max(slider1.height / 2, currY), 600 - slider1.height / 2); // using slider1's height but we expect both sliders to have same height
                if (type == "slider1") {    
                    if (slider1.y < bddY - slider1.height / 2) { // going down
                        slider1.velocityY = slider1.speed;
                        if (velID != null) {
                            clearTimeout(velID);
                            velID = null;
                        }
                        velID = setTimeout(() => slider1.velocityY = 0, 50);
                    }
                    else if (slider1.y > bddY - slider1.height / 2) { // going up
                        slider1.velocityY = -slider1.speed;
                        if (velID != null) {
                            clearTimeout(velID);
                            velID = null;
                        }
                        veclID = setTimeout(() => slider1.velocityY = 0, 50);
                    }
                                                                    // if we expect sliders to have distinct heights, expand this calculation into the if statements
                    slider1.y = bddY - slider1.height / 2; // set the center to the cursor
                }
                else if (type == "slider2") {
                    if (slider2.y < bddY - slider2.height / 2) { // going down
                        slider2.velocityY = slider2.speed;
                        if (velID != null) {
                            clearTimeout(velID);
                            velID = null;
                        }
                        velID = setTimeout(() => slider2.velocityY = 0, 50);
                    }
                    else if (slider2.y > bddY - slider2.height / 2) { // going up
                        slider2.velocityY = -slider2.speed;
                        if (velID != null) {
                            clearTimeout(velID);
                            velID = null;
                        }
                        veclID = setTimeout(() => slider2.velocityY = 0, 50);
                    }
                    slider2.y = bddY - slider2.height / 2;
                }
                else {
                    console.log("ERROR, WRONG TYPE TO DRAG");
                }

            }, 10);
        }

        function insideSlider1(x, y) {
            return (slider1.x < x && x < slider1.x + slider1.width) && (slider1.y < y && y < slider1.y + slider1.height);
        } 
        function insideSlider2(x, y) {
            return (slider2.x < x && x < slider2.x + slider2.width) && (slider2.y < y && y < slider2.y + slider2.height);
        } 
        
    }
    // ============ PONG SLIDERS ============

    // ============================== MORE FUNCTIONS ==============================
    
    // ============= PONG GAME =============
    function startSinglePlayer() {
        // console.log(`starting single player ${difficulty}`);
        currentScreen.classList.toggle("hidden");
        gameCanvas.classList.toggle("hidden");
        lastScreen = currentScreen;
        currentScreen = gameCanvas;
        
        ball.regSpeed += (1/2)*difficulty*difficulty + (3/2)*difficulty;
        slider2.speed = assignCpu();
        playingPong = 1;
        gameID = setInterval(nextTick, 10);

        function assignCpu() {
            if (difficulty == 1) {
                return 2;
            }
            else if (difficulty == 2) {
                return 3;
            }
            else if (difficulty == 3) {
                return 5;
            }
            else if (difficulty == 4) {
                return 9.5;
            }
        }
    }

    function startMultiplayer() {
        // console.log(`starting multi player ${difficulty}`);
        currentScreen.classList.toggle("hidden");
        gameCanvas.classList.toggle("hidden");
        lastScreen = currentScreen;
        currentScreen = gameCanvas;

        ball.regSpeed += (1/2)*difficulty*difficulty + (3/2)*difficulty;
        playingPong = 2;
        gameID = setInterval(nextTick, 10);
    }

    function resumeGame() {
        pongIsPaused = false;

        countDown(3);

        function countDown(num) {
            if (!pongIsPaused) {
                if (num != 0) {
                    let cx = gameCanvas.width / 2;
                    let cy = gameCanvas.height / 2

                    currentCD = num.toString();
                    drawCurrentCD();

                    resumingID = setTimeout(() => {
                        ctx.fillStyle = "black";
                        let tw = 50;
                        let th = 40;
                        ctx.fillRect(cx - tw/2, cy - th/2, tw, th);
                        currentCD = null;
                        resumingID = setTimeout(() => countDown(num - 1), 500);
                    }, 1000);
                }
                else {
                    gameID = setInterval(nextTick, 10);
                    pongIsPaused = false;
                }
            }
        }

    }

    function drawCurrentCD() {
        if (currentCD != null) {
            let cx = gameCanvas.width / 2;
            let cy = gameCanvas.height / 2
            ctx.font = "40px 'Press Start 2P'"; 
            ctx.textAlign = "center"; 
            ctx.textBaseline = "middle"; 
            ctx.fillStyle = "whitesmoke"; 
            ctx.fillText(currentCD, cx, cy);
        }
    }

    function pauseGame() {
        setTimeout(adjustVolumeMusicSliderPositions, 1);
        pongIsPaused = true;

        if (resumingID != null) {
            clearTimeout(resumingID);
        }
        freezeGame();
        pauseMenu.classList.toggle("hidden");
        lastScreen = currentScreen;
        currentScreen = pauseMenu;
    }

    function freezeGame() {
        clearInterval(gameID);
        drawBoard();
        redrawBall();
        redrawSliders();
    }

    function backToSPMenu() {
        if (pongBackToSPPopup.classList.contains("hidden")) {
            pongIsPaused = true;
            if (resumingID != null) {
                clearTimeout(resumingID);
            }
            freezeGame();
            pongBackToSPPopup.classList.toggle("hidden");
            console.log("game is frozen..");
        }
    }

    function backToMPMenu() {
        if (pongBackToMPPopup.classList.contains("hidden")) {
            pongIsPaused = true;
            if (resumingID != null) {
                clearTimeout(resumingID);
            }
            freezeGame();
            pongBackToMPPopup.classList.toggle("hidden");
        }
    }

    function endGame() {
        clearInterval(gameID);

        // reset slider1 state
        slider1.y = gameCanvas.height / 2 - 50;
        slider1.velocityY = 0;
        slider1.dash = false;
        // reset slider2 state
        slider2.y = gameCanvas.height / 2 - 50;
        slider2.velocityY = 0;
        slider2.dash = false;
        // reset ball state
        ball.exists = false;
        ball.serve = true;
        ball.onFire = false;
        ball.x = gameCanvas.width / 2 - 10;
        ball.y = gameCanvas.height / 2 - 10;
        ball.regSpeed = ball.startSpeed;
        ball.velocityX = 0;
        ball.velocityY = 0;
        ball.xRelative = 50;
        // reset scores
        playerOneScore = 0;
        playerTwoScore = 0;
        // reset dash states
        upDashWindow1 = false; 
        downDashWindow1 = false;
        upDashWindow2 = false;
        downDashWindow2 = false;
        dashWindowID1 = null;
        dashWindowID2 = null;
        trailCD = false;

        difficulty = null;
        playingPong = 0;
    }

    function exitPong() {
        if (playingPong) {
            endGame();
        }
        pongPreview.classList.toggle("hidden");
        pong.classList.toggle("hidden");
        currentScreen.classList.toggle("hidden");
        pongExitPopup.classList.toggle("hidden");
        lastScreen = null;
        currentScreen = null;
        pongIsOpen = false;
        hideVolumeBars();
    }


    function drawBoard() {
        vw = window.innerWidth;
        gameCanvas.width = Math.max(0.5 * vw, 400); 

        drawBox();

        function drawBox() {
            ctx.lineWidth = 0.1;
            ctx.strokeStyle = "whitesmoke";
            ctx.setLineDash([40, 40]);
    
            ctx.beginPath();
            ctx.moveTo(gameCanvas.width / 2, 0.5);
            ctx.lineTo(gameCanvas.width / 2, gameCanvas.height - 0.5);
            ctx.stroke();
        }
    }

    // factored out redraw functions at top level so resize events may call them 
    function redrawBall() { 
        ctx.beginPath();
        ctx.fillStyle = "red";
        ctx.fillRect(ball.x, ball.y, ball.width, ball.height);
        ctx.stroke();
    }

    function redrawSliders() {
        ctx.beginPath();
        // slider2
        ctx.fillStyle = "whitesmoke";
        ctx.fillRect(slider2.x, slider2.y, slider2.width, slider2.height);
        ctx.stroke();

        // slider1
        slider1.x = gameCanvas.width - 20;
        ctx.fillStyle = "whitesmoke";
        ctx.fillRect(slider1.x, slider1.y, slider1.width, slider1.height);
        ctx.stroke();

    }

    function nextTick() {
        let blitzMode = difficulty == 4;

        drawBoard();
        drawSliders();
        drawBall(); // also handles ball creation
        drawTrail(); // for blitz
        checkCollision(); // also handles goals
        
        
        function drawSliders() {

            redrawSliders();

            if (pressedKeys.up1 && !pressedKeys.down1 && slider1.y > 0) {
                slider1.velocityY = -slider1.speed;
                if (slider1.dash && blitzMode) {
                    slider1.velocityY = (-3) * slider1.speed;
                }
            }
            else if (pressedKeys.down1 && !pressedKeys.up1 && slider1.y < 600 - slider1.height) {
                slider1.velocityY = slider1.speed;
                if (slider1.dash && blitzMode) {
                    slider1.velocityY = 3 * slider1.speed;
                }
            }
            else if (!slider1.held) {
                slider1.velocityY = 0;
            }

            if (playingPong == 2) { // multiplayer case
                if (pressedKeys.up2 && !pressedKeys.down2 &&  slider2.y > 0) {
                    slider2.velocityY = -slider2.speed;
                    if (slider2.dash && blitzMode) {
                        slider2.velocityY = (-3) * slider2.speed;
                    }
                }
                else if (pressedKeys.down2 && !pressedKeys.up2 && slider2.y < 600 - slider2.height) {
                    slider2.velocityY = slider2.speed;
                    if (slider2.dash && blitzMode) {
                        slider2.velocityY = 3 * slider2.speed;
                    }
                }
                else if (!slider2.held) {
                    slider2.velocityY = 0;
                }
            } 

            else {
                let centerSlider2 = slider2.y + slider2.height / 2;
                let centerBall = ball.y + ball.height / 2;

                let near = (slider2.y < centerBall ) && (centerBall < slider2.y + slider2.height);

                if ((centerSlider2 < centerBall) && (slider2.y < 600 - slider2.height)) { // ball is lower than slider 
                    if (near) {
                        slider2.velocityY = Math.min(slider2.speed, Math.abs(ball.velocityY) + 0.1);
                    }
                    else {
                        slider2.velocityY = slider2.speed;
                    }
                }
                else if ((centerSlider2 > centerBall) &&  (slider2.y > 0)) { // ball is higher than slider
                    if (near) {
                        slider2.velocityY = Math.min(slider2.speed, Math.abs(ball.velocityY) + 0.1);
                    }
                    else {
                        slider2.velocityY = slider2.speed;
                    }
                    slider2.velocityY = -slider2.velocityY;
                }
                else {
                    slider2.velocityY = 0;
                }
            }

            if (!slider1.held) {
                slider1.y += slider1.velocityY;
            }
            if (!slider2.held) {
                slider2.y += slider2.velocityY;
            }
        }

        function drawBall() {
            
            if (!ball.exists) {
                spawnSide = (playerOneScore + playerTwoScore) % 2;
                // 0 for spawning on right, 1 for spawning on left
                createBall(spawnSide);
            }
            redrawBall();

            ball.x += ball.velocityX;
            ball.y += ball.velocityY;
            ball.xRelative = ball.x / gameCanvas.width;

            function createBall(spawnSide) {
                let velY = (Math.random() * ball.startSpeed) - ball.startSpeed / 2
                // generate a random value in [-startSpeed/2, startSpeed/2) for the y velocity
                let velX = ball.startSpeed - Math.abs(velY);
                ball.x = gameCanvas.width / 2 - ball.width / 2;
                ball.y = gameCanvas.height / 2 - ball.height / 2;
                ball.xRelative = ball.x / gameCanvas.width;

                if (spawnSide) {
                    velX = -velX;
                }

                ball.velocityX = velX;
                ball.velocityY = velY;
                ball.exists = true;
                ball.serve = true;
                ball.onFire = false;

                if (blitzMode) {
                    portalDir = "right"; // portal shoots ball to right
                    if (spawnSide) {
                        portalDir = "left";
                    }
                }
            }
        }

        function drawTrail() {
            if (blitzMode && !trailCD) { // ping a lingering shrinking trail once!

                let fireOrange = "rgba(255, 165, 0, 0.5)"
        
                if(slider1.dash) {
                    fireTrail(slider1, fireOrange, "whitesmoke");
                }
                if(slider2.dash) {
                    fireTrail(slider2, fireOrange, "whitesmoke");
                }
                if(ball.onFire) {
                    fireTrail(ball, fireOrange); // don't pass in an item color for ball
                }

                function fireTrail(item, trailColour, itemColour) { // continuously draw an item on the canvas in a fixed position and have it shrink
                    // item has properties x, y, width, height to be drawn!

                    let x = item.x; // fix all the variable values!
                    let y = item.y;
                    let w = item.width;
                    let h = item.height;
                    let centerX = x + w / 2;
                    let centerY = y + h / 2;

                    let trailID = drawFlame(trailColour, itemColour);
                    setTimeout(killTrail, 400, trailID); // kill the trail after 

                    function drawFlame(trailColour, itemColour) { // repeatedly draw a single shrinking rectangle (not moving)
                        let drawID = setInterval(() => {
                            ctx.beginPath();
                            ctx.fillStyle = trailColour;
                            ctx.fillRect(centerX - w/2, centerY - h / 2, w, h);
                            w *= 0.94;
                            h *= 0.94;

                            if (itemColour !== undefined) { // if some itemColour parameter is passed in, repeatedly draw that item over itself
                                ctx.fillStyle = itemColour; // this is to prevent the trail overlapping with the item's own colour
                                ctx.fillRect(item.x, item.y, item.width, item.height);
                            }
                        }, 10);

                        return drawID;
                    }

                    function killTrail(ID) {
                        clearInterval(ID);
                    }
                }

                trailCD = true;
                setTimeout(() => trailCD = false, 20);
            }
        }

        function checkCollision() {
            let verticalBounce = ball.y <= 0 || ball.y >= (gameCanvas.height - ball.height)
            if (verticalBounce) {
                ball.velocityY = -ball.velocityY;
            }

            let leftGoal = (ball.x <= 0);
            let rightGoal = (ball.x >= (gameCanvas.width - ball.width));
            let sliderHit1 = ((ball.x + ball.width) > slider1.x) && (ball.y + ball.height > slider1.y) && (ball.y < slider1.y + slider1.height);
            let sliderHit2 = (ball.x < slider2.x + slider2.width) && (ball.y + ball.height > slider2.y) && (ball.y < slider2.y + slider2.height);

            if (sliderHit1) {
                ball.onFire = false;
                let velY = ball.velocityY + slider1.velocityY;
                let neg = velY < 0;
                velY = Math.min(Math.abs(velY), ball.regSpeed * 0.55);
                let velX = -(ball.regSpeed - velY);
                if (neg) {
                    velY = -velY;
                }
                if (slider1.dash && !ball.serve) {
                    velX *= 1.5;
                    velY *= 1.5;
                    ball.onFire = true;
                }
                ball.velocityX = velX;
                ball.velocityY = velY;
                setTimeout(() => ball.serve = false, 60); // add a small delay to avoid multiple hit bugs
            }

            else if (sliderHit2) {
                ball.onFire = false;
                let velY = ball.velocityY + slider2.velocityY;
                let neg = velY < 0;
                velY = Math.min(Math.abs(velY), ball.regSpeed * 0.55);
                let velX = ball.regSpeed - velY;
                if (neg) {
                    velY = -velY;
                }
                if (slider2.dash && !ball.serve) {
                    velX *= 1.5;
                    velY *= 1.5;
                    ball.onFire = true;
                }
                ball.velocityX = velX;
                ball.velocityY = velY;
                ball.serve = false;
            }

            else if (leftGoal) {
                playerOneScore ++;
                ball.onFire = false;
                ball.exists = false;
                checkWin();
            }

            else if (rightGoal) {
                playerTwoScore ++;
                ball.onFire = false;
                ball.exists = false;
                checkWin();
            }

            function checkWin(){

            }
        }
    }
    // ============= PONG GAME =============

    // ============= PONG PREVIEW =============
    function startPongIconAnimation() {
        const slider1 = document.querySelector("#isliderOne");
        const slider2 = document.querySelector("#isliderTwo");
        const ball = document.querySelector("#iball");

        s1 = slideAnimation(slider1, 20, false);
        s2 = slideAnimation(slider2, 40, true);
        b1 = ballXAnimation();
        b2 = ballYAnimation();

        function slideAnimation(slider, position, up) {
            let y = position;
            let goingUp = up;
            let s = 1;

            return setInterval(() => {
                if (y == 0) {
                    goingUp = false;
                    y += s;
                }

                else if (y == 60) {
                    goingUp = true;
                    y -= s;
                }

                else if (goingUp) {
                    y -= s;
                }

                else {
                    y += s;
                }

                slider.style.top = y + "px";

            }, 20);
        }

        function ballXAnimation() {
            let x = 0;
            let goingLeft = false; 

            return setInterval(() => {
                let vw = window.innerWidth;
                s = (0.03 * vw) / 118;

                if (x <= 0) {
                    goingLeft = false;
                    x += s;
                }


                else if (x >= (0.03 * vw)) {
                    goingLeft = true;
                    x -= s;
                }

                else if (goingLeft) {
                    x -= s;
                }

                else {
                    x += (0.03 * vw) / 118;
                }
                
                ball.style.left = x + "px";
            }, 20);
        }

        function ballYAnimation() {
            let y = 32;
            let goingUp = false;
            let s = 2 ;

            return setInterval(() => {
                
                if (y <= 0) {
                    goingUp = false;
                    y += s;
                }

                else if (y >= 80) {
                    goingUp = true;
                    y -= s;
                }

                else if (goingUp) {
                    y -= s;
                }

                else {
                    y += s;
                }

            ball.style.top = y + "px";
            }, 20);
        }

        return [s1, s2, b1, b2];
    }

    function loopAnimation() {
        let startAnimations = function() {
            let anims = startPongIconAnimation();
            animations[0] = anims[0];
            animations[1] = anims[1];
            animations[2] = anims[2];
            animations[3] = anims[3];
        }

        let clearAnimations = function () {
            clearInterval(animations[0]);
            clearInterval(animations[1]);
            clearInterval(animations[2]);
            clearInterval(animations[3]);
        }

        if (firstRun) {
            startAnimations();
        } 
        
        else {
            clearAnimations();
            startAnimations();
        }

        firstRun = false;
    }
    // ============= PONG PREVIEW =============

    // ============= OTHER FUNCTIONS =============
    function flashingText() {
        textArr = Array.from(document.querySelectorAll(".flashing"));

        setInterval(() => {
            for (const elem of textArr) {
                elem.classList.toggle('invisibleText');
            }
        }, 600);
    }
    // ============= OTHER FUNCTIONS =============

    // ============================== MORE FUNCTIONS ==============================
});
