var hole;

function renderHole(context) {
    context.beginPath();
    context.arc(hole.x, hole.y, hole.radius, 0, 2 * Math.PI, false);
    context.fillStyle = hole.color;
    context.fill();
    context.lineWidth = 1;
    context.strokeStyle = hole.color;
    context.stroke();
}