<template>
	<div class="chooseBar">
		<el-menu class="el-menu-demo" mode="horizontal" :default-active="active">
			<el-menu-item index="1" @click="itemOne"><p>待上课程</p></el-menu-item>
			<el-menu-item index="0" @click="itemTwo"><p>历史课程</p></el-menu-item>
			<!--for test-->
			<!--<el-menu-item index="3" @click="gotest"><p>测试页面</p></el-menu-item>-->
			<freshBtn class="freshBtn" v-on:click.native="fresh"></freshBtn>
		</el-menu>
	</div>
</template>

<script>
	import freshBtn from '../../components/buttons/freshBtn.vue'
	export default {
		name: "",
		components: {
			freshBtn
		},
		data () {
			return {}
		},
		props: {
			fresh: {
				type: Function,
				default: () => {
					console.log('fresh it!')
				}
			},
			itemOne: {
				type: Function,
				default: () => {
					console.log('click item1 !')
				}
			},
			itemTwo: {
				type: Function,
				default: () => {
					console.log('click item2 !')
				}
			},
		  active:{
				default:'1'
		  }
		},
		computed: {},
		created () {
		},
		mounted () {
		},
		methods: {
			gotest(){
				this.$router.push("/static/test")
			}
		}
	}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
	@import "../../common/styles/mixin";

	.el-menu {
		background: #ffffff !important;
		border: solid $border;
		border-width: 0 0 1px 0;

	}

	.el-menu-item {

		box-sizing: border-box !important;
		/*padding-top: 30px!important;*/
		/*padding-bottom: 30px !important;*/
		font-size: 18px !important;;
		color: darken($fontClr_2nd, 30%) !important;
		font-weight: 600 !important;
	}

	.el-menu-item:hover {
		background: #ffffff !important;
		border-bottom: 2px solid $orange;
	}

	.el-menu-item, .el-submenu__title {
		cursor: pointer;
		height: 78px;
		transition: .3s !important;
		p {
			margin-top: 10px;
		}

	}

	.chooseBar {
		box-shadow: 0 2px 6px $fontClr_3rd;
		width: 100%;
		z-index: 1024;
		top: 50px;
		position: fixed;
		background: #ffffff;
		/*width: 1000px;*/
	}

	.freshBtn {
		cursor: pointer;
		margin-top: 28px;
		margin-right: 20px;
		float: right;
	}

</style>
