import { IGameMap } from './GameMap';
import { IPlayer } from '@/Player';
import { ICamera } from "./Camera"

export interface IEnemy {
    X:number
    Y:number
    RADIUS:number
    COLOR:string
    SPEED:number
    ANGLE:number
    lastPosition: {
        x:number,
        y:number,
        moved:boolean
    }

    setPosition: (x:number,y:number) => void
    draw:(ctx:CanvasRenderingContext2D,camera:ICamera) => void,
    findPath:(canMoveMap: ([number,number]|null)[][],player:IPlayer,gameMap:IGameMap,ctx:CanvasRenderingContext2D,camera:ICamera) => void
}


export class Enemy implements IEnemy {
    X:number
    Y:number
    RADIUS:number
    COLOR:string
    SPEED:number
    ANGLE = 0
    lastPosition: {
        x:number,
        y:number,
        moved:boolean
    }

    constructor(x:number,y:number,radius:number,color:string,speed:number) {
        this.X = x
        this.Y = y
        this.RADIUS = radius
        this.COLOR = color
        this.SPEED = speed
        this.lastPosition = {
            x:0,
            y:0,
            moved:true
        }
    }

    setPosition(x: number, y: number)  {
        this.X = x
        this.Y = y
    }
    moveTo(x: number, y: number)  {
        const angle = Math.atan2(y - this.Y,x - this.X)

        const cos = Math.cos(angle)
        const sin = Math.sin(angle)

        this.setPosition(this.X + this.SPEED*cos, this.Y + this.SPEED*sin)
    }

    draw(ctx:CanvasRenderingContext2D, camera:ICamera) { 
        ctx.beginPath() 
        ctx.arc(this.X - (camera.X - camera.CAMERAWIDTH/2),
            this.Y -(camera.Y - camera.CAMERAHEIGHT/2), 
            this.RADIUS,0,Math.PI * 2,false)
        ctx.fillStyle = this.COLOR
        ctx.fill()
    }

    findPath(canMoveMap: ([number,number]|null)[][],player:IPlayer, gameMap:IGameMap,ctx:CanvasRenderingContext2D,camera:ICamera) {
        const graph = gameMap.graph

        const startXIndex = Math.floor(this.X / gameMap.TILESIZE)
        const startYIndex = Math.floor(this.Y / gameMap.TILESIZE)
        
        const endXIndex = Math.floor(player.X / gameMap.TILESIZE)
        const endYIndex = Math.floor(player.Y / gameMap.TILESIZE)

        if(startXIndex < 0 || startYIndex < 0 || endXIndex < 0 || endYIndex < 0)
            return
        
        const start = `${startXIndex},${startYIndex}`
        const end = `${endXIndex},${endYIndex}`       

        if(start === end)
            return
        
        const costs = {} as any
        const processed = [start]
        let neighbors = [...graph[start]]
        const path = {} as any

        for(let i = 0; i < neighbors.length; i++) {
            costs[neighbors[i][0]] = newCostsNeighbor(neighbors[i][0],neighbors[i][1],canMoveMap)
            path[neighbors[i][0]] = start
        }

        let node = findLowestNode(costs,processed)

        while (node) {
            neighbors = [...graph[node]]
            
            for(let i = 0; i < neighbors.length; i++) {
                let newCost = costs[node] + newCostsNeighbor(neighbors[i][0],neighbors[i][1],canMoveMap)
            
                if(newCost < (costs[neighbors[i][0]] || Infinity)) {
                    costs[neighbors[i][0]] = newCost
                    path[neighbors[i][0]] = node
                    if(neighbors[i][0] === String(start)) {
                        path[node] = neighbors[i][0]
                        costs[neighbors[i][0]] = Infinity
                    }
                }
            }
            

            if(node === end) { 
                break
            }

            processed.push(node)
            node = findLowestNode(costs,processed)
        }
       
        const convertedPath = [] as any
        let currentEl = end
        let isFound = false
        let positionWhile = 0
        while(positionWhile < Object.keys(path).length && !isFound) {
            if(path[currentEl]) {
                convertedPath.unshift(currentEl)
            }
            currentEl = path[currentEl]
            positionWhile++

            if(currentEl === start) {
                isFound = true
                // convertedPath.unshift(currentEl)
            }
        }

        //test------------
        this.drawPath(convertedPath,canMoveMap,gameMap.TILESIZE,camera,ctx)

        if(!convertedPath[0])
            return

        const splited = convertedPath[0].split(',')
        const X = canMoveMap[splited[1]][splited[0]]![0] + gameMap.TILESIZE/2 
        const Y = canMoveMap[splited[1]][splited[0]]![1] + gameMap.TILESIZE/2

        if(Math.abs(this.lastPosition.x - this.X) <= this.SPEED && Math.abs(this.lastPosition.y - this.Y) <= this.SPEED && !this.lastPosition.moved) {
            this.lastPosition.moved = true
        }
        
        if(!this.lastPosition.moved) {
            this.moveTo(this.lastPosition.x,this.lastPosition.y)
        } else {
            this.lastPosition = {
                x:X,
                y:Y,
                moved:false
            }
            
            this.moveTo(X,Y)
        }

        function newCostsNeighbor(neighbor:string,costTile:number,canMoveMap:([number,number]|null)[][]):number {
            const splitedNeighbor = neighbor.split(",")
            const splitedEnd = end.split(",")
            
            const neighborPosition = canMoveMap[Number(splitedNeighbor[1])][Number(splitedNeighbor[0])]
            const endPosition = canMoveMap[Number(splitedEnd[1])][Number(splitedEnd[0])]

            const totalTilesToEndFromNeighbor = Math.abs((endPosition![0] - neighborPosition![0])/gameMap.TILESIZE) + Math.abs((endPosition![1] - neighborPosition![1])/gameMap.TILESIZE)
            
        
            return costTile  + totalTilesToEndFromNeighbor*10
        }
       
        function findLowestNode(costs:any,processed:string[]):string {
            let lowestCost = Infinity
            let lowestNode = ""
            Object.keys(costs).forEach(el => {
                if(costs[el] < lowestCost && !processed.includes(el)) {
                    lowestCost = costs[el]
                    lowestNode = el
                }
            })
            return lowestNode
        }
    }

    drawPath(convertedPath:string[],canMoveMap:([number,number]|null)[][],tileSize:number,camera:ICamera,ctx:CanvasRenderingContext2D) {
        const lastPosition = {
            x:this.X - (camera.X - camera.CAMERAWIDTH/2),
            y:this.Y - (camera.Y - camera.CAMERAHEIGHT/2)
        }
        
        for(let i = 0; i<convertedPath.length;i++) {
            const splited = convertedPath[i].split(',')
            const X = canMoveMap[Number(splited[1])][Number(splited[0])]![0] + tileSize/2
            const Y = canMoveMap[Number(splited[1])][Number(splited[0])]![1] + tileSize/2

            ctx.beginPath()
            ctx.lineWidth = 2
            ctx.strokeStyle = 'green'
            ctx.moveTo(lastPosition.x, lastPosition.y)
            ctx.lineTo(X - (camera.X - camera.CAMERAWIDTH/2), Y -(camera.Y - camera.CAMERAHEIGHT/2))
            ctx.stroke()
            lastPosition.x = X - (camera.X - camera.CAMERAWIDTH/2)
            lastPosition.y = Y -(camera.Y - camera.CAMERAHEIGHT/2)
        }
    }
}