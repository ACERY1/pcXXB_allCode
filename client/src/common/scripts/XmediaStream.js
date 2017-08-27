/**
 * Created by Acery on 2017/8/21.
 */


/*
 * 媒体流，提供接口
 * 1.创建视频流
 * 2.创建音频流*/
// 创建流，删除流，

function XMediaStream() {
	this.mediaTracks = [] // store the tracks
	this.mediaTracksRecycle = [] // to recovery the tracks you have removed
	this.mediaStream = null // store mediaStream object
	this.streamId = undefined // store the mediaStream.id
}

XMediaStream.mediaCount = 0
XMediaStream.maxCount = 6 // 限制最大流

/**
 *  创建流
 * @param name 类型
 * @param constraint 约束条件
 * @returns {Promise} 注：上层可用await 接收
 */
XMediaStream.prototype.createMedia = function (name, constraint={}) {
	let _constraint = {}
	
	if (XMediaStream.mediaCount >= XMediaStream.maxCount) {
		console.error("XMS: Reach max MediaCount")
		return;
	}
	switch (name) {
		case 'audio': {
			// _constraint['audio'] = true
			// _constraint['video'] = false
			for (let key of Object.keys(constraint)) {
				_constraint[key] = constraint[key]
			}
			return new Promise((resolve, reject) => {
				navigator.mediaDevices.getUserMedia(_constraint).then((stream) => {
					this.mediaStream = stream
					this.streamId = stream.id
					this.mediaTracks = stream.getTracks()
					XMediaStream.mediaCount++
					resolve('done!')
				}).catch((err) => {
					reject(err)
				})
			})
			
		}
			break;
		case 'video': {
			// _constraint['audio'] = true
			// _constraint['video'] = {}
			// for (let key of Object.keys(constraint)) {
			// 	_constraint.video[key] = constraint[key]
			// }
			return new Promise((resolve, reject) => {
				navigator.mediaDevices.getUserMedia(constraint).then((stream) => {
					this.mediaStream = stream
					this.streamId = stream.id
					this.mediaTracks = stream.getTracks()
					XMediaStream.mediaCount++
					resolve('done!')
				}).catch((err) => {
					reject(err)
				})
			})
		}
			break;
		default:
			return Promise.rejected('unexpected params')
			break;
	}
}

/**
 * 清除所有轨道 注意：仍然未释放设备
 */
XMediaStream.prototype.removeAllTracks = function () {
	for (let i = 0; i < this.mediaTracks.length; ++i) {
		this.mediaTracksRecycle.push(this.mediaTracks[i])
		this.mediaStream.removeTrack(this.mediaTracks[i])
	}
	this.mediaTracks.splice(0, this.mediaTracks.length)
}

/**
 * 清除指定轨道 注意：仍然未释放设备
 */
XMediaStream.prototype.removeTracks = function () {
	console.error('未实现')
}

/**
 * 恢复轨道
 */
XMediaStream.prototype.recoveryTracks = function () {
	console.error('未实现')
}

/**
 * 停止并释放设备
 */
XMediaStream.prototype.stopAll = function () {
	for (let item of this.mediaTracks) {
		item.stop()
	}
}

/**
 * 获取设备名称
 * @returns {audio,video}
 */
XMediaStream.prototype.getLabel = function () {
	let _labels = {}
	for (let item of this.mediaTracks) {
		_labels[item.kind] = item.label
	}
	return _labels
}

/**
 * 记录传入的音频流 适用于并非经过内部构造的
 * @param stream
 */
XMediaStream.prototype.recordStream = function (stream) {
	this.mediaStream = stream
	this.streamId = stream.id
	this.mediaTracks = stream.getTracks()
	XMediaStream.mediaCount++
	// console.log(this.mediaStream)
	// console.log(this.streamId)
	// console.log(this.mediaTracks)
}

export {XMediaStream}