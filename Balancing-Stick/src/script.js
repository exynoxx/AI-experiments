var Example = Example || {};
var sceneW = 1000;
var sceneH = 700;

Example.newtonsCradle = function () {
    var Engine = Matter.Engine,
        Render = Matter.Render,
        Runner = Matter.Runner,
        Body = Matter.Body,
        Composites = Matter.Composites,
        MouseConstraint = Matter.MouseConstraint,
        Mouse = Matter.Mouse,
        World = Matter.World;

    // create engine
    var engine = Engine.create(),
        world = engine.world;

    // create renderer
    var render = Render.create({
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

    Render.run(render);

    // create runner
    var runner = Runner.create();
    Runner.run(runner, engine);

    var balancer = function () {
        var container = Matter.Composite.create();
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
        var group = Body.nextGroup(true);

        var t = Matter.Bodies.fromVertices(400, 200, vertices, {
            collisionFilter: {
                group: group
            }
        });
        var cart = Matter.Bodies.rectangle(400, 280, 80, 20, {
            collisionFilter: {
                group: group
            }
        });

        var connector = Matter.Constraint.create({
            bodyA: t,
            bodyB: cart,
            pointA: {x: 0, y: 100},
            stiffness: 0,
            length: 0
        });
        Matter.Composite.addBody(container, t);
        Matter.Composite.addBody(container, cart);
        Matter.Composite.addConstraint(container, connector);
        return container;
    };


    let b = new balancer();
    World.add(world, b);

    World.add(world, [
        // walls
        Matter.Bodies.rectangle(sceneW / 2, 0, sceneW, 10, {isStatic: true, render: {fillStyle: "#000"}}),
        Matter.Bodies.rectangle(sceneW / 2, sceneH, sceneW, 10, {isStatic: true, render: {fillStyle: "#000"}}),
        Matter.Bodies.rectangle(0, sceneH / 2, 10, sceneH, {isStatic: true, render: {fillStyle: "#000"}}),
        Matter.Bodies.rectangle(sceneW, sceneH / 2, 10, sceneH, {isStatic: true, render: {fillStyle: "#000"}})
    ]);


    var left = false;
    var right = false;
    Matter.Events.on(engine, 'beforeUpdate', e=> {
        if (left) {
            Matter.Composite.translate(b, {x: -18, y: 0});
        }
        if (right) {
            Matter.Composite.translate(b, {x: 18, y: 0});
        }

    });

    window.addEventListener("keydown", e=> {
        if (e.keyCode === 37) {
            left = true;
            right=false;
        }
        if (e.keyCode === 39){
            right = true;
            left = false;
        }
    });
    window.addEventListener("keyup", e=> {
        if(left)left=false;
        if(right)right=false;
    });


    // add mouse control
    var mouse = Mouse.create(render.canvas),
        mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: {
                    visible: false
                }
            }
        });

    World.add(world, mouseConstraint);

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
    return {
        engine: engine,
        runner: runner,
        render: render,
        canvas: render.canvas,
        stop: function () {
            Matter.Render.stop(render);
            Matter.Runner.stop(runner);
        }
    };
};

if (typeof module !== 'undefined') {
    module.exports = Example[Object.keys(Example)[0]];
}
Example.newtonsCradle();