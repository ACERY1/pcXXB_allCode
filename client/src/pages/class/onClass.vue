<template>
	<div class="onClass">
		<div class="onClass-infoBar" v-if="isShowMtBar">
			<p>距离开课还有五分钟</p>
			<img src="../../../static/icons/live/closeBtn.png" alt="" @click="_showMtBar">
		</div>
		<div class="onClass-main">
			<div class="onClass-main-box">
				<canvas id="localCanvas"></canvas>
			</div>
			<div class="onClass-main-video">
				<div class="onClass-main-video-item">
					<div class="videoBox">
						<img src="../../../static/icons/live/closeBtn.png" alt="" class="video_clsBtn">
					</div>
					<div class="signalBar">
						<span>周老师</span>
						<img src="../../../static/icons/live/s1.png" alt="" v-if="signal1 === 1">
						<img src="../../../static/icons/live/s2.png" alt="" v-if="signal1 === 2">
						<img src="../../../static/icons/live/s3.png" alt="" v-if="signal1 === 3">
						<img src="../../../static/icons/live/s4.png" alt="" v-if="signal1 === 4">
						<img src="../../../static/icons/live/s5.png" alt="" v-if="signal1 === 5">
						<img src="../../../static/icons/live/s6.png" alt="" v-if="signal1 === 6">
					</div>
				</div>
				<div class="onClass-main-video-item">
					<div class="videoBox">
						<video autoplay="autoplay" muted :src="localVideoURL" width="238" height="250"></video>
						<img src="../../../static/icons/live/closeBtn.png" alt="" class="video_clsBtn">
					</div>
					<div class="signalBar">

						<span @click="test">我</span>
						<img src="../../../static/icons/live/s1.png" alt="" v-if="signal2 === 1">
						<img src="../../../static/icons/live/s2.png" alt="" v-if="signal2 === 2">
						<img src="../../../static/icons/live/s3.png" alt="" v-if="signal2 === 3">
						<img src="../../../static/icons/live/s4.png" alt="" v-if="signal2 === 4">
						<img src="../../../static/icons/live/s5.png" alt="" v-if="signal2 === 5">
						<img src="../../../static/icons/live/s6.png" alt="" v-if="signal2 === 6">
					</div>
				</div>
			</div>
		</div>
		<tool-bar class="toolBar" @changeSize="changeSize" @changeColor="changeColor" @useEraser="useEraser"
				  @cancelEraser="cancelEraser" @clearCanvas="clearCanvas"></tool-bar>
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
		import {randomNum, countFn, setMediaStream} from '../../common/scripts/util'
		export default {
			name: "",
			components: {
				toolBar
			},
			data () {
				return {
					isShowMtBar: true,
					signal1: 6,
					signal2: 6,
					localVideoURL: '',
					localCanvas: null
				}
			},
			props: {},
			computed: {},
			created () {
			},
			mounted () {

				this.localCanvas = new XBoard('localCanvas', $('#localCanvas'))
//				let a = new XBoard('test', $('#test'))
//				this.localCanvas.changeColor('blue')
//				this.localCanvas.changeSize('S')
//				setTimeout(() => {
//
//
//				}, 4000)
//				setTimeout(() => {
//					console.log('start')
//					a.useEraser()
//				}, 8000)
//				setTimeout(() => {
//				  	a.cancelEraser()
//				  	a.clearCanvasByPoints(a.clearPoints)
//					console.log('stop')
////					a.recompute($('#test'))
//				}, 12000)

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
				height: 100%;
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
					background: #42b983;
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
		@include wh(100%, 100%)
	}
</style>
