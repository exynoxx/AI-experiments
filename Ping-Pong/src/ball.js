function ball(myGameArea, radius, color, x, y) {
    this.type = 1;
    this.alive = true;
    this.score = 0;
    this.x = x;
    this.y = y;
    this.v = 5;
    let angle = Math.random() * Math.PI / 2 + 0.5;
    this.dx = this.v * Math.cos(angle);
    this.dy = this.v * Math.sin(angle);
    this.r = radius;
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
        if (this.x < 0 || this.x > myGameArea.canvas.width) {
            this.dx = -this.dx;
        }
        if (this.y < 0) this.dy = -this.dy;
        if (this.y > myGameArea.canvas.height) {
            this.alive = false;
            this.dy = 0;
            this.dx = 0;
            this.crashAble[0].y = myGameArea.canvas.height - 2;
            this.score /= 2;
        }

        for (let i = 0; i < this.crashAble.length; i++) {
            this.crashAble[i].crash(this);
        }
        this.x += this.dx;
        this.y += this.dy;
    }
}