export interface ICamera {
    X:number
    Y:number

    CAMERAWIDTH:number
    CAMERAHEIGHT:number

    setPosition:(x:number,y:number) => void
}


export class Camera implements ICamera{
    X:number
    Y:number

    CAMERAWIDTH:number
    CAMERAHEIGHT:number

    constructor(x:number,y:number, w:number,h:number) {
        this.X = x
        this.Y = y
        this.CAMERAWIDTH = w
        this.CAMERAHEIGHT = h
    }

    setPosition(x:number,y:number) {
        this.X = x
        this.Y = y
    }
}