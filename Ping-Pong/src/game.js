var gameObjects = [];
var balls = [];
var plates = [];

let config = {
    model: [
        {nodeCount: 3, type: "input"},
        {nodeCount: 2, type: "output", activationfunc: activation.SOFTMAX}
    ],
    mutationRate: 0.1,
    crossoverMethod: crossover.RANDOM,
    mutationMethod: mutate.RANDOM,
    populationSize: 100
};


var left = false;
var right = false;

document.onkeydown = function(e) {
    if(e.keyCode === 37) left = true;
    if(e.keyCode === 39) right = true;
};
document.onkeyup = function(e) {
    if(e.keyCode == 37) left = false;
    if(e.keyCode == 39) right = false;
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

function startGame() {
    neat = new NEAT(config);
    for (let i = 0; i < 100; i++) {
        let ran = Math.round(Math.random() * 500);

        let p = new plate(100,5,"#000",ran,670);
        let b = new ball(10,10,"#0F0",ran,ran);
        plates.push(p);
        balls.push(b);
        b.crashAble.push(p);
        gameObjects.push(p);
        gameObjects.push(b);
    }
    myGameArea.initGame();
    runIteration();
}

function runIteration() {
    setInterval(updateGameArea, 10);
    setInterval(function () {
        for (let i = 0; i < balls.length; i++) {
            if (!balls[i].alive){

            }
        }
    },500);
}

function ball(width, height, color, x, y) {
    this.type = 1;
    this.alive = true;
    this.score = 0;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.dx = 5;
    this.dy = 5;
    this.r = 10;
    this.crashAble = [];
    this.ddraw = function () {
        let ctx = myGameArea.context;
        ctx.fillStyle = color;
        //ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();
    }
    this.update = function () {

        //let dx = parseInt(this.velocity * Math.cos(this.angle));
        //let dy = parseInt(this.velocity * Math.sin(this.angle));
        if(this.x < 0 || this.x > myGameArea.canvas.width) this.dx = -this.dx;
        if(this.y < 0) this.dy = -this.dy;
        if(this.y > myGameArea.canvas.height) {
            this.alive=false;
            this.dy = 0;
            this.dx = 0;
            this.crashAble[0].y = myGameArea.canvas.height-2;
        }

        /*
        for (let i = 0; i < gameObjects.length; i++) {
            if (gameObjects[i].type === 1) continue;
            let otherobj = gameObjects[i];
            var otherleft = otherobj.x;
            var otherright = otherobj.x + (otherobj.width);
            var othertop = otherobj.y;
            var otherbottom = otherobj.y + (otherobj.height);
            if((this.y > othertop-this.r) && (this.y < otherbottom+ this.r)&&(this.x > otherleft-this.r) && (this.x < otherright+this.r)) this.dy = -this.dy;
        }

         */
        for (let i = 0; i < this.crashAble.length; i++) {
            let otherobj = this.crashAble[i];
            var otherleft = otherobj.x;
            var otherright = otherobj.x + (otherobj.width);
            var othertop = otherobj.y;
            var otherbottom = otherobj.y + (otherobj.height);

            let below = this.y > othertop - this.r;
            let over = this.y < otherbottom + this.r;
            let left = this.x > otherleft;
            let right = this.x < otherright;


            //console.log(below+" "+over+" "+left+" "+right);

            if(below && over&&left && right) {
                this.dy = -this.dy;
                this.score+=1;
            }
        }
        this.x += this.dx;
        this.y += this.dy;
    }
}

function plate(width, height, color, x, y) {
    this.type = 0;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.left = false;
    this.right = true;
    this.ddraw = function () {
        let ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    };
    this.update = function () {
        /*
        if(left && this.x > 0) {
            this.x -= 10;
        }
        if(right && this.x < myGameArea.canvas.width-this.width){
            this.x += 10;
        }
        if(this.x < 0) this.x = 0;
        if(this.x > myGameArea.canvas.width) this.x = myGameArea.canvas.width-this.width;

         */

        if(this.left){
            this.x -= 20;
            this.left = false;
        }

        if (this.right){
            this.x += 20;
            this.right = false;
        }

        if(this.x < 0) this.x = 0;
        if(this.x > myGameArea.canvas.width) this.x = myGameArea.canvas.width-this.width;
    }
}

function updateGameArea() {

    //draw
    myGameArea.clear();
    myGameArea.frameNo += 1;
    for (var i = 0; i < gameObjects.length; i += 1) {
        gameObjects[i].update();
        gameObjects[i].ddraw();
    }

    //neural information to the NN
    for (let i = 0; i < 100; i++) {
        let inn=[plates[i].x,   balls[i].x,  plates[i].x-balls[i].x];
        neat.setInputs(inn, i);
    }

    //eval
    neat.feedForward();

    //results
    let desicions = neat.getDesicions();
    for (let i = 0; i < 100; i++) {
        if (desicions[i] === 0) {
            plates[i].left = true;
        } else {
            plates[i].right = true;
        }
    }
    let finish = balls.every(x=>!x.alive);
    if (finish) {
        for (let i = 0; i < 100; i++) {
            neat.setFitness(balls[i].score, i);
            let ran = Math.round(Math.random() * 500);
            balls[i] = new ball(10,10,"#0F0",ran,ran);
        }
        neat.doGen();
    }




}