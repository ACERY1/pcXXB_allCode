/**
 * Created by Acery on 2017/8/22.
 */

//获取页面上的canvas元素
// 前台功能 绘画，改变颜色，橡皮，删除
// 后台实时发送坐标数据 以及各种命令，以回调Promise的形式抛出去

function XBoard() {
	this.isPainting = false
}

// init&append canvas
// canvas = document.createElement('canvas')
// canvas.setAttribute('width', canvasWidth)
// canvas.setAttribute('height', canvasHeight)
// canvas.setAttribute('height', canvasHeight)
// canvas.setAttribute('id', `canvasCtx_${paperNum}`)
// canvasBox.append(canvas)
// ctx = document.getElementById(`canvasCtx_${paperNum}`).getContext("2d");
// ctx.fillRect(0, 0, 1000, 800)
// getMouseEvent
// $("#canvasCtx").on("mousedown", function (e) {
// 	isPaint = true
// 	ctx.beginPath()
// 	ctx.moveTo(e.clientX - divLeft, e.clientY - divTop)
//
// })
// $("#canvasCtx").on("mouseup", function (e) {
// 	isPaint = false
// 	ctx.closePath();
// })
// $("#canvasCtx").on("mousemove", function (e) {
// 	if (isPaint) {
// 		// 在此执行绘画
// 		ctx.strokeStyle ="orange"
// 		ctx.stroke
// 		ctx.lineWidth = 10
// 		ctx.lineTo(e.clientX - divLeft,e.clientY - divTop)
// 		ctx.stroke();
// 	}
// })
// $('#canvasCtx').on("mouseleave", function (e) {
// 	isPaint = false
// })
// $('#canvasCtx').on("click", function (e) {
// 	// isPaint = false
// })
