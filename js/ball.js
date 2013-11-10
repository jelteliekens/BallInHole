var ball;

function renderBall(context) {

    context.beginPath();
    context.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI, false);
    context.fillStyle = ball.color;
    context.fill();
    context.lineWidth = 1;
    context.strokeStyle = ball.stoke;
    context.stroke();
}

function moveBall(xDelta, yDelta) {
    var xTest = ball.x + xDelta;
    var yTest = ball.y + yDelta;

    if (xTest > ball.radius && xTest < (winW - ball.radius)) {
        ball.x += xDelta;
    } else if (xTest <= ball.radius) {
        ball.x = ball.radius;
    } else if (xTest >= winW - ball.radius) {
        ball.x = winW - ball.radius;
    }

    if (yTest > ball.radius && yTest < (winH - ball.radius)) {
        ball.y += yDelta;
    } else if (yTest <= ball.radius) {
        ball.y = ball.radius;
    } else if (yTest >= winH - ball.radius) {
        ball.y = winH - ball.radius;
    }
}