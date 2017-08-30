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
	this.penSize = 4// the size of pen(S:2,M:4,L:8)
	this.eraserSize = 40 // the size of eraser
	this.scaleX = 1 // store newCanvasWidth/canvasWidth
	this.scaleY = 1 // store newCanvasHeight/canvasHeight
	// this.points = [] // store all  position data  (func: resize to recovery)
	// this.clearPoints = []
	this.tempPoint = [] //temporary storage （after send out remember clear!)
	this.tempClearPoint = [] // judge valid line
	this.tolerantRadious = 10 // blur clear
	this.pointsData = []
	
	
	// define callBack fn
	this.writeFn = ()=>{
		console.log('write')
	}
	this.eraserFn = ()=>{
		console.log('eraser')
	}
	this.clearFn = ()=>{
		console.log('clear')
	}
	
	// bind events
	let _bindEvents = () => {
		let self = this;
		document.getElementById(self.domId).setAttribute('height', self.height)
		document.getElementById(self.domId).setAttribute('width', self.width)
		
		self.canvasDom.on('mousedown', function (e) {
			self.tempPoint = [] // refresh
			self.tempClearPoint = [] // refresh
			self.isPainting = true
			self.ctx.beginPath()
			self.ctx.moveTo(e.clientX - self.left, e.clientY - self.top)
		})
		
		self.canvasDom.on('mouseup', function () {
			self.isPainting = false
			// 判断是否为无效橡皮擦轨迹
			// if (self.isUsingEraser) {
			// 	console.log(self.judgeIntersection(self.tempClearPoint))
			// }
			
			// 存下当前的pointData
			let _temp = {
				cmd: '', // clear/draw
				data: {
					color: null,
					size: null,
					point: [
						{
							x: 0,
							y: 0
						}
					]
				}
			};
			if (self.isUsingEraser) {
				// 说明是clearLine
				_temp.cmd = 'clear'
				
				_temp.data.point = self.tempClearPoint
			} else {
				// 说明是drawLine
				_temp.cmd = 'draw'
				_temp.data.color = self.color
				_temp.data.size = self.penSize
				_temp.data.point = self.tempPoint
			}
			
			self.pointsData.push(_temp)
			//	触发回调函数
			if(self.isUsingEraser){
				self.eraserFn(_temp)
			}else{
				self.writeFn(_temp)
			}
	
			// console.log(self.pointsData)
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
				// self.storeData(e.clientX - self.left, e.clientY - self.top, self.eraserSize, self.eraserSize)
				self.storeTempData(e.clientX - self.left, e.clientY - self.top, self.eraserSize, self.eraserSize)
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
			console.error('XB changeColorWARN: unknown colors')
			this.color = color
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
			console.error('XB changeSizeWARN: unknown size')
			this.penSize = size
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
	this.clearData()
	//TODO:以后加上
	// this.clearFn()
}


/**
 * 通过点坐标用于清除画布
 * @param points
 */
// XBoard.prototype.clearCanvasByPoints = function (points) {
// 	if (!points) {
// 		console.error('XB:clearCanvasByPoints ERR ---params undefined')
// 	} else {
// 		for (let i = 0; i < points.length; ++i) {
// 			// this.ctx.clearRect(item.x, item.y, this.eraserSize, this.eraserSize)
// 			this.ctx.clearRect(points[i].x * this.scaleX, points[i].y * this.scaleY, this.eraserSize, this.eraserSize)
//
// 			// 更新clearPoints
// 			points[i].x = points[i].x * this.scaleX
// 			points[i].y = points[i].y * this.scaleY
// 		}
// 	}
// }


/**
 * 使用橡皮 TODO：橡皮的回调函数没写呢
 */
XBoard.prototype.useEraser = function () {
	this.isUsingEraser = true
}

/**
 * 退出使用橡皮擦 涉及到筛选调 clearPoints 和 points的交点为圆心画圆 在圆内的所有点全部清除掉
 */
XBoard.prototype.cancelEraser = function () {
	this.isUsingEraser = false
	
	// ******** 半径算法 被 通过clearPoints模拟橡皮轨迹 所替代 *********
	// for (let i = 0; i < this.clearPoints.length; i++) {
	// 	for (let point of this.points) {
	// 		// Math.pow(Math.pow(x1-x2,2)+Math.pow(y1-y2,2),1/2)
	// 		if (Math.pow(
	// 				(
	// 					Math.pow(this.clearPoints[i].x - point.x, 2)
	// 					+
	// 					Math.pow(this.clearPoints[i].y - point.y, 2)
	// 					//         this.tolerantRadious
	// 				), 1 / 2) <= this.eraserSize) {
	//
	// 			this.points.splice(i, 1)
	// 		}
	// 	}
	// }
}

// XBoard.prototype.judgeIntersection = function (points) {
// 	// 离散分布情况计数
// 	let count = 0
//
// 	for (let i = 0; i < points.length; i++) {
// 		for (let point of this.points) {
// 			// Math.pow(Math.pow(x1-x2,2)+Math.pow(y1-y2,2),1/2)
//
//
// 			// console.log(points[i].x, point.x)
// 			// console.log(Math.pow(
// 			// 	(
// 			// 		Math.pow(points[i].x - point.x, 2)
// 			// 		+
// 			// 		Math.pow(points[i].y - point.y, 2)
// 			// 	), 1 / 2))
// 			if (Math.pow(
// 					(
// 						Math.pow(this.clearPoints[i].x - point.x, 2)
// 						+
// 						Math.pow(this.clearPoints[i].y - point.y, 2)
// 					), 1 / 2) <= this.tolerantRadious) {
// 				count++
// 				// console.log(count)
// 			}
// 		}
// 	}
//
// 	return count > 1;
// }


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
// XBoard.prototype.storeData = function (pointX, pointY) {
// 	if (this.isUsingEraser) {
// 		this.clearPoints.push({
// 				x: pointX,
// 				y: pointY
// 			}
// 		)
// 	} else {
// 		this.points.push({
// 			x: pointX,
// 			y: pointY
// 		})
// 	}
//
// }

/**
 * 储存临时坐标数据（用于发送和判断的坐标数据）
 */
XBoard.prototype.storeTempData = function (pointX, pointY) {
	if (this.isUsingEraser) {
		this.tempClearPoint.push({
				x: pointX,
				y: pointY
			}
		)
	} else {
		this.tempPoint.push({
			x: pointX,
			y: pointY
		})
	}
	
}

/**
 * 清除储存的坐标数据
 */
XBoard.prototype.clearData = function () {
	// this.points = []
	// this.clearPoints = []
	this.pointsData = []
}

/**
 * 通过储存的坐标绘制画图 作用：用于resize之后的重绘
 */
// XBoard.prototype.drawData = function () {
// 	let self = this
// 	self.ctx.strokeStyle = self.color
// 	self.ctx.lineWidth = self.penSize
// 	self.ctx.beginPath()
// 	// if(!this.points)
// 	if (this.points.length == 0) {
// 		console.error("XB:drawData ERR --- points.length ERR")
// 		return false
// 	}
// 	self.ctx.moveTo(this.points[0].x * self.scaleX, this.points[0].y * self.scaleY)
// 	for (let i = 0; i < this.points.length; i++) {
// 		self.ctx.lineTo(this.points[i].x * self.scaleX, this.points[i].y * self.scaleY) // 按比例来缩放
//
// 		// 更新点坐标
// 		self.ctx.stroke();
// 		self.points[i].x = this.points[i].x * self.scaleX
// 		self.points[i].y = this.points[i].y * self.scaleY
// 	}
// 	self.ctx.closePath()
// 	// self.clearData()
// }


/**
 * 通过点坐标绘制图形
 * @param color
 * @param size
 * @param points
 * @returns {boolean} status
 */
// XBoard.prototype.drawCanvasByPoints = function (color, size, points) {
// 	this.recompute(this.canvasDom)
// 	if (!points || !color || !size) {
// 		console.error('XB: drawCanvasByPoints --- params undefined')
// 		return false
// 	} else {
// 		this.ctx.strokeStyle = color
// 		this.ctx.lineWidth = size
// 		this.ctx.beginPath()
// 		if (points.length == 0) {
// 			console.error("XB:drawCanvasByPoints ERR --- points.length ERR")
// 			return false
// 		}
// 		this.ctx.moveTo(points[0].x * this.scaleX, points[0].y * this.scaleY)
// 		for (let i = 0; i < points.length; ++i) {
// 			this.ctx.lineTo(points[i].x * this.scaleX, points[i].y * this.scaleY)
// 			this.ctx.stroke()
// 		}
// 		this.ctx.closePath()
// 	}
// }


/**
 * new: 从 pointsData 里读取命令和坐标数据进行绘画和擦除
 */
XBoard.prototype.plotPoints = function () {
	// console.log(this.pointsData)
	if (!this.pointsData.length) {
		console.error('XB: plotPoint ERR ---- there is no data in pointsData')
		return false
	} else {
		for (let i = 0; i < this.pointsData.length; ++i) {
	
			if (this.pointsData[i].cmd == 'clear') {
				// 清除
				this.clearLine(this.pointsData[i].data.point)
			}
			if (this.pointsData[i].cmd == 'draw') {
				// 绘画
				this.drawLine(this.pointsData[i].data.color, this.pointsData[i].data.size, this.pointsData[i].data.point)
			}
		}
	}
}

/**
 * 绘画命令所执行函数
 * @param color
 * @param size
 * @param data
 * @returns {boolean}
 */
XBoard.prototype.drawLine = function (color, size, data) {
	if (!data || !color || !size) {
		console.error('XB: drawLine --- params undefined')
		return false
	} else {
		this.ctx.strokeStyle = color
		this.ctx.lineWidth = size
		this.ctx.beginPath()
		if (data.length == 0) {
			console.error("XB: drawLine ERR --- points.length ERR")
			return false
		}
		this.ctx.moveTo(data[0].x * this.scaleX, data[0].y * this.scaleY)
		for (let i = 0; i < data.length; ++i) {
			this.ctx.lineTo(data[i].x * this.scaleX, data[i].y * this.scaleY)
			
			// update data
			data[i].x = data[i].x * this.scaleX
			data[i].y = data[i].y * this.scaleY
			this.ctx.stroke()
		}
		this.ctx.closePath()
	}
}

/**
 * 清除命令所执行函数
 * @param points
 * @returns {boolean}
 */
XBoard.prototype.clearLine = function (points) {
	if (!points || points.length == 0) {
		console.error('XB: clearLine ERR --- params wrong')
		return false
	} else {
		for (let i = 0; i < points.length; ++i) {
			this.ctx.clearRect(points[i].x * this.scaleX, points[i].y * this.scaleY, this.eraserSize, this.eraserSize)
			
			// update Data
			points[i].x = points[i].x * this.scaleX
			points[i].y = points[i].y * this.scaleY
			
		}
	}
}

/**
 * 绑定触发回调函数
 */
XBoard.prototype.bindCallBack = function (writeFn,clearFn ,eraserFn = ()=>{}) {
	if(!writeFn||!clearFn){
		console.error('XB:bindCallBack ERR ---- wrong params')
		return false
	}
	
	this.writeFn = writeFn
	this.clearFn = clearFn
	this.eraserFn = eraserFn
}

/**
 * 通过外部传入的坐标数据进行绘制 data:[{cmd:'',data:{ size:'',point:'',color:''}}]
 */

XBoard.prototype.plotByOutPoints = function (dataArray) {
	
	for(let item of dataArray){
		if(item.cmd == 'draw'){
			let _data = JSON.parse(item.data)
			this.drawLine(_data.color,_data.size,_data.point)
		}
		if(item.cmd == 'clear'){
			// TODO: 下个版本加上
		}
	}
}


export {XBoard}


let tempData = [
	{
		cmd: '', // clear/draw
		data: {
			color: '',
			size: '',
			point: [
				{
					x: 0,
					y: 0
				}
			]
		}
	}
];


let dataTemplate = {
	'lessonToken': '课程的token',
	'cmd': 'draw', //
	'data': {
		color: '笔画颜色',// 16进制
		size: '画笔大小', // 2 num
		point: [{x: '横坐标', y: '纵坐标'}]
	}
}


