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

    private findpathParts = {
        start:"",
        end:"",
        convertedPath: [] as string[]
    }
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
        const now = performance.now() / 1000
        if(this.attackSpeed +  this.lastAtack <= now) {
            player.getDamage(this.DAMAGE)
            this.lastAtack = now
        }
    }

    moveTo(x: number, y: number)  {
        this.ANGLE =  Math.atan2(y - this.Y,x - this.X)

        const cos = Math.cos(this.ANGLE)
        const sin = Math.sin(this.ANGLE)
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

        const occupiedСellsWithOutEnd = occupiedСells.filter( el => {
            return el !== end
        })

        
        const distToPlayer = Math.sqrt((player.X - this.X)**2 + (player.Y - this.Y)**2)

        
        if(start === end) {
            if( distToPlayer > this.RADIUS + player.RADIUS + this.SPEED)
            this.moveTo(player.X,player.Y)
            return
        }
        
        if(start !== this.findpathParts.start || end !== this.findpathParts.end) {
            const [isFoundWithOccupied,newConvertedPathWithOccupied] = this.AStar(graph,canMoveMap,gameMap,start,end,occupiedСellsWithOutEnd) 
            
            // const [isFound,newConvertedPath] = this.AStar(graph,canMoveMap,gameMap,start,end,[]) 

            if(!isFoundWithOccupied) {
                const [isFound,newConvertedPath] = this.AStar(graph,canMoveMap,gameMap,start,end,[]) 
                if(isFound) {
                    this.findpathParts.convertedPath = newConvertedPath
                } else {
                    this.findpathParts.convertedPath = newConvertedPathWithOccupied
                }
            } else {
                this.findpathParts.convertedPath = newConvertedPathWithOccupied
            }

            this.findpathParts.start = start
            this.findpathParts.end = end
        }
      
        //test------------
        this.drawPath(this.findpathParts.convertedPath,canMoveMap,gameMap.TILESIZE,camera,ctx)
        
        const splitedStart = this.findpathParts.start.split(',')
        
        const startX = canMoveMap[Number(splitedStart[1])][Number(splitedStart[0])]![0] + gameMap.TILESIZE/2 
        const startY = canMoveMap[Number(splitedStart[1])][Number(splitedStart[0])]![1] + gameMap.TILESIZE/2
        
        if(!this.findpathParts.convertedPath[0]) {
            return
        }

        const splitedPath = this.findpathParts.convertedPath[0].split(',')
        const PathX = canMoveMap[Number(splitedPath[1])][Number(splitedPath[0])]![0] + gameMap.TILESIZE/2 
        const PathY = canMoveMap[Number(splitedPath[1])][Number(splitedPath[0])]![1] + gameMap.TILESIZE/2
        
        
        const distMeAndNextTile = Math.sqrt((this.X - PathX)**2 + (this.Y - PathY)**2)
        const distMeAndStartTile = Math.sqrt((this.X - startX)**2 + (this.Y - startY)**2)
        const distStartPathAndStartTile = Math.sqrt((PathX - startX)**2 + (PathY - startY)**2)

        if(
            distStartPathAndStartTile < distMeAndNextTile
            && distMeAndStartTile > this.SPEED
        ) {
            this.moveTo(startX,startY)
            return
        }
        if(!occupiedСells.includes(this.findpathParts.convertedPath[0])) {
            if( distToPlayer > this.RADIUS + player.RADIUS + this.SPEED)
                this.moveTo(PathX,PathY)
        }

    }

    AStar(
        graph: {
            [XandY:string]:[string,number][]
        },
        canMoveMap: ([number,number]|null)[][],
        gameMap:GameMap,
        start:string,end:string,
        occupiedСells: string[]
        ) {


        const costs = {} as any
        const processed = [start]
        let neighbors = [...graph[start]]
        const path = {} as any

        for(let i = 0; i < neighbors.length; i++) {
            costs[neighbors[i][0]] = newCostsNeighbor(neighbors[i][0],neighbors[i][1],canMoveMap)
            path[neighbors[i][0]] = start
        }

        let node = findLowestNode(costs,processed)
        let isFound = false
        
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
                isFound = true
                break
            }

            processed.push(node)
            node = findLowestNode(costs,processed)
        }
       
        if(!isFound)
            return [isFound,[]]
        
        const convertedPath = [] as any
        let currentEl = end
        let positionWhile = 0
        while(positionWhile < Object.keys(path).length) {
            if(path[currentEl]) {
                convertedPath.unshift(currentEl)
            }
            currentEl = path[currentEl]
            positionWhile++

            if(currentEl === start) {
                break
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