var players = [];

let population = 100;
let aiEnabled = true;

let config = {
    model: [
        {nodeCount: 4, type: "input"},
        {nodeCount: 5, type: "hidden", activationfunc: activation.RELU},
        {nodeCount: 2, type: "output", activationfunc: activation.SOFTMAX}
    ],
    mutationRate: 0.1,
    crossoverMethod: crossover.RANDOM,
    mutationMethod: mutate.RANDOM,
    populationSize: population
};

document.onkeydown = function (e) {
    if (e.keyCode === 37) plates[0].left = true;
    if (e.keyCode === 39) plates[0].right = true;
    if (e.keyCode === 32) {
        for (let i = 0; i < population; i++) {
            balls[i].alive = false;
        }
    }
    if(e.keyCode == 83) {
        population = 1;
        spawnPlayers();
    }
};
document.onkeyup = function (e) {
    if (e.keyCode == 37) plates[0].left = false;
    if (e.keyCode == 39) plates[0].right = false;
}

let myGameArea = {
    canvas: document.createElement("canvas"),
    initGame: function () {
        this.canvas.width = 1000;
        this.canvas.height = 700;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;

    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
};

function spawnPlayers() {
    players = [];

    for (let i = 0; i < population; i++) {
        let ranx = Math.round(Math.random() * 1000);
        let rany = Math.round(Math.random() * 700);
        let rana = Math.round(Math.random() * 2*Math.PI);
        let p = new ball(myGameArea, rana, "#0F0", ranx, rany);
        players.push(p);
    }
}

function startGame() {
    neat = new NEAT(config);
    myGameArea.initGame();
    spawnPlayers();
    setInterval(updateGameArea, 10);
    setInterval(function () {
        var alive = 0;
        var bestScore = 0;
        for (let i = 0; i < population; i++) {
            if (balls[i].alive) {
                alive++;
                bestScore = Math.max(bestScore, balls[i].score);
            }
        }
        console.log("alive: " + alive + " - bestScore: " + bestScore);
    }, 2000);
}

function updateGameArea() {

    //draw
    myGameArea.clear();
    myGameArea.frameNo += 1;
    for (var i = 0; i < players.length; i += 1) {
        players[i].update();
        players[i].ddraw();
    }
//neural information to the NN
    for (let i = 0; i < population; i++) {
        let inn = [];
        neat.setInputs(inn, i);
    }

    //eval
    neat.feedForward();

    //resultsi
    let desicions = neat.getDesicions();
    for (let i = 0; i < population; i++) {
        if (desicions[i] === 0) {
            players[i].left = true;
        } else {
            players[i].right = true;
        }
    }

    let finish = players.every(x => !x.alive);
    if (finish) {
        console.log("finish!");
        for (let i = 0; i < population; i++) {
            neat.setFitness(players[i].score, i);
        }
        spawnPlayers();
        neat.doGen();
    }
}