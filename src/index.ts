import { EnemyController } from './EnemyController';
import { Camera } from './Camera';
import { GameMap } from "./GameMap"
import {Player} from "./Player"
import "../styles/styles.scss"
import showFPS from "./utils/showFPS"

const canvas = document.getElementById("canvas") as HTMLCanvasElement
canvas.width = window.innerWidth
canvas.height = window.innerHeight
// canvas.width = 400
// canvas.height = 400

const ctx = canvas.getContext("2d")

let currentfps = 0
let lastSecfps = 0
let lastSecond = 0

const map = new GameMap(100)
const player = new Player(0,0,30,"blue",5)
const camera = new Camera(0,0,canvas.width,canvas.height)
const enemyController = new EnemyController()
map.convertTextMapToWorldMap(player,enemyController)
camera.setPosition(player.X, player.Y)



const GameLoop = () => {
    if(!ctx) return
    ctx.clearRect(0,0,canvas.offsetWidth,canvas.offsetHeight)
    
    const sec = Math.floor(performance.now() / 1000)
    
    if(lastSecond != sec) {
        lastSecfps = currentfps
        currentfps = 0
        lastSecond = sec
    } else {
        currentfps++
    }
    
    player.movement(map)
    camera.setPosition(player.X, player.Y)
    map.renderMap(ctx,camera)
    enemyController.findPath(map.empty_tile,player,map,ctx,camera)
    enemyController.draw(ctx,camera)
    player.draw(ctx,camera)

    showFPS(ctx,lastSecfps)
    
    requestAnimationFrame(GameLoop)
}

document.addEventListener("keydown", (e) => {
    player.setPressedKey(e.code)

})
document.addEventListener("keyup", (e) => {
    player.setunPressedKey(e.code)
})




GameLoop()