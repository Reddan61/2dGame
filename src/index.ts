import { EnemyController } from './EnemyController';
import "../styles/styles.scss"
import showFPS from "./utils/showFPS"
import { BulletsController } from './Bullets/BulletsController';
import { GameMap } from './GameMap';
import { Camera } from './Camera';
import { Weapon } from './Weapon/Weapon';
import { Player } from './Player';
import { configGlobalKeys } from './ConfigKeys';
import { config } from './Config';
import showControlls from './utils/showControlls';



let currentfps = 0
let lastSecfps = 0
let lastSecond = 0

const canvas = document.getElementById("canvas") as HTMLCanvasElement
canvas.width = window.innerWidth
canvas.height = window.innerHeight

const ctx = canvas.getContext("2d")

let map = new GameMap(100)
let camera = new Camera(0,0,canvas.width,canvas.height)
let weapon = new Weapon(20,25,5,10,0.1)
let player = new Player(0,0,30,"blue",5,weapon)

let currentGameLoopID:number

map.convertTextMapToWorldMap(player)
camera.setPosition(player.X, player.Y)



function restart() {
    map = new GameMap(100)
    camera = new Camera(0,0,canvas.width,canvas.height)
    weapon = new Weapon(20,25,5,10,0.1)
    player = new Player(0,0,30,"blue",5,weapon)
    
    EnemyController.EnemyArray.splice(0, EnemyController.EnemyArray.length)
    BulletsController.bullets.splice(0, BulletsController.bullets.length)

    map.convertTextMapToWorldMap(player)
    camera.setPosition(player.X, player.Y)
    console.log(currentGameLoopID);
    
    cancelAnimationFrame(currentGameLoopID)
    GameLoop()
}


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
    camera.setPosition(player.X, player.Y)
    player.checkChunk(map)
    player.shoot()
    map.renderMap(ctx,camera,configGlobalKeys)
    EnemyController.spawnEnemyInSpawnPoint(map)
    EnemyController.checkTrigger(player,map,config)
    EnemyController.findPath(player,map,ctx,camera,configGlobalKeys)
    EnemyController.draw(ctx,camera,map)
    EnemyController.enemyAttack(player)
    BulletsController.moveBullets(player,map)
    BulletsController.drawBullets(ctx,camera)
    player.draw(ctx,camera)

    showFPS(ctx,lastSecfps)
    showControlls(ctx)
    
    currentGameLoopID = requestAnimationFrame(GameLoop)
}

document.addEventListener("keydown", (e) => {
    player.setPressedKey(e.code)
    configGlobalKeys[e.code] = !configGlobalKeys[e.code]  
    if(e.code === "KeyR") {
        restart()
    }
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

document.addEventListener("wheel", (e) => {
    const sens = 1
    if(e.deltaY > 0) {
        camera.zoom(sens)
    } else {
        camera.zoom(-sens)
    }
})



canvas.addEventListener("mousemove", (e) => {
    const canvasRect = canvas.getBoundingClientRect()
    const canvasLeft = canvasRect.left
    const canvasTop = canvasRect.top

    player.setAngle(e.clientX - canvasLeft,e.clientY - canvasTop,camera)
})




GameLoop()