import { SpawnPoint } from './SpawnPoint';
import { Camera } from './Camera';
import { Player } from "@/Player"
import { Enemy } from './Enemy';
import { EnemyController } from './EnemyController';

export class GameMap {
    TILESIZE:number
    chunkW = 8
    chunkH = 8
    //1-wall
    //2-player
    //3-enemy spawn point
    text_map = [
        [1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1,],
        [1,2,0,0,0,0,0,1, 1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1,],
        [1,0,0,0,0,0,0,1, 1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1,],
        [1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1,],
        [1,0,0,0,0,0,0,1, 1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,3,1,],
        [1,0,0,0,0,0,0,1, 1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1,],
        [1,0,0,0,0,0,0,1, 1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1,],
        [1,1,1,1,0,1,1,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1,],
        
        [1,1,1,1,0,1,1,0, 0,0,0,0,0,0,0,1, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1,],
        [1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1,],
        [1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1,],
        [1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1,],
        [1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1,],
        [1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1,],
        [1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1,],
        [1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1,],

        [1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1,],
        [1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1,],
        [1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1,],
        [1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1,],
        [1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1,],
        [1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1,],
        [1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1,],
        [1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1,],

        [1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1,],
        [1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1,],
        [1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1,],
        [1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1,],
        [1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1,],
        [1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1,],
        [1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1,],
        [1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1,],

        [1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 1,1,1,1,0,1,1,1,],
        [1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 1,0,0,0,0,0,0,1,],
        [1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 1,0,0,0,0,0,0,1,],
        [1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1,],
        [1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1,],
        [1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 1,0,0,0,0,0,0,1,],
        [1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 1,0,0,0,0,0,3,1,],
        [1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1,]
    ]

    wall_map = [] as ([number,number] | null)[][]
    empty_tile = [] as ([number,number]|null)[][]

    graph = {} as {
        [XandY:string]:[string,number][]
    }

    bigGraph = {} as {
        [XandY:string]:string[]
    }
    portalsGraph = {} as {
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
                this.graph[`${x},${y}`] = [...arr]
            }
        }

        const totalChunksInWidth = this.text_map.length/this.chunkW
        const totalChunksInHeight = this.text_map.length/this.chunkH

        const directions = [
            [-1,-1],[0,-1],[1,-1],
            [-1,0],       [1,0],
            [-1,1],[0,1],[1,1],
        ]

        const addToGraphPortals = (x:number,y:number,x2:number,y2:number) => {
            if(this.portalsGraph[`${x},${y}`]) {
                this.portalsGraph[`${x},${y}`] = [
                    ...this.portalsGraph[`${x},${y}`], 
                    [`${x2},${y2}`,1]
                ]
            }
            else {
                this.portalsGraph[`${x},${y}`] = [
                    [`${x2},${y2}`,1]
                ]
            }
        }

        for(let x = 0; x < totalChunksInWidth; x++) {
            for(let y = 0; y < totalChunksInHeight; y++) {
                const arr = [] as string[]
                for(let d = 0; d < directions.length; d++) {
                    let canI = false
                    switch(d) {
                        // [-1,-1]
                        case 0 : 
                            if(
                                this.text_map[y*this.chunkH][x * this.chunkW] !== 1
                                &&
                                this.text_map[y*this.chunkH - 1][x * this.chunkW - 1] !== 1
                                &&
                                this.text_map[y*this.chunkH - 1][x * this.chunkW] !== 1
                                &&
                                this.text_map[y*this.chunkH][x * this.chunkW - 1] !== 1
                            ) {
                                canI = true
                                addToGraphPortals(
                                    x * this.chunkW,
                                    y*this.chunkH,
                                    x * this.chunkW - 1,
                                    y*this.chunkH - 1
                                )
                             
                            }
                            break
                        // [0,-1]
                        case 1: 
                            for(let i = 0; i < this.chunkW; i++) { 
                                if(
                                    y*this.chunkH - 1 >= 0 &&
                                    this.text_map[y*this.chunkH][x * this.chunkW + i] !== 1
                                    &&
                                    this.text_map[y*this.chunkH - 1][x * this.chunkW + i] !== 1
                                ) {
                                    canI = true
                                    addToGraphPortals(
                                        x * this.chunkW + i,
                                        y*this.chunkH,
                                        x * this.chunkW + i,
                                        y*this.chunkH - 1
                                    )
                                   
                                }
                            }
                            break
                        //[1,-1]
                        case 2 :
                            if(
                                y*this.chunkH - 1 >= 0 
                                &&
                                this.text_map[y*this.chunkH][x * this.chunkW + this.chunkW - 1] !== 1
                                &&
                                this.text_map[y*this.chunkH - 1][x * this.chunkW + this.chunkW - 1] !== 1
                                &&
                                this.text_map[y*this.chunkH - 1][x * this.chunkW + this.chunkW] !== 1
                                &&
                                this.text_map[y*this.chunkH][x * this.chunkW + this.chunkW] !== 1
                            ) {
                                canI = true
                                addToGraphPortals(
                                    x * this.chunkW + this.chunkW - 1,
                                    y*this.chunkH,
                                    x * this.chunkW + this.chunkW,
                                    y*this.chunkH - 1
                                )
                                
                            }
                            break
                        // [-1,0]
                        case 3 :
                            for(let i = 0; i < this.chunkW; i++) {
                                if(
                                    x * this.chunkW - 1 >= 0 && 
                                    this.text_map[y * this.chunkH + i][x * this.chunkW] !== 1
                                    &&
                                    this.text_map[y * this.chunkH + i][x * this.chunkW - 1] !== 1
                                ) {
                                    canI = true
                                    addToGraphPortals(
                                        x * this.chunkW,
                                        y*this.chunkH + i,
                                        x * this.chunkW - 1,
                                        y * this.chunkH + i
                                    )
                                   
                                }
                            }
                            break
                        // [1,0]
                        case 4 : 
                            for(let i = 0; i < this.chunkW; i++) {
                                if(
                                    this.text_map[y * this.chunkH + i][x * this.chunkW + (this.chunkW - 1)] !== 1
                                    &&
                                    this.text_map[y * this.chunkH + i][(x + 1) * this.chunkW] !== 1
                                ) {
                                    canI = true
                                    addToGraphPortals(
                                        x * this.chunkW + (this.chunkW - 1),
                                        y*this.chunkH + i,
                                        (x + 1) * this.chunkW,
                                        y * this.chunkH + i
                                    )
            
                                }
                            }
                            break
                        // [-1,1]
                        case 5 :
                            if(
                                x * this.chunkW - 1 >= 0 &&
                                this.text_map[y*this.chunkH + this.chunkH - 1][x * this.chunkW] !== 1
                                &&
                                this.text_map[y*this.chunkH + this.chunkH][x * this.chunkW] !== 1
                                &&
                                this.text_map[y*this.chunkH + this.chunkH][x * this.chunkW - 1] !== 1
                                &&
                                this.text_map[y*this.chunkH + this.chunkH - 1][x * this.chunkW - 1] !== 1
                            ) {
                                canI = true
                                addToGraphPortals(
                                    x * this.chunkW,
                                    y*this.chunkH + this.chunkH - 1,
                                    x * this.chunkW - 1,
                                    y*this.chunkH + this.chunkH - 1
                                )
       
                            }
                            break
                        // [0,1]
                        case 6 :
                            for(let i = 0; i < this.chunkW; i++) {
                                if(
                                    this.text_map[(y * this.chunkH) + this.chunkH - 1][x * this.chunkW + i] !== 1
                                    &&
                                    this.text_map[(y + 1) * this.chunkH][x * this.chunkW + i] !== 1
                                ) {
                                    canI = true
                                    addToGraphPortals(
                                        x * this.chunkW + i,
                                        (y * this.chunkH) + this.chunkH - 1,
                                        x * this.chunkW + i,
                                        (y + 1) * this.chunkH
                                    )
                          
                                }
                            }
                            break
                        // [1,1]
                        case 7 :
                            if(
                                this.text_map[y*this.chunkH + this.chunkH - 1][x * this.chunkW + this.chunkW - 1] !== 1
                                &&
                                this.text_map[y*this.chunkH + this.chunkH - 1][x * this.chunkW + this.chunkW] !== 1
                                &&
                                this.text_map[y*this.chunkH + this.chunkH][x * this.chunkW + this.chunkW - 1] !== 1
                                &&
                                this.text_map[y*this.chunkH + this.chunkH][x * this.chunkW + this.chunkW] !== 1
                            ) {
                                canI = true
                                addToGraphPortals(
                                    x * this.chunkW + this.chunkW - 1,
                                    y*this.chunkH + this.chunkH - 1,
                                    x * this.chunkW + this.chunkW,
                                    y*this.chunkH + this.chunkH
                                )
                            }
                            break
                    }
                    
                    if(canI)
                        arr.push(`${x + directions[d][0]},${y + directions[d][1] }`)
                }
                this.bigGraph[`${x},${y}`] = [...arr]
            }
        }

        EnemyController.setSpawnPoints(spawns)
        console.log('chunks graph')
        console.log(this.bigGraph)
        console.log('portals graph')
        console.log(this.portalsGraph)
        console.log('graph')
        console.log(this.graph)
        console.log('wall map')
        console.log(this.wall_map)
        console.log('empty map')
        console.log(this.empty_tile)
    }

    renderMap(ctx:CanvasRenderingContext2D,camera:Camera) {
        for(let y = 0; y < this.wall_map.length; y++) {
            if(!this.wall_map[y])
                continue
            for(let x = 0; x < this.wall_map[y].length; x++) {
                if(!this.wall_map[y][x])
                    continue
                const [cameraX,cameraY] = camera.getCords(this.wall_map[y][x]![0],this.wall_map[y][x]![1])
                ctx.beginPath()
                ctx.fillStyle = "#999999"
                ctx.fillRect(cameraX,
                    cameraY,
                    this.TILESIZE,this.TILESIZE)
                ctx.fill()
                ctx.closePath()
            }
        }
        for(let y = 0; y < this.empty_tile.length; y++) {
            if(!this.empty_tile[y])
                continue
            for(let x = 0; x < this.empty_tile[y].length; x++) {
                if(!this.empty_tile[y][x])
                    continue
                const [cameraX,cameraY] = camera.getCords(this.empty_tile[y][x]![0] + this.TILESIZE/2 - 10,this.empty_tile[y][x]![1] + this.TILESIZE/2)
                ctx.fillStyle = "green"
                ctx.font      = "normal 14px Arial"
                ctx.fillText(`${x},${y}`, cameraX, cameraY)
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