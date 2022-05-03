import { camera, ctx, map } from "@/worldObjects"

export interface IBullet {
    X:number
    Y:number
    SPEED:number
    ANGLE:number
    RADIUS:number

    move:() => void
    draw: () => void
    collisionWall: () => boolean
}

export class Bullet implements IBullet {
    X:number
    Y:number
    SPEED:number
    ANGLE:number
    RADIUS:number

    constructor(x:number,y:number,speed:number,angle:number,radius:number) {
        this.X = x
        this.Y = y
        this.ANGLE = angle
        this.SPEED = speed
        this.RADIUS = radius
    }

    move() {
        this.X =  this.X + this.SPEED * Math.cos(this.ANGLE)
        this.Y = this.Y + this.SPEED * Math.sin(this.ANGLE)
    }

    draw() {
        if(!ctx)
            return
        
        const [x,y] = camera.getCords(this.X,this.Y)

        ctx.beginPath() 
        ctx.arc(x,
            y, 
            this.RADIUS,0,Math.PI * 2,false)
      
        ctx.fillStyle = "rgb(199, 209, 7)"
        ctx.fill()
    }


    collisionWall() {
        return map.isCollisionWall(
            this.X + this.SPEED * Math.cos(this.ANGLE),
            this.Y + this.SPEED * Math.sin(this.ANGLE)
        )
    }
}