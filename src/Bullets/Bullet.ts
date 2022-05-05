import { Camera } from "@/Camera"
import { GameMap } from '@/GameMap';

export class Bullet  {
    X:number
    Y:number
    SPEED:number
    ANGLE:number
    RADIUS:number
    DAMAGE:number

    constructor(x:number,y:number,speed:number,angle:number,radius:number,damage:number) {
        this.X = x
        this.Y = y
        this.ANGLE = angle
        this.SPEED = speed
        this.RADIUS = radius
        this.DAMAGE = damage
    }

    move() {
        this.X =  this.X + this.SPEED * Math.cos(this.ANGLE)
        this.Y = this.Y + this.SPEED * Math.sin(this.ANGLE)
    }

    draw(ctx:CanvasRenderingContext2D,camera:Camera) {
        const [x,y] = camera.getCords(this.X,this.Y)

        ctx.beginPath() 
        ctx.arc(x,
            y, 
            this.RADIUS,0,Math.PI * 2,false)
      
        ctx.fillStyle = "rgb(199, 209, 7)"
        ctx.fill()
    }


    collisionWall(gameMap:GameMap) {
        return gameMap.isCollisionWall(
            this.X + this.SPEED * Math.cos(this.ANGLE),
            this.Y + this.SPEED * Math.sin(this.ANGLE)
        )
    }
}