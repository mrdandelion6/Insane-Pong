document.addEventListener('DOMContentLoaded', function () {
    var openButton = document.getElementById('openbutton');
    var popMenu = document.getElementById('popmenu');
    var menuButtons = popMenu.querySelectorAll('a');
    var firstRun = true;
    var animations = [];
    var pongPreviewButton = document.querySelector("#cupTitle");

    // pong tray buttons
    var settingsButton = document.querySelector("#pongSettingsIcon");
    
    openButton.addEventListener('click', function () {
        popMenu.classList.toggle('hidden');
    });

    menuButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            popMenu.classList.add('hidden');
        });
    });

    loopAnimation();
    drawBox();
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

    pongPreviewButton.addEventListener("click", () => console.log("clicked preview"));



    // ============================== Functions ==============================

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

    function drawBox() {
        let vw = window.innerWidth;
        let box = document.querySelector("#pongGame");
        box.width = Math.max(0.5 * vw, 400); 

        let ctx = box.getContext("2d");

        ctx.lineWidth = 0.1;
        ctx.strokeStyle = "whitesmoke";
        ctx.setLineDash([40, 40]);

        ctx.beginPath();
        ctx.moveTo(box.width / 2, 0.5);
        ctx.lineTo(box.width / 2, box.height - 0.5);
        ctx.stroke();

        // sliders
        ctx.fillStyle = "whitesmoke";
        ctx.fillRect(10, 10, 10, 100);
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