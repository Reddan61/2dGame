import { BulletsController } from '@/Bullets/BulletsController';

export class Weapon {
    gunSize: number
    bulletSpeed:number
    bulletRadius: number
    bulletDamage: number
    attackSpeed: number
    private lastAtack = 0

    constructor(speed:number,gunSize:number,bulletRadius:number,bulletDamage:number,attackSpeed:number) {
        this.gunSize = gunSize
        this.bulletSpeed = speed
        this.bulletRadius = bulletRadius
        this.bulletDamage = bulletDamage
        this.attackSpeed = attackSpeed
    }

    shoot(xPlayer:number,yPlayer:number,angle:number) {
        const now = performance.now() / 1000
        if(this.attackSpeed +  this.lastAtack <= now) {
            BulletsController.createNewBullet(
                xPlayer + this.gunSize * Math.cos(angle),
                yPlayer + this.gunSize * Math.sin(angle),
                this.bulletSpeed, angle, this.bulletRadius,this.bulletDamage
            )
            this.lastAtack = now
        }
       
    }

    draw(ctx:CanvasRenderingContext2D,x:number,y:number,playerSize:number,angle:number) {
        ctx.beginPath()
        ctx.strokeStyle = "black"
        ctx.lineWidth = 8
        ctx.moveTo(x + playerSize*Math.cos(angle),y + playerSize * Math.sin(angle))
        ctx.lineTo(
            (x + playerSize*Math.cos(angle)) + this.gunSize * Math.cos(angle),
            (y + playerSize * Math.sin(angle)) + this.gunSize * Math.sin(angle)
        )
        ctx.closePath()
        ctx.stroke()
    }
}