import { Camera } from "./Camera"
import { GameMap } from "./GameMap"
import { Player } from "./Player"
import { Weapon } from "./Weapon/Weapon"

const canvas = document.getElementById("canvas") as HTMLCanvasElement
canvas.width = window.innerWidth
canvas.height = window.innerHeight

const ctx = canvas.getContext("2d")
const map = new GameMap(100)
const camera = new Camera(0,0,canvas.width,canvas.height)
const weapon = new Weapon(10,80,5)
const player = new Player(0,0,30,"blue",5,weapon)

export {
    ctx,canvas,
    map,camera,player
}