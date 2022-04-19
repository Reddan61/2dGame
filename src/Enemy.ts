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

    constructor(x:number,y:number,radius:number,color:string,speed:number) {
        this.X = x
        this.Y = y
        this.RADIUS = radius
        this.COLOR = color
        this.SPEED = speed
    }

    setPosition(x: number, y: number)  {
        this.X = x
        this.Y = y
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
        const graph = {} as any

        let start = ""
        let end = ""

        for(let y = 0; y < canMoveMap.length; y++) {
            for(let x = 0; x < canMoveMap[y].length; x++) {
                if(!canMoveMap[y][x])
                    continue

                if(
                    player.X - player.RADIUS < canMoveMap[y][x]![0] + gameMap.TILESIZE  && player.X - player.RADIUS + (player.RADIUS*2)  > canMoveMap[y][x]![0] &&
                    player.Y - player.RADIUS < canMoveMap[y][x]![1] + gameMap.TILESIZE && player.Y - player.RADIUS + (player.RADIUS*2) > canMoveMap[y][x]![1]
                ) {
                    end = `${x},${y}`
                }
                if(
                    this.X - this.RADIUS < canMoveMap[y][x]![0] + gameMap.TILESIZE  && this.X - this.RADIUS + (this.RADIUS*2)  > canMoveMap[y][x]![0] &&
                    this.Y - this.RADIUS < canMoveMap[y][x]![1] + gameMap.TILESIZE && this.Y - this.RADIUS + (this.RADIUS*2) > canMoveMap[y][x]![1]
                ) {
                    start = `${x},${y}`
                }
                const arr = [] as [string,number][]
                const cost = 1
                if(canMoveMap[y][x + 1]) {
                    arr.push([`${x+1},${y}`,cost])
                }
                if(canMoveMap[y][x - 1]) {
                    arr.push([`${x-1},${y}`,cost])
                }
                if(canMoveMap[y + 1][x]) {
                    arr.push([`${x},${y+1}`,cost])
                }
                if(canMoveMap[y - 1][x]) {
                    arr.push([`${x},${y-1}`,cost])
                }
                graph[`${x},${y}`] = arr
            }
        }

        const costs = {} as any
        Object.keys(graph).forEach(el => {
            for(let i = 0; i < el.length; i++) {
                costs[el] = Infinity
            }   
        })

        const processed = [start]
        let neighbors = [...graph[start]]
        const path = {} as any
        for(let i = 0; i < neighbors.length; i++) {
            costs[neighbors[i][0]] = newCostsNeighbor(neighbors[i][0],neighbors[i][1],canMoveMap)
        }
       
        let node = findLowestNode(costs,processed)

        while (node) {
            neighbors = [...graph[node]]
            
            for(let i = 0; i < neighbors.length; i++) {
                let newCost = costs[node] + newCostsNeighbor(neighbors[i][0],neighbors[i][1],canMoveMap)
            
                if(newCost < costs[neighbors[i][0]]) {
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
                convertedPath.unshift(currentEl)
            }
        }

        //test------------
        for(let i = 0; i<convertedPath.length;i++) {
            const splited = convertedPath[i].split(',')
            const X = canMoveMap[splited[1]][splited[0]]![0] + gameMap.TILESIZE/2
            const Y = canMoveMap[splited[1]][splited[0]]![1] + gameMap.TILESIZE/2
            ctx.beginPath() 
            ctx.arc(X - (camera.X - camera.CAMERAWIDTH/2),
                Y -(camera.Y - camera.CAMERAHEIGHT/2), 
                5,0,Math.PI * 2,false)
            ctx.fillStyle = this.COLOR
            ctx.fill()
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
}