class GameArea{
    objects = [];

    constructor(width,height) {
        this.width = width;
        this.height = height;
        let canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        this.ctx = canvas.getContext("2d");
        this.objects = [];
    }

    clear(){
        this.ctx.strokeStyle = "#eee";
        this.ctx.fillRect(0,0,this.width,this.height);
        this.ctx.strokeStyle = "#000";
    }

    add(o){
        this.objects.push(o);
    }

    start(){
        setInterval(this.draw, 500);
    }

    draw(){
        this.objects.forEach(function (e) {
            e.draw();
        });
    }
}
