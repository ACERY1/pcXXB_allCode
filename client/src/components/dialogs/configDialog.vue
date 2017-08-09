<template>
	<div class="setting" ref="test">
		<el-dialog title="设备检测" v-model="show" size="large" :show-close="false">
			<el-menu class="el-menu-demo" mode="horizontal" :default-active="focusItem" @select="change">
				<el-menu-item index="mic" @click="showMic">麦克风</el-menu-item>
				<el-menu-item index="voice" @click="showVoice">扬声器</el-menu-item>
				<el-menu-item index="camera" @click="showVideo">摄像头</el-menu-item>
			</el-menu>
			<div class="setting-mic" v-show="focusItem === 'mic'">
				<p class="setting-mic-title">麦克风音量</p>
				<div class="setting-mic-bar " style="margin-top: 20px;margin-bottom: 20px">
					<img src="../../../static/icons/mic.png" alt="" style="height: 23px;width: 18px">
					<ul>
						<li v-for="i,index in 9" :class="{org:(index+1)<= testMicVal}"></li>
					</ul>
					<audio :src="audioURL" autoplay id="micAudio"></audio>
				</div>
				<p class="setting-mic-title">调整麦克风音量</p>
				<div class="setting-mic-bar">
					<img src="../../../static/icons/mic.png" alt="">
					<el-slider v-model="micVal" class="slider"></el-slider>
				</div>
				<div class="setting-mic-choose">
					<el-dropdown trigger="click">
      				<span class="el-dropdown-link">
        				无麦克风设备<i class="el-icon-caret-bottom el-icon--right"></i>
     				 </span>
						<el-dropdown-menu>
							<el-dropdown-item>黄金糕</el-dropdown-item>
							<el-dropdown-item>狮子头</el-dropdown-item>
							<el-dropdown-item>螺蛳粉</el-dropdown-item>
							<el-dropdown-item>双皮奶</el-dropdown-item>
							<el-dropdown-item>蚵仔煎</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</div>
				<p class="setting-mic-add">如说话无反应，请尝试更换麦克风设备</p>
			</div>
			<div class="setting-voice" v-show="focusItem === 'voice'">
				<p class="setting-mic-title">点击测试按钮，播放声音</p>
				<div class="setting-mic-bar " style="margin-top: 20px;margin-bottom: 20px">
					<img src="../../../static/icons/voice.png" alt="" style="height: 23px;width: 18px">
					<ul>
						<li v-for="i,index in 9" :class="{org:(index+1)<= volVal}"></li>
					</ul>
					<button class="test-btn" @click="testVol">点击测试</button>
				</div>
				<p class="setting-mic-title" style="margin-bottom: 20px">调整扬声器音量</p>
				<div class="setting-mic-bar">
					<img src="../../../static/icons/voice.png" alt="">
					<el-slider v-model="voiceVal" class="slider"></el-slider>
				</div>
				<div class="setting-mic-choose">
					<el-dropdown trigger="click">
      				<span class="el-dropdown-link">
        				无扬声器设备<i class="el-icon-caret-bottom el-icon--right"></i>
     				 </span>
						<el-dropdown-menu>
							<el-dropdown-item>黄金糕</el-dropdown-item>
							<el-dropdown-item>狮子头</el-dropdown-item>
							<el-dropdown-item>螺蛳粉</el-dropdown-item>
							<el-dropdown-item>双皮奶</el-dropdown-item>
							<el-dropdown-item>蚵仔煎</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</div>
				<p class="setting-mic-add">若听不见声音，请尝试更换扬声器设备</p>
			</div>
			<div class="setting-camera" v-if="focusItem === 'camera'">
				<div class="videoBox">
					<p>预览</p>
					<video class="videoScreen" autoplay="autoplay" muted :src="videoURL"></video>
				</div>
				<div class="setting-mic-choose">
					<el-dropdown trigger="click">
      				<span class="el-dropdown-link">
        				无视频设备<i class="el-icon-caret-bottom el-icon--right"></i>
     				 </span>
						<el-dropdown-menu>
							<el-dropdown-item>黄金糕</el-dropdown-item>
							<el-dropdown-item>狮子头</el-dropdown-item>
							<el-dropdown-item>螺蛳粉</el-dropdown-item>
							<el-dropdown-item>双皮奶</el-dropdown-item>
							<el-dropdown-item>蚵仔煎</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</div>
				<p class="setting-mic-add">若看不见视频，请更换视频设备</p>
			</div>
			<div class="dlg-btn">
				<div class="dlg-btn-grp">
					<button class="cancle" @click="unShow">取消</button>
					<button class="select" @click="select">确定</button>
				</div>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import {
		randomNum, countFn, setMediaStream, outputAudioData, computeVolume, readAudioTo_HZ_Array
	} from '../../common/scripts/util'
	export default {
		name: "",
		components: {},
		data () {
			return {
				videoURL: '', // 视频流输入入口
				videoStream: '', // 保存视频流对象
				audioURL: '', // 麦克风音频流入口
				audioStream: '', //麦克风音频流对象
				voiceURL: '../../../static/audios/demo.mov', // 样本音频路径
				audioObj: null, // 用于保存扬声器设置下建立的音频对象
				isPlayVoice: false, //是否正在播放音频
				temp_micVal: 0, // 麦克风音量进度条(0-100) 中间数据
				temp_voiceVal: 0, // 扬声器音量进度条(0-100) 中间数据
				volVal: 0, // 播放声音的值
				testMicVal: 0, // 当前麦克风音量
				focusItem: 'mic', // 当前选中的设置页
				mediaStreams: [], // 保存所有媒体流，用于最后清除
				audioContexts: [], //保存生成的音频盒子 用于最后清楚
				animationId: '',
				gainNode: '',
				openCount: 0 //用于计数，防止多次setStream造成消耗
			}
		},
		props: {
//			select: {
//				type: Function,
//				default: () => {
//					console.log('selected')
//					this.$store.commit('UPDATE_SHOW_SETTING')
//				}
//			}
		},
		computed: {
			show: {
				get(){
					return this.$store.state.showSetting
				},
				set (){
					return false
				}
			},
			micVal: {
				get(){
					return this.$store.state.setting.micVal // 麦克风音量进度条(0-100)
				},
				set(data){
//					this.temp_micVal = data // 当前值
					this.$store.state.setting.micVal = data
				}

			},
			voiceVal: {
				get (){
					return this.$store.state.setting.voiceVal // 扬声器音量进度条(0-100)
				},
				set(data){
//					this.temp_voiceVal = data // 当前值
					this.$store.state.setting.voiceVal = data
				}

			}

		},
		created () {
			this.showMic()
			this.temp_micVal = this.$store.state.setting.micVal
			this.temp_voiceVal = this.$store.state.setting.voiceVal
		},
		mounted () {
		},
		methods: {
			select () {
				console.log('selected')
				this._closeStream()
				this.$store.commit('UPDATE_SHOW_SETTING')
			},
			_closeStream(){
				for (let i = 0; i < this.mediaStreams.length; i++) {
					this.mediaStreams[i].getTracks()[0].stop()
				}
				for (let i = 0; i < this.audioContexts.length; ++i) {
					this.audioContexts[i].close()
				}
				this.audioContexts = []
				this.isPlayVoice = false
				this.audioObj = null
				this.volVal = 0
				this.testMicVal = 0
				if (this.animationId != '') {
					window.cancelAnimationFrame(this.animationId)
				}
				if (this.audioObj != null) {
					this.audioObj.pause()
				}

			},
			//监听头部栏改变时间
			change(index){
				this.focusItem = index
			},
			// 测试声音
			testVol(){
				if (this.isPlayVoice) {
					this.audioObj.pause()
					this.isPlayVoice = false
				} else {
					if (this.audioObj != null) {
						//说明被初始化了
						this.audioObj.play()
						this.isPlayVoice = true
					} else {
						//将音频导入分析器*/
						let audioCtx = readAudioTo_HZ_Array(this.voiceURL, 32)
						let hzArray = audioCtx.array
						let analyser = audioCtx.analyser
						this.audioContexts.push(audioCtx.audioBox)
						this.audioObj = audioCtx.audio
						//播放音频
						this.audioObj.volume = 0.5
						this.audioObj.play()
						this.isPlayVoice = true
						// 动画
						let _ani = () => {
							analyser.getByteFrequencyData(hzArray);
							//TODO 600-x*6 是取样函数 x值越大 计算出来的值就越大*/
							this.volVal = computeVolume(hzArray, 300);
							if (this.audioObj == null) {
								return false
							}
							this.audioObj.volume = this.voiceVal / 100	// 拿到麦克风音量
							requestAnimationFrame(_ani)
						}
						requestAnimationFrame(_ani)
					}
				}

			},
			// 退出显示
			unShow(){
				this._closeStream()
				this.$store.commit('UPDATE_SHOW_SETTING')
				this.$store.commit('REVERT_SETTING_DATA', {voice: this.temp_voiceVal, mic: this.temp_micVal})
			},
			// 显示视频
			showVideo(){
				if (this.openCount > 6) {
					this.unShow()
				}
				this._closeStream()
				setMediaStream(false, true).then((stream) => {
					this.videoURL = window.URL.createObjectURL(stream)
					this.videoStream = stream
					this.mediaStreams.push(stream)
					this.openCount++
//					console.log(this.mediaStreams)
				})
			},
			//显示麦克风
			showMic(){
				if (this.openCount > 6) {
					this.unShow()
				}
				this._closeStream()
				setMediaStream(true, false).then((stream) => {
					this.audioStream = stream
					this.audioURL = window.URL.createObjectURL(stream)
					this.mediaStreams.push(stream)
					let audio = outputAudioData(stream, 32)

					this.audioContexts.push(audio.audioCtx)

					let _analyser = audio.analyser
					let array = new Uint8Array(_analyser.frequencyBinCount) // array长度和frequencyBinCount长度相等
					let _ani = () => {
						_analyser.getByteFrequencyData(array);
						//TODO 600-x*6 是取样函数 x值越大 计算出来的值就越大*/
						this.testMicVal = computeVolume(array, this.micVal > 0 ? 800 - this.micVal * 8 + 100 : 10000);
						if (document.querySelector('#micAudio') == null) {
							return false
						}
						document.querySelector('#micAudio').volume = this.micVal / 100	// 拿到麦克风音量
						requestAnimationFrame(_ani)
					}

					this.openCount++
					this.animationId = requestAnimationFrame(_ani)
				})
			},
			// 显示扬声器
			showVoice(){

				if (this.openCount > 6) {
					this.unShow()
				}
				this._closeStream()
				console.log()
				this.openCount++
			}
		}
	}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
	@import "../../common/styles/mixin";

	.setting {
		position: relative;
		&-mic {
			&-title {
				@include fontSizeColor(14px, $fontClr_main);
				display: flex;
				align-items: center;
				margin-top: 30px;
				height: 30px;
				background: $bg_wht;
				padding-left: 20px;
			}
			&-bar {
				img {
					@include wh(20px, 20px);
					margin-left: 20px;
					margin-right: 10px;
				}
				@include rowBox();
				align-items: center;
				.slider {
					width: 315px;
				}
				ul {
					li {
						float: left;
						margin-right: 8px;
						width: 2px;
						height: 12px;
						background-color: $fontClr_2nd;
					}
				}
			}
			&-choose {
				margin-top: 25px;
				margin-left: 20px;
			}
			&-add {
				margin-top: 20px;
				margin-left: 20px;
				@include fontSizeColor(14px, $fontClr_2nd);
			}
		}
		&-voice {
			position: relative;

		}
		&-camera {
			.videoBox {
				@include allMidBox();
				p {
					font-size: 14px;
					color: #666666;
					margin-top: 30px;
					margin-bottom: 10px;
				}
				p:not(:first-child) {
					cursor: pointer;
					position: absolute;
				}
				video {
					height: 150px;
					width: 200px;
					background: $pre2;
				}

			}
		}
	}

	.el-menu {
		background: #ffffff;
		border: solid $border;
		border-width: 0 0 1px 0;
		margin-left: 20px;
		margin-right: 20px;
	}

	.el-menu-item {

		box-sizing: border-box !important;
		/*padding-top: 30px!important;*/
		/*padding-bottom: 30px !important;*/
		font-size: 14px !important;;
		color: $fontClr_2nd !important;
		font-weight: 600 !important;
	}

	.el-menu-item:hover {
		background: #ffffff !important;
		border-bottom: 2px solid $orange;
		color: $orange !important;
	}

	.el-menu-item, .el-submenu__title {
		border: none !important;
		cursor: pointer;
		transition: .1s !important;

	}

	.is-active {
		border-bottom: 2px solid $orange !important;
		color: $orange !important;
		border-bottom: 2px solid $orange;
	}

	.el-slider {

	}

	.el-slider__button {
		background-color: $orange !important;
	}

	.el-dropdown {
		position: relative;
		@include fontSizeColor(14px, $fontClr_2nd);
		display: flex;
		align-items: center;
		width: 350px;
		height: 25px;
		border: 1px solid $border;
		.el-dropdown-link {
			cursor: default;
			margin-left: 10px;
		}
	}

	.el-icon--right {
		cursor: pointer;
		top: 6px;
		right: 5px;
		position: absolute;
		color: $orange;
	}

	.dlg-btn {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		border-radius: 5px !important;
		bottom: 0;
		height: 60px;
		width: 450px;
		background: $bg_wht;
		position: absolute;
		&-grp {
			margin-right: 20px;
			display: flex;
			flex-flow: row;

			@include wh(170px, 30px)
		}
		.cancle {
			cursor: pointer;
			box-sizing: border-box;
			border: 1px solid $border;
			@include fontSizeColor(14px, $fontClr_2nd);
			background: #ffffff;
			margin-right: 5px;
			width: 80px;
		}
		.select {
			cursor: pointer;
			@include fontSizeColor(14px, #ffffff);
			background: $orange;
			margin-left: 5px;
			width: 80px;
		}

	}

	.test-btn {
		background: #ffffff;
		border: 1px solid $orange;
		@include fontSizeColor(14px, $orange);
		cursor: pointer;
		@include wh(80px, 30px);
		position: absolute;
		top: 50px;
		right: 20px;
	}

	.org {
		background-color: $orange !important;
	}
</style>
