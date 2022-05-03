export interface ICamera {
    X:number
    Y:number

    CAMERAWIDTH:number
    CAMERAHEIGHT:number

    setPosition:(x:number,y:number) => void
    getCords: (x:number,y:number) => [number,number]
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

    getCords(x:number,y:number):[number,number] {
        const newX = x - (this.X - this.CAMERAWIDTH/2)
        const newY = y -(this.Y - this.CAMERAHEIGHT/2)

        return [newX,newY]
    }
}