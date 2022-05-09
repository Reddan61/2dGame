import { Camera } from "./Camera"

export class SpawnPoint {
    X:number
    Y:number
    SIZE:number
    COLOR:string

    constructor(x:number,y:number,size:number,color:string) {
        this.X = x
        this.Y = y
        this.SIZE = size
        this.COLOR = color
    }

    draw(ctx:CanvasRenderingContext2D,camera:Camera) {
        const [x,y] = camera.getCords(this.X,this.Y)
        ctx.beginPath()
        ctx.fillStyle = this.COLOR
        ctx.fillRect(x,
            y,
            this.SIZE,this.SIZE)
        ctx.fill()
        ctx.closePath()
    }
} 