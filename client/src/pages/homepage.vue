<template>
	<div class="home" ref="mainBox">
		<choose-bar :fresh="reFresh" :itemOne="nowCourse" :itemTwo="historyCourse"
					:active="focus.toString()"></choose-bar>
		<el-row type="flex" justify="center" id="mainList" class="test">
			<el-col :span="24">
				<div v-infinite-scroll="loadFn" infinite-scroll-disabled="busy"
					 infinite-scroll-distance="10">
					<class-item v-for="item in courseInfo" :key="item.courseId" :courseInfo="item"></class-item>
					<div v-if="loadingIcon" class="loading">
						<i class="el-icon-loading"></i>
						<p>加载中</p>
					</div>
				</div>
			</el-col>
		</el-row>
	</div>
</template>

<script>
	import chooseBar from '../components/bars/chooseBar.vue'
	import classItem from '../components/items/classItem.vue'
	import {loadMore, removeSession} from '../common/scripts/util'
	export default {
		name: "",
		components: {
			chooseBar,
			classItem,
		},
		data () {
			return {
//				courseInfo: [],
				busy: false, // 是否正在加载   动画显示处理
				isQuery: false, // 是否正在请求 加锁处理

				currentPageSize: 5, //当前页容量
				historyPageSize: 6, //历史页容量


//				currentPageIndex: 0,// 当前页索引
//				historyPageIndex: 0,// 历史页索引

				leftNone: false,// 没有更多了
				loadingIcon: true, //显示loading

//				focus: 1 // 1代表choose待上课程 0代表历史课程
			}
		},
		props: {},
		computed: {
			currentPageIndex: {
				get (){
					return this.$store.state.courseList.currentIndex
				},
				set(data){
					this.$store.state.courseList.currentIndex = data
				}
			},
			historyPageIndex: {
				get(){
					return this.$store.state.courseList.historyIndex
				},
				set(data){
					this.$store.state.courseList.historyIndex = data
				}
			},
			focus: {
				get(){
					return this.$store.state.courseList.focus
				},
				set(data){
					this.$store.state.courseList.focus = data
				}
			},
			courseInfo: {
				get(){
					return this.$store.state.courseList.courseInfo
				},
				set(data){
					this.$store.state.courseList.courseInfo = data
				}
			},
			mountPoint: {
				get(){
					return this.$store.state.courseList.mountPoint
				},
				set(data){
					this.$store.state.courseList.mountPoint = data
				}
			}
		},
		created () {
			// 清除用来判断跳转路由的courseId
			removeSession("temp_courseId") // 为课程详情下的制作/查看课件的
			removeSession("temp_courseWareId") // 为课程详情下的制作/查看课件的
			removeSession("didPPT") // 判断是否做过ppt 为课程详情的
			removeSession("courseInfo") // 为课程详情存储的session
			removeSession("courseId_forClass") // 为上课页面存储的session
		},
		mounted () {
			// 回归访问历史
			let $test = $('.test')
			$test.scrollTop(this.mountPoint)
			$test.on('scroll', () => {
				this.mountPoint = $('.test').scrollTop()
			})
		},
		beforeDestroy(){
			// domTree still alive but u trigger to destroy it!
//			this.$store.commit("STORE_COURSE_LIST", {
//				courseInfo: this.courseInfo,
//				currentIndex: this.currentIndex,
//				historyIndex: this.historyIndex,
//				focus: this.focus,
//				mountPoint: ''
//			})

		},
		methods: {
			_getCourseList(status, order = 0, type){
				//status,statusList,pageSize,pageIndex,order,begin,end*/
				// 加锁
				this.isQuery = true
				let pageSize, pageIndex
				if (this.leftNone) {
					this.isQuery = false
					return false
				}
				//载入加载动画
				this.busy = true;
				if (type == 1) {
					this.currentPageIndex++
					pageSize = this.currentPageSize
					pageIndex = this.currentPageIndex
				}
				if (type == 0) {
					this.historyPageIndex++
					pageSize = this.historyPageSize
					pageIndex = this.historyPageIndex
				}
				this.$api.getCourseList({
					status: status, /*1正在上课，2已结束，3待上课，4教师旷课， 5已取消 ，6学生旷课 ，7教师和学生均旷课*/
					statusList: [],// 拿多种状态的
					pageSize: pageSize,
					pageIndex: pageIndex,
					order: order, // order是排列顺序 默认的是降序 order=0时是升序
					begin: null, //ms
					end: null, //ms

				}).then((res) => {
					let _data = res.data

					//符合条件时status为0*/
					if (_data.status) {
						this.$message(_data.msg)
						this.isQuery = false
						return false
					} else {
						//数组赋值*/
						for (let i of _data.courses) {
							this.courseInfo.push(i)
						}
						if (_data.courses.length < 5) {
							this.busy = false;
							this.loadingIcon = false;
							this.isQuery = false
							this.leftNone = true;// 标记没有更多了
							return this.$message({
								message: '没有更多了',
								duration: 1500
							})
						}

						//释放加载动画
						this.busy = false;
						// 释放锁
						this.isQuery = false

					}

				}).catch((err) => {
					if (err.toString().indexOf('403') != -1) {
						this.$message({
							message: "没有认证！",
							duration: 1500
						})
						setTimeout(() => {
							this.$router.push('/static/login')
						}, 1500)
					}
					else {
						this.$message(
							{
								message: err
							}
						)
					}
				})
			},
			// 清除历史状态和计数
			_clearStatus (){
				this.$store.commit('UN_SHOW_MENU')
				this.leftNone = false
				this.busy = false
				this.loadingIcon = true
				this.courseInfo = []
				this.currentPageIndex = 0
				this.historyPageIndex = 0
			},
			// 刷新按钮事件
			reFresh(){
				if (this.isQuery) {
					return false
				}
				this._clearStatus()
				if (this.focus) {
					this._getCourseList(1, 0, 1)
					this._getCourseList(3, 0, 1)
				} else {
					this._getCourseList(2, 1, 1)
				}
			},
			// 待上课程点击事件
			nowCourse(){
				if (this.isQuery) {
					return false
				}
				this.focus = 1
				this._clearStatus()
				this._getCourseList(1, 0, 1)
				this._getCourseList(3, 0, 1)
			},
			//载入历史课程
			historyCourse(){
				this.focus = 0
				this._clearStatus()
				this._getCourseList(2, 1, 1)
			},
			//载入待上课程
			loadCourse(){
				this._getCourseList(3, 0, 1)
			},
			loadHistoryCourse(){
				console.log(this.focus)
				this._getCourseList(2, 1, 1)
			},
			loadFn(){
				if (this.focus) {
					this._getCourseList(3, 0, 1)
				} else {
					this._getCourseList(2, 1, 1)
				}
			}
		}
	}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
	@import "../common/styles/mixin";

	.home {
		padding-top: 80px;
	}

	.loading {
		color: $fontClr_3rd;
		font-size: 12px;
		@include allMidBox();
		.el-icon-loading {
			margin-top: 6px;
		}
	}

	.test {
		height: 600px;
		overflow: scroll;
	}
</style>
