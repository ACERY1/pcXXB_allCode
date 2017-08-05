<template>
	<div class="home">
		<choose-bar></choose-bar>
		<el-row type="flex" justify="center">
			<el-col :span="24" >
				<class-item v-for="item in courseInfo" :key="item.courseId" :courseInfo="item"></class-item>
			</el-col>
		</el-row>
	</div>
</template>

<script>
	import chooseBar from '../components/bars/chooseBar.vue'
	import classItem from '../components/items/classItem.vue'
	export default {
		name: "",
		components: {
			chooseBar,
			classItem,
		},
		data () {
			return {
				courseInfo: []
			}
		},
		props: {},
		computed: {},
		created () {
			this.getCourseList()
		},
		mounted () {
		},
		methods: {
			getCourseList(){
				//status,statusList,pageSize,pageIndex,order,begin,end*/
				this.$api.getCourseList(0).then((res) => {
					let _data = res.data

					//符合条件时status为0*/
					if (_data.status) {
						this.$message(_data.msg)
						return false
					} else {
						/*数组赋值*/
						this.courseInfo = _data.courses
					}

				}).catch((err) => {
					this.$message(err)
				})
			}

		}
	}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
	.home{
		padding-top: 80px;
	}
</style>
