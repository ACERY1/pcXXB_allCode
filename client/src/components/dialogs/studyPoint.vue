<template>
	<div>
		<el-dialog title="查看知识点" v-model="isShow" size="large" :show-close="false" custom-class="stuPoint">
			<header>
				<img src="../../../static/icons/list_point.png" alt="">
				<p>查看知识点</p>
				<img src="../../../static/icons/list_cls.png" alt="" class="clsBtn" @click="close">
			</header>
			<p class="stuPoint-title">教材版本：{{version}}</p>
			<div class="tableBox">
				<el-table :data="tableData">
					<el-table-column align="center"
									 prop="a"
									 label="知识点"
									 width="200"
					>
					</el-table-column>
					<el-table-column align="center"
									 prop="b"
									 label="讲解题目数"
									 width="108"
					>
					</el-table-column>
					<el-table-column align="center"
									 prop="c"
									 label="难度系数"
									 width="101">
					</el-table-column>
				</el-table>
			</div>

		</el-dialog>
	</div>
</template>

<script>
	export default {
		name: "",
		components: {},
		data () {
			return {
				tableData: [{
					//TODO：对接口
					a: '1',
					b: '2',
					c: '3'
				}]
			}
		},
		props: {
			/*设计接口*/
			version:{
				default:"bookVersionName"
			}
		},
		computed: {
			isShow: {
				get (){
					return this.$store.state.showPoint
				},
				set (){
				}
			}
		},
		created () {
		},
		mounted () {
		},
		methods: {
			close(){
			  this.$store.commit("UPDATE_SHOW_POINT")
			}
		}
	}
</script>

<style lang="scss" rel="stylesheet/scss">
	@import "../../common/styles/mixin";

	/*.el-dialog__header {*/
		/*display: none;*/
	/*}*/

	.el-table td, .el-table th.is-leaf {
		background: #ffffff;

		.cell {
			background: #ffffff;
		}
	}

	.stuPoint {
		padding: 20px;
		.tableBox {
			margin-top: 10px;
		}
		&-title {
			@include fontSizeColor(14px, $fontClr_1st)
		}
		header {
			position: relative;
			margin-bottom: 20px;
			img {

			}
			img:first-child {
				@include wh(14px, 14px);
				margin-right: 10px;
			}
			.clsBtn {
				position: absolute;
				right: 0;
				cursor: pointer;
				@include wh(22px, 22px)
			}
			p {
				@include fontSizeColor(12px, $fontClr_2nd)
			}
			@include rowBox();
			align-items: center;
		}

	}
</style>
