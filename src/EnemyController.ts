import { IGlobalKeys } from './ConfigKeys';
import { SpawnPoint } from './SpawnPoint';
import { Bullet } from './Bullets/Bullet';
import { Camera } from './Camera';
import { Enemy } from './Enemy';
import { GameMap } from './GameMap';
import { Player } from './Player';
import { configType } from './Config';



export class EnemyController {
    static EnemyArray: Enemy[] = []
    private static EnemySpawnPoints = [] as SpawnPoint[]


    static draw(ctx: CanvasRenderingContext2D, camera:Camera,map:GameMap) {
        for(let i = 0; i < EnemyController.EnemyArray.length; i++) {
            EnemyController.EnemyArray[i].draw(ctx,camera)
        }
        for(let i = 0; i < EnemyController.EnemySpawnPoints.length; i++) {
            EnemyController.EnemySpawnPoints[i].draw(ctx,camera)
        }
    }

    static checkTrigger(player:Player,map:GameMap,config:configType) {
        const xPlayer = Math.floor(player.X / map.TILESIZE)
        const yPlayer = Math.floor(player.Y / map.TILESIZE)

        const triggerX = config.triggerEnemyTilesX
        const triggerY = config.triggerEnemyTilesY

        for(let i = 0; i < EnemyController.EnemyArray.length; i++) {
            const xEnemy= Math.floor(EnemyController.EnemyArray[i].X / map.TILESIZE)
            const yEnemy = Math.floor(EnemyController.EnemyArray[i].Y / map.TILESIZE)

            const distToPlayer = Math.sqrt((xEnemy - xPlayer)**2 + (yEnemy - yPlayer)**2)
    
            if(
                distToPlayer <= triggerX || distToPlayer <= triggerY) {
                
                EnemyController.EnemyArray[i].triggered = true
            }
        }

    }

    static spawnEnemyInSpawnPoint(map:GameMap) {
        for(let i = 0; i < EnemyController.EnemySpawnPoints.length; i++) {
            const spawn = EnemyController.EnemySpawnPoints[i]
            let bool = true
            for(let j = 0; j < EnemyController.EnemyArray.length; j++) {
                const enemy = EnemyController.EnemyArray[j]

                if(
                    spawn.checkCollision(enemy.X,enemy.Y,enemy.RADIUS,map)) 
                {
                    bool = false
                    break
                }
            }

            if(bool) {
                const newEnemy = spawn.spawn()
                if(newEnemy)
                    EnemyController.EnemyArray.push(newEnemy)
            }
        }
    }

    static spawnSingleEnemy(
        x:number,y:number,radius:number,color:string,speed:number,
        damage:number,health = 100
    ) {
        EnemyController.EnemyArray.push(new Enemy(x,y,radius,color,speed,damage,health))
    }

    static setSpawnPoints(points:  SpawnPoint[]) {
        EnemyController.EnemySpawnPoints = [...points]
    }

    static findPath(player:Player,gameMap:GameMap,ctx:CanvasRenderingContext2D,camera:Camera,keysConfig:IGlobalKeys) {
        for(let i = 0; i < EnemyController.EnemyArray.length; i++) {
            EnemyController.EnemyArray[i].findPath(player,gameMap,ctx,camera,keysConfig)
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

    static bulletCollisionEnemy(newX:number,newY:number,radius:number,bullet:Bullet,gameMap:GameMap,player:Player):boolean {
        let bool = false

        for(let i = 0; i < EnemyController.EnemyArray.length; i++) {
            const enemy = EnemyController.EnemyArray[i]

            if(
                newX - radius < enemy.X + enemy.RADIUS  && newX + radius  > enemy.X - enemy.RADIUS &&
                newY - radius < enemy.Y + enemy.RADIUS && newY + radius > enemy.Y - enemy.RADIUS
                
            ) {
                bool = true
                if(EnemyController.EnemyArray[i].isDead(bullet.DAMAGE))  {
                    EnemyController.EnemyArray[i].whenDead(player,gameMap)
                    EnemyController.EnemyArray.splice(i,1)
                }
                if(bool) {
                    break
                }
            }
        }
        
        return bool
    }


    static getPositionOtherEnemies(enemy:Enemy) {
        const positions = [] as string[]
        for(let i = 0; i < EnemyController.EnemyArray.length; i++) {
            if(enemy.X === EnemyController.EnemyArray[i].X && enemy.Y === EnemyController.EnemyArray[i].Y) {
                continue
            }
            
            positions.push(`${Math.floor(EnemyController.EnemyArray[i].X / 100)},${Math.floor(EnemyController.EnemyArray[i].Y / 100)}`)
        }

        return positions
    }

    static getPositionEnemies() {
        const positions = [] as string[]
        for(let i = 0; i < EnemyController.EnemyArray.length; i++) {
            positions.push(`${Math.floor(EnemyController.EnemyArray[i].X / 100)},${Math.floor(EnemyController.EnemyArray[i].Y / 100)}`)
        }

        return positions
    }
}