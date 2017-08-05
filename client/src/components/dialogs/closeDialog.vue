<template>
	<div class="cls">
		<el-dialog v-model="isClose" size="small">
			<p class="cls-ask">{{title}}</p>
			<boolBtn :yesTitle="'确定'" :noTitle="'取消'" class="cls-btn" @yes="selectBtn" @no="closeBtn"></boolBtn>
			<div slot="title" class="dialog-footer">
				<div class="dlg_title">
					<img src="../../../static/icons/warn.png" alt="">
					<p>提示</p>
				</div>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	/*该dialog为通用组件
	* 1. close  boolean  true 代表显示
	* 2. title 提示文字
	* 3. select 确认按钮的函数*/
	import boolBtn from '../../components/buttons/2buttons.vue'
	export default {
		name: "",
		components: {
			boolBtn
		},
		data () {
			return {
				isClose: this.close
			}
		},
		props: {
			close: {
				default: true
			},
			title: {
				default: '填入文字以使用组件'
			},
			select: {
				type:Function,
				default:()=>{
					console.log("selected!")
				}
			}
		},
		computed: {},
		created () {
		},
		mounted () {
		},
		methods: {
			closeBtn(){
				this.isClose = false
			},
			selectBtn(){
				this.select()
			}
		}
	}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
	@import "../../common/styles/mixin";

	.cls {
		&-ask {
			@include fontSizeColor(14px, $fontClr_main);
			margin-top: 40px;
			margin-bottom: 35px;
			text-align: center;
		}
		&-btn {
			margin-bottom: 20px;
		}
	}

	.dlg_title {
		margin-bottom: -22px;
		width: 80px;
		p {
			margin-left: 10px;
		}
		@include rowBox();
	}
</style>
