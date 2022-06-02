export default function showFps(ctx:CanvasRenderingContext2D,fps:number) {
    ctx.fillStyle = "#00ff4b";
    ctx.font      = "normal 20px Arial";
    ctx.fillText(fps + " fps", 10, 25);
}