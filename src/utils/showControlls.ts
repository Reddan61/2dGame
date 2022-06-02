export default function showControlls(ctx:CanvasRenderingContext2D) {
    ctx.fillStyle = "#00ff4b";
    ctx.font      = "normal 20px Arial";
    ctx.fillText("R - restart", 10, 55);
    ctx.fillText("Mouse wheel - zoom", 10, 85);
}