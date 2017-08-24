/**
 * Created by Acery on 2017/8/21.
 */

// 接入stream输出数组
// 后期实现解码音频 输出数组 需要建立动画帧
// 建立实例化计数
function XAudioBox() {
	this.audioCtx = null // for audioContext
	this.streamSource = null // store mediaStream in audioCtx
	this.analyser = null // analyser
	this.isInit = false // judge init
	this.dataArray = null // store ouputArray
	this.audioObj = null // for Audio object
	this.animationId =null // store annimatino id to clear
}

XAudioBox.boxCount = 0; // static
XAudioBox.maxCount = 6; // static

XAudioBox.prototype.initBox = function () {
	if (XAudioBox.boxCount >= XAudioBox.maxCount) {
		console.error('Reach max XAB count')
	}
	XAudioBox.boxCount++
	this.isInit = true
	this.audioCtx = new AudioContext()
}

// 加载音频流
XAudioBox.prototype.loadStream = function (stream) {
	if (this.isInit) {
		this.streamSource = this.audioCtx.createMediaStreamSource(stream);
	} else {
		console.error('audioCtx not init')
	}
}

// 创建取样数组
XAudioBox.prototype.createDataArray = function (arrLength) {
	if (this.isInit) {
		if (!this.analyser) {
			this.analyser = this.audioCtx.createAnalyser();
			this.streamSource.connect(this.analyser)
			this.analyser.fftSize = arrLength
			this.dataArray = new Uint8Array(this.analyser.frequencyBinCount)
		}else {
			console.error("audioCtx has been defined, please create new audioCtx")
		}
	} else {
		console.error('audioCtx not init')
	}
}

// 实时捕获并输出数据
XAudioBox.prototype.outputData = function (fn) {
	if(!this.animationId){
		let _ani = () => {
			this.analyser.getByteFrequencyData(this.dataArray)
			fn();
			requestAnimationFrame(_ani)
		}
		this.animationId=requestAnimationFrame(_ani)
	}else {
		console.error("animation has been defined, please stop it")
	}
	
}


// 从文件加载
XAudioBox.prototype.loadSrc = function (audioSrc) {
	if (this.isInit) {
		this.audioObj = new Audio()
		this.audioObj.src = audioSrc
		if (!this.streamSource) {
			// this.analyser = this.audioCtx.createAnalyser();
			this.streamSource = this.audioCtx.createMediaElementSource(this.audioObj)
			// this.streamSource.connect(this.analyser)
			// this.analyser.connect(this.audioCtx.destination)
		} else {
			console.error("audioCtx has been defined, please create new audioCtx")
		}
	} else {
		console.error('audioCtx not init')
	}
}

// 播放音频
XAudioBox.prototype.playSrc = function (volume) {
	this.analyser.connect(this.audioCtx.destination)
	this.audioObj.volume = volume
	this.audioObj.play()
}

// 关闭动画和audioCtx
XAudioBox.prototype.stop = function () {
	// this.audioObj.pause()
	this.audioCtx.close()
	window.cancelAnimationFrame(this.animationId)
}


export {XAudioBox}