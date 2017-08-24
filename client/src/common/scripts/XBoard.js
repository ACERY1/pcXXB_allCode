/**
 * Created by Acery on 2017/8/22.
 */


// 橡皮擦 1. clearRect 2. 设置画笔隐形
// 在使用橡皮擦的时候进行隐形划线 划线坐标与储存的points做交集，拿到交集部分再进行clearRect


// record: 1.搞清楚class里什么时候该用成状态 什么时候该用成一个暂存数据 什么时候该清除数据

//获取页面上的canvas元素
// 前台功能 绘画，改变颜色，橡皮，删除
// 后台实时发送坐标数据 以及各种命令，以回调Promise的形式抛出去
// 各种resize需要设计reload函数
// creator:You_Chao_Yang


// **** important: need JQuery register first ****
function XBoard(DomId, canvasDom) {
	this.ctx = null // canvas obj
	this.isPainting = false // judge painting
	this.isUsingEraser = false // judge Eraser
	this.height = undefined // to recompute the canvas height
	this.width = undefined // to recompute the canvas width
	this.top = undefined // store the position of canvasDom
	this.left = undefined // store the position of canvasDom
	this.canvasDom = null // store the dom
	this.domId = null // store dom attr:id
	this.color = 'black' // now : blue red black
	this.penSize = 8// the size of pen(S:2,M:4,L:8)
	this.eraserSize = 40 // the size of eraser
	this.scaleX = 1 // store newCanvasWidth/canvasWidth
	this.scaleY = 1 // store newCanvasHeight/canvasHeight
	this.points = [] // store all  position data  (func: resize to recovery)
	this.clearPoints = []
	this.tempPoint = [] //temporary storage （after send out remember clear!)
	this.tolerantRadious = 20 // blur clear
	
	// bind events
	let _bindEvents = () => {
		let self = this;
		document.getElementById(self.domId).setAttribute('height', self.height)
		document.getElementById(self.domId).setAttribute('width', self.width)
		
		self.canvasDom.on('mousedown', function (e) {
			self.isPainting = true
			self.ctx.beginPath()
			self.ctx.moveTo(e.clientX - self.left, e.clientY - self.top)
		})
		
		self.canvasDom.on('mouseup', function () {
			self.isPainting = false
			self.ctx.closePath();
		})
		
		self.canvasDom.on('mousemove', function (e) {
			if (self.isPainting) {
				// 使用橡皮擦
				if (self.isUsingEraser) {
					self.ctx.strokeStyle = 'transparent' // static
					self.ctx.lineWidth = self.eraserSize // variable
					self.ctx.clearRect(e.clientX - self.left, e.clientY - self.top, self.eraserSize, self.eraserSize)
				} else {
					self.ctx.strokeStyle = self.color
					self.ctx.lineWidth = self.penSize
				}
				self.ctx.lineTo(e.clientX - self.left, e.clientY - self.top)
				self.storeData(e.clientX - self.left, e.clientY - self.top, self.eraserSize, self.eraserSize)
				self.ctx.stroke();
			}
		})
		
		self.canvasDom.on('mouseleave', function () {
			self.isPainting = false
		})
		
		self.canvasDom.on("click", function (e) {
			// 暂时没功能
		})
		
	}
	if (DomId && canvasDom) {
		if (document.getElementById(DomId).getContext("2d")) {
			this.ctx = document.getElementById(DomId).getContext("2d");
			this.domId = DomId
			this.canvasDom = canvasDom
			this.top = canvasDom.offset().top
			this.left = canvasDom.offset().left
			this.height = canvasDom.height()
			this.width = canvasDom.width()
			_bindEvents()
		} else {
			//  canvas-unsupported code here
			alert("this browser can not support canvas")
		}
		
	} else {
		console.error("XB init ERR: params undefined")
	}
	
}

/**
 * 换画笔颜色
 * @param color
 */
XBoard.prototype.changeColor = function (color) {
	switch (color) {
		case 'black':
			this.color = '#231815';
			break;
		case 'blue':
			this.color = '#4a96ff';
			break;
		case 'red':
			this.color = '#ff3333';
			break;
		default: {
			console.error('XB changeColorERR: unknown colors')
		}
	}
}

/**
 * 换画笔粗细
 * @param size
 */
XBoard.prototype.changeSize = function (size) {
	switch (size) {
		case 'S':
			this.penSize = 2;
			break;
		case 'M':
			this.penSize = 4;
			break;
		case 'L':
			this.penSize = 8;
			break;
		default: {
			console.error('XB changeSizeERR: unknown size')
		}
	}
}

/**
 * 清屏
 */
XBoard.prototype.clearAllCanvas = function () {
	this.ctx.stroke()
	this.ctx.closePath()
	this.ctx.clearRect(0, 0, this.width, this.height);
}

XBoard.prototype.clearCanvasByPoints = function (points) {
	if (!points) {
		console.error('XB:clearCanvasByPoints ERR ---params undefined')
	} else {
		for (let item of points) {
			this.ctx.clearRect(item.x, item.y, this.eraserSize, this.eraserSize)
		}
	}
}


/**
 * 使用橡皮
 */
XBoard.prototype.useEraser = function () {
	this.isUsingEraser = true
}

/**
 * 退出使用橡皮擦 涉及到筛选调 clearPoints 和 points的交点为圆心画圆 在圆内的所有点全部清除掉
 */
XBoard.prototype.cancelEraser = function () {
	this.isUsingEraser = false
	for (let i = 0; i < this.clearPoints.length; i++) {
		for (let point of this.points) {
			// Math.pow(Math.pow(x1-x2,2)+Math.pow(y1-y2,2),1/2)
			if (Math.pow(
					(
						Math.pow(this.clearPoints[i].x - point.x, 2)
						+
						Math.pow(this.clearPoints[i].y - point.y, 2)
					), 1 / 2) <= this.tolerantRadious) {
				
				this.points.splice(i, 1)
			}
		}
	}
}


/**
 * 重新计算canvas尺寸 核心计算：比例不变原则
 */
XBoard.prototype.recompute = function (canvasDom) {
	// 重置数据
	this.scaleX = canvasDom.width() / this.width // new/old
	this.scaleY = canvasDom.height() / this.height// new/old
	this.height = canvasDom.height()
	this.width = canvasDom.width()
	this.top = canvasDom.offset().top
	this.left = canvasDom.offset().left
	document.getElementById(this.domId).setAttribute('height', this.height)
	document.getElementById(this.domId).setAttribute('width', this.width)
}

/**
 * 储存坐标数据
 */
XBoard.prototype.storeData = function (pointX, pointY) {
	if (this.isUsingEraser) {
		this.clearPoints.push({
				x: pointX,
				y: pointY
			}
		)
	} else {
		this.points.push({
			x: pointX,
			y: pointY
		})
	}
	
}

/**
 * 清除储存的坐标数据
 */
XBoard.prototype.clearData = function () {
	this.points = []
}

/**
 * 通过储存的坐标绘制画图 作用：用于resize之后的重绘
 */
XBoard.prototype.drawData = function () {
	let self = this
	self.ctx.strokeStyle = self.color
	self.ctx.lineWidth = self.penSize
	self.ctx.beginPath()
	// if(!this.points)
	if (this.points.length == 0) {
		console.error("XB:drawData ERR --- points.length ERR")
		return false
	}
	self.ctx.moveTo(this.points[0].x * self.scaleX, this.points[0].y * self.scaleY)
	for (let i = 0; i < this.points.length; i++) {
		self.ctx.lineTo(this.points[i].x * self.scaleX, this.points[i].y * self.scaleY) // 按比例来缩放
		self.ctx.stroke();
	}
	self.ctx.closePath()
	self.clearData()
}

XBoard.prototype.drawCanvasByPoints = function (color, size, points) {
	this.recompute()
	if (!points || !color || !size) {
		console.error('XB: drawCanvasByPoints --- params undefined')
		return false
	} else {
		this.ctx.strokeStyle = color
		this.ctx.lineWidth  = size
		this.ctx.beginPath()
		if(points.length == 0){
			console.error("XB:drawCanvasByPoints ERR --- points.length ERR")
			return false
		}
		self.ctx.moveTo(points[0].x*this.scaleX,points[0].y*this.scaleY)
		for(let i=0;i< points.length;++i){
			this.ctx.lineTo(points[i].x*this.scaleX,points[i].y*this.scaleY)
			this.ctx.stroke()
		}
		this.ctx.closePath()
	}
}


export {XBoard}


// {"lessonToken":"X0014ym7N26O5PFp0dd7ab3157cc83779969e7fff1d6887376r5q19X87mw4Swp",
// "cmd":"draw",
// "data":"{
// \"color\":\"#333333\"
// ,\"size\":2,
// \"point\":[{\"x\":126,\"y\":287},{\"x\":127,\"y\":287},{\"x\":142,\"y\":303},{\"x\":150,\"y\":311},{\"x\":176,\"y\":338},{\"x\":198,\"y\":364},{\"x\":290,\"y\":512},{\"x\":291,\"y\":512},{\"x\":291,\"y\":512}]}"}:

let dataTemplate = {
	'lessonToken': '课程的token',
	'cmd': 'draw', //
	'data': {
		color: '笔画颜色',// 16进制
		size: '画笔大小', // 2 num
		point: [{x: '横坐标', y: '纵坐标'}]
	}
}