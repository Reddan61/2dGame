import { Weapon } from './Weapon/Weapon';
import { EnemyController } from './EnemyController';
import { GameMap } from './GameMap';
import { Camera } from './Camera';

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

    get health() {
        return this.HEALTH
    }
    shoot() {
        if(this.movementKeys["0"]) {
            this.currentWeapon.shoot(this.X,this.Y,this.ANGLE)
        }
    }

    getDamage(damage:number) {
        this.HEALTH -= damage
    }

    draw(ctx:CanvasRenderingContext2D,camera:Camera) { 
        const [x,y] = camera.getCords(this.X,this.Y)

        ctx.beginPath() 
        ctx.arc(x,
            y, 
            this.RADIUS,0,Math.PI * 2,false)
      
        ctx.fillStyle = this.COLOR
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

        //weapon
        this.currentWeapon.draw(ctx,x,y,this.RADIUS,this.ANGLE)
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