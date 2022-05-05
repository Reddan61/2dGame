import { Bullet } from './Bullets/Bullet';
import { Camera } from './Camera';
import { Enemy } from './Enemy';
import { GameMap } from './GameMap';
import { Player } from './Player';



export class EnemyController {
    static EnemyArray: Enemy[] = []


    static draw(ctx: CanvasRenderingContext2D, camera:Camera) {
        for(let i = 0; i < EnemyController.EnemyArray.length; i++) {
            EnemyController.EnemyArray[i].draw(ctx,camera)
        }
    }
    static findPath(canMoveMap:([number,number]|null)[][],player:Player,gameMap:GameMap,ctx:CanvasRenderingContext2D,camera:Camera) {
        for(let i = 0; i < EnemyController.EnemyArray.length; i++) {
            EnemyController.EnemyArray[i].findPath(canMoveMap,player,gameMap,ctx,camera)
        }
    }

    static enemyAttack(player:Player) {
        EnemyController.EnemyArray.forEach(el => {
            const distToPlayer = Math.sqrt((player.X - el.X)**2 + (player.Y - el.Y)**2)

            if(distToPlayer <= player.RADIUS + el.RADIUS*2) {
                el.attack(player)
            }
        })
    }

    static collisionEnemy(x:number,y:number,newX:number,newY:number,radius:number):boolean {
        let bool = false

        for(let i = 0; i < EnemyController.EnemyArray.length; i++) {
            if(EnemyController.EnemyArray[i].X === x && EnemyController.EnemyArray[i].Y === y)
                continue
            
            const enemy = EnemyController.EnemyArray[i]

            if(
                newX - radius < enemy.X + enemy.RADIUS  && newX + radius  > enemy.X - enemy.RADIUS &&
                newY - radius < enemy.Y + enemy.RADIUS && newY + radius > enemy.Y - enemy.RADIUS
                
            ) {
                bool = true
                if(bool) {
                    break
                }
            }
        }
        
        return bool
    }

    static bulletCollisionEnemy(newX:number,newY:number,radius:number,bullet:Bullet):boolean {
        let bool = false

        for(let i = 0; i < EnemyController.EnemyArray.length; i++) {
            const enemy = EnemyController.EnemyArray[i]

            if(
                newX - radius < enemy.X + enemy.RADIUS  && newX + radius  > enemy.X - enemy.RADIUS &&
                newY - radius < enemy.Y + enemy.RADIUS && newY + radius > enemy.Y - enemy.RADIUS
                
            ) {
                bool = true
                if(EnemyController.EnemyArray[i].isDead(bullet.DAMAGE)) 
                    EnemyController.EnemyArray.splice(i,1)
                if(bool) {
                    break
                }
            }
        }
        
        return bool
    }

    static collisionEnemyWithPlayer(x:number,y:number,newX:number,newY:number,radius:number,player:Player):boolean {
        let bool = false

        for(let i = 0; i < EnemyController.EnemyArray.length; i++) {
            if(EnemyController.EnemyArray[i].X === x && EnemyController.EnemyArray[i].Y === y)
                continue
            
            const enemy = EnemyController.EnemyArray[i]

            if(
                newX - radius < enemy.X + enemy.RADIUS  && newX + radius  > enemy.X - enemy.RADIUS &&
                newY - radius < enemy.Y + enemy.RADIUS && newY + radius > enemy.Y - enemy.RADIUS
                
            ) {
                bool = true
                if(bool) {
                    break
                }
            }
        }
        if(
            newX - radius < player.X + player.RADIUS  && newX + radius  > player.X - player.RADIUS &&
            newY - radius < player.Y + player.RADIUS && newY + radius > player.Y - player.RADIUS
            
        ) {
            bool = true
        }
        return bool
    }

    static getPositionOtherEnemys(enemy:Enemy) {
        const positions = [] as string[]
        for(let i = 0; i < EnemyController.EnemyArray.length; i++) {
            if(enemy.X === EnemyController.EnemyArray[i].X && enemy.Y === EnemyController.EnemyArray[i].Y) {
                continue
            }
            
            positions.push(`${Math.floor(EnemyController.EnemyArray[i].X / 100)},${Math.floor(EnemyController.EnemyArray[i].Y / 100)}`)
        }

        return positions
    }
}