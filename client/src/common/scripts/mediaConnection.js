/**
 * Created by Acery on 2017/8/25.
 */
import WebRTC from '../../../js/webrtc'
import {teacherConfigure} from '../../service/getData'
import {XAudioBox} from '../../common/scripts/XaudioBox'
import {XMediaStream} from '../../common/scripts/XmediaStream'


let mediaConnection = () => {
	let webrtc = WebRTC('teacher')
	let courseId = window.sessionStorage.getItem('courseId_forClass') || 0
	let onlineStatus = true
	let streamObj = {}
	let streamConfig = {
		"video": true,
		"audio": {
			optional: [{
				googAutoGainControl: true
			}, {
				googEchoCancellation: true
			}, {
				googNoiseSuppression: true
			}]
		}
	} // 视频流配置
	
	webrtc.on("socket_opened", function () {
		
		// 1.建一个对象，传入配置，发射出来，然后返回对象便以后操作
		webrtc.createLocalStream(streamConfig)
	})
	
	webrtc.on("stream_created", function (e) {
		streamObj = new XMediaStream()
		streamObj.recordStream(e.stream)
	});
	
	webrtc.on("peer_stream", function (e) {
		// 来自对方
		var stream = e.stream;
		console.log(stream.getAudioTracks());
		console.log(stream.getVideoTracks());
	});
	
	
	webrtc.on("remove_peer", function () {
		console.log("remove_peer");
	});
	webrtc.on("remove_stream", function () {
		console.log("远程流删除");
	});
	
	teacherConfigure(courseId).then((res) => {
		let _data = res.data.result.video
		webrtc.connect(_data.channelName, _data.uid, _data.key)
		
	}).catch((err) => {
		console.log(err)
	})
	
}

export default mediaConnection