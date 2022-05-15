import { SpawnPoint } from './SpawnPoint';
import { Camera } from './Camera';
import { Player } from "@/Player"
import { Enemy } from './Enemy';
import { EnemyController } from './EnemyController';
import { AStar } from './utils/aStar';

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
        [1,0,0,0,0,0,0,0, 0,0,0,3,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1,],
        [1,0,0,0,0,0,0,1, 1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1,],
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
        [1,0,0,0,0,0,1,0, 0,0,0,0,0,0,0,1, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1,],

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
        [1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 1,0,0,0,0,0,0,1,],
        [1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1,]
    ]

    wall_map = [] as ([number,number] | null)[][]
    empty_tile = [] as ([number,number]|null)[][]

    graph = {} as {
        [XandY:string]:[string,number][]
    }

    portalsGraph = {} as {
        [XandY:string]:[string,number][]
    }

    chunkPortals = {} as {
        [XandY:string]: string[]
    }

    private chunkGraph = {} as {
        [XandYChunk:string]: {
            [XandY:string] : [string,number][]
        }
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

        // const directions = [
        //     [-1,-1],[0,-1],[1,-1],
        //     [-1,0],       [1,0],
        //     [-1,1],[0,1],[1,1],
        // ]
        const directions = [
                   [0,-1],
            [-1,0],       [1,0],
                   [0,1],
        ]

        const addToGraphPortals = (x:number,y:number,x2:number,y2:number) => {
            const xChunkNumber = Math.floor(x / this.chunkW)
            const yChunkNumber = Math.floor(y / this.chunkH)

            if(this.chunkPortals[`${xChunkNumber},${yChunkNumber}`] ) {
                if(!this.chunkPortals[`${xChunkNumber},${yChunkNumber}`].includes(`${x},${y}`))
                    this.chunkPortals[`${xChunkNumber},${yChunkNumber}`] = [
                        ...this.chunkPortals[`${xChunkNumber},${yChunkNumber}`],
                        `${x},${y}`
                    ]
            } else {
                this.chunkPortals[`${xChunkNumber},${yChunkNumber}`] = [
                    `${x},${y}`
                ]
            }

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
        //поиск порталов в другие чанки
        for(let xChunk = 0; xChunk < totalChunksInWidth; xChunk++) {
            for(let yChunk = 0; yChunk < totalChunksInHeight; yChunk++) {
                for(let y = yChunk * this.chunkH; y < yChunk * this.chunkH + this.chunkH; y++) {
                    for(let x = xChunk * this.chunkW; x < xChunk * this.chunkW + this.chunkW; x++) {
                        if(
                            (x === xChunk * this.chunkW || y === yChunk * this.chunkH
                            || x === xChunk * this.chunkW + this.chunkW - 1 || 
                            y === yChunk * this.chunkH + this.chunkH - 1) &&
                            this.text_map[y][x] !== 1
                        ) {
        
                            for(let d = 0; d < directions.length; d++) {
                                const xd = x + directions[d][0]
                                const yd = y + directions[d][1]
                                const chunkDirection = this.getChunkNumber(xd,yd)
                                if( 
                                    `${xChunk},${yChunk}` !== chunkDirection && this.text_map[yd][xd] !== 1 
                                ) {
                                    addToGraphPortals(
                                        x,
                                        y,
                                        xd,
                                        yd
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }
        
        const chunkPortalskeys = Object.keys(this.chunkPortals)

        //поиск пути из портала в другие порталы этого чанка
        for(let i = 0; i < chunkPortalskeys.length; i++) {
            for(let j = 0; j < this.chunkPortals[chunkPortalskeys[i]].length; j++) {
                const start = this.chunkPortals[chunkPortalskeys[i]][j]
        
                if(!this.isCurrentChunk(chunkPortalskeys[i],start))
                    continue

                for(let g = 0; g < this.chunkPortals[chunkPortalskeys[i]].length; g++) {
                    const end = this.chunkPortals[chunkPortalskeys[i]][g]
                    
                    if(j === g && !this.isCurrentChunk(chunkPortalskeys[i],end))
                        continue
  
                    const [isFound,] = AStar(
                        this.getChunkGraph(chunkPortalskeys[i]),
                        this.empty_tile,
                        this, start, end, []
                    )
                    if(isFound) {
                        this.portalsGraph[start] = [
                            ...this.portalsGraph[start],
                            [end,1]
                        ]
                    }
                }
            }
        }

        EnemyController.setSpawnPoints(spawns)
        console.log('portals graph')
        console.log(this.portalsGraph)
        // console.log('graph')
        // console.log(this.graph)
        // console.log('wall map')
        // console.log(this.wall_map)
        // console.log('empty map')
        // console.log(this.empty_tile)
    }

    addNewConnectTileToNearPortals(tile:string,nearportals:string[]) {
        //добавил в порталы свою точку
        this.portalsGraph[tile] = []
        for(let i = 0; i < nearportals.length; i++) {
            if(!nearportals[i]) {
                continue
            }
            this.portalsGraph[nearportals[i]] = [
                ...this.portalsGraph[nearportals[i]], 
                [tile, 1]
            ]
            this.portalsGraph[tile].push([nearportals[i],1])
        }
    }
    deleteTileToNearPortals(tile:string,nearportals:string[],exceptions = [] as string[]) {
        if(exceptions.includes(tile))
            return
        //удалил из прошлых порталов свою точку
        for(let i = 0; i < nearportals.length; i++) {
            if(!this.portalsGraph[nearportals[i]]) 
                continue
            const index = this.portalsGraph[nearportals[i]].findIndex(el => el[0] === tile)
            if(index >= 0)
                this.portalsGraph[nearportals[i]].splice(index,1)
        }
        delete this.portalsGraph[tile]
    }

    getChunkNumber(xTile:number,yTile:number) {
        const xChunkNumber = Math.floor(xTile / this.chunkW)
        const yChunkNumber = Math.floor(yTile / this.chunkH)

        return `${xChunkNumber},${yChunkNumber}`
    }

    isCurrentChunk(currentChunk:string,position:string) {
        const splitedChunk = currentChunk.split(',')
        const splitedPosition = position.split(',')

        const xSC = Number(splitedChunk[0])
        const ySC = Number(splitedChunk[1])

        const xSP = Number(splitedPosition[0])
        const ySP = Number(splitedPosition[1])

        const xChunkNumber = Math.floor(xSP / this.chunkW)
        const yChunkNumber = Math.floor(ySP / this.chunkH)

        if(xSC === xChunkNumber && ySC === yChunkNumber) 
            return true
        return false
    }

    setPathToPortalsFromTileOneChunk(xTile:number,yTile:number) {
        const currentChunk = this.getChunkNumber(xTile,yTile)

        const start = `${xTile},${yTile}`

        const arr = [] as string[]

        for(let i = 0; i < this.chunkPortals[currentChunk].length; i++) {
            const end = this.chunkPortals[currentChunk][i]

            if(start === end) {
                arr.push(this.chunkPortals[currentChunk][i])
                continue
            }
            const [ isFound, ] = AStar(
                this.getChunkGraph(currentChunk),
                this.empty_tile,
                this,
                start, end,[]
            )

            if(isFound) {
                arr.push(this.chunkPortals[currentChunk][i])
            }
        }

        return arr
    }

    getChunkGraph(chunk:string) {
        const newGraphChunk = {} as  {
                [XandY:string] : [string,number][]
        }
        const splitedChunk = chunk.split(',')
        const xChunk = Number(splitedChunk[0])
        const yChunk = Number(splitedChunk[1])

        const xChunkStart = xChunk * this.chunkW
        const yChunkStart = yChunk * this.chunkH

        let currentX = xChunkStart
        let currentY = yChunkStart

        if(this.chunkGraph[chunk]) 
            return this.chunkGraph[chunk]
        
        for(let y = 0; y < this.chunkH; y++) {
            currentY = yChunkStart + y
            currentX = xChunkStart
            for(let x = 0; x < this.chunkW; x++) {
                currentX = xChunkStart + x 
                const currentPosition = `${currentX},${currentY}`
                const newNeighbors = [] as [string,number][]
                if(!this.graph[currentPosition] || this.text_map[currentY][currentX] === 1) {
                    continue
                }
                for(let i = 0; i < this.graph[currentPosition].length; i++){
                    const splitedNeighbor = this.graph[currentPosition][i][0].split(",")
                    const xNeighbor = Number(splitedNeighbor[0])
                    const yNeighbor = Number(splitedNeighbor[1])
                    
                    if(xNeighbor < xChunkStart + this.chunkW
                        && xNeighbor >= xChunkStart 
                        && yNeighbor >= yChunkStart 
                        && yNeighbor < yChunkStart + this.chunkH 
                    ) {
                        newNeighbors.push(this.graph[currentPosition][i])
                    }
                }

                newGraphChunk[currentPosition] = newNeighbors
            }
        }

        this.chunkGraph[chunk] = newGraphChunk
        return this.chunkGraph[chunk]
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

        const keys = Object.keys(this.portalsGraph)
        for(let i = 0; i < keys.length; i++) {
            const splitedPortal = keys[i].split(",")

            const [cameraX,cameraY] = camera.getCords(Number(splitedPortal[0]) * this.TILESIZE,Number(splitedPortal[1]) * this.TILESIZE)
            ctx.fillStyle = "rgba(23, 74, 200,0.5)"
            ctx.fillRect(cameraX,
                cameraY,
                this.TILESIZE,this.TILESIZE)
            ctx.fill()
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