class Plate {
    constructor() {
        this.width = 50;
        this.height = 5;
        this.y = 10;
        this.x = 50;
    }
    update(){
        console.log("update");
    }

    draw(ctx){
        ctx.fillRect(this.x,this.y,this.width,this.height);
    }
}