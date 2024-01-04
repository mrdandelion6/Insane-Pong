document.addEventListener('DOMContentLoaded', function () {
    var openButton = document.getElementById('openbutton');
    var popMenu = document.getElementById('popmenu');
    var menuButtons = popMenu.querySelectorAll('a');
    var firstRun = true;
    var animations = [];
    var pongPreview = document.querySelector("#pongPreview");
    var pongPreviewButton = document.querySelector("#cupTitle");
    var up1 = "ArrowUp";
    var down1 = "ArrowDown";
    var up2 = "w";
    var down2 = "s";
    var pongIsOpen = false;
    var playingPong = false;
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
                       "p": false};

    // pong tray buttons
    var settingsButton = document.querySelector("#pongSettingsIcon");
    var volumeButton = document.querySelector("#pongVolumeIcon");
    var volumeCross = document.querySelector("#pongVolumeCross");
    var backButton = document.querySelector("#pongBackIcon");
    var exitButton = document.querySelector("#pongExitIcon");
    var resumeButton = document.querySelector("#pongResumeIcon");
    var restartButton = document.querySelector("#pongRestartIcon");

    // pong screens
    var pong = document.querySelector("#gameStuff");
    var mainMenu = document.querySelector("#pongMenu");
    var singlePlayerMenu = document.querySelector("#singleMenu");
    var multiplayerMenu = document.querySelector("#multiMenu");
    var settingsMenu = document.querySelector("#pongSettings");
    var pauseMenu = document.querySelector("#pausedScreen");
    var gameCanvas = document.querySelector("#pongGame");
    var pongExitPopup = document.querySelector("#pongExitPrompt"); 
    
    // managing screen
    let currentScreen;
    let lastScreen;

    // pong text buttons
    var confirmExit = document.querySelector("#exitY"); // exit popup
    var rejectExit = document.querySelector("#exitN");

    var selectMP = document.querySelector("#chooseMP"); // main menu
    var selectSP = document.querySelector("#chooseSP");

    var easyModeSP = document.querySelector("#SPeasy"); // single player menu
    var mediumModeSP = document.querySelector("#SPeasy");
    var hardModeSP = document.querySelector("#SPeasy");
    var impossibleModeSP = document.querySelector("#SPeasy");

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

    // RESIZING EVENTS
    window.addEventListener("resize", () => {

        // PONG PREVIEW
        clearInterval(iconLoop);
        loopAnimation(); // call again immediately to avoid delay
        iconLoop = setInterval(loopAnimation, 4800);

        // PONG BOX
        drawBox();
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

    // exit button
    exitButton.addEventListener("click", () => {
        pongExitPopup.classList.toggle("hidden");
    });
    confirmExit.addEventListener("click", () => {
        pongPreview.classList.toggle("hidden");
        pong.classList.toggle("hidden");
        currentScreen.classList.toggle("hidden");
        pongExitPopup.classList.toggle("hidden");
        lastScreen = null;
        currentScreen = null;
        pongIsOpen = false;
    });
    rejectExit.addEventListener("click", () => {
        pongExitPopup.classList.toggle("hidden");
    });

    // volume button
    function toggleVolume() {
        volumeCross.classList.toggle("hidden");
        // TODO: implement volume muting and unmuting
    }
    volumeButton.addEventListener("click", toggleVolume);
    volumeCross.addEventListener("click", toggleVolume);

    // settings button
    function openSettings() {
        if (currentScreen != settingsMenu) {
            mainMenu.classList.toggle("hidden");
            settingsMenu.classList.toggle("hidden");
            lastScreen = currentScreen;
            currentScreen = settingsMenu;
            backButton.classList.toggle("hidden");
        }
    }
    settingsButton.addEventListener("click", openSettings);

    // back button 
    backButton.addEventListener("click", () => {
        switch(true) {
            case currentScreen == settingsMenu:
                currentScreen.classList.toggle("hidden");
                lastScreen.classList.toggle("hidden");
                currentScreen = lastScreen;
                lastScreen = settingsMenu;
                break;

            case currentScreen == singlePlayerMenu || currentScreen == multiplayerMenu:
                currentScreen.classList.toggle("hidden");
                mainMenu.classList.toggle("hidden");
                lastScreen = currentScreen;
                currentScreen = mainMenu;
                break;
        }

        if (currentScreen = mainMenu) {
            backButton.classList.toggle("hidden");
        }

    });

    
    // key press handling

    // check if key is being held, only want one trigger
    document.addEventListener("keydown", (event) => {
        let key = event.key;
        if (["1", "2", "3", "4", "Escape", "m", "p"].includes(key)) {
            if (!pressedKeys[key]) {
                pressedKeys[key] = true;
                handleKeyPress(key);
            } 
        } 

        else { // don't need to check if it's being held as these are for sliders (holding is normal)
            switch(key) { // we have a switch for this because we still want to set up1, up2, down1, down2 to true 
                case up1:
                    pressedKeys.up1 = true;
                    handleKeyPress(key);
                    break;
                case down1:
                    pressedKeys.down1 = true;
                    handleKeyPress(key);
                    break;
                case up2:
                    pressedKeys.up2 = true;
                    handleKeyPress(key);
                    break;
                case down2:
                    pressedKeys.down2 = true;
                    handleKeyPress(key);
                    break;
                default:
                    break;
            }
        }
    });

    // update key pressed status when key is released
    document.addEventListener("keyup", (event) => {
        let key = event.key;
        if (["1", "2", "3", "4", "Escape", "m", "p"].includes(key)) {
            pressedKeys[key] = false;
        } 

        else { 
            switch(key) { 
                case up1:
                    pressedKeys.up1 = false;
                    break;
                case down1:
                    pressedKeys.down1 = false;
                    break;
                case up2:
                    pressedKeys.up2 = false;
                    break;
                case down2:
                    pressedKeys.down2 = false;
                    break;
                default:
                    break;
            }
        }
    });

    // handle the key taps
    function handleKeyPress(key) {
        console.log(key);
        switch(key) {
            case "1":
                switch(currentScreen) {
                    case mainMenu:
                        selectSinglePlayer();
                        break;
                    case singlePlayerMenu:
                        startSinglePlayer(1);
                        break;
                    case multiplayerMenu:
                        startMultiPlayer(1);
                        break;
                    default:
                        break;
                }
                break;
            case "2":
                switch(currentScreen) {
                    case mainMenu:
                        selectMultiplayer();
                        break;
                    case singlePlayerMenu:
                        startSinglePlayer(2);
                        break;
                    case multiplayerMenu:
                        startMultiPlayer(2);
                        break;
                    default:
                        break;
                }
                break;
            case "3":
                switch(currentScreen) {
                    case singlePlayerMenu:
                        startSinglePlayer(3);
                        break;
                    case multiplayerMenu:
                        startMultiPlayer(3);
                        break;
                    default:
                        break;
                }
                break;
            case "4":
                switch(currentScreen) {
                    case singlePlayerMenu:
                        startSinglePlayer(4); // impossible mode
                        break;
                    case multiplayerMenu:
                        startMultiPlayer(4); // blitz mode
                        break;
                    default:
                        break;
                }
                break;

            case "Escape":
                switch(currentScreen) {
                    case gameCanvas:
                        pauseGame();
                    default:
                        openSettings();
                }
            case "m":
                if (pongIsOpen) {
                    toggleVolume();
                }
                break;

            case up1:
                if (playingPong) {

                }
                break;
            case down1:
                if (playingPong) {
                    
                }
                break;

            case up2:
                if (playingPong) {
                    
                }
                break;

            case down2:
                if (playingPong) {
                    
                }
                break;

            default:
                break;
        }
    }

    // select one player
    selectSP.addEventListener("click", selectSinglePlayer);
    function selectSinglePlayer() {
        currentScreen.classList.toggle("hidden");
        singlePlayerMenu.classList.toggle("hidden");
        backButton.classList.toggle("hidden");
        lastScreen = currentScreen;
        currentScreen = singlePlayerMenu;
    }

    // select two player    
    selectMP.addEventListener("click", selectMultiplayer);
    function selectMultiplayer() {
        currentScreen.classList.toggle("hidden");
        multiplayerMenu.classList.toggle("hidden");
        backButton.classList.toggle("hidden");
        lastScreen = currentScreen;
        currentScreen = multiplayerMenu;
    }


    // ============================== More Functions ==============================

    // =========== PONG PREVIEW ===========
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
    // =========== PONG PREVIEW ===========


    // ============= PONG BOX =============

    function startSinglePlayer(difficulty) {
        drawBox();
    }

    function startMultiPlayer(difficulty) {
        drawBox();
    }

    function drawBox() {
        let vw = window.innerWidth;
        gameCanvas.width = Math.max(0.5 * vw, 400); 
        let ctx = gameCanvas.getContext("2d");

        ctx.lineWidth = 0.1;
        ctx.strokeStyle = "whitesmoke";
        ctx.setLineDash([40, 40]);

        ctx.beginPath();
        ctx.moveTo(gameCanvas.width / 2, 0.5);
        ctx.lineTo(gameCanvas.width / 2, gameCanvas.height - 0.5);
        ctx.stroke();

        // sliders
        ctx.fillStyle = "whitesmoke";
        ctx.fillRect(10, gameCanvas.height / 2 - 50, 10, 100);
        ctx.stroke();

        ctx.fillStyle = "whitesmoke";
        ctx.fillRect(gameCanvas.width - 20, gameCanvas.height / 2 - 50, 10, 100);
        ctx.stroke();
    }

    function flashingText() {
        textArr = Array.from(document.querySelectorAll(".flashing"));

        setInterval(() => {
            for (const elem of textArr) {
                elem.classList.toggle('invisibleText');
            }
        }, 600);
    }

    // ============= PONG BOX =============

});