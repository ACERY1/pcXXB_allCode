var WebRTC = function(role) {
    var PeerConnection = (window.PeerConnection || window.webkitPeerConnection00 || window.webkitRTCPeerConnection || window.mozRTCPeerConnection),

    URL = (window.URL || window.webkitURL || window.msURL || window.oURL),

    getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.mediaDevices.getUserMedia),

    nativeRTCIceCandidate = (window.mozRTCIceCandidate || window.RTCIceCandidate),

    nativeRTCSessionDescription = (window.mozRTCSessionDescription || window.RTCSessionDescription), // order is very important: "RTCSessionDescription" defined in Nighly but useless

    moz = !!navigator.mozGetUserMedia,

    // websocketServer = "ws://" + window.sessionStorage.getItem('temp_host') + "/media/websocket/ws",
    websocketServer = "ws://localhost:2048/media/websocket/ws",

    packetSize = 100,
    
    iceServer = {
        "iceServers": [{
            urls: "turn:58.83.148.247",
            username: "coturn",
            credential: "ppnn13fish",
            credentialType: "password"
        }, {
            urls:"stun:58.83.148.247:3478"
        }, {
            urls:"stun:stun.58.83.148.247:3478",
            username: "coturn",
            credential: "ppnn13fish",
            credentialType: "password"
        }], mandatory: {
            OfferToReceiveAudio: true,
            OfferToReceiveVideo: true
        }, optional: {
            DtlsSrtpKeyAgreement : true
        }
    };

    function EventEmitter() {
        this.events = {};
        this.onceEvents = {};
    } // define Class

    EventEmitter.prototype.on = function(eventName, callback) {
        this.events[eventName] = this.events[eventName] || [];
        this.events[eventName].push(callback);
    } // define Methods
    EventEmitter.prototype.once = function(eventName, callback) {
        this.on(eventName, callback);
        this.onceEvents[eventName] = true;
    } // define Methods
    EventEmitter.prototype.emit = function(eventName, _) {
        var events = this.events[eventName],
            args = Array.prototype.slice.call(arguments, 1),
            i, m;

        if (!events) {
            return;
        }
        for (i = 0, m = events.length; i < m; i++) {
            events[i].apply(null, args);
        }
        if(this.onceEvents[eventName]){
            delete this.events[eventName];
            delete this.onceEvents[eventName];
        }
    } // define Methods
    function webrtc(role) {
        this.uid = null;
        this.key = null;
        this.me = null;
        this.role = role;
        this.localMediaStream = null;
        this.room = null;
        this.websocket = null;
        //connectionId和PeerConnection之间的关系
        this.peerConnections = {};
        //connectionId，存放同频道的所有连接的数组
        this.connections = [];
    } // define Class

    webrtc.prototype = new EventEmitter(); // 继承事件发射器

    webrtc.prototype.connect = function(room, uid, key) {
        var that = this,
        websocket;
        this.room = this.room || room;
        this.uid = this.uid || uid;
        this.key = this.key || key;
        var url = websocketServer + "?room=" + this.room + "&uid=" + this.uid + "&key=" + this.key;
        this.websocket && this.websocket.close();
        console.log('新建webcoket');
        websocket = this.websocket = new WebSocket(url);// 建立ws连接
        websocket.onopen = function() {
            join(); // 给后台发送数据
            that.emit("socket_opened", websocket); // 发送连接开启信号
        };

        websocket.onmessage = function(message) {
            var json = JSON.parse(message.data); // 拿到通信的数据
            if (json.cmd) {
                that.emit(json.cmd, json.data); //如果是命令 则发射相关执行信号和数据
            } else {
                that.emit("socket_receive_message", websocket, json);  // 如果是message 则发射
            }
        };

        websocket.onerror = function(error) {
            this.close(); // 连接错误则关闭
            that.websocket = null;
            that.emit("socket_err", error);
            that.emit("socket_error", error, websocket);

        };

        websocket.onclose = function(data) {
            console.log("Websocket connection is closed", data);

            that.emit('socket_closed', websocket); // 发射关闭信号
        };
        function join(){
            websocket.send(JSON.stringify({
                "cmd": "__join",
                "data": {
                    "room": that.room
                }
            }));
            that.closeSource();
        }

    };
    
    webrtc.prototype.initEvents = function(){
        var that = this;
        this.on("_ice_candidate", function(data) {
            mediaReady(function(){
                var pc = that.peerConnections[data.socketId];
                pc.addIceCandidate(new nativeRTCIceCandidate(data));
            });
        });

        this.on('_peers', function(data) {
            that.connections = data.connections;
            that.me = data.you;
            that.emit("peers", that.connections);
        });
        this.on('_new_peer', function(data) {
            var socketId = data.socketId;
            that.createPeerConnection(data.socketId);
            that.sendOffer(socketId);
            that.connections.push(socketId);
            that.emit("new_peer", socketId);

        });
        this.on('_remove_peer', function(data) {
            that.closePeerConnection(data.socketId);
            that.emit("remove_peer", data.socketId);
        });

        this.on('_offer', function(data) {
            var socketId = data.socketId;
            mediaReady(function(){
                that.createPeerConnection(socketId);
                that.sendAnswer(socketId, data.sdp);
            })
            that.emit("offer", data);
        });

        this.on('_answer', function(data) {
            var pc = that.peerConnections[data.socketId];
            console.log('接受到answer');
            pc.setRemoteDescription(new nativeRTCSessionDescription(data.sdp));
            that.emit('answer', data);
        });

        function mediaReady(fn){
            if(typeof fn !== 'function'){
                return ;
            }
            if(that.localMediaStream){
                fn();
                return;
            }
            that.once('ready', function(data) {
                fn();
            });
        }
        return this;
    } // 初始化事件监听

    webrtc.prototype.sendOffer = function(socketId) {
        var that = this,
        pc = that.peerConnections[socketId];
        pc.createOffer(function(session_desc) {
            console.log("createOffer", session_desc);
            pc.setLocalDescription(session_desc, function(){ // 本地保存描述
                console.log('offer设置本地desc描述成功');
            }, function(err){
                console.log('offer设置本地desc描述失败', err);
            });
            that.websocket.send(JSON.stringify({
                "cmd": "__offer",
                "data": {
                    "sdp": session_desc,
                    "socketId": socketId
                }
            }));
        }, function(error) {
            console.log(error);
        });
    } // 发送offer
  
    webrtc.prototype.sendAnswer = function(socketId, sdp) {
        var pc = this.peerConnections[socketId],
        that = this;
        console.log('将要发送answer');
        pc.setRemoteDescription(new nativeRTCSessionDescription(sdp), function(){
            console.log('offer设置远程desc描述成功'); // sdp来自远程
        }, function(err){
            console.log('offer设置远程desc描述失败', err);
        });
        pc.createAnswer(function(session_desc) {
            pc.setLocalDescription(session_desc, function(){
            }, function(){
              console.log('sendAnswer setLocalDescription error');
            });
            that.websocket.send(JSON.stringify({
                "cmd": "__answer",
                "data": {
                    "socketId": socketId,
                    "sdp": session_desc // 让服务器发送回答信令
                }
            }));
        }, function(error) {
            console.log(error);
        });
    };
    
    webrtc.prototype.createLocalStream = function(options) {
        var that = this;
        if (getUserMedia) {
            getUserMedia.call(navigator, options, function(stream){
                that.localMediaStream = stream;
                that.emit("stream_created", {
                    stream : that.localMediaStream
                });
                that.emit('ready');
            }, function(err){
                console.log("create Stream fail", err);
                that.emit("stream_create_error", err);
            });
        } else {
            console.log("fail");
            that.emit("stream_create_error", new Error("WebRTC is not supported in this browser."));
        }
    }
    
    webrtc.prototype.attachStream = function(stream, domId) {
        var element = document.getElementById(domId);
        if (navigator.mozGetUserMedia) {
            element.mozSrcObject = stream;
            element.play();
        } else {
            element.src = URL.createObjectURL(stream);
        }
    }
    
    webrtc.prototype.removeStream = function(domId) {
        var element = document.getElementById(domId);
        if (navigator.mozGetUserMedia) {
            element.mozSrcObject = null;
        } else {
            URL.revokeObjectURL(element.src);
        }
    }
    
    webrtc.prototype.createPeerConnection = function(socketId) {
        var that = this,
        pc;
        this.peerConnections[socketId] = pc = new PeerConnection(iceServer);
        pc.onicecandidate = function(evt) {
            if (evt.candidate) {
                that.websocket.send(JSON.stringify({
                    "cmd": "__ice_candidate",
                    "data": {
                        "label": evt.candidate.sdpMLineIndex,
                        "candidate": evt.candidate.candidate,
                        "socketId": socketId
                    }
                }));
            }
        };
        pc.onopen = function(evt) {
            that.emit("pc_opened", evt);
        };
        pc.onaddstream = function(evt) {
            that.emit('peer_stream', evt);
        };
        pc.onnegotiationneeded = function(evt){
            console.log('stream_needed');
            that.emit('stream_needed', evt);
        }
        pc.onremovestream = function(evt) {
            console.log('remove_stream');
            that.emit('remove_stream', evt);
        };
        pc.ondatachannel = function(evt) {
            console.log('pc_add_data_channel');
            that.emit('pc_add_data_channel', evt);
        };
        pc.onsignalingstatechange = function(evt){
            console.log('pc_signaling_change');
            that.emit('pc_signaling_change', {
                target : evt,
                stream : pc.signalingState
            });
        }
        pc.oniceconnectionstatechange = function(evt) {
            console.log('pc_ice_connections_change');
            that.emit('pc_ice_connections_change', {
                target : evt,
                stream : pc.connectionState
            });
        };
        pc.onicegatheringstatechange = function(evt) {
            console.log('pc_ice_gathering_change');
            that.emit('pc_ice_gathering_change', {
                target : evt,
                stream : pc.iceGatheringState
            });
        };
        pc.addStream(this.localMediaStream);
        pc.createDataChannel('');
        return pc;
    }
    
    webrtc.prototype.closePeerConnection = function(socketId){
        var pc;
        if(pc = this.peerConnections[socketId]){
            pc.close();
            delete this.peerConnections[socketId];
            this.connections.splice(this.connections.indexOf(socketId), 1);
        }
    }
    
    webrtc.prototype.closePeerConnections = function(){
        var that = this;
        this.connections.forEach(function(socketId){
            that.closePeerConnection(socketId);
        });
    }
    
    webrtc.prototype.closeSource = function(){
        this.localMediaStream && (this.localMediaStream = null);
        this.closePeerConnections();
    }
    
    webrtc.prototype.removeVideoTrack = function(stream){
        var that = this;
        try{
            removeStream();
        }catch(e){
            console.error(e);
        }
        function removeStream(){
            var videoStream = stream.getVideoTracks()[0];
            stream.removeTrack(videoStream);
            for(var id in that.peerConnections){
                var pc = that.peerConnections[id];
                pc.removeStream(stream);
                pc.addStream(stream);
            }
        }
    }
    
    webrtc.prototype.addVideoTrack = function(stream, videoStream){
        var that = this;
        try{
            addStream();
        }catch(e){
            console.error(e);
        }
        function addStream(){
            stream.addTrack(videoStream);
            for(var id in that.peerConnections){
                var pc = that.peerConnections[id];
                pc.removeStream(stream);
                pc.addStream(stream);
            }
        }
    }

    return new webrtc(role).initEvents();
}

export default WebRTC