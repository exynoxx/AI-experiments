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
            {x: 60, y: 100},
            {x: 50, y: 100},
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
            pointA: {x: 0, y: 80},
            stiffness: 0,
            length: 0
        });
        Matter.Composite.addBody(container, t);
        Matter.Composite.addBody(container, cart);
        Matter.Composite.addConstraint(container, connector);
        return container;
    };


    World.add(world, new balancer());

    World.add(world, [
        // walls
        Matter.Bodies.rectangle(sceneW / 2, 0, sceneW, 10, {isStatic: true, render: {fillStyle: "#f00"}}),
        Matter.Bodies.rectangle(sceneW / 2, sceneH, sceneW, 10, {isStatic: true, render: {fillStyle: "#f00"}}),
        Matter.Bodies.rectangle(0, sceneH / 2, 10, sceneH, {isStatic: true, render: {fillStyle: "#f00"}}),
        Matter.Bodies.rectangle(sceneW, sceneH / 2, 10, sceneH, {isStatic: true, render: {fillStyle: "#f00"}})
    ]);

    /*    var balancer = function (x, y, r, l) {
            var container = Matter.Composite.create({label: 'cunt'});
            var cart = Matter.Bodies.rectangle(x, y, 50, 30);
            var circle = Matter.Bodies.circle(x, y-100, r, {
                inertia: Infinity,
                restitution: 1,
                friction: 0,
                frictionAir: 0.0001,
                slop: 1
            });
            Matter.Composite.addBody(container, cart);
            Matter.Composite.addBody(container, circle);
            Composites.chain(container);
            return container;
        };


        var balancer = balancer(500,sceneH-50,30,0);
        World.add(world, balancer);*/


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