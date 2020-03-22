function ball(myGameArea, angle, color, x, y) {
    this.alive = true;
    this.score = 0;
    this.x = x;
    this.y = y;
    this.v = 5;
    this.r = 10;
    this.angle = angle;
    this.dx = parseInt(this.v * Math.cos(angle));
    this.dy = parseInt(this.v * Math.sin(angle));
    this.left = false;
    this.right = false;

    this.ddraw = function () {
        let ctx = myGameArea.context;
        ctx.fillStyle = color;
        //ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();
        ctx.moveTo(x,y);
        ctx.lineTo(this.dx,this.dy);
        ctx.stroke();
    };
    this.update = function () {

        //let dx = parseInt(this.velocity * Math.cos(this.angle));
        //let dy = parseInt(this.velocity * Math.sin(this.angle));

        if(left){
            this.angle += 0.1 % Math.PI*2;
            this.left = false;
        }
        if(right){
            this.angle -= 0.1 % Math.PI*2;
            this.right = false;
        }

        this.dx = parseInt(this.v * Math.cos(this.angle));
        this.dy = parseInt(this.v * Math.sin(this.angle));


        if (this.x < 0 || this.x > myGameArea.canvas.width) this.dx = -this.dx;
        if (this.y < 0 || this.y > myGameArea.canvas.height) this.dx = -this.dx;
        if (this.y < 0) this.dy = -this.dy;


        this.x += this.dx;
        this.y += this.dy;
    }
}