import { ICamera } from './Camera';
import {IPlayer} from "@/Player"

export interface IGameMap {
    TILESIZE:number
    mapW:number
    mapH:number
    text_map: number[][]
    world_map: [number,number][][]

    convertTextMapToWorldMap: (player:IPlayer) => void
    renderMap: (ctx:CanvasRenderingContext2D,camera:ICamera) => void
    canIMove: (x:number,y:number,newX:number,newY:number, movingObjectColisionSize:number) => boolean
}

export class GameMap implements IGameMap {
    TILESIZE:number
    mapW = 10
    mapH = 10
    text_map = [
        [1,1,1,1,1,1,1,1,1,1],
        [1,2,1,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,1,0,1],
        [1,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,1,1],
        [1,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1]
    ]

    world_map = [] as [number,number][][]
    constructor(TILESIZE:number) {
        this.TILESIZE = TILESIZE
    }

    convertTextMapToWorldMap(player:IPlayer) {
        const startCords = [0,0]

        for(let y = 0; y < this.text_map.length; y++) {
            this.world_map[y] = []
            for(let x = 0; x < this.text_map[y].length; x++) {
                if(this.text_map[y][x] === 1) {
                    this.world_map[y].push([startCords[0],startCords[1]])
                }
                if(this.text_map[y][x] === 2) {
                    player.setPosition(startCords[0] + this.TILESIZE / 2,startCords[1] + this.TILESIZE / 2)
                }
                startCords[0] += this.TILESIZE
            }
            startCords[1] += this.TILESIZE 
            startCords[0] = 0 
        }
        console.log(this.world_map)
    }

    renderMap(ctx:CanvasRenderingContext2D,camera:ICamera) {
        for(let y = 0; y < this.world_map.length; y++) {
            for(let x = 0; x < this.world_map[y].length; x++) {
                // if(this.world_map[y][x])
                ctx.beginPath()
                ctx.fillStyle = "#999999"
                ctx.fillRect(this.world_map[y][x][0] - (camera.X - camera.CAMERAWIDTH/2),
                    this.world_map[y][x][1] -  (camera.Y - camera.CAMERAHEIGHT/2),
                    this.TILESIZE,this.TILESIZE)
                ctx.fill()
                ctx.closePath()
            }
        }
    }

    canIMove(x:number,y:number,newX:number,newY:number, movingObjectColisionSize:number)  {
        let canMove = true
        const leftTopX = newX - movingObjectColisionSize
        const leftTopY = newY - movingObjectColisionSize

       // const speed = Math.abs(newX - x) || Math.abs(newY - y)

        const arr =[]
        for(let j = 0; j < this.world_map.length; j++) {
            for(let i = 0; i < this.world_map[j].length; i++) {
                if(
                    leftTopX < this.world_map[j][i][0] + this.TILESIZE  && leftTopX + (movingObjectColisionSize*2)  > this.world_map[j][i][0] &&
		            leftTopY < this.world_map[j][i][1] + this.TILESIZE && leftTopY + (movingObjectColisionSize*2) > this.world_map[j][i][1]
                ) {
                    arr.push(this.world_map[j][i])
                    canMove = false
                }
            }
        }
        
        return canMove
    }

}