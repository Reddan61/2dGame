import { GameMap } from './GameMap';
import { Player } from '@/Player';
import { Camera } from "./Camera"
import { EnemyController } from './EnemyController';
import { AStar } from './utils/aStar';
import { IGlobalKeys } from './ConfigKeys';


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
    triggered = false
    lastPositionTile = ""
    private lastPositionChunk = ""
    

    private findpathParts = {
        start:"",
        end:"",
        lastEndChunk: "",
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
        const [x,y] = camera.getCords(this.X,this.Y)

        const newRadius = camera.getSize(this.RADIUS)

        
        ctx.beginPath() 
        ctx.arc(x,
            y, 
            newRadius,0,Math.PI * 2,false)
        ctx.fillStyle = this.COLOR
        ctx.fill()

        ctx.beginPath() 
        ctx.arc( x + newRadius * Math.cos(this.ANGLE),
            y + newRadius * Math.sin(this.ANGLE), 
            camera.getSize(3),0,Math.PI * 2,false)
        ctx.fillStyle = "black"
        ctx.fill()
        
        //healthBar
        const maxHealthBarWidth = newRadius * 2
        const percentHealth = (this.HEALTH * 100)/this.MAXHEALTH
        const percentHealthBarWidth = (maxHealthBarWidth * percentHealth) / 100
        ctx.beginPath()
        ctx.lineWidth = camera.getSize(2)
        ctx.strokeStyle = "black"
        ctx.moveTo(x - newRadius - camera.getSize(2),y + newRadius + camera.getSize(14))
        ctx.lineTo(x + newRadius,y + newRadius + camera.getSize(14))
        ctx.lineTo(x + newRadius,y + newRadius + camera.getSize(21))
        ctx.lineTo(x - newRadius - camera.getSize(1),y + newRadius + camera.getSize(21))
        ctx.lineTo(x - newRadius - camera.getSize(1),y + newRadius + camera.getSize(14))
        ctx.stroke()
        ctx.closePath()
        ctx.fillStyle = "red"
        ctx.fillRect(x - newRadius,y + newRadius + camera.getSize(15), percentHealthBarWidth, camera.getSize(5))
    }

    whenDead(player:Player,gameMap:GameMap) {
        const x = Math.floor(this.X / gameMap.TILESIZE)
        const y = Math.floor(this.Y / gameMap.TILESIZE)
        const tile = `${x},${y}`
        
        if(!this.nearportals.includes(this.lastPositionTile)) {
            const enemyPositions = EnemyController.getPositionOtherEnemies(this)
            const playerPosition = player.getPosition(gameMap)
            const exceptions = [...enemyPositions,playerPosition]

            const portals = gameMap.setPathToPortalsFromTileOneChunk(x,y)

            gameMap.deleteTileToNearPortals(tile,portals,exceptions)
        }

    }

    checkChunk(gameMap:GameMap) {
        const x = Math.floor(this.X / gameMap.TILESIZE)
        const y = Math.floor(this.Y / gameMap.TILESIZE)
        const tile = `${x},${y}`
        const chunk = gameMap.getChunkNumber(x,y)
        
        if(this.lastPositionTile !== `${x},${y}`) {
            if(!this.nearportals.includes(this.lastPositionTile)) {
                const enemyPositions = EnemyController.getPositionOtherEnemies(this)
                gameMap.deleteTileToNearPortals(this.lastPositionTile,this.nearportals,enemyPositions)
            }
            if(this.lastPositionChunk !== chunk) {
                 this.nearportals = gameMap.setPathToPortalsFromTileOneChunk(x,y)
            }
            if(!this.nearportals.includes(tile)) {
                gameMap.addNewConnectTileToNearPortals(tile,this.nearportals)
            }
            this.lastPositionChunk = chunk
            this.lastPositionTile = `${x},${y}`
        }
    }

    findPath(player:Player, gameMap:GameMap,ctx:CanvasRenderingContext2D,camera:Camera,keysConfig:IGlobalKeys) {
        if(!this.triggered)
            return

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

        const startChunk = `${xStartChunk},${yStartChunk}`

        const occupied??ells = EnemyController.getPositionOtherEnemies(this)
        
        const distToPlayer = Math.sqrt((player.X - this.X)**2 + (player.Y - this.Y)**2)
        
        this.checkChunk(gameMap)
        
        if(start === end) {
            if( distToPlayer > this.RADIUS + player.RADIUS + this.SPEED)
            this.moveTo(player.X,player.Y)
            return
        }
        
            
        if(end !== this.findpathParts.end ) {
            const graph = gameMap.portalsGraph

            this.findpathParts.convertedPath = []
            const [,newPortalsPath] = AStar(graph,gameMap.empty_tile,gameMap,start,end,[])
            this.findpathParts.pathPortals = newPortalsPath

            
            if(this.findpathParts.pathPortals[1] === end  ) {
                const splitedPortal = this.findpathParts.pathPortals[1].split(",")
                const portalChunk = gameMap.getChunkNumber(Number(splitedPortal[0]),Number(splitedPortal[1]))
                if(startChunk === portalChunk) {
                    this.findpathParts.pathPortals.splice(0,1)
                }
            } else {
                if(this.findpathParts.pathPortals[0]) {
                    const splitedPortal = this.findpathParts.pathPortals[0].split(",")
                    const portalChunk = gameMap.getChunkNumber(Number(splitedPortal[0]),Number(splitedPortal[1]))
                    if(startChunk === portalChunk) {
                        const [,newPathToPortal] = 
                            AStar(gameMap.getChunkGraph(startChunk),gameMap.empty_tile,gameMap,start,this.findpathParts.pathPortals[0],[])
                        this.findpathParts.convertedPath = [...this.findpathParts.convertedPath,...newPathToPortal]
                        this.findpathParts.pathPortals.splice(0,1)
                    }
                }
            }   

            this.findpathParts.start = start
            this.findpathParts.end = end
        }
      
        if(keysConfig.KeyI) {
            this.drawPath(this.findpathParts.convertedPath,gameMap.empty_tile,gameMap.TILESIZE,camera,ctx)
        }
        
        const splitedStart = this.findpathParts.start.split(',')
        
        const startX = gameMap.empty_tile[Number(splitedStart[1])][Number(splitedStart[0])]![0] + gameMap.TILESIZE/2 
        const startY = gameMap.empty_tile[Number(splitedStart[1])][Number(splitedStart[0])]![1] + gameMap.TILESIZE/2
        
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
                    AStar(gameMap.getChunkGraph(startChunk),gameMap.empty_tile,gameMap,start,this.findpathParts.pathPortals[0],[])
                this.findpathParts.convertedPath = [...this.findpathParts.convertedPath,...newPathToPortal]
                this.findpathParts.pathPortals.splice(0,1)
            }
            return
        }

        const splitedPath = this.findpathParts.convertedPath[0].split(',')
        const PathX = gameMap.empty_tile[Number(splitedPath[1])][Number(splitedPath[0])]![0] + gameMap.TILESIZE/2 
        const PathY = gameMap.empty_tile[Number(splitedPath[1])][Number(splitedPath[0])]![1] + gameMap.TILESIZE/2
        
        
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
        if(!occupied??ells.includes(this.findpathParts.convertedPath[0])) {
            if( distToPlayer > this.RADIUS + player.RADIUS + this.SPEED) {
                this.moveTo(PathX,PathY)
            }
        }
        if(distMeAndNextTile <= this.SPEED ) {
            this.findpathParts.convertedPath.splice(0,1)
        }
    }

   

    drawPath(convertedPath:string[],canMoveMap:([number,number]|null)[][],tileSize:number,camera:Camera,ctx:CanvasRenderingContext2D) {
        const [newX,newY] = camera.getCords(this.X,this.Y)
        

        const lastPosition = {
            x:newX,
            y:newY
        }
        
        for(let i = 0; i<convertedPath.length;i++) {
            const splited = convertedPath[i].split(',')
            const xTile = canMoveMap[Number(splited[1])][Number(splited[0])]![0] + tileSize/2
            const yTile = canMoveMap[Number(splited[1])][Number(splited[0])]![1] + tileSize/2

            const [newXTile,newYTile] = camera.getCords(xTile,yTile)

            ctx.beginPath()
            ctx.lineWidth = camera.getSize(2)
            ctx.strokeStyle = 'green'
            ctx.moveTo(lastPosition.x, lastPosition.y)
            ctx.lineTo(newXTile, newYTile)
            ctx.stroke()
            lastPosition.x = newXTile
            lastPosition.y = newYTile
        }
    }
}