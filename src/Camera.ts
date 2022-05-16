export class Camera {
    X:number
    Y:number
    Z = 1

    CAMERAWIDTH:number
    CAMERAHEIGHT:number

    private maxZoom = 5
    private minZoom = 0

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

    zoom(sens:number) {
        const newZoom = this.Z + sens
        if(newZoom < this.maxZoom && newZoom > this.minZoom ) {
            this.Z = newZoom
        }
    }

    getSize(size:number) {
        return size * this.Z
    }

    getCords(x:number,y:number):[number,number] {
        const CAMERAWIDTH = this.CAMERAWIDTH / this.Z 
        const CAMERAHEIGHT = this.CAMERAHEIGHT / this.Z 
        const xleftTopPos = (this.X - CAMERAWIDTH/2) 
        const yleftTopPos = (this.Y - CAMERAHEIGHT/2)

        const newX = x  - xleftTopPos 
        const newY = y - yleftTopPos 

        return [newX * this.Z  ,newY * this.Z]
    }
}