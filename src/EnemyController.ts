import { ICamera } from './Camera';
import { IEnemy } from './Enemy';
import { IGameMap } from './GameMap';
import { IPlayer } from './Player';

export interface IEnemyController {
    EnemyArray: IEnemy[]

    draw: (ctx:CanvasRenderingContext2D, camera:ICamera) => void
    findPath: (canMoveMap:([number,number]|null)[][],player:IPlayer,gameMap:IGameMap,ctx:CanvasRenderingContext2D,camera:ICamera) => void
}

export class EnemyController implements IEnemyController {
    EnemyArray: IEnemy[]

    constructor() {
        this.EnemyArray = []
    }

    draw(ctx: CanvasRenderingContext2D, camera:ICamera) {
        for(let i = 0; i < this.EnemyArray.length; i++) {
            this.EnemyArray[i].draw(ctx,camera)
        }
    }
    findPath(canMoveMap:([number,number]|null)[][],player:IPlayer,gameMap:IGameMap,ctx:CanvasRenderingContext2D,camera:ICamera) {
        for(let i = 0; i < this.EnemyArray.length; i++) {
            this.EnemyArray[i].findPath(canMoveMap,player,gameMap,ctx,camera)
        }
    }
}