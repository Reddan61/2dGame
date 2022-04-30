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
    CAMERA: ICamera
    movementKeys: {[code: string]: boolean},

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
    CAMERA:ICamera
    ANGLE = 0

    movementKeys = {} as {[code: string]: boolean}

    constructor(x:number,y:number,radius:number,color:string,speed:number, camera:ICamera) {
        this.X = x
        this.Y = y
        this.RADIUS = radius
        this.COLOR = color
        this.SPEED = speed
        this.CAMERA = camera
    }

    setPosition(x: number, y: number)  {
        this.X = x
        this.Y = y
    }

    draw(ctx:CanvasRenderingContext2D) { 
        const x = this.X - (this.CAMERA.X - this.CAMERA.CAMERAWIDTH/2)
        const y = this.Y -(this.CAMERA.Y - this.CAMERA.CAMERAHEIGHT/2)
        const gunLong = 80
        ctx.beginPath() 
        ctx.arc(x,
            y, 
            this.RADIUS,0,Math.PI * 2,false)
      
        ctx.fillStyle = this.COLOR
        ctx.fill()
        //stick
        ctx.beginPath()
        ctx.strokeStyle = "pink"
        ctx.lineWidth = 8
        ctx.moveTo(x + 30*Math.cos(this.ANGLE),y + 30 * Math.sin(this.ANGLE))
        ctx.lineTo(
            x + gunLong * Math.cos(this.ANGLE),
            y + gunLong * Math.sin(this.ANGLE)
        )
        ctx.closePath()
        ctx.stroke()
    }

    setPressedKey(keyCode:string) {
        this.movementKeys[keyCode] = true
    }

    setunPressedKey(keyCode:string) {
        this.movementKeys[keyCode] = false
    }

    setAngle(mouseX:number,mouseY:number) {
        const x = mouseX- (this.X - (this.CAMERA.X - this.CAMERA.CAMERAWIDTH/2))
        const y = mouseY - (this.Y -(this.CAMERA.Y - this.CAMERA.CAMERAHEIGHT/2))

        this.ANGLE = Math.atan2(y,x)
    }

    movement(map: IGameMap) {
        if(this.movementKeys.KeyW) {
            const speed = map.returnNewSpeed(this.X,this.Y, this.X,this.Y - this.SPEED,this.RADIUS) 
            // const [bool,newSpeedX,newSpeedY] = EnemyController.returnSpeedToEnemy(this.X,this.Y, this.X,this.Y - this.SPEED,this.RADIUS)
            // if(!bool) {
            //     this.setPosition(newSpeedX,newSpeedY)
            //     return
            // } 
            // this.setPosition(this.X,this.Y + speed)
            if(EnemyController.canIMove(this.X,this.Y, this.X,this.Y - this.SPEED,this.RADIUS))    
                this.setPosition(this.X,this.Y + speed)
        }
        if(this.movementKeys.KeyS) {
            const speed = map.returnNewSpeed(this.X,this.Y, this.X,this.Y + this.SPEED,this.RADIUS) 
            if(EnemyController.canIMove(this.X,this.Y, this.X,this.Y + this.SPEED,this.RADIUS))    
                this.setPosition(this.X,this.Y + speed)
        }
        if(this.movementKeys.KeyD) {
            const speed = map.returnNewSpeed(this.X,this.Y, this.X + this.SPEED,this.Y,this.RADIUS) 
            if(EnemyController.canIMove(this.X,this.Y, this.X + this.SPEED,this.Y,this.RADIUS))    
                this.setPosition(this.X + speed,this.Y)
        }
        if(this.movementKeys.KeyA) {
            const speed = map.returnNewSpeed(this.X,this.Y, this.X - this.SPEED,this.Y,this.RADIUS) 
            if(EnemyController.canIMove(this.X,this.Y, this.X - this.SPEED,this.Y,this.RADIUS))    
                this.setPosition(this.X + speed,this.Y)
        }
    }
}