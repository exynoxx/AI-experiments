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
    balls = [];
    plates = [];
    gameObjects = [];

    let spacing = 6;
    let w = 50;
    let h = 20;
    let blocks = [];

    for (let i = 0; i < 18; i++) {
        for (let j = 0; j < 4; j++) {
            let block = new box(myGameArea, w, h, "#0FF", (spacing+w)*i, (spacing+h)*j);
            gameObjects.push(block);
            blocks.push(block)
        }
    }

    for (let i = 0; i < population; i++) {
        let ran1 = Math.round(Math.random() * 500);
        let ran2 = Math.round(Math.random() * 200) + 200;
        let p = new plate(myGameArea, 80, 5, "#000", ran2, 670);
        let b = new ball(myGameArea, 10, "#0F0", ran1, ran2);
        plates.push(p);
        b.crashAble.push(p);
        balls.push(b);
        for(let e of blocks){
            b.crashAble.push(e);
        }
        gameObjects.push(p);
        gameObjects.push(b);
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
    for (var i = 0; i < gameObjects.length; i += 1) {
        gameObjects[i].update();
        gameObjects[i].ddraw();
    }

    if (aiEnabled) {
        //neural information to the NN
        for (let i = 0; i < population; i++) {
            let inn = [plates[i].x, balls[i].x, plates[i].x - balls[i].x, balls[i].y];
            neat.setInputs(inn, i);
        }

        //eval
        neat.feedForward();

        //resultsi
        let desicions = neat.getDesicions();
        for (let i = 0; i < population; i++) {
            if (desicions[i] === 0) {
                plates[i].left = true;
            } else {
                plates[i].right = true;
            }
        }

        let finish = balls.every(x => !x.alive);
        if (finish) {
            console.log("finish!");
            for (let i = 0; i < population; i++) {
                neat.setFitness(balls[i].score, i);
            }
            spawnPlayers();
            neat.doGen();
        }
    }
}