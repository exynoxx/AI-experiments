function box(myGameArea,width, height, color, x, y) {
    this.type = 2;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.ddraw = function () {
        let ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    };
    this.update = function () {
        return
    }
}