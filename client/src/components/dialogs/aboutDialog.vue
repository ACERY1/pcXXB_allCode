<template>
	<div class="">
		<el-dialog title="关于我们" v-model="show" size="large">
			<cls-btn :on="isOn" class="indexCnt-clsBtn" :close="close"></cls-btn>
			<div class="about">
				<img src="../../../static/logos/main.png" alt="" class="about-logo"/>
				<p class="about-version">版本 v{{version}}</p>
				<div class="about-check">
					<img src="../../../static/icons/agree.png" alt=""/>
					<p>已是最新版本</p>
				</div>
				<div class="about-item">
					<p>客服电话：</p>
					<p>{{serviceTel}}</p>
				</div>
				<div class="about-item">
					<p>教师端官网：</p>
					<p>{{webStation}}</p>
				</div>
				<div class="about-copyRight">
					<p>Copyright@2014-2017 xuexibao</p>
				</div>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	/*TODO:以后写拿最新版本号的请求*/
		import clsBtn from '../../components/buttons/closeBtn.vue'
		export default {
			name: "",
			components: {
				clsBtn
			},
			data () {
				return {
					version: "1.0.0",
					serviceTel: '400-816-1991',
					webStation: 't.91xuexibao.com',
					isOn: true
				}
			},
			props: {
				close: {
					type: Function,
					default: () => {
						console.log("about!")
					}
				}
			},
			computed: {
				show: {
					get(){
						return this.$store.state.showAbout
					},
					set(){

					}
				}
			},
			created () {
			},
			mounted () {
			},
			methods: {}
		}

</script>

<style lang="scss" rel="stylesheet/scss">
	@import "../../common/styles/mixin";

	.el-dialog__header {
		display: none;

	}

	.el-dialog--tiny {
		width: 430px;
		height: 450px;
	}

	.indexCnt {
		position: relative;
		&-clsBtn {
			position: absolute;
			top: 20px;
			right: 20px;
		}
	}

	.about {
		@include allMidBox();

		&-logo {
			margin-top: 50px;
		}
		&-version {
			margin-top: 10px;
			@include fontSizeColor(16px, $fontClr_main);
		}
		&-check {
			margin-top: 60px;
			img {
				padding-top: 2px;
				@include wh(18px, 18px);
				margin-right: 10px;
			}
			margin-bottom: 10px;
			@include rowBox();
		}
		&-item {
			font-size: 14px;
			@include rowBox();
			align-items: center;
			margin-top: 20px;
			p:nth-child(2) {
				@include fontSizeColor(14px, $fontClr_ble);
				cursor: pointer;
			}
		}
		&-copyRight {
			margin-top: 60px;
			margin-bottom: 20px;
			@include fontSizeColor(12px, $fontClr_2nd)
		}
	}
</style>
