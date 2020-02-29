class Ball{
    constructor() {
        this.x = 500;
        this.y = 300;
        this.r = 5;
        this.velocity = 2;
        this.angle = Math.PI/2;
    }

    update(){
        this.x = this.velocity*Math.cos(this.angle);
        this.y = this.velocity*Math.sin(this.angle);
    }

    draw(ctx){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        ctx.stroke();
    }


}