<template>
	<div id="app">
		<router-view></router-view>
	</div>
</template>

<script>
	export default {
		name: 'app',
		data () {
			return {}
		},
		created(){
			if (!this.$store.state.isLogin) {
				/*TODO:这里以后做刷新不登录跳转*/
				this.$router.push('/static/login')
			} else {
				this.$router.push('/static/main')
			}
		}
	}
</script>

<style lang="scss" rel="stylesheet/scss">
	@import "./common/styles/common.scss";
	@import "./common/styles/mixin.scss";



	.el-menu-item.is-active{

		border-bottom: 2px solid #f4a100!important;
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

	.el-dialog--large {

		height: 545px !important;
		width: 450px !important;
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
		display: none!important;
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
		margin-top: 40%;
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
</style>
