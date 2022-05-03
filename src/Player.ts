import { camera, ctx } from './worldObjects';
import { IWeapon } from './Weapon/Weapon';
import { EnemyController } from './EnemyController';
import { IGameMap } from './GameMap';
import { ICamera } from './Camera';
export interface IPlayer {
    X:number,
    Y:number,
    RADIUS:number,
    COLOR:string,
    SPEED:number,
    ANGLE:number,
    movementKeys: {[code: string]: boolean},
    currentWeapon: IWeapon

    setPosition: (x:number,y:number) => void

    draw:(ctx:CanvasRenderingContext2D,camera:ICamera) => void

    setAngle:(mouseX:number,mouseY:number) => void 
    setPressedKey:(keyCode:string) => void
    setunPressedKey:(keyCode:string) => void
    movement:(map: IGameMap) => void
}


export class Player implements IPlayer{
    X:number
    Y:number
    RADIUS:number
    COLOR:string
    SPEED:number
    ANGLE = 0
    currentWeapon: IWeapon

    movementKeys = {} as {[code: string]: boolean}

    constructor(x:number,y:number,radius:number,color:string,speed:number, weapon:IWeapon) {
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

    shoot() {
        this.currentWeapon.shoot(this.X,this.Y,this.ANGLE)
    }

    draw() { 
        if(!ctx)
            return
        const [x,y] = camera.getCords(this.X,this.Y)

        ctx.beginPath() 
        ctx.arc(x,
            y, 
            this.RADIUS,0,Math.PI * 2,false)
      
        ctx.fillStyle = this.COLOR
        ctx.fill()
        //weapon
        this.currentWeapon.draw(x,y,this.RADIUS,this.ANGLE)
    }

    setPressedKey(keyCode:string) {
        this.movementKeys[keyCode] = true
    }

    setunPressedKey(keyCode:string) {
        this.movementKeys[keyCode] = false
    }

    setAngle(mouseX:number,mouseY:number) {
        const [cameraX,cameraY] = camera.getCords(this.X,this.Y)

        const x = mouseX- cameraX
        const y = mouseY - cameraY

        this.ANGLE = Math.atan2(y,x)
    }

    movement(map: IGameMap) {
        if(this.movementKeys.KeyW) {
            const speed = map.returnNewSpeed(this.X,this.Y, this.X,this.Y - this.SPEED,this.RADIUS) 
            if(!EnemyController.collisionEnemy(this.X,this.Y, this.X,this.Y - this.SPEED,this.RADIUS))    
                this.setPosition(this.X,this.Y + speed)
        }
        if(this.movementKeys.KeyS) {
            const speed = map.returnNewSpeed(this.X,this.Y, this.X,this.Y + this.SPEED,this.RADIUS) 
            if(!EnemyController.collisionEnemy(this.X,this.Y, this.X,this.Y + this.SPEED,this.RADIUS))    
                this.setPosition(this.X,this.Y + speed)
        }
        if(this.movementKeys.KeyD) {
            const speed = map.returnNewSpeed(this.X,this.Y, this.X + this.SPEED,this.Y,this.RADIUS) 
            if(!EnemyController.collisionEnemy(this.X,this.Y, this.X + this.SPEED,this.Y,this.RADIUS))    
                this.setPosition(this.X + speed,this.Y)
        }
        if(this.movementKeys.KeyA) {
            const speed = map.returnNewSpeed(this.X,this.Y, this.X - this.SPEED,this.Y,this.RADIUS) 
            if(!EnemyController.collisionEnemy(this.X,this.Y, this.X - this.SPEED,this.Y,this.RADIUS))    
                this.setPosition(this.X + speed,this.Y)
        }
    }
}