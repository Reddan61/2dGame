import { GameMap } from './GameMap';
import { Player } from '@/Player';
import { Camera } from "./Camera"
import { EnemyController } from './EnemyController';
import { AStar } from './utils/aStar';


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

    nearportals = [] as string[]
    private lastPositionChunk = ""
    

    private findpathParts = {
        start:"",
        end:"",
        pathPortals: [] as string[],
        pathToPortal : [] as string[],
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

    checkChunk(gameMap:GameMap) {
        const x = Math.floor(this.X / gameMap.TILESIZE)
        const y = Math.floor(this.Y / gameMap.TILESIZE)
        const chunk = gameMap.getChunkNumber(x,y)

        this.nearportals = gameMap.setPathToPortalsFromTileOneChunk(x,y)
    }

    findPath(canMoveMap: ([number,number]|null)[][],player:Player, gameMap:GameMap,ctx:CanvasRenderingContext2D,camera:Camera) {
        const occupiedСells = EnemyController.getPositionOtherEnemys(this)

        const startXIndex = Math.floor(this.X / gameMap.TILESIZE)
        const startYIndex = Math.floor(this.Y / gameMap.TILESIZE)
        
        const endXIndex = Math.floor(player.X / gameMap.TILESIZE)
        const endYIndex = Math.floor(player.Y / gameMap.TILESIZE)
        
        if(startXIndex < 0 || startYIndex < 0 || endXIndex < 0 || endYIndex < 0)
            return
        
        const start = `${startXIndex},${startYIndex}`
        const end = `${endXIndex},${endYIndex}`  

        const xStartChunk = Math.floor(startXIndex / gameMap.chunkW)
        const yStartChunk = Math.floor(startYIndex / gameMap.chunkH)

        const xEndChunk = Math.floor(endXIndex / gameMap.chunkW)
        const yEndChunk = Math.floor(endYIndex / gameMap.chunkH)

        const startChunk = `${xStartChunk},${yStartChunk}`
        const endChunk = `${xEndChunk},${yEndChunk}`
        
        
        const distToPlayer = Math.sqrt((player.X - this.X)**2 + (player.Y - this.Y)**2)

        let lastChunk = startChunk
        
        if(start === end) {
            if( distToPlayer > this.RADIUS + player.RADIUS + this.SPEED)
            this.moveTo(player.X,player.Y)
            return
        }
        
            
        if(end !== this.findpathParts.end ) {
            this.checkChunk(gameMap)
         
            const newGraph = {
                ...gameMap.portalsGraph,
            }

            for(let i = 0; i < player.nearportals.length; i++) {
                newGraph[player.nearportals[i]] = [
                    ... newGraph[player.nearportals[i]], 
                    [end, 1]
                ]
                if(newGraph[end]) {
                    newGraph[end] = [
                        ...newGraph[end],
                        [player.nearportals[i], 1]
                    ]
                } else {
                    newGraph[end] = [
                        [player.nearportals[i], 1]
                    ]
                }
            }

            for(let i = 0; i < this.nearportals.length; i++) {
                newGraph[this.nearportals[i]] = [
                    ... newGraph[this.nearportals[i]], 
                    [start, 1]
                ]
                if(newGraph[start]) {
                    newGraph[start] = [
                        ...newGraph[start],
                        [this.nearportals[i], 1]
                    ]
                } else {
                    newGraph[start] = [
                        [this.nearportals[i], 1]
                    ]
                }
            }
            
            
            this.findpathParts.convertedPath = []
            
            const [,newPortalsPath] = AStar(newGraph,canMoveMap,gameMap,start,end,[])
            this.findpathParts.pathPortals = newPortalsPath
            let newStart = start

            
            if(this.findpathParts.pathPortals[1] === end  ) {
                const splitedPortal = this.findpathParts.pathPortals[1].split(",")
                const portalChunk = gameMap.getChunkNumber(Number(splitedPortal[0]),Number(splitedPortal[1]))
                if(startChunk === portalChunk) {
                    this.findpathParts.pathPortals.splice(0,1)
                }
            }   

            const [,newPathToPortal] = 
                AStar(gameMap.getChunkGraph(lastChunk),canMoveMap,gameMap,newStart,newPortalsPath[0],[])
            this.findpathParts.convertedPath = [...this.findpathParts.convertedPath,...newPathToPortal]
            // this.findpathParts.pathPortals.splice(0,1)

            // if(newPortalsPath[1] === end && endChunk === lastChunk) {
            //     const [,newPathToPortal] = 
            //         AStar(gameMap.getChunkGraph(lastChunk),canMoveMap,gameMap,newStart,newPortalsPath[1],[])
            //     this.findpathParts.convertedPath = [...this.findpathParts.convertedPath,...newPathToPortal]
            // } else {
            //     for(let i = 0; i < newPortalsPath.length; i++) {
            //         const splitedPortal = newPortalsPath[i].split(",")
            //         const portalChunk = gameMap.getChunkNumber(Number(splitedPortal[0]),Number(splitedPortal[1]))
            //         if(portalChunk !== lastChunk) {
            //             this.findpathParts.convertedPath = [...this.findpathParts.convertedPath,newPortalsPath[i]]
            //             lastChunk = portalChunk
            //             newStart = newPortalsPath[i]
            //             continue
            //         }
    
            //         const [,newPathToPortal] = 
            //             AStar(gameMap.getChunkGraph(lastChunk),canMoveMap,gameMap,newStart,newPortalsPath[i],[])
                    
            //         this.findpathParts.convertedPath = [...this.findpathParts.convertedPath,...newPathToPortal]
            //     }
            // }

            this.findpathParts.start = start
            this.findpathParts.end = end
        }
      
        //test------------
        this.drawPath(this.findpathParts.convertedPath,canMoveMap,gameMap.TILESIZE,camera,ctx)
        
        const splitedStart = this.findpathParts.start.split(',')
        
        const startX = canMoveMap[Number(splitedStart[1])][Number(splitedStart[0])]![0] + gameMap.TILESIZE/2 
        const startY = canMoveMap[Number(splitedStart[1])][Number(splitedStart[0])]![1] + gameMap.TILESIZE/2
        
        if(!this.findpathParts.convertedPath[0]) {
            if(!this.findpathParts.convertedPath[0]) {
                if(this.findpathParts.pathPortals[0]) {
                    const splitedPortal = this.findpathParts.pathPortals[0].split(",")
                    const portalChunk = gameMap.getChunkNumber(Number(splitedPortal[0]),Number(splitedPortal[1]))
                    if(portalChunk !== startChunk) {
                        this.findpathParts.convertedPath = [... this.findpathParts.convertedPath,this.findpathParts.pathPortals[0]]
                        this.findpathParts.pathPortals.splice(0,1)
                        return
                    }

                    const [,newPathToPortal] = 
                        AStar(gameMap.getChunkGraph(lastChunk),canMoveMap,gameMap,start,this.findpathParts.pathPortals[0],[])
                    this.findpathParts.convertedPath = [...this.findpathParts.convertedPath,...newPathToPortal]
                    this.findpathParts.pathPortals.splice(0,1)
                }
            }
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
            if( distToPlayer > this.RADIUS + player.RADIUS + this.SPEED) {
                this.moveTo(PathX,PathY)
            }
        }
        if(distMeAndNextTile <= this.SPEED ) {
            this.findpathParts.convertedPath.splice(0,1)
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