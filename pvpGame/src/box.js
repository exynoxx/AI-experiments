function box(myGameArea, width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.count = 0;
    this.alive = true;
    this.breakThreshold = 3;
    this.ddraw = function () {
        if(!this.alive)return;
        let ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    };
    this.update = function () {
        return
    };
    this.crash = function (ball) {
        if (!this.alive) return;
        var otherleft = this.x;
        var otherright = this.x + (this.width);
        var othertop = this.y;
        var otherbottom = this.y + (this.height);

        let bottom = ball.y - ball.r < otherbottom;
        let top = ball.y + ball.r > othertop;

        let left = ball.x > otherleft;
        let right = ball.x < otherright;

        if (left && right && bottom && top) {
            ball.dy = -ball.dy;
            this.count+=1;
            if (this.count >= this.breakThreshold) {
                this.alive = false;
                ball.score+=1;
            }
        }
    }
}