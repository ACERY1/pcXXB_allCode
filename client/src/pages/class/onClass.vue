<template>
	<div class="onClass">
		<div class="onClass-infoBar" v-if="isShowMtBar">
			<p>距离开课还有五分钟</p>
			<img src="../../../static/icons/live/close.png" alt="" @click="_showMtBar">
		</div>
		<div class="onClass-main">
			<div class="onClass-main-box"></div>
			<div class="onClass-main-video">
				<div class="onClass-main-video-item">
					<div class="videoBox">
						<img src="../../../static/icons/live/close.png" alt="" class="video_clsBtn">
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
						<img src="../../../static/icons/live/close.png" alt="" class="video_clsBtn">
					</div>
					<div class="signalBar">
						<span>我</span>
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
		<tool-bar></tool-bar>
	</div>
</template>

<script>
	import toolBar from '../../components/bars/toolsBar.vue'
	import {randomNum, countFn} from '../../common/scripts/util'
	export default {
		name: "",
		components: {
			toolBar
		},
		data () {
			return {
				isShowMtBar: true,
				signal1: 6,
				signal2: 6
			}
		},
		props: {},
		computed: {},
		created () {
			countFn(100, 100, () => {
				this._updateSignal1(randomNum(1, 6))
				this._updateSignal2(randomNum(1, 6))
			}, () => {
				this.signal2 = 6
				this.signal1 = 6
			});
		},
		mounted () {
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
			}
		}
	}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
	@import "../../common/styles/mixin";

	.onClass {
		width: 1000px;
		&-infoBar {
			width: 1000px;
			z-index: 2050;
			position: absolute;
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
			height: 530px;
			&-box {
				height: 100%;
				background: #ffffff;
				width: 772px;
			}
			&-video {
				box-sizing: border-box;
				padding: 30px 15px 0 15px;
				width: 228px;
				height: 100%;
				background: $bg_wht;
				&-item {
					position: relative;
					@include wh(198px, 210px);
					background: #42b983;
					margin-bottom: 40px;
					.videoBox {
					}
					.signalBar {
						padding-top: 3px;
						padding-left: 10px;
						background: rgba(0, 0, 0, .5);
						position: absolute;
						@include wh(198px, 24px);
						bottom: 0;
						@include fontSizeColor(12px, $bg_wht);
						img {
							margin-top: 2px;
							margin-left: 4px;
							height: 14px;
						}
					}
				}
			}
		}
	}

	.video_clsBtn {
		cursor: pointer;
		right: 6px;
		top:  6px;
		position: absolute;
		@include wh(16px,16px)
	}
</style>
