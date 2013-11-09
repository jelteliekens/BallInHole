var start = 0;
var end = 0;
var diff = 0;
var timerID = 0;

var timeString;

function timer() {
    end = new Date();
    diff = end - start;
    diff = new Date(diff);

    var sec = diff.getSeconds();
    var min = diff.getMinutes();

    if (min < 10) {
        min = "0" + min;
    }
    if (sec < 10) {
        sec = "0" + sec;
    }

    timeString = min + ":" + sec;
    timerLabel.innerHTML = timeString = timeString;
    timerID = setTimeout(timer, 10);
}

function chronoStart() {
    start = new Date();
    timer();
}

function chronoPause() {
    clearTimeout(timerID);
}

function chronoContinue() {
    start = new Date() - diff;
    start = new Date(start);
    timer();
}

function chronoStop() {
    clearTimeout(timerID);
}
