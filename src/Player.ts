import { GameMap } from '@/GameMap';
import { Weapon } from './Weapon/Weapon';
import { EnemyController } from './EnemyController';
import { Camera } from './Camera';
import { AStar } from './utils/aStar';

export class Player{
    X:number
    Y:number
    RADIUS:number
    COLOR:string
    SPEED:number
    ANGLE = 0
    currentWeapon: Weapon
    MAXHEALTH = 100
    private HEALTH = this.MAXHEALTH

    private lastPositionTile = ""
    private lastPositionChunk = ""
    nearportals = [] as string[]

    movementKeys = {} as {[code: string]: boolean}

    constructor(x:number,y:number,radius:number,color:string,speed:number, weapon:Weapon) {
        this.X = x
        this.Y = y
        this.RADIUS = radius
        this.COLOR = color
        this.SPEED = speed
        this.currentWeapon = weapon
    }

    setPosition(x: number, y: number)  {
        this.X = x
        this.Y = y
    }

    getPosition(gameMap:GameMap):string {
        const x = Math.floor(this.X / gameMap.TILESIZE)
        const y = Math.floor(this.Y / gameMap.TILESIZE)

        return `${x},${y}`
    }

    checkChunk(gameMap:GameMap) {
        const x = Math.floor(this.X / gameMap.TILESIZE)
        const y = Math.floor(this.Y / gameMap.TILESIZE)
        const tile = `${x},${y}`
        const chunk = gameMap.getChunkNumber(x,y)
        
        if(this.lastPositionTile !== `${x},${y}`) {
            if(!this.nearportals.includes(this.lastPositionTile)) {
                const positionsEnemies = EnemyController.getPositionEnemies()
                gameMap.deleteTileToNearPortals(this.lastPositionTile,this.nearportals,positionsEnemies)
            }
            if(this.lastPositionChunk !== chunk) {
                 this.nearportals = gameMap.setPathToPortalsFromTileOneChunk(x,y)
            }
            if(!this.nearportals.includes(tile)) {
                gameMap.addNewConnectTileToNearPortals(tile,this.nearportals)
            }
            this.lastPositionChunk = chunk
            this.lastPositionTile = `${x},${y}`
            EnemyController.getTrigger(this,gameMap)
        }
    }

    get health() {
        return this.HEALTH
    }
    shoot() {
        if(this.movementKeys["0"]) {
            this.currentWeapon.shoot(this)
        }
    }

    getDamage(damage:number) {
        this.HEALTH -= damage
    }

    draw(ctx:CanvasRenderingContext2D,camera:Camera) { 
        const [x,y] = camera.getCords(this.X,this.Y)

        const size = camera.getSize(this.RADIUS)

        ctx.beginPath() 
        ctx.arc(x,
            y, 
            size,0,Math.PI * 2,false)
      
        ctx.fillStyle = this.COLOR
        ctx.fill()
        

        //healthBar
        const maxHealthBarWidth = size * 2
        const percentHealth = (this.HEALTH * 100)/this.MAXHEALTH
        const percentHealthBarWidth = (maxHealthBarWidth * percentHealth) / 100
        ctx.beginPath()
        ctx.lineWidth = camera.getSize(2)
        ctx.strokeStyle = "black"
        ctx.moveTo(x - size - camera.getSize(2),y + size + camera.getSize(14))
        ctx.lineTo(x + size,y + size + camera.getSize(14))
        ctx.lineTo(x + size,y + size + camera.getSize(21))
        ctx.lineTo(x - size - camera.getSize(1),y + size + camera.getSize(21))
        ctx.lineTo(x - size - camera.getSize(1),y + size + camera.getSize(14))
        ctx.stroke()
        ctx.closePath()
        ctx.fillStyle = "red"
        ctx.fillRect(x - size,y + size + camera.getSize(15), percentHealthBarWidth, camera.getSize(5))

        //weapon
        this.currentWeapon.draw(ctx,x,y,size,this.ANGLE,camera)
    }

    setPressedKey(keyCode:string) {
        this.movementKeys[keyCode] = true
    }

    setunPressedKey(keyCode:string) {
        this.movementKeys[keyCode] = false
    }

    setAngle(mouseX:number,mouseY:number,camera:Camera) {
        const [cameraX,cameraY] = camera.getCords(this.X,this.Y)

        const x = mouseX- cameraX
        const y = mouseY - cameraY

        this.ANGLE = Math.atan2(y,x)
    }

    movement(map: GameMap) {
        if(this.movementKeys.KeyW) {
            const speed = map.returnNewSpeed(this.X,this.Y, this.X,this.Y - this.SPEED,this.RADIUS) 
            if(!EnemyController.collisionEnemyForPlayer(this.X,this.Y, this.X,this.Y - this.SPEED,this.RADIUS))    
                this.setPosition(this.X,this.Y + speed)
        }
        if(this.movementKeys.KeyS) {
            const speed = map.returnNewSpeed(this.X,this.Y, this.X,this.Y + this.SPEED,this.RADIUS) 
            if(!EnemyController.collisionEnemyForPlayer(this.X,this.Y, this.X,this.Y + this.SPEED,this.RADIUS))    
                this.setPosition(this.X,this.Y + speed)
        }
        if(this.movementKeys.KeyD) {
            const speed = map.returnNewSpeed(this.X,this.Y, this.X + this.SPEED,this.Y,this.RADIUS) 
            if(!EnemyController.collisionEnemyForPlayer(this.X,this.Y, this.X + this.SPEED,this.Y,this.RADIUS))    
                this.setPosition(this.X + speed,this.Y)
        }
        if(this.movementKeys.KeyA) {
            const speed = map.returnNewSpeed(this.X,this.Y, this.X - this.SPEED,this.Y,this.RADIUS) 
            if(!EnemyController.collisionEnemyForPlayer(this.X,this.Y, this.X - this.SPEED,this.Y,this.RADIUS))    
                this.setPosition(this.X + speed,this.Y)
        }
    }
}