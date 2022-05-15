import { Camera } from '@/Camera'
import { EnemyController } from '@/EnemyController'
import { GameMap } from '@/GameMap'
import { Bullet } from './Bullet'

export class BulletsController {
    static bullets = [] as Bullet[]
    
    static createNewBullet(x:number,y:number,speed:number,angle:number,radius:number,damage:number) {
        BulletsController.bullets.push(new Bullet(x,y,speed,angle,radius,damage))
    }

    static drawBullets(ctx:CanvasRenderingContext2D,camera:Camera) {
        BulletsController.bullets.forEach(el => {
            el.draw(ctx,camera)
        })
    }

    static moveBullets(gameMap:GameMap) {
        BulletsController.bullets.forEach((el, index) => {
            el.move()
            if(EnemyController.bulletCollisionEnemy(el.X,el.Y,el.RADIUS,el,gameMap))
            {
                BulletsController.bullets.splice(index,1)
                return
            }
            if(el.collisionWall(gameMap)) {
                BulletsController.bullets.splice(index,1)
                return
            }
        })
    }
}