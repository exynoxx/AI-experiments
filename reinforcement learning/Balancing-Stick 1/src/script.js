var sceneW = 1200;
var sceneH = 700;

let population = 100;
let config = {
    model: [
        {nodeCount: 4, type: "input"},
        {nodeCount: 5, type: "hidden", activationfunc: activation.RELU},
        {nodeCount: 4, type: "output", activationfunc: activation.SOFTMAX}
    ],
    mutationRate: 0.1,
    crossoverMethod: crossover.RANDOM,
    mutationMethod: mutate.RANDOM,
    populationSize: population
};
// create engine
var engine = Matter.Engine.create(),
    world = engine.world;

var top = Matter.Bodies.rectangle(sceneW / 2, 0, sceneW * 2, 10, {
    isStatic: true,
    render: {fillStyle: "#000"}
});
var bottom = Matter.Bodies.rectangle(sceneW / 2, sceneH, sceneW * 2, 10, {
    isStatic: true, render: {fillStyle: "#000"}
});
/*var left = Matter.Bodies.rectangle(0, sceneH / 2, 10, sceneH, {
    isStatic: true, render: {fillStyle: "#000"}
});
var right = Matter.Bodies.rectangle(sceneW, sceneH / 2, 10, sceneH, {
    isStatic: true, render: {fillStyle: "#000"}
});*/
Matter.World.add(world, [top, bottom]);

var group = Matter.Body.nextGroup(true);


var player = function (x, y) {
    this.score = 0;
    this.alive = true;
    this.content = (function () {
        var vertices = [
            {x: 0, y: 0},
            {x: 110, y: 0},
            {x: 110, y: 10},
            {x: 60, y: 10},
            {x: 60, y: 150},
            {x: 50, y: 150},
            {x: 50, y: 10},
            {x: 0, y: 10},
            {x: 0, y: 0}
        ];

        var t = Matter.Bodies.fromVertices(x, y, vertices, {
            collisionFilter: {
                group: group
            }
        });
        var cart = Matter.Bodies.rectangle(x, y + 100, 80, 20, {
            collisionFilter: {
                group: group
            }, density: 0.005
        });

        var connector = Matter.Constraint.create({
            bodyA: t,
            bodyB: cart,
            pointA: {x: 0, y: 100},
            stiffness: 0,
            length: 0
        });

        Matter.World.addBody(world, t);
        Matter.World.addBody(world, cart);
        Matter.World.addConstraint(world, connector);
        return [t, cart, connector];
    })();
};

var players = [];

var spawnPlayers = function () {
    players = [];
    for (let i = 0; i < population; i++) {
        players.push(new player(500, 500));
    }
};

var neat = new NEAT(config);
spawnPlayers();
/*setInterval(function () {
    var alive = 0;
    var bestScore = 0;
    for (let i = 0; i < population; i++) {
        if (balls[i].alive) {
            alive++;
            bestScore = Math.max(bestScore, balls[i].score);
        }
    }
    console.log("alive: " + alive + " - bestScore: " + bestScore);
}, 2000);*/


// create renderer
var render = Matter.Render.create({
    element: document.body,
    engine: engine,
    options: {
        width: sceneW,
        height: sceneH,
        showVelocity: true,
        wireframes: false,
        background: "#eee"
    }
});

Matter.Render.run(render);

// create runner
var runner = Matter.Runner.create();
Matter.Runner.run(runner, engine);

function newGeneration() {
    best = 0;
    for (let i = 0; i < population; i++) {
        best = Math.max(players[i].score, best);
        neat.setFitness(players[i].score, i);
        Matter.World.remove(world, players[i].content);
    }
    console.log("best score = " + best);
    console.log(neat.export());
    spawnPlayers();
    neat.doGen();
}

var count = 0;
Matter.Events.on(engine, 'beforeUpdate', e => {
    count++;

//finish check
    if (count % 1000) {
        if (players.every(x => !x.alive)) {
            console.log("finish!");
            newGeneration();
        }
    }


    //MISC
    for (let i = 0; i < population; i++) {
        //NN INPUT
        let inn = [players[i].content[0].angle * 100, players[i].content[0].position.x, players[i].content[1].position.x, Math.abs(players[i].content[1].position.x - 600)];
        neat.setInputs(inn, i);

        //UPDATE FITNESS
        if (players[i].alive) players[i].score += 1;

        //DEAD CRITERION
        if (Math.abs(players[i].content[0].angle) > 1.2) {
            players[i].alive = false;
        }

        if (players[i].content[1].position.x < 30) {
            players[i].alive = false;
        }
        if (players[i].content[1].position.x > 1170) {
            players[i].alive = false;
        }
    }

    //eval NN
    neat.feedForward();

    //NN RESULT -> DESCISION
    let desicions = neat.getDesicions();
    for (let i = 0; i < population; i++) {
        if (!players[i].alive) {
            if(players[i].content[1].position.x>1400 ||players[i].content[1].position.x<-200) continue;
            if(players[i].content[1].position.x>600){
                Matter.Body.translate(players[i].content[1], {x: 5, y: 0});
            }else{
                Matter.Body.translate(players[i].content[1], {x: -5, y: 0});

            }
            continue;
        }
        if (desicions[i] === 0) Matter.Body.translate(players[i].content[1], {x: -40, y: 0});
        if (desicions[i] === 1) Matter.Body.translate(players[i].content[1], {x: -5, y: 0});
        if (desicions[i] === 2) Matter.Body.translate(players[i].content[1], {x: 40, y: 0});
        if (desicions[i] === 3) Matter.Body.translate(players[i].content[1], {x: 5, y: 0});
    }
});


window.addEventListener("keydown", e => {
    if (e.keyCode === 32) {
        newGeneration();
    }
    if (e.keyCode === 39) {
        for (let i = 0; i < population; i++) {
            if (!players[i].alive) continue;
            Matter.Body.translate(players[i].content[1], {x: 200, y: 0});
            Matter.Body.translate(players[i].content[0], {x: 200, y: 0});
        }
    }
    if (e.keyCode === 37) {
        for (let i = 0; i < population; i++) {
            if (!players[i].alive) continue;
            Matter.Body.translate(players[i].content[1], {x: -200, y: 0});
            Matter.Body.translate(players[i].content[0], {x: -200, y: 0});
        }
    }


});

/*var left = false;
var right = false;
var count = 0;
Matter.Events.on(engine, 'beforeUpdate', e => {
    if (left) {
        Matter.Body.translate(players[0].content[1], {x: -18, y: 0});
    }
    if (right) {
        Matter.Body.translate(players[0].content[1], {x: 18, y: 0});
    }
});

window.addEventListener("keydown", e => {
    if (e.keyCode === 37) {
        left = true;
        right = false;
    }
    if (e.keyCode === 39) {
        right = true;
        left = false;
    }
});
window.addEventListener("keyup", e => {
    if (left) left = false;
    if (right) right = false;
});*/


// add mouse control
var mouse = Matter.Mouse.create(render.canvas),
    mouseConstraint = Matter.MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.2,
            render: {
                visible: false
            }
        }
    });

Matter.World.add(world, mouseConstraint);

// keep the mouse in sync with rendering
render.mouse = mouse;

/*
// fit the render viewport to the scene
Render.lookAt(render, {
    min: { x: 0, y: 0 },
    max: { x: 1000, y: 700 }
});
*/
// context for MatterTools.Demo
