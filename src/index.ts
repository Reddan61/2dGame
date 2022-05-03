import { EnemyController } from './EnemyController';
import "../styles/styles.scss"
import showFPS from "./utils/showFPS"
import { camera, canvas, ctx, map, player } from './worldObjects';
import { BulletsController } from './Bullets/BulletsController';


// canvas.width = 400
// canvas.height = 400


let currentfps = 0
let lastSecfps = 0
let lastSecond = 0




map.convertTextMapToWorldMap(player)
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
    EnemyController.findPath(map.empty_tile,player,map,ctx,camera)
    EnemyController.draw(ctx,camera)
    BulletsController.moveBullets()
    BulletsController.drawBullets()
    player.draw()

    showFPS(ctx,lastSecfps)
    
    requestAnimationFrame(GameLoop)
}

document.addEventListener("keydown", (e) => {
    player.setPressedKey(e.code)

})
document.addEventListener("keyup", (e) => {
    player.setunPressedKey(e.code)
})

canvas.addEventListener("mousemove", (e) => {
    const canvasRect = canvas.getBoundingClientRect()
    const canvasLeft = canvasRect.left
    const canvasTop = canvasRect.top

    player.setAngle(e.clientX - canvasLeft,e.clientY - canvasTop)
})

canvas.addEventListener("click", (e) => {
    player.shoot()
})


GameLoop()