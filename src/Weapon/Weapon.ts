import { BulletsController } from '@/Bullets/BulletsController';
import { Camera } from '@/Camera';
import { Player } from '@/Player';

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

    shoot(player:Player) {
        const xPlayer = player.X
        const yPlayer = player.Y
        const angle = player.ANGLE
        const newGunSize = player.RADIUS + this.gunSize
 
        const now = performance.now() / 1000
        if(this.attackSpeed +  this.lastAtack <= now) {
            BulletsController.createNewBullet(
                xPlayer + newGunSize * Math.cos(angle),
                yPlayer + newGunSize * Math.sin(angle),
                this.bulletSpeed, player.ANGLE, this.bulletRadius,this.bulletDamage
            )
            this.lastAtack = now
        }
       
    }

    draw(ctx:CanvasRenderingContext2D,x:number,y:number,playerSize:number,angle:number, camera:Camera) {
        const newGunSize = camera.getSize(this.gunSize)
        
        ctx.beginPath()
        ctx.strokeStyle = "black"
        ctx.lineWidth = camera.getSize(8)
        ctx.moveTo(x + playerSize*Math.cos(angle),y + playerSize * Math.sin(angle))
        ctx.lineTo(
            (x + playerSize*Math.cos(angle)) + newGunSize * Math.cos(angle),
            (y + playerSize * Math.sin(angle)) + newGunSize * Math.sin(angle)
        )
        ctx.closePath()
        ctx.stroke()
    }
}