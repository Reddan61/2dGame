import { EnemyController } from './EnemyController';
import "../styles/styles.scss"
import showFPS from "./utils/showFPS"
import { BulletsController } from './Bullets/BulletsController';
import { GameMap } from './GameMap';
import { Camera } from './Camera';
import { Weapon } from './Weapon/Weapon';
import { Player } from './Player';


// canvas.width = 400
// canvas.height = 400

let currentfps = 0
let lastSecfps = 0
let lastSecond = 0

const canvas = document.getElementById("canvas") as HTMLCanvasElement
canvas.width = window.innerWidth
canvas.height = window.innerHeight

const ctx = canvas.getContext("2d")

let map = new GameMap(100)
let camera = new Camera(0,0,canvas.width,canvas.height)
let weapon = new Weapon(20,25,5,50,0.1)
let player = new Player(0,0,30,"blue",5,weapon)


map.convertTextMapToWorldMap(player)
camera.setPosition(player.X, player.Y)
EnemyController.setNumberEnemy(10)



const GameLoop = () => {
    if(!ctx) return
    ctx.clearRect(0,0,canvas.offsetWidth,canvas.offsetHeight)

    if(player.health <= 0) {
        restart()
        return
    }
    
    const sec = Math.floor(performance.now() / 1000)
    
    if(lastSecond != sec) {
        lastSecfps = currentfps
        currentfps = 0
        lastSecond = sec
    } else {
        currentfps++
    }
    
    player.movement(map)
    player.checkChunk(map)
    player.shoot()
    camera.setPosition(player.X, player.Y)
    map.renderMap(ctx,camera)
    EnemyController.spawnEnemy(map)
    EnemyController.findPath(player,map,ctx,camera)
    EnemyController.draw(ctx,camera,map)
    EnemyController.enemyAttack(player)
    BulletsController.moveBullets(map)
    BulletsController.drawBullets(ctx,camera)
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
document.addEventListener("mousedown", (e) => {
    player.setPressedKey(String(e.button))
})
document.addEventListener("mouseup", (e) => {
    player.setunPressedKey(String(e.button))
})

canvas.addEventListener("mousemove", (e) => {
    const canvasRect = canvas.getBoundingClientRect()
    const canvasLeft = canvasRect.left
    const canvasTop = canvasRect.top

    player.setAngle(e.clientX - canvasLeft,e.clientY - canvasTop,camera)
})

function restart() {
    map = new GameMap(100)
    camera = new Camera(0,0,canvas.width,canvas.height)
    weapon = new Weapon(10,25,5,20,0.2)
    player = new Player(0,0,30,"blue",5,weapon)
    
    EnemyController.EnemyArray.splice(0, EnemyController.EnemyArray.length)
    BulletsController.bullets.splice(0, BulletsController.bullets.length)
    EnemyController.setNumberEnemy(10)

    map.convertTextMapToWorldMap(player)
    camera.setPosition(player.X, player.Y)

    GameLoop()
}


GameLoop()