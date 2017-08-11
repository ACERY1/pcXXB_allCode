<template>
	<div class="update">
		<img src="../../../static/icons/update.png" alt="" class="bgPic">
		<img src="../../../static/icons/close_wht.png" alt="" class="update-cls" @click="cls">
		<div class="box">
			<div>
				<p class="box-title">更新内容</p>
				<p class="box-cont" v-for="item,index in updateFeatures" :key="item"> {{index+1}}. {{item}}</p>
			</div>
			<myBtn :title="'立即更新'" :styles="'yellow'" class="update-btn"></myBtn>
		</div>

	</div>
</template>

<script>
	import myBtn from '../../components/buttons/basicButtons.vue'
	export default {
		name: "",
		components: {
			myBtn
		},
		data () {
			return {
				updateFeatures:[
						"重新设计教师PC客户端",
						"界面操作更友好，客户端更稳定",
						"新增设备检测功能",
						"新增自动检测新版本功能"
				]
			}
		},
		props: {},
		computed: {},
		created () {
		},
		mounted () {
		},
		methods: {
			cls(){
				console.log('ff')
			}
		}
	}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
	@import "../../common/styles/mixin";

	.box {
		margin-top: 30px;
		flex-flow: column;
		display: flex;
		align-items: center;
		&-cont{
			@include fontSizeColor(14px,$fontClr_main);
			margin-top: 18px;
		}
		&-cont:first-child{
			margin: 0;
		}
	}

	.update {
		position: relative;
		box-sizing: border-box;
		height: 100%;
		/*width: 800px;*/
		background: $bg_wht;
		box-shadow: rgba(0, 0, 0, .15) 0 3px 7px;
		&-cls {
			cursor: pointer;
			position: absolute;
			top: 20px;
			right: 20px;
		}
		&-btn{
			margin-top: 30px;
		}
	}
	.bgPic{
		width: 100%;
	}
</style>
