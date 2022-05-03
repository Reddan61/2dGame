import { EnemyController } from '@/EnemyController'
import { Bullet, IBullet } from './Bullet'

export class BulletsController {
    static bullets = [] as IBullet[]
    
    static createNewBullet(x:number,y:number,speed:number,angle:number,radius:number) {
        BulletsController.bullets.push(new Bullet(x,y,speed,angle,radius))
    }

    static drawBullets() {
        BulletsController.bullets.forEach(el => {
            el.draw()
        })
    }

    static moveBullets() {
        BulletsController.bullets.forEach((el, index) => {
            el.move()
            if(EnemyController.bulletCollisionEnemy(el.X,el.Y,el.RADIUS))
            {
                BulletsController.bullets.splice(index,1)
                return
            }
            if(el.collisionWall()) {
                BulletsController.bullets.splice(index,1)
                return
            }
        })
    }
}