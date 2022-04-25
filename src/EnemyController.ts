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
}