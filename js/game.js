window.onload = init;

var winW, winH, winT;
var mouseDownInsideball;
var touchDownInsideball;
var movementTimer;
var lastMouse, lastOrientation, lastTouch;
var gameSurface;
var btnStart, btnPause, btnStop;
var timerLabel;

var isStarted = 0, isPlaying = 0;

// Initialisation on opening of the window
function init() {
    gameSurface = document.getElementById('game');

    btnStart = document.getElementById('btnStart');
    btnPause = document.getElementById('btnPause');
    btnStop = document.getElementById('btnStop');

    timerLabel = document.getElementById('timer');

    //EventListeners
    window.addEventListener('resize', doLayout, false);
    btnStart.addEventListener('click', start, false);
    btnPause.addEventListener('click', pause, false);
    btnStop.addEventListener('click', stop, false);

    lastOrientation = {};
    lastMouse = {x: 0, y: 0};
    lastTouch = {x: 0, y: 0};
    mouseDownInsideball = false;
    touchDownInsideball = false;

    doLayout(gameSurface);
}

function addListeners() {

    gameSurface.addEventListener('mousemove', onMouseMove, false);
    gameSurface.addEventListener('mousedown', onMouseDown, false);
    gameSurface.addEventListener('mouseup', onMouseUp, false);
    gameSurface.addEventListener('touchmove', onTouchMove, false);
    gameSurface.addEventListener('touchstart', onTouchDown, false);
    gameSurface.addEventListener('touchend', onTouchUp, false);
    window.addEventListener('deviceorientation', deviceOrientationTest, false);

}

function removeListeners() {
    gameSurface.removeEventListener('mousemove', onMouseMove, false);
    gameSurface.removeEventListener('mousedown', onMouseDown, false);
    gameSurface.removeEventListener('mouseup', onMouseUp, false);
    gameSurface.removeEventListener('touchmove', onTouchMove, false);
    gameSurface.removeEventListener('touchstart', onTouchDown, false);
    gameSurface.removeEventListener('touchend', onTouchUp, false);
    window.removeEventListener('deviceorientation', onDeviceOrientationChange, false);
    clearInterval(movementTimer);
}

// Does the gyroscope or accelerometer actually work?
function deviceOrientationTest(event) {
    window.removeEventListener('deviceorientation', deviceOrientationTest);
    if (event.beta != null && event.gamma != null) {
        window.addEventListener('deviceorientation', onDeviceOrientationChange, false);
        movementTimer = setInterval(onRenderUpdate, 10);
    }
}

function doLayout(event) {
    winW = gameSurface.offsetWidth;
    winH = gameSurface.offsetHeight;
    winT = gameSurface.offsetTop;

    var surface = document.getElementById('surface');
    surface.width = winW;
    surface.height = winH;

    var ballRadius = 10;
    ball = {    radius: ballRadius,
        x: Math.round(winW / 2),
        y: Math.round(winH / 2),
        color: 'rgba(140,52,4,1)'};

    var holeRadius = ballRadius + 3;
    hole = {
        radius: holeRadius,
        x: 30,
        y: 30,
        color: 'rgb(4,115,140)'
    };
}

function playGame(xDelta, yDelta) {
    moveBall(xDelta, yDelta);

    if (ball.x + ball.radius < hole.x + hole.radius
        && ball.x - ball.radius > hole.x - hole.radius
        && ball.y + ball.radius < hole.y + hole.radius
        && ball.y - ball.radius > hole.y - hole.radius) {

        var time = timeString;
        stop();
        alert('Congratulations, Your time is ' + time + '!');
    }

    renderCanvas();
}

function renderCanvas() {

    if (isPlaying && isStarted) {
        var surface = document.getElementById('surface');
        var context = surface.getContext('2d');
        context.clearRect(0, 0, surface.width, surface.height);

        renderHole(context);
        renderBall(context);
    }
}

function clearCanvas() {
    var context = surface.getContext('2d');
    context.clearRect(0, 0, surface.width, surface.height);
}

function onRenderUpdate(event) {
    var xDelta, yDelta;
    switch (window.orientation) {
        case 0: // portrait - normal
            xDelta = lastOrientation.gamma;
            yDelta = lastOrientation.beta;
            break;
        case 180: // portrait - upside down
            xDelta = lastOrientation.gamma * -1;
            yDelta = lastOrientation.beta * -1;
            break;
        case 90: // landscape - bottom right
            xDelta = lastOrientation.beta;
            yDelta = lastOrientation.gamma * -1;
            break;
        case -90: // landscape - bottom left
            xDelta = lastOrientation.beta * -1;
            yDelta = lastOrientation.gamma;
            break;
        default:
            xDelta = lastOrientation.gamma;
            yDelta = lastOrientation.beta;
    }
    playGame(xDelta, yDelta);
}

function onMouseMove(event) {
    if (mouseDownInsideball) {
        var xDelta, yDelta;
        xDelta = event.clientX - lastMouse.x;
        yDelta = event.clientY - lastMouse.y;
        playGame(xDelta, yDelta);
        lastMouse.x = event.clientX;
        lastMouse.y = event.clientY;
    }
}

function onMouseDown(event) {
    var x = event.clientX;
    var y = event.clientY;

    if (x > ball.x - ball.radius &&
        x < ball.x + ball.radius &&
        y - winT > ball.y - ball.radius &&
        y - winT < ball.y + ball.radius) {
        mouseDownInsideball = true;
        lastMouse.x = x;
        lastMouse.y = y;
    } else {
        mouseDownInsideball = false;
    }
}

function onMouseUp(event) {
    mouseDownInsideball = false;
}

function onTouchMove(event) {
    event.preventDefault();
    if (touchDownInsideball) {
        var touches = event.changedTouches;
        var xav = 0;
        var yav = 0;
        for (var i = 0; i < touches.length; i++) {
            var x = touches[i].pageX;
            var y = touches[i].pageY;
            xav += x;
            yav += y;
        }
        xav /= touches.length;
        yav /= touches.length;
        var xDelta, yDelta;

        xDelta = xav - lastTouch.x;
        yDelta = yav - lastTouch.y;
        playGame(xDelta, yDelta);
        lastTouch.x = xav;
        lastTouch.y = yav;
    }
}

function onTouchDown(event) {
    event.preventDefault();
    touchDownInsideball = false;
    var touches = event.changedTouches;
    for (var i = 0; i < touches.length && !touchDownInsideball; i++) {
        var x = touches[i].pageX;
        var y = touches[i].pageY;
        if (x > ball.x - ball.radius &&
            x < ball.x + ball.radius &&
            y - winT > ball.y - ball.radius &&
            y - winT < ball.y + ball.radius) {
            touchDownInsideball = true;
            lastTouch.x = x;
            lastTouch.y = y;
        }
    }
}

function onTouchUp(event) {
    touchDownInsideball = false;
}

function onDeviceOrientationChange(event) {
    lastOrientation.gamma = event.gamma;
    lastOrientation.beta = event.beta;
}

function start() {
    if (!isPlaying) {

        addListeners();

        if (isStarted) {

            btnStart.disabled = "disabled";
            btnPause.disabled = "";
            btnStop.disabled = "";

            chronoContinue();
            isPlaying = 1;

        } else {

            btnStart.disabled = "disabled";
            btnPause.disabled = "";
            btnStop.disabled = "";

            ball.x = ball.radius + Math.round((Math.random() * (winW - 2 * ball.radius)) + 1);
            ball.y = ball.radius + Math.round((Math.random() * (winH - 2 * ball.radius)) + 1);

            hole.x = hole.radius + Math.round((Math.random() * (winW - 2 * hole.radius)) + 1);
            hole.y = hole.radius + Math.round((Math.random() * (winH - 2 * hole.radius)) + 1);

            chronoStart();
            isStarted = 1;
            isPlaying = 1;
        }
    }

    renderCanvas();
}

function pause() {

    if (isStarted && isPlaying) {
        removeListeners();

        btnStart.disabled = "";
        btnPause.disabled = "disabled";
        btnStop.disabled = "";
        chronoPause();
        isPlaying = 0;
    }
}

function stop() {

    removeListeners();

    btnStart.disabled = "";
    btnPause.disabled = "disabled";
    btnStop.disabled = "disabled";

    timerLabel.innerHTML = "00:00";

    chronoStop();
    isPlaying = 0;
    isStarted = 0;

    clearCanvas();
}

