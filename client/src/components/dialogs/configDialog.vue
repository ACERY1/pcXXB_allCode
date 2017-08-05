<template>
	<div class="setting" >
		<el-dialog title="设备检测" v-model="show" size="large" :show-close="false">
			<el-menu class="el-menu-demo" mode="horizontal" :default-active="focusItem" @select="change">
				<el-menu-item index="mic">麦克风</el-menu-item>
				<el-menu-item index="voice">扬声器</el-menu-item>
				<el-menu-item index="camera">摄像头</el-menu-item>
			</el-menu>
			<div class="setting-mic" v-if="focusItem === 'mic'">
				<p class="setting-mic-title">麦克风音量</p>
				<div class="setting-mic-bar " style="margin-top: 20px;margin-bottom: 20px">
					<img src="../../../static/icons/voice.png" alt="" style="height: 23px;width: 18px">
					<ul>
						<li v-for="i,index in 9" :class="{org:(index+1)<= testMicVal}"></li>
					</ul>
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
			<div class="setting-voice" v-if="focusItem === 'voice'">
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
					<video src="" class="videoScreen"></video>
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
	import {randomNum, countFn} from '../../common/scripts/util'
	export default {
		name: "",
		components: {},
		data () {
			return {
//				show: true,
				micVal: 50, // 麦克风音量进度条
				voiceVal: 60, // 扬声器音量进度条
				volVal: 0, // 播放声音的值
				testMicVal: 0, // 当前麦克风音量
				focusItem: 'mic'
			}
		},
		props: {
			select: {
				type: Function,
				default: () => {
					console.log('selected')
				}
			}
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
//			show(){
//				return this.$store.state.showSetting
//			}
		},
		created () {
//			this.testMic()
		},
		mounted () {
		},
		methods: {
			change(index){
				this.focusItem = index
			},
			testVol(){
				countFn(40, 50, () => {
					this.volVal = randomNum(1, 9);
				}, () => {
					this.volVal = 0;
				})

			},
			testMic(){
				countFn(40, 100, () => {
					this.testMicVal = randomNum(1, 9);
				}, () => {
					this.testMicVal = 0;
				})

			},
			unShow(){
			  this.$store.commit('UPDATE_SHOW_SETTING')
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
		@include fontSizeColor(14px, $fontClr_2nd)
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
