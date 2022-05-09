import { SpawnPoint } from './SpawnPoint';
import { Bullet } from './Bullets/Bullet';
import { Camera } from './Camera';
import { Enemy } from './Enemy';
import { GameMap } from './GameMap';
import { Player } from './Player';



export class EnemyController {
    static EnemyArray: Enemy[] = []
    private static EnemySpawnPoints = [] as SpawnPoint[]
    private static EnemyNumber = 0


    static draw(ctx: CanvasRenderingContext2D, camera:Camera,map:GameMap) {
        for(let i = 0; i < EnemyController.EnemyArray.length; i++) {
            EnemyController.EnemyArray[i].draw(ctx,camera)
        }
        for(let i = 0; i < EnemyController.EnemySpawnPoints.length; i++) {
            EnemyController.EnemySpawnPoints[i].draw(ctx,camera)
        }
    }

    static spawnEnemy(map:GameMap) {
        if(EnemyController.EnemyNumber <= 0) {
            return
        }
        for(let i = 0; i < EnemyController.EnemySpawnPoints.length; i++) {
            const spawn = EnemyController.EnemySpawnPoints[i]
            let bool = true
            for(let j = 0; j < EnemyController.EnemyArray.length; j++) {
                const enemy = EnemyController.EnemyArray[j]
                const leftTopX = enemy.X - enemy.RADIUS
                const leftTopY = enemy.Y - enemy.RADIUS
                if(
                    leftTopX < spawn.X + map.TILESIZE  && leftTopX + (enemy.RADIUS*2)  > spawn.X &&
		            leftTopY < spawn.Y + map.TILESIZE && leftTopY + (enemy.RADIUS*2) > spawn.Y
                ) 
                {
                    bool = false
                    break
                }
            }

            if(bool) {
                EnemyController.EnemyArray.push(new Enemy(spawn.X + spawn.SIZE / 2,spawn.Y + spawn.SIZE / 2,30,"red",3,10))
                if(--EnemyController.EnemyNumber <= 0)
                    break
            }
        }
    }

    static setSpawnPoints(points:  SpawnPoint[]) {
        EnemyController.EnemySpawnPoints = [...points]
    }

    static setNumberEnemy(num:number) {
        EnemyController.EnemyNumber = num
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

    static collisionEnemyForPlayer(x:number,y:number,newX:number,newY:number,radius:number):boolean {
        let bool = false

        for(let i = 0; i < EnemyController.EnemyArray.length; i++) {
            if(EnemyController.EnemyArray[i].X === x && EnemyController.EnemyArray[i].Y === y)
                continue
            
            const enemy = EnemyController.EnemyArray[i]

            if(
                newX - radius < enemy.X + enemy.RADIUS / 2  && newX + radius  > enemy.X - enemy.RADIUS / 2 &&
                newY - radius < enemy.Y + enemy.RADIUS / 2 && newY + radius > enemy.Y - enemy.RADIUS / 2
                
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