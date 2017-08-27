import WebRTC from './webrtc'

let  media_connection = ()=>{
	(function($){
		var webrtc = WebRTC('teacher'),
			onlineStatus = true,
			streamConfig = {
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
			},
			streamIds = [];
		webrtc.on("socket_opened", function(websocket) {
			console.log("connected");
			webrtc.createLocalStream(streamConfig);
		});
		
		webrtc.on("stream_created", function(e) {
			var stream = e.stream;
			createVideo(stream, true);
			webrtc.attachStream(stream, "source_me" + stream.id.replace(/[{}]/g, ''));
			
			// document.getElementById('me').src = URL.createObjectURL(stream);
			// document.getElementById('me').play();
		});
		
		webrtc.on("peer_stream", function(e) {
			var stream = e.stream;
			console.log("===========peer_stream");
			console.log(stream.getAudioTracks().length);
			console.log(stream.getVideoTracks().length);
			// setTimeout(webrtc.attachStream(stream, "peer"), 5000);
			createVideo(stream);
			webrtc.attachStream(stream, "source_peer" + stream.id.replace(/[{}]/g, ''));
			
		});
		
		webrtc.on("remove_peer", function() {
			console.log("remove_peer");
		});
		webrtc.on("remove_stream", function() {
			console.log("远程流删除");
		});
		$.ajax({
			type : 'POST',
			url : '/webcast/api/teacherConfigure',
			dataType : 'json',
			data : JSON.stringify({
				courseId : window.sessionStorage.getItem('temp_courseId')
			})
		}).then(function(response){
			var video = response.result.video;
			webrtc.connect(video.channelName, video.uid, video.key);
		}).fail(function(err){
			console.log(err);
		});
		
		
		$(window).on('online', function(){
			console.log('网络已经连接');
			console.log('此时的状态', onlineStatus);
			if(!onlineStatus){
				console.log(0,'===================');
				streamIds.forEach(function(id){
					webrtc.removeStream(id);
				});
				console.log('是否链接');
				webrtc.connect();
			}
		}).on('offline', function(){
			onlineStatus = false;
			console.log('网络已经断开');
		});
		
		
		function createVideo(stream, isLocal){
			var message_bottom,
				play_flag = true,
				role = (isLocal ? 'me' : 'peer'),
				sourceRole = (isLocal ? 'source_me' : 'source_peer'),
				streamId = stream.id.replace(/[{}]/g, ''),
				$videowrapper = $('div[id^=' + role + ']'),
				videoStream = stream.getVideoTracks()[0],
				$container = $("#video-container-multiple");
			if($videowrapper.size() > 0){
				streamIds.splice(streamIds.indexOf($videowrapper.find('video').attr('id')), 1);
				$videowrapper.remove();
			}
			console.log(videoStream);
			if(isLocal){
				message_bottom = '<div class="video_student_bottom">'+
					'<span class="student_name">' + teacherInfo.name + '老师</span>'+
					'</div>';
			}else{
				message_bottom = '<div class="video_teacher_bottom">'+
					'<span class="teacher_name">' + messageObj.name + '</span>'+
					'</div>';
			}
			streamIds.push(sourceRole + streamId);
			$container.append('<div id="'+ role + streamId + '" class="video-item" data-stream-id="' + streamId + '">'
				+ '<img class="show_ctrl" src="../images/closeVideo.png" />' + message_bottom
				+ '<div class="video-box"><video id="'+ sourceRole + streamId + '" autoplay '
				+ (isLocal ? 'muted' : '') + '></video></div></div>');
			$('#' + role + streamId).children('img').click(function(e){
				videoStream.enabled = play_flag ? false : true;
				play_flag ? webrtc.removeVideoTrack(stream) : webrtc.addVideoTrack(stream, videoStream);
				$(this).attr('src', play_flag ? '../images/startVideo.png' : '../images/closeVideo.png');
				play_flag = play_flag ? false : true;
			});
			stream.onaddtrack = function(event){
				var kind = event.track.kind;
				console.log('add', event);
				if(kind == 'video'){
					console.log('add new video track');
				}
			}
			stream.onremovetrack = function(){
				var kind = event.track.kind;
				console.log('remove', event);
				if(kind == 'video'){
					console.log('remove a video track');
				}
			}
		}
		
	})(jQuery);
}

export default media_connection

