import { saveData, authenticate } from "./saveData.js";

var canvas = document.getElementById('gameCanvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var ctx = canvas.getContext('2d');

var targets = [];
var userClicks = [];
var trialCounter = 0;
var totalErrorDistance = 0;
var canStartNextTrial = true;
var data = []; 
var corsi_end = false;
const n_trials = 2;
var sessionID;

function createTarget() {
    return {
        x: 20 + Math.random() * (canvas.width - 40),
        y: 20 + Math.random() * (canvas.height - 40)
    };
}

function drawTarget(target) {
    ctx.beginPath();
    ctx.arc(target.x, target.y, 20, 0, Math.PI*2);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();
}

function writeInstructions(lines) {
    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    lines.forEach((line, i) => {
        ctx.fillText(line, canvas.width / 2, canvas.height / 2 - 20 + i * 30);
    });
}

function startTrial() {
    sessionID = Date.now();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    targets = [];
    userClicks = [];
    for (var i = 0; i < 5; i++) {
        targets.push(createTarget());
    }

    targets.forEach((target, i) => {
        setTimeout(() => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawTarget(target);
        }, (500 + 1000) * i);
    });

    setTimeout(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.addEventListener('click', recordClick, false);
        writeInstructions(['Click on the targets in order.']);
        setTimeout(() => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }, 1500);
    }, (500 + 1000) * 5);
}

function recordClick(e) {
    var rect = canvas.getBoundingClientRect(),
        scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for X
        scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for Y

    var x = (e.clientX - rect.left) * scaleX,  // scale mouse coordinates after they have
        y = (e.clientY - rect.top) * scaleY;   // been adjusted to be relative to element

    userClicks.push({x, y});

    data.push({
        Trial: trialCounter,
        ClickCounter: userClicks.length,
        identifier: localStorage.getItem('identifier'),
        clickPositionX: x,
        clickPositionX: y,
        targetPositionX: targets[userClicks.length - 1].x,
        targetPositionY: targets[userClicks.length - 1].y,
        sessionID: Date.now() 
    });

    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI*2);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();

    setTimeout(() => {
        ctx.clearRect(x - 20, y - 20, 40, 40);
        if (userClicks.length === 5) {
            canvas.removeEventListener('click', recordClick, false);
            calculateError();
            trialCounter++;
            if (trialCounter < n_trials + 1) {
                var screenDiagonal = Math.sqrt(canvas.width ** 2 + canvas.height ** 2);
                var errorPercentage = (totalErrorDistance / screenDiagonal) * 100;
                errorPercentage = Math.round(errorPercentage);
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                writeInstructions(['Mean distance error: ' + errorPercentage + '%', 'Press SPACEBAR to start the next trial.']);
                setTimeout(() => {
                    canStartNextTrial = true;
                }, 100);
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                corsi_end = true; 
                 // Ensure authentication before saving data
                 authenticate().then(() => {
                     saveData(data, "corsi", sessionID.toString()); // pass the sessionID to the saveData function
                 }); 
                writeInstructions(['Task is finished. Press the space bar to begin the pizza delivery game.']);
            }
        }
    }, 500);
}

function calculateError() {
    totalErrorDistance = 0;
    for (var i = 0; i < 5; i++) {
        var dx = userClicks[i].x - targets[i].x;
        var dy = userClicks[i].y - targets[i].y;
        var distance = Math.sqrt(dx * dx + dy * dy);
        totalErrorDistance += distance;
    }
    totalErrorDistance /= 5;
}

document.body.onkeyup = function(e) {
    if (e.keyCode === 32 && trialCounter < 10 && canStartNextTrial) {
        canStartNextTrial = false;
        startTrial();
    }
    else if (e.keyCode === 32 && corsi_end) {
        window.location.href = "pizza.html";
    }
}

writeInstructions(['Welcome to the experiment.', 'You will be presented with 5 white targets on a black background.', 'Each target will be displayed individually for 500 ms.', 'After all targets have been displayed, your task is to click with the mouse where you think the targets were.', 'You must click on the targets in the order they were displayed.', 'When you are ready to start the trial, press SPACEBAR.']);
