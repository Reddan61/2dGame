import { GameMap } from './GameMap';
import { Player } from '@/Player';
import { Camera } from "./Camera"
import { EnemyController } from './EnemyController';


export class Enemy {
    X:number
    Y:number
    RADIUS:number
    COLOR:string
    SPEED:number
    ANGLE = 0
    HEALTH:number
    MAXHEALTH: number
    DAMAGE:number
    private lastStartPosition = ""
    private lastEndPosition = ""
    private lastConvertedPath = [] as string[]
    private lastIsFound = false
    private lastAtack = 0
    private attackSpeed = 1

    constructor(
        x:number,y:number,radius:number,color:string,speed:number,
        damage:number,health = 100
    ) {
        this.X = x
        this.Y = y
        this.RADIUS = radius
        this.COLOR = color
        this.SPEED = speed
        this.MAXHEALTH = health
        this.HEALTH = this.MAXHEALTH
        this.DAMAGE = damage
    }

    setPosition(x: number, y: number)  {
        this.X = x
        this.Y = y
    }

    isDead(damage: number) {
        this.HEALTH -= damage

        return this.HEALTH <= 0
    }

    attack(player:Player) {
        const now = Math.floor(performance.now() / 1000)
        // if(this.attackSpeed +  this.lastAtack <= now) {
        //     player.getDamage(this.DAMAGE)
        //     this.lastAtack = now
        // }
    }

    moveTo(x: number, y: number,player:Player)  {
        this.ANGLE =  Math.atan2(y - this.Y,x - this.X)

        const cos = Math.cos(this.ANGLE)
        const sin = Math.sin(this.ANGLE)
        const bool = EnemyController.collisionEnemyWithPlayer(this.X,this.Y,this.X + this.SPEED*cos,this.Y + this.SPEED*sin,this.RADIUS,player)
     
        if(bool) {
            return
        }
       
        this.setPosition(this.X + this.SPEED*cos,this.Y + this.SPEED*sin)
    }

    draw(ctx:CanvasRenderingContext2D, camera:Camera) { 
        const x = this.X - (camera.X - camera.CAMERAWIDTH/2)
        const y = this.Y -(camera.Y - camera.CAMERAHEIGHT/2)
        
        ctx.beginPath() 
        ctx.arc(x,
            y, 
            this.RADIUS,0,Math.PI * 2,false)
        ctx.fillStyle = this.COLOR
        ctx.fill()

        ctx.beginPath() 
        ctx.arc( x + this.RADIUS * Math.cos(this.ANGLE),
            y + this.RADIUS * Math.sin(this.ANGLE), 
            3,0,Math.PI * 2,false)
        ctx.fillStyle = "black"
        ctx.fill()
        
        //healthBar
        const maxHealthBarWidth = this.RADIUS * 2
        const percentHealth = (this.HEALTH * 100)/this.MAXHEALTH
        const percentHealthBarWidth = (maxHealthBarWidth * percentHealth) / 100
        ctx.beginPath()
        ctx.lineWidth = 2
        ctx.strokeStyle = "black"
        ctx.moveTo(x - this.RADIUS - 2,y + this.RADIUS + 14)
        ctx.lineTo(x + this.RADIUS,y + this.RADIUS + 14)
        ctx.lineTo(x + this.RADIUS,y + this.RADIUS + 21)
        ctx.lineTo(x - this.RADIUS - 1,y + this.RADIUS + 21)
        ctx.lineTo(x - this.RADIUS - 1,y + this.RADIUS + 14)
        ctx.stroke()
        ctx.closePath()
        ctx.fillStyle = "red"
        ctx.fillRect(x - this.RADIUS,y + this.RADIUS + 15, percentHealthBarWidth, 5)
    }

    findPath(canMoveMap: ([number,number]|null)[][],player:Player, gameMap:GameMap,ctx:CanvasRenderingContext2D,camera:Camera) {
        const startTest = performance.now()

        const graph = {...gameMap.graph}
        const occupiedСells = EnemyController.getPositionOtherEnemys(this)

        const startXIndex = Math.floor(this.X / gameMap.TILESIZE)
        const startYIndex = Math.floor(this.Y / gameMap.TILESIZE)
        
        const endXIndex = Math.floor(player.X / gameMap.TILESIZE)
        const endYIndex = Math.floor(player.Y / gameMap.TILESIZE)
        
        if(startXIndex < 0 || startYIndex < 0 || endXIndex < 0 || endYIndex < 0)
            return
        
        const start = `${startXIndex},${startYIndex}`
        const end = `${endXIndex},${endYIndex}`   
        
        const distToPlayer = Math.sqrt((player.X - this.X)**2 + (player.Y - this.Y)**2)

        // if(distToPlayer <= player.RADIUS + this.RADIUS + this.SPEED) {
        //     this.moveTo(player.X,player.Y,player)
        //     return
        // }
        // if(distToPlayer <= gameMap.TILESIZE) {
        //     this.moveTo(player.X,player.Y,player)
        //     return
        // }
        
        let isFound = this.lastIsFound
        let convertedPath = [] as string[]

        [isFound,convertedPath] = this.AStar(graph,canMoveMap,gameMap,start,end,occupiedСells)
        // if(this.lastEndPosition !== end && this.lastStartPosition !== start) {
        //     [isFound,convertedPath] = this.AStar(graph,canMoveMap,gameMap,start,end,occupiedСells)
        //     this.lastConvertedPath = [...convertedPath]
        //     this.lastStartPosition = start
        //     this.lastEndPosition = end
        //     this.lastIsFound = isFound
        // } else {
        //     convertedPath = this.lastConvertedPath
        // }

        //if we did not find the path to the player, we try to find a new path to the nearest enemy
        // if(!isFound) {
        //     const enemyPositions = [...occupiedСells]
        //     while (!isFound && enemyPositions.length > 0) {
        //         const nearestOccupiedСell = {
        //             x:Infinity,
        //             y:Infinity
        //         }
        //         let currentCell = null as null | number
        //         for(let i = 0; i < enemyPositions.length; i++) {
        //             const splited = enemyPositions[i].split(",")
        //             const x = Number(splited[0])
        //             const y = Number(splited[1])
                    
        //             const distToPlayerFromTile = Math.sqrt((player.X - x*gameMap.TILESIZE)**2 + (player.Y- y*gameMap.TILESIZE)**2 )
        //             const distToPlayerFromNearestTile = Math.sqrt((player.X - nearestOccupiedСell.x)**2 + (player.Y- nearestOccupiedСell.y)**2 )
                    
    
        //             if(distToPlayerFromTile <= distToPlayerFromNearestTile) {
        //                 nearestOccupiedСell.x = canMoveMap[y][x]![0]
        //                 nearestOccupiedСell.y = canMoveMap[y][x]![1]
        //                 currentCell = i
        //             }
        //         }
        //         const newEnd = `${nearestOccupiedСell.x / gameMap.TILESIZE},${nearestOccupiedСell.y / gameMap.TILESIZE}`
        //         const [isFoundWayToNearestEnemy,convertedPathTonearestOccupiedСell] = this.AStar(graph,canMoveMap,gameMap,start,newEnd,occupiedСells)
        //         if(!isFoundWayToNearestEnemy && currentCell) {
        //             enemyPositions.splice(currentCell,1)
        //         } else {
        //             isFound = true
        //             convertedPath = convertedPathTonearestOccupiedСell.slice(0,convertedPathTonearestOccupiedСell.length - 1)
        //         }
        //     }
        // }
      
        //test------------
        this.drawPath(convertedPath,canMoveMap,gameMap.TILESIZE,camera,ctx)
        
        const splitedStart = start.split(',')
        
        const startX = canMoveMap[Number(splitedStart[1])][Number(splitedStart[0])]![0] + gameMap.TILESIZE/2 
        const startY = canMoveMap[Number(splitedStart[1])][Number(splitedStart[0])]![1] + gameMap.TILESIZE/2
        
        if(!convertedPath[0]) {
            return
        }

        const splitedPath = convertedPath[0].split(',')
        const PathX = canMoveMap[Number(splitedPath[1])][Number(splitedPath[0])]![0] + gameMap.TILESIZE/2 
        const PathY = canMoveMap[Number(splitedPath[1])][Number(splitedPath[0])]![1] + gameMap.TILESIZE/2
        
        
        const distMeAndNextTile = Math.sqrt((this.X - PathX)**2 + (this.Y - PathY)**2)
        const distMeAndStartTile = Math.sqrt((this.X - startX)**2 + (this.Y - startY)**2)
        const distStartPathAndStartTile = Math.sqrt((PathX - startX)**2 + (PathY - startY)**2)

        if(distMeAndNextTile <= distStartPathAndStartTile) {
            this.moveTo(PathX,PathY,player)
        } else {
            this.moveTo(startX,startY,player)
        }
        if(distMeAndStartTile <= this.SPEED ) {
            // [this.lastIsFound,this.lastConvertedPath] = this.AStar(graph,canMoveMap,gameMap,start,end,occupiedСells)
            
            this.moveTo(PathX,PathY,player)
        }
        console.log(performance.now() - startTest )
    }

    AStar(
        graph: {
            [XandY:string]:[string,number][]
        },
        canMoveMap: ([number,number]|null)[][],
        gameMap:GameMap,
        start:string,end:string,occupiedСells:string[]) {


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
            if(occupiedСells.includes(node)){
                processed.push(node)
                node = findLowestNode(costs,processed)
                continue
            }
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
            }
        }

        return [isFound,convertedPath]

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

    drawPath(convertedPath:string[],canMoveMap:([number,number]|null)[][],tileSize:number,camera:Camera,ctx:CanvasRenderingContext2D) {
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