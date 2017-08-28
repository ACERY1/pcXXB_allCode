<template>
	<div class="onClass">
		<div class="onClass-infoBar" v-if="isShowMtBar">
			<p>距离开课还有{{gapTime2}}分钟</p>
			<p v-show="false">{{gapTime}}</p>
			<img src="../../../static/icons/live/closeBtn.png" alt="" @click="_showMtBar">
		</div>
		<div class="onClass-main">
			<div class="onClass-main-box">
				<canvas id="localCanvas"></canvas>
				<canvas id="remoteCanvas"></canvas>
				<div id="imgBox">
					<img :src="images[pageCount]" alt="">
				</div>
				<div id="mask" v-if="isOnClass">
					<div class="btn">
						<basic-btn :title="'上课'" :styles="'orange'" @click.native="onClass"></basic-btn>
					</div>
				</div>
			</div>
			<div class="onClass-main-video">
				<div class="onClass-main-video-item">
					<div class="videoBox">
						<video autoplay="autoplay" muted :src="remoteVideoURL" width="238" height="250"></video>
						<img src="../../../static/icons/live/closeBtn.png" alt="" class="video_clsBtn">
					</div>
					<div class="signalBar">
						<span>周老师</span>
						<img src="../../../static/icons/live/s1.png" alt="" v-if="signal1 === 1||signal1 === 0">
						<img src="../../../static/icons/live/s2.png" alt="" v-if="signal1 === 2">
						<img src="../../../static/icons/live/s3.png" alt="" v-if="signal1 === 3">
						<img src="../../../static/icons/live/s4.png" alt="" v-if="signal1 === 4">
						<img src="../../../static/icons/live/s5.png" alt="" v-if="signal1 === 5">
						<img src="../../../static/icons/live/s6.png" alt="" v-if="signal1 >= 6">
					</div>
				</div>
				<div class="onClass-main-video-item">
					<div class="videoBox">
						<video autoplay="autoplay" muted :src="localVideoURL" width="238" height="250"></video>
						<img src="../../../static/icons/live/closeBtn.png" alt="" class="video_clsBtn">
					</div>
					<div class="signalBar">

						<span @click="test">我</span>
						<img src="../../../static/icons/live/s1.png" alt="" v-if="signal2 === 1 ||signal2 === 0">
						<img src="../../../static/icons/live/s2.png" alt="" v-if="signal2 === 2">
						<img src="../../../static/icons/live/s3.png" alt="" v-if="signal2 === 3">
						<img src="../../../static/icons/live/s4.png" alt="" v-if="signal2 === 4">
						<img src="../../../static/icons/live/s5.png" alt="" v-if="signal2 === 5">
						<img src="../../../static/icons/live/s6.png" alt="" v-if="signal2 >= 6">
					</div>
				</div>
			</div>
		</div>
		<tool-bar class="toolBar" @changeSize="changeSize" @changeColor="changeColor" @useEraser="useEraser"
				  @cancelEraser="cancelEraser" @clearCanvas="clearCanvas" @addNewPage="addNewPage"
				  @offClass="offClass" :nowPage="nowPage" :allPage="pageNum" @backPage="backPage"
				  @forwardPage="forwardPage" @timeUp="timeCountDone"></tool-bar>
	</div>
</template>

<script>
	/*功能
	 * 1.获取本地视频流并显示出来，记得清除多余的mediaStream
	 * 2.通过webrtc建立p2p视频通话（ws连接，发送自己的流，接受对面的流） 流包括 音频流 视频流 坐标流(x,y)
	 * 3. 本地canvas绘图 改变颜色 粗细 并返回实时的坐标(x,y)
	 * 4. 两张canvas重叠，一张接受对面的坐标，一张绘自己的坐标
	 * 5. 新增白纸功能,在图片最后一页加入白纸，翻页会翻到图片的下一页，清空当前的绘图数据
	 * 6.
	 * 2.*/
		import toolBar from '../../components/bars/toolsBar.vue'
		import {XMediaStream} from '../../common/scripts/XmediaStream'
		import {XAudioBox} from '../../common/scripts/XaudioBox'
		import {XBoard} from '../../common/scripts/XBoard'
		import {computeVolume} from '../../common/scripts/util'
		import  basicBtn from '../../components/buttons/basicButtons.vue'
		import {
			randomNum, countFn, setMediaStream, getSession, setSession, removeSession
		} from '../../common/scripts/util'
		//		import mediaConnection from '../../../js/media-connection'
		//		import mediaConnection from '../../common/scripts/mediaConnection'
		import WebRTC from '../../../js/webrtc'
		export default {
			name: "",
			components: {
				toolBar,
				basicBtn
			},
			data () {
				return {
					beginTime: null,
					courseId: null,
					gapTime2: null,
					intervalId: null,
					coursewareId: null,
					lessonToken: null,
					isShowMtBar: true,
					signal1: 6,
					signal2: 6,
					localVideoURL: '',
					remoteVideoURL: '',
					localStreamObj: {},
					remoteStreamObj: {},
					localAudio: {},
					remoteAudio: {},
					localCanvas: null,
					remoteCanvas: null,
					localBox: null,
					remoteBox: null,
					images: [],
					imagesObj: [],
					pageCount: 0,// 图片页数
					isOnClass: true
				}
			},
			props: {},
			computed: {
				pageNum (){
					return this.images.length
				},
				nowPage (){
					return this.pageCount + 1
				},
				gapTime: {
					get (){
						if (this.beginTime != null) {
							let _time = Math.ceil((this.beginTime - (+new Date())) / 60000)
							if (_time <= 0) {
								this.isShowMtBar = false
							}
							countFn(_time, 60000, () => {
								this.gapTime2 = --_time
							}, () => {
								this.isShowMtBar = false
							})
							this.gapTime2 = _time
						} else {
							this.gapTime2 = 5
						}

					},
					set (data){
						console.log(data)
						this.gapTime2 = data
					}
				}
			},
			created () {
			},
			mounted () {
				// clear the interval
				clearInterval(getSession('interval_id'))
				removeSession('interval_id')
				// init courseId
				this.courseId = getSession('courseId_forClass');
				// bind reDraw event
				this.$ipc.on('redraw', () => {
					this._reDraw();
				})
				// onClass
				this._onClass()
				// 实例化本地白板
				this.localCanvas = new XBoard('localCanvas', $('#localCanvas'))
				this.remoteCanvas = new XBoard('remoteCanvas', $('#remoteCanvas'))
				let getData = async() => {
					try {
						await  this.$api.videoPlatform(this.courseId, 'webrtc')
						let _coursewareId = await this.$api.searchCourseware(this.courseId)

						//	获取课件id
						this.coursewareId = _coursewareId.data.coursewareId
						let _coursePics = await this.$api.previewCourseWare(this.coursewareId)

						// 获取图片和课件详细信息
						this.imagesObj = _coursePics.data.pageList
						for (let item of this.imagesObj) {
							this.images.push(item.imageUrl)
						}

						// 获取上课token
						let _courseToken = await this.$api.getLessonToken(this.courseId)
						this.lessonToken = _courseToken.data.result.lessonToken
//						console.log(this.coursewareId, this.images, this.lessonToken)
						this._polling(25000)
					} catch (err) {
						console.error(err)
					}

				}

				getData()

				// 当前课程
				this.$api.getCurrentCourse(this.courseId).then((res) => {
					let _data = res.data
					this.beginTime = _data.beginTime
					console.log(res)
				})

//				this.mediaConnection()


			},
			beforeDestroy(){
				//
				this._offClass()
			},
			methods: {
				_showMtBar(){
					this.isShowMtBar = false
				},
				_updateSignal1(val){
					this.signal1 = val
				},
				_updateSignal2(val){
					this.signal2 = val
				},
				//	顶部提示距离上课时间
//				_remindTime(){
//					let _nowTime = +new Date()
//					let _gapTime = this.beginTime - (+new Date())
//
////					countFn()
//				},
				// 重绘和重计算高度
				_reDraw(){
					this.remoteCanvas.recompute($('#remoteCanvas'))
					this.localCanvas.recompute($('#localCanvas'))
					this.localCanvas.plotPoints()
				},
				// 发送上课命令
				_onClass (){
					console.log('上课')
					this.$ipc.send("onClass", true)
				},
				// 发送上课请求
				onClass (){
//				  console.log(Math.round((this.beginTime - (+new Date())) / 60000))
					if (Math.round((this.beginTime - (+new Date())) / 60000) > 0) {
						this.$message({message: '还未到上课时间', duration: 1500})
						return false
					}
					console.log('发送上课请求')
					this.$api.startLesson(this.lessonToken).then((res) => {
						let _data = res.data
						if (!_data.status) {
							// 上课成功
							this.$store.commit('START_COUNT_TIME')
						} else {
							this.$message({message: _data.msg, duration: 1500})
						}

					}).catch((err) => {
						console.error(err)
					})
				},
				// 发送下课命令
				_offClass () {
					this.$ipc.send('onClass', false)
					console.log('下课')
				},
				// 轮询
				_polling (gapTime){
					let that = this
					if (gapTime < 5000 || !this.lessonToken) {
						return;
					}
					let intervalId = setInterval(() => {
						that.$api.syncLessonMessage(this.lessonToken)
					}, gapTime)
					setSession('interval_id', intervalId)
				},
				// 上课视频连接
				mediaConnection () {
					let webrtc = WebRTC('teacher')
					let courseId = window.sessionStorage.getItem('courseId_forClass') || 0
					let onlineStatus = true
					let localStreamObj = {}
					let remoteStreamObj = {}
					let that = this
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
						localStreamObj = new XMediaStream()
						localStreamObj.recordStream(e.stream)
						// 记录音频
						that.localBox = new XAudioBox()
						that.localBox.initBox()
						that.localBox.loadStream(e.stream)
						that.localBox.createDataArray(32)
						that.localBox.outputData(() => {
							that.signal2 = computeVolume(that.localBox.dataArray, 300)
						})
						that.localStreamObj = localStreamObj
						that.localVideoURL = window.URL.createObjectURL(localStreamObj.mediaStream)
					});

					webrtc.on("peer_stream", function (e) {
						// 来自对方
						remoteStreamObj = new XMediaStream()
						remoteStreamObj.recordStream(e.stream)
						that.remoteBox = new XAudioBox()
						that.remoteBox.initBox()
						that.remoteBox.loadStream(e.stream)
						that.remoteBox.createDataArray(32)
						that.remoteBox.outputData(() => {
							that.signal1 = computeVolume(that.remoteBox.dataArray, 300)
						})
						that.remoStreamObj = remoteStreamObj
						that.remoteVideoURL = window.URL.createObjectURL(remoteStreamObj.mediaStream)
					});


					webrtc.on("remove_peer", function () {
						console.log("remove_peer");
					});
					webrtc.on("remove_stream", function () {
						console.log("远程流删除");
					});

					that.$api.teacherConfigure(courseId).then((res) => {
						let _data = res.data.result.video
						webrtc.connect(_data.channelName, _data.uid, _data.key)

					}).catch((err) => {
						console.log(err)
					})

				},
				// 测试封装的媒体流对象
				test (){
					let t = new XMediaStream()
					try {
						(async() => {
							await t.createMedia('audio')
							let ad = new XAudioBox()
							ad.initBox()
//							ad.loadSrc('../../../static/audios/demo.mov')
							ad.loadStream(t.mediaStream)
							ad.createDataArray(32)
//							ad.playSrc(1)

							ad.outputData(() => {
								console.log(ad.dataArray)
							})

							setTimeout(() => {
								t.stopAll()
//								ad.stop()
							}, 2000)


//							this.localVideoURL = window.URL.createObjectURL(t.mediaStream)
						})()
					} catch (err) {
						console.log(err)
					}

				},
				changeColor(code){
					let color = null
					switch (code) {
						case 0:
							color = 'red';
							break;
						case 1:
							color = 'black';
							break;
						case 2:
							color = 'blue';
							break;
					}
					this.localCanvas.changeColor(color)
				},
				changeSize (code) {
					let size = null
					switch (code) {
						case 0:
							size = 'L';
							break;
						case 1:
							size = 'M';
							break;
						case 2:
							size = 'S';
							break;
					}
					this.localCanvas.changeSize(size)
				},
				useEraser (){
					this.localCanvas.useEraser()
				},
				cancelEraser (){
					this.localCanvas.cancelEraser()
				},
				clearCanvas (){
					this.localCanvas.clearAllCanvas()
				},
				addNewPage (){
					console.log('添加新页')
				},
				offClass () {
//					console.log('下课')
					this.$api.teacherFinishCourse(this.courseId)
					this.$store.commit("UPDATE_COURSE_ID", this.courseId)
					this.$router.push('/static/classInfo')
				},
				// 上一页
				backPage (){
					this.pageCount--
				},
				// 下一页
				forwardPage (){
					this.pageCount++
				},
				// 底部栏计时结束
				timeCountDone (){
					console.log('计时结束！！')
				}
			}
		}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
	@import "../../common/styles/mixin";

	.onClass {
		/*position: relative;*/
		width: 100%;
		&-infoBar {
			width: 100%;
			z-index: 1000;
			position: fixed;
			height: 20px;
			background: #fff198;
			p {
				text-align: center;
				@include fontSizeColor(14px, #d0aa17)
			}
			img {
				cursor: pointer;
				@include wh(14px, 14px);
				top: 3px;
				position: absolute;
				right: 10px;
			}
		}
		&-main {
			@include rowBox();
			height: 90vh;
			&-box {
				position: relative;
				height: 100%;
				z-index: 0;
				/*background-color: #b3b3b3;*/
				background: #ffffff;
				width: 80%;
			}
			&-video {
				box-sizing: border-box;
				padding: 20px 15px 0 15px;
				width: 20%;
				height: 90%;
				background: $bg_wht;
				display: flex;
				flex-flow: column;
				align-items: center;
				&-item {
					position: relative;
					background: rgba(0, 0, 0, .8);
					margin-bottom: 40px;
					overflow: hidden;
					.videoBox {
						@include wh(100%, 100%);
					}
					.signalBar {
						padding-top: 3px;
						padding-left: 10px;
						background: rgba(0, 0, 0, .5);
						position: absolute;

						bottom: 0;
						@include fontSizeColor(12px, $bg_wht);
						img {
							margin-top: 2px;
							margin-left: 4px;
							height: 14px;
						}
					}
				}

				/*for minScreen*/
				@media screen and(max-width: 1140px) {
					&-item {
						@include wh(148px, 200px);
					}
					.signalBar {
						@include wh(148px, 24px);
					}
				}
				/*For fullScreen*/
				@media screen and(min-width: 1140px) {
					&-item {
						@include wh(238px, 250px);
					}
					.signalBar {
						@include wh(100%, 24px);
					}
				}
			}
			/*For xs Screen*/
			@media screen and(max-width: 800px) {
				&-box {
					width: 100%;
				}
				&-video {
					display: none;
				}
			}
		}
	}

	.video_clsBtn {
		cursor: pointer;
		right: 6px;
		top: 6px;
		position: absolute;
		@include wh(16px, 16px)
	}

	.toolBar {
		bottom: 0;
		position: fixed !important;
	}

	#localCanvas {
		z-index: 1;
		top: 0;
		position: absolute;
		@include wh(100%, 100%)
	}

	#remoteCanvas {
		top: 0;
		z-index: 0;
		position: absolute;
		@include wh(100%, 100%)
	}

	#imgBox {
		top: 0;
		position: absolute;
		@include wh(100%, 100%);
		img {
			@include wh(100%, 100%)
		}
	}

	#mask {
		top: 0;
		position: absolute;
		z-index: 1;
		@include wh(100%, 100%);
		@include allMidBox();
		background: rgba(0, 0, 0, .4);
		.btn {
			position: absolute;
			z-index: 2;
		}
	}
</style>
