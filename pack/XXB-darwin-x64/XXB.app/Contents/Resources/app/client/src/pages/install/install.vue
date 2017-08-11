<!--TODO:retina屏幕2倍切图 window.devicePixelRatio 可以拿到设备像素比 ----UI说不管了 - - ，-->
<template>
	<div class="install">
		<div class="install-logo" v-if="installPrg===1 || installPrg === 2 || installPrg ===0">
			<img src="../../../static/logos/main.png" alt="logo">
		</div>
		<div class="install-okLogo" v-if="installPrg===3">
			<img src="../../../static/icons/install_success.png" alt="install success">
			<p>安装成功</p>
		</div>
		<div class="install-btn" v-if="installPrg===1" @click="install">
			<my-btn :styles="'orange'" :size="20" :height="50" :width="200" :title="'立即安装'" v-if="isAgree"></my-btn>
			<my-btn :styles="'grey'" :size="20" :height="50" :width="200" :title="'立即安装'" v-if="!isAgree"></my-btn>
		</div>
		<div class="install-main" v-if="installPrg===1">
			<p class="install-main-title">默认安装路径</p>
			<div class="install-main-path">
				<input type="text" v-model="inputPath" class="install-main-path-input" disabled>
				<my-btn :title="'更改'" :style="'white'" :height="35" :width="80" :size="16"
						:fontColor="'#969696'"></my-btn>
			</div>
			<div class="install-main-protocol">
				<img src="../../../static/icons/disagree.png" alt="" v-if="!isAgree" @click="agree"
					 class="install-main-protocol-select">
				<img src="../../../static/icons/agree.png" alt="" v-if="isAgree" @click="agree"
					 class="install-main-protocol-select">
				<span class="install-main-protocol-txt">我已同意并阅读</span>
				<span class="install-main-protocol-click">学习宝用户使用及隐私协议</span>
			</div>
		</div>
		<div class="install-prg" v-if="installPrg===2">
			<p class="install-prg-txt">已安装（{{prgVal}}%）</p>
			<el-progress :text-inside="false" :stroke-width="18" :percentage="prgVal" class="prgMain"></el-progress>
			<p class="install-prg-txt2">正在安装...</p>
		</div>
		<div class="install-success" v-if="installPrg===3" >
			<my-btn :styles="'yellow'" :size="20" :height="50" :width="200" :title="'立即启动'" v-on:click.native="start"></my-btn>
		</div>
		<div class="install-uninstall" v-if="installPrg===0">
			<my-btn :styles="'yellow'" :size="20" :height="50" :width="200" :title="'开始卸载'" ></my-btn>
		</div>
	</div>
</template>

<script>
	import myBtn from '../../components/buttons/basicButtons.vue'
	import {countFn} from '../../common/scripts/util'
	export default {
		name: "",
		components: {
			myBtn
		},
		data () {
			return {
				inputPath: `C:\\Program Files\\xuexibao`,
				isAgree: false, // 是否同意协议
				prgVal: 0, // 模拟进度条的进度百分比

				// 安装进程 0: 卸载 1: 选择路径 2: 安装中 3: 安装完成
				installPrg: 1
			}
		},
		props: {},
		computed: {},
		created () {
		},
		mounted () {
		},
		methods: {
			agree() {
				this.isAgree = !this.isAgree
			},
			install(){
				if (this.isAgree) {
					this.installPrg = 2
					countFn(100, 100, this.count, this.countDone)
				}
			},
			count(){
				this.prgVal++
			},
			countDone(){
				this.installPrg = 3
			},
			start(){
				this.$router.push('home')
//			  console.log(window.location.href)
			}
		}
	}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
	@import "../../common/styles/mixin";

	.install {
		position: relative;
		width: 100%;
		@include allMidBox();
		&-logo {
			@include allMidBox();
			margin-top: 50px;
		}
		&-okLogo {
			margin-top: 52px;
			p {
				text-align: center;
				margin-top: 40px;
				@include fontSizeColor(30px, $fontClr_main)
			}
		}
		&-btn {
			margin-top: 60px;
			@include allMidBox();
		}
		&-main {
			float: left;
			margin-top: 35px;
			width: 580px;
			&-title {
				margin-bottom: 10px;
				@include fontSizeColor(14px, $fontClr_2nd);
			}
			&-path {
				display: flex;
				flex-flow: row nowrap;
				margin-bottom: 20px;
				&-input {
					box-sizing: border-box;
					padding-left: 10px;
					@include fontSizeColor(12px, $fontClr_2nd);
					margin-right: 10px;
					@include wh(490px, 35px)
				}
				&-input:disabled {
					background: #ffffff;
				}
			}
			&-protocol {

				display: flex;
				align-items: center;
				&-select {
					height: 18px;
					width: 18px;
					margin-right: 10px;
					img {
						width: 100%;
						height: 100%;
					}
					cursor: pointer;
				}
				span {
					font-size: 12px;
				}
				&-txt {
					color: $fontClr_2nd;
				}
				&-click {
					cursor: pointer;
					color: $orange;
				}
			}
		}
		&-prg {
			margin-top: 110px;
			.prgMain {
				width: 570px;
			}
			&-txt {
				color: $fontClr_1st;
				margin-bottom: 10px;
			}
			&-txt2 {
				position: absolute;
				bottom: -100px;
				right: 0;
				color: $fontClr_3rd;
			}
		}
		&-success {
			margin-top: 70px;
		}
		&-uninstall {
			margin-top: 165px;
		}
	}

</style>
