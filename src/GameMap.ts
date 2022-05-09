import { SpawnPoint } from './SpawnPoint';
import { Camera } from './Camera';
import { Player } from "@/Player"
import { Enemy } from './Enemy';
import { EnemyController } from './EnemyController';

export class GameMap {
    TILESIZE:number
    mapW = 10
    mapH = 10
    //1-wall
    //2-player
    //3-enemy spawn point
    text_map = [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,3,1],
        [1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,1,1,1,0,0,1,1,1],
        [1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,1,1,1,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,1],
        [1,0,0,0,3,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,3,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    ]

    wall_map = [] as ([number,number] | null)[][]
    empty_tile = [] as ([number,number]|null)[][]

    graph = {} as {
        [XandY:string]:[string,number][]
    }

    constructor(TILESIZE:number) {
        this.TILESIZE = TILESIZE
    }

    convertTextMapToWorldMap(player:Player) {
        const startCords = [0,0]
        const spawns = [] as SpawnPoint[]

        for(let y = 0; y < this.text_map.length; y++) {
            this.wall_map[y] = []
            this.empty_tile[y] = []
            for(let x = 0; x < this.text_map[y].length; x++) {
                if(this.text_map[y][x] !== 1) {
                    this.empty_tile[y].push([startCords[0],startCords[1]])
                    this.wall_map[y].push(null)
                }
                if(this.text_map[y][x] === 1) {
                    this.wall_map[y].push([startCords[0],startCords[1]])
                    this.empty_tile[y].push(null)
                }
                if(this.text_map[y][x] === 2) {
                    player.setPosition(startCords[0] + this.TILESIZE / 2,startCords[1] + this.TILESIZE / 2)
                }
                if(this.text_map[y][x] === 3) {
                    spawns.push(
                        new SpawnPoint(startCords[0],startCords[1],this.TILESIZE,"rgba(227, 85, 71,0.3)")
                    )
                }
                startCords[0] += this.TILESIZE
            }
            startCords[1] += this.TILESIZE 
            startCords[0] = 0 
        }
        for(let y = 0; y < this.empty_tile.length; y++) {
            for(let x = 0; x < this.empty_tile[y].length; x++) {
                if(!this.empty_tile[y][x])
                    continue
                const arr = [] as [string,number][]
                const cost = 1
                if(this.empty_tile[y][x + 1]) {
                    arr.push([`${x+1},${y}`,cost])
                }
                if(x - 1 > 0 && this.empty_tile[y][x - 1]) {
                    arr.push([`${x-1},${y}`,cost])
                }
                if(this.empty_tile[y + 1][x]) {
                    arr.push([`${x},${y+1}`,cost])
                }
                if(y - 1 > 0 && this.empty_tile[y - 1][x]) {
                    arr.push([`${x},${y-1}`,cost])
                }
                if(y - 1 > 0 && this.empty_tile[y - 1][x + 1] && this.empty_tile[y - 1][x] && this.empty_tile[y][x+1] ) {
                    arr.push([`${x+1},${y-1}`,cost])
                }
                if(y - 1 > 0 && x - 1 > 0 && this.empty_tile[y - 1][x - 1] && this.empty_tile[y - 1][x] && this.empty_tile[y][x-1] ) {
                    arr.push([`${x-1},${y-1}`,cost])
                }
                if(this.empty_tile[y + 1][x + 1] && this.empty_tile[y + 1][x] && this.empty_tile[y][x+1] ) {
                    arr.push([`${x+1},${y+1}`,cost])
                }
                if(x - 1 > 0 && this.empty_tile[y + 1][x - 1] && this.empty_tile[y + 1][x] && this.empty_tile[y][x-1] ) {
                    arr.push([`${x-1},${y+1}`,cost])
                }
                this.graph[`${x},${y}`] = arr
            }
        }

        EnemyController.setSpawnPoints(spawns)
        console.log(this.wall_map)
        console.log(this.empty_tile)
        console.log(this.graph)
    }

    renderMap(ctx:CanvasRenderingContext2D,camera:Camera) {
        for(let y = 0; y < this.wall_map.length; y++) {
            if(!this.wall_map[y])
                continue
            for(let x = 0; x < this.wall_map[y].length; x++) {
                if(!this.wall_map[y][x])
                    continue
                ctx.beginPath()
                ctx.fillStyle = "#999999"
                ctx.fillRect(this.wall_map[y][x]![0] - (camera.X - camera.CAMERAWIDTH/2),
                    this.wall_map[y][x]![1] -  (camera.Y - camera.CAMERAHEIGHT/2),
                    this.TILESIZE,this.TILESIZE)
                ctx.fill()
                ctx.closePath()
            }
        }
    }

    
    returnNewSpeed(x:number,y:number,newX:number,newY:number, movingObjectColisionSize:number)  {
        const leftTopX = newX - movingObjectColisionSize
        const leftTopY = newY - movingObjectColisionSize
      
        const speedX = newX - x
        const speedY = newY - y

        let newSpeed = speedX || speedY

        
        for(let j = 0; j < this.wall_map.length; j++) {
            if(!this.wall_map[j])
                continue
            for(let i = 0; i < this.wall_map[j].length; i++) {
                if(!this.wall_map[j][i])
                    continue
                const wall = this.wall_map[j][i]!
                if(
                    leftTopX < wall[0] + this.TILESIZE  && leftTopX + (movingObjectColisionSize*2)  > wall[0] &&
		            leftTopY < wall[1] + this.TILESIZE && leftTopY + (movingObjectColisionSize*2) > wall[1]
                ) {
                    //wall on the left
                    if(wall[0] < leftTopX && speedX) {
                        newSpeed = (wall[0] + this.TILESIZE) - leftTopX + speedX
                    }
                    //wall on the right
                    if(wall[0] > leftTopX && speedX) {
                        newSpeed = wall[0] - (leftTopX + movingObjectColisionSize*2) + speedX
                    }
                    //wall from above
                    if(wall[1] < leftTopY && speedY) {
                        newSpeed = (wall[1] + this.TILESIZE) - leftTopY + speedY
                    }
                    //wall from below
                    if(wall[1] > leftTopY && speedY) {
                        newSpeed = wall[1] - (leftTopY + movingObjectColisionSize*2) + speedY
                    }
                   
                }
            }
        }
        
        return newSpeed
    }

    isCollisionWall(newX:number,newY:number)  {
        if(this.wall_map[Math.floor(newY / this.TILESIZE)]
            &&
            this.wall_map[Math.floor(newY / this.TILESIZE)][Math.floor(newX / this.TILESIZE)]
        )
        {
            return true
        }
        
        return false
    }
}