function plate(myGameArea,width, height, color, x, y) {
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