/**
 * Created by Acery on 2017/8/25.
 */
import WebRTC from '../../../js/webrtc'
import {teacherConfigure} from '../../service/getData'


let mediaConnection = () => {
	let webrtc = WebRTC('teacher')
	let courseId = window.sessionStorage.getItem('courseId_forClass') || 0
	let onlineStatus = true
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
	let streamIds = [] // 存储流id
	
	webrtc.on("socket_opened", function () {
		console.log('connected')
		webrtc.createLocalStream(streamConfig)
	})
	
	webrtc.on("stream_created", function (e) {
		console.log(e.stream)
	});
	
	webrtc.on("peer_stream", function (e) {
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
	
	teacherConfigure(courseId).then((res)=>{
		let _data = res.data.result.video
		console.log(_data)
		webrtc.connect(_data.channelName,_data.uid,_data.key)
	}).catch((err)=>{
		console.log(err)
	})
	
}

export default mediaConnection