document.addEventListener('DOMContentLoaded', function () {
    var openButton = document.getElementById('openbutton');
    var popMenu = document.getElementById('popmenu');
    var menuButtons = popMenu.querySelectorAll('a');
    
    openButton.addEventListener('click', function () {
        popMenu.classList.toggle('hidden');
    });

    menuButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            popMenu.classList.add('hidden');
        });
    });

    function startPongIconAnimation() {
        const slider1 = document.querySelector("#isliderOne");
        const slider2 = document.querySelector("#isliderTwo");
        // const ball = document.querySelector("#iball")

        slideAnimation(slider1, 0, 1);
        slideAnimation(slider2, 60, 1);

        function slideAnimation(slider, position, speed) {
            let y = position;
            let goingUp = false;
            let s = speed;

            setInterval(() => {
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

        function ballAnimation() {
        }

    }

    startPongIconAnimation();

});