<template>
	<div class="">
		{{classInfo.startTime}}
		{{classInfo.endTime}}
		{{classInfo.name}}
		{{classInfo.grade}}
		{{classInfo.status}}
	</div>
</template>

<script>
	/*课程详细信息
	* 接口详情
	* 1.classInfo 课程相关数据
	* 2.message 留言
	* 3.ware 课件
	* 4.report 报告
	* 5.eva 评价*/
	export default {
		name: "",
		components: {},
		data () {
			return {}
		},
		props: {
			/*课程相关的信息*/
			classInfo: {
				type: Object,
				default: () => {
					return {
						startTime: 0,
						endTime: 0,
						name: 'courseName',
						grade: 'grade',
						/*老师旷课 学生旷课 均旷课*/
						status: 0
					}
				}
			},
			/*留言*/
			message:{
				type:Object,
				default:()=>{
					return {
						time:'',
						cont:''
					}
				}
			},

			/*课件*/
			ware:{
				type:Object,
				default:()=>{
					return {
						time:'',
						/*TODO:不知道课件的格式*/
					}
				}
			},

			/*报告*/
			report:{
				type:Object,
				default:()=>{
					return {
						time:'',
						/*TODO:不知道报告的格式*/
					}
				}
			},

			/*评价*/
			eva:{
				type:Object,
				default:()=>{
					return {
						time:'',
						cont:''
					}
				}
			}

		},
		computed: {},
		created () {
		},
		mounted () {
		},
		methods: {}
	}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>

