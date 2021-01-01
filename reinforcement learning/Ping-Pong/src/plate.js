function plate(myGameArea, width, height, color, x, y) {
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
        if (this.left) {
            this.x -= 20;
            this.left = false;
        }

        if (this.right) {
            this.x += 20;
            this.right = false;
        }

        if (this.x < 0) this.x = 0;
        if (this.x > myGameArea.canvas.width) this.x = myGameArea.canvas.width - this.width;
    }
    this.crash = function (ball) {
        var otherleft = this.x;
        var otherright = this.x + (this.width);
        var othertop = this.y;
        var otherbottom = this.y + (this.height);

        let bottom = ball.y - ball.r < otherbottom;
        let top = ball.y + ball.r > othertop;

        let left = ball.x > otherleft;
        let right = ball.x < otherright;

        if (left && right && bottom && top) {
            let half = this.width / 2;
            let a = ball.x - (this.x + half);
            let b = a / half;
            let angle = (-b * 2 * Math.PI / 5) + (Math.PI / 2);
            ball.dx = ball.v * Math.cos(angle);
            ball.dy = -ball.v * Math.sin(angle);
            ball.score += 1;
        }

    }
}