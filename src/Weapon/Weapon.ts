import { BulletsController } from '@/Bullets/BulletsController';
import { ctx } from '@/worldObjects';

export interface IWeapon {
    gunSize:number
    bulletSpeed:number
    bulletRadius:number

    shoot:(xPlayer:number,yPlayer:number,angle:number) => void
    draw:(x:number,y:number,playerSize:number,angle:number) => void
}


export class Weapon implements IWeapon {
    gunSize: number
    bulletSpeed:number
    bulletRadius: number

    constructor(speed:number,gunSize:number,bulletRadius:number) {
        this.gunSize = gunSize
        this.bulletSpeed = speed
        this.bulletRadius = bulletRadius
    }

    shoot(xPlayer:number,yPlayer:number,angle:number) {
        BulletsController.createNewBullet(
            xPlayer + this.gunSize * Math.cos(angle),
            yPlayer + this.gunSize * Math.sin(angle),
            this.bulletSpeed, angle, this.bulletRadius
        )
    }

    draw(x:number,y:number,playerSize:number,angle:number) {
        if(!ctx)
            return
        
        ctx.beginPath()
        ctx.strokeStyle = "pink"
        ctx.lineWidth = 8
        ctx.moveTo(x + playerSize*Math.cos(angle),y + playerSize * Math.sin(angle))
        ctx.lineTo(
            x + this.gunSize * Math.cos(angle),
            y + this.gunSize * Math.sin(angle)
        )
        ctx.closePath()
        ctx.stroke()
    }
}