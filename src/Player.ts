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
    movement:() => void
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

    movement() {
        if(this.movementKeys.KeyW) {
            this.setPosition(this.X,this.Y -= this.SPEED)
        }
        if(this.movementKeys.KeyS) {
            this.setPosition(this.X,this.Y += this.SPEED)
        }
        if(this.movementKeys.KeyD) {
            this.setPosition(this.X += this.SPEED,this.Y)
        }
        if(this.movementKeys.KeyA) {
            this.setPosition(this.X -= this.SPEED,this.Y)
        }
    }
}