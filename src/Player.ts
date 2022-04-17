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

    setPosition: (x:number,y:number) => void

    draw:(ctx:CanvasRenderingContext2D,camera:ICamera) => void,

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

    movementKeys = {} as {[code: string]: boolean}

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

    setPressedKey(keyCode:string) {
        this.movementKeys[keyCode] = true
    }

    setunPressedKey(keyCode:string) {
        this.movementKeys[keyCode] = false
    }

    movement(map: IGameMap) {
        if(this.movementKeys.KeyW) {
            const speed = map.returnNewSpeed(this.X,this.Y, this.X,this.Y - this.SPEED,this.RADIUS) 
                this.setPosition(this.X,this.Y + speed)
        }
        if(this.movementKeys.KeyS) {
            const speed = map.returnNewSpeed(this.X,this.Y, this.X,this.Y + this.SPEED,this.RADIUS) 
                this.setPosition(this.X,this.Y += speed)
        }
        if(this.movementKeys.KeyD) {
            const speed = map.returnNewSpeed(this.X,this.Y, this.X + this.SPEED,this.Y,this.RADIUS) 
                this.setPosition(this.X += speed,this.Y)
        }
        if(this.movementKeys.KeyA) {
            const speed = map.returnNewSpeed(this.X,this.Y, this.X - this.SPEED,this.Y,this.RADIUS) 
                this.setPosition(this.X += speed,this.Y)
        }
    }
}