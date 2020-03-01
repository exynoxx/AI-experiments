var gameObjects = [];

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
    start: function () {
        this.canvas.width = 1000;
        this.canvas.height = 700;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 10);
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
};

function startGame() {
    gameObjects.push(new ball(10,10,"#F00",50,50));
    gameObjects.push(new plate(100,5,"#000",500,670));
    myGameArea.start();
}


function ball(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.dx = 3;
    this.dy = 3;
    this.crashAble = [];
    this.ddraw = function () {
        let ctx = myGameArea.context;
        ctx.fillStyle = color;
        //ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.beginPath();
        ctx.arc(this.x, this.y, 10, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();
    }
    this.update = function () {

        //let dx = parseInt(this.velocity * Math.cos(this.angle));
        //let dy = parseInt(this.velocity * Math.sin(this.angle));
        if(this.x < 0 || this.x > myGameArea.canvas.width) this.dx = -this.dx;
        if(this.y < 0 || this.y > myGameArea.canvas.height) this.dy = -this.dy;
        this.x += this.dx;
        this.y += this.dy;
    }
    this.crashWith = function (otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

function plate(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.ddraw = function () {
        let ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    this.update = function () {
        if(left && this.x > 0) {
            this.x -= 10;
        }
        if(right && this.x < myGameArea.canvas.width-this.width){
            this.x += 10;
        }
        if(this.x < 0) this.x = 0;
        if(this.x > myGameArea.canvas.width) this.x = myGameArea.canvas.width-this.width;
    }
}

function updateGameArea() {

    /*
    for (i = 0; i < gameObjects.length; i += 1) {
        if (myGamePiece.crashWith(gameObjects[i])) {
            return;
        }
    }
    */
    myGameArea.clear();
    myGameArea.frameNo += 1;
    /*
    if (myGameArea.frameNo == 1 || everyinterval(150)) {
        x = myGameArea.canvas.width;
        minHeight = 20;
        maxHeight = 200;
        height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
        minGap = 50;
        maxGap = 200;
        gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
        gameObjects.push(new component(10, height, "green", x, 0));
        gameObjects.push(new component(10, x - height - gap, "green", x, height + gap));
    }

     */
    for (var i = 0; i < gameObjects.length; i += 1) {
        gameObjects[i].update();
        gameObjects[i].ddraw();
    }
}