<template>
	<div class="chooseBar">
		<el-menu class="el-menu-demo" mode="horizontal" default-active="1">
			<el-menu-item index="1"><p>待上课程</p></el-menu-item>
			<el-menu-item index="2"><p>历史课程</p></el-menu-item>
			<freshBtn class="freshBtn"></freshBtn>
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
			return {
			}
		},
		props: {},
		computed: {},
		created () {
		},
		mounted () {
		},
		methods: {
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
