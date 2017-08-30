<template>
	<div id="app">
		<router-view></router-view>
	</div>
</template>

<script >
	import {getCookie, getSession,getStore} from './common/scripts/util'
	export default {
		name: 'app',
		data () {
			return {}
		},
		created(){
		/*TODO:判断登录还是有问题 ps:现在解决了*/
			if (getCookie("x_token") == null ||getStore('name')=='请登录') {
				this.$router.push('/static/login')
			} else {
		  /*TODO:根据session 里是否有temp_courseId 来判断是否是从制作课件跳转回来的*/
				if (getSession("temp_courseId") != null) {
					this.$router.push('/static/classInfo')
				}
				if(getSession('courseId_forClass')){
					// 上课阶段防止跳转
					this.$message("正在上课呢")
				}
				else {
					this.$router.push('/static/main')
				}

			}
			window.onkeydown = (e) => {
				if (e.code == 'Escape') {
					this.$ipc.send('esc')
				}
			}
		}
	}

</script>

<style lang="scss" rel="stylesheet/scss">
	@import "./common/styles/common.scss";
	@import "./common/styles/mixin.scss";

	.el-menu-item.is-active {

		border-bottom: 2px solid #f4a100 !important;
	}

	.el-dialog--large{
		width:450px!important;
		height: 500px;
	}

	#app {
		height: 100%;
	}

	.el-progress-bar__inner {
		background-color: $orange !important;
	}

	.el-progress-bar__outer {
		background-color: $pre2 !important;
	}
	.el-dialog--full{
		top: 10% !important;
		height:500px !important;
		width: 800px !important;
	}

	.el-dialog--small {

		height: 200px !important;
		width: 450px !important;
	}

	.el-dialog {
		border-radius: 5px !important;
	}

	.el-dialog__close {
		font-size: 12px;
		color: $fontClr_2nd;
	}

	.el-dialog__close:hover {
		color: $orange !important;
	}

	.el-dialog__header {
		border-radius: 5px !important;
		height: 55px !important;
		background: $bg_wht !important;
	}

	.el-dialog__body {
		padding: 0 0px 0 0px !important;
	}

	.el-slider__button {
		background-color: $orange !important;
	}

	.el-slider__bar {
		background-color: $orange !important;
	}

	.el-progress__text {
		display: none !important;
	}

	.el-message {
		margin-top: 70vh;
		border-radius: 5px !important;
		background: rgba(0, 0, 0, .6) !important;
		img {
			display: none !important;
		}
	}

	.el-message__group {
		margin-left: 0 !important;
		display: flex !important;
		justify-content: center !important;
		p {
			margin: 0 !important;
			color: #ffffff !important;
			font-size: 14px !important;
		}
	}

	.el-message-box{

	}

	.el-message-box__headerbtn:focus .el-message-box__close, .el-message-box__headerbtn:hover .el-message-box__close{
		color: $orange!important;
	}

	.el-message-box__headerbtn:focus .el-message-box__close, .el-message-box__headerbtn:hover .el-message-box__close{
		color: #fff;
		border-color: $orange!important;
	}
	.el-button:focus, .el-button:hover{
		color: $border!important;
		border-color: $orange!important;
	}
	.el-button--primary{
		background-color:$orange!important;
		border-color: $border!important;
	}
	@media screen  and (min-width: 1000px){
		.el-dialog--full{
			top: 10% !important;
			height:900px !important;
			width: 900px !important;
		}
	}

	@media screen  and (max-width: 1000px){
		.el-dialog--full{
			top: 10% !important;
			height:500px !important;
			width: 800px !important;
		}
	}
</style>
