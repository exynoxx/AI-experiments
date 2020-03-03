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

            let bottom = this.y - this.r < otherbottom;
            let top = this.y + this.r > othertop;

            let left = this.x > otherleft;
            let right = this.x < otherright;


            //console.log(below+" "+over+" "+left+" "+right);

            if (left && right && bottom && top) {
                if (otherobj.type == 0) {
                    let half = otherobj.width / 2;
                    let a = this.x - (otherobj.x + half);
                    let b = a / half;
                    let angle = (-b * 2 * Math.PI / 5) + (Math.PI / 2);
                    this.dx = this.v * Math.cos(angle);
                    this.dy = -this.v * Math.sin(angle);
                    this.score += 1;
                } else {
                    this.dx = -this.dx;
                    this.dy = -this.dy;
                }
            }
        }
        this.x += this.dx;
        this.y += this.dy;
    }
}