var sceneW = 1200;
var sceneH = 700;


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

var left = false;
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
});


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
