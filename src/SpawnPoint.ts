import { Enemy } from './Enemy';
import { GameMap } from '@/GameMap';
import { Camera } from "./Camera"

export class SpawnPoint {
    X:number
    Y:number
    SIZE:number
    COLOR:string
    ENEMYNUMBER:number

    constructor(x:number,y:number,size:number,color:string, enemyNumber:number) {
        this.X = x
        this.Y = y
        this.SIZE = size
        this.COLOR = color
        this.ENEMYNUMBER = enemyNumber
    }

    draw(ctx:CanvasRenderingContext2D,camera:Camera) {
        const [x,y] = camera.getCords(this.X,this.Y)
        const size = camera.getSize(this.SIZE)

        ctx.beginPath()
        ctx.fillStyle = this.COLOR
        ctx.fillRect(x,
            y,
            size,size)
        ctx.fill()
        ctx.closePath()
    }

    checkCollision(x:number,y:number,radius:number,map:GameMap) {
        const leftTopX = x - radius
        const leftTopY = y - radius

        if(
            leftTopX < this.X + map.TILESIZE  && leftTopX + (radius*2)  > this.X &&
            leftTopY < this.Y + map.TILESIZE && leftTopY + (radius*2) > this.Y
        ) 
        {
            return true
        }
    }

    spawn() {
        if(this.ENEMYNUMBER > 0) {
            this.ENEMYNUMBER--
            return  new Enemy(this.X + this.SIZE / 2,this.Y + this.SIZE / 2,30,"red",4,15,200)
        }
        return null
    }
} 