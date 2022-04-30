import { ICamera } from './Camera';
import { IEnemy } from './Enemy';
import { IGameMap } from './GameMap';
import { IPlayer } from './Player';



export class EnemyController {
    static EnemyArray: IEnemy[] = []


    static draw(ctx: CanvasRenderingContext2D, camera:ICamera) {
        for(let i = 0; i < this.EnemyArray.length; i++) {
            this.EnemyArray[i].draw(ctx,camera)
        }
    }
    static findPath(canMoveMap:([number,number]|null)[][],player:IPlayer,gameMap:IGameMap,ctx:CanvasRenderingContext2D,camera:ICamera) {
        for(let i = 0; i < this.EnemyArray.length; i++) {
            this.EnemyArray[i].findPath(canMoveMap,player,gameMap,ctx,camera)
        }
    }
    static canIMove(x:number,y:number,newX:number,newY:number,radius:number):boolean {
        let bool = true

        for(let i = 0; i < this.EnemyArray.length; i++) {
            if(this.EnemyArray[i].X === x && this.EnemyArray[i].Y === y)
                continue
            
            const enemy = this.EnemyArray[i]

            if(
                newX - radius < enemy.X + enemy.RADIUS  && newX + radius  > enemy.X - enemy.RADIUS &&
                newY - radius < enemy.Y + enemy.RADIUS && newY + radius > enemy.Y - enemy.RADIUS
                
            ) {
                bool = false
                if(!bool) {
                    break
                }
            }
        }
        
        return bool
    }
    static canIMoveWithPlayer(x:number,y:number,newX:number,newY:number,radius:number,player:IPlayer):boolean {
        let bool = true

        for(let i = 0; i < this.EnemyArray.length; i++) {
            if(this.EnemyArray[i].X === x && this.EnemyArray[i].Y === y)
                continue
            
            const enemy = this.EnemyArray[i]

            if(
                newX - radius < enemy.X + enemy.RADIUS  && newX + radius  > enemy.X - enemy.RADIUS &&
                newY - radius < enemy.Y + enemy.RADIUS && newY + radius > enemy.Y - enemy.RADIUS
                
            ) {
                bool = false
                if(!bool) {
                    break
                }
            }
        }
        if(
            newX - radius < player.X + player.RADIUS  && newX + radius  > player.X - player.RADIUS &&
            newY - radius < player.Y + player.RADIUS && newY + radius > player.Y - player.RADIUS
            
        ) {
            bool = false
        }
        return bool
    }

    static getPositionOtherEnemys(enemy:IEnemy) {
        const positions = [] as string[]
        for(let i = 0; i < this.EnemyArray.length; i++) {
            if(enemy.X === this.EnemyArray[i].X && enemy.Y === this.EnemyArray[i].Y) {
                continue
            }
            
            positions.push(`${Math.floor(this.EnemyArray[i].X / 100)},${Math.floor(this.EnemyArray[i].Y / 100)}`)
        }

        return positions
    }
}