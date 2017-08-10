<template>
	<div class="course">
		<div class="course-info">
			<div class="course-info-header">
				<div class="trigger" @click="goMain">
					<img src="../../../static/icons/back.png" alt="">
				</div>
				<span @click="goMain">待上课程/</span>
				<span>课程详情</span>
			</div>
			<div class="course-info-item">
				<div class="course-info-item-title">辅导</div>
				<div class="course-info-item-cont">上课时间：{{stuDate}} {{stuTime.hour}}:{{stuTime.minute}} -
					{{endTime.hour}}:{{endTime.minute}}
				</div>
				<div class="course-info-item-cont">年级科目：{{info.gradeName}}</div>
				<div class="course-info-item-cont">教材课本：{{info.bookVersionName}}</div>
				<div class="course-info-item-cont">课程状态：{{courseSt}}</div>

			</div>
			<div class="course-info-item">
				<div class="course-info-item-title">课件</div>
				<div class="course-info-item-cont">上课课件：
					<div class="course-info-item-cont-btn" v-if="!ware" @click="goPPTPage">制作</div>
					<div class="course-info-item-cont-btn" v-if="ware">查看</div>
					<div class="course-info-item-cont-time" v-if="ware">发布于 {{info.coursewareCreateTime}}</div>
				</div>
				<div class="course-info-item-cont">知 识 点：
					<p v-if="!ware">请在课件制作后查看</p>
					<div class="course-info-item-cont-btn" v-if="ware">查看</div>
				</div>
			</div>
			<div class="course-info-item">
				<div class="course-info-item-title">上课</div>
				<div class="course-info-item-cont">上课报告：
					<div class="course-info-item-cont-btn" v-if="!report" @click="goReportPage">填写</div>
					<div class="course-info-item-cont-btn" v-if="report">查看</div>
					<div class="course-info-item-cont-time" v-if="report">发布于 {{info.courseReportCreateTime}}</div>
				</div>
			</div>
		</div>
		<div class="course-stu">
			<div class="course-stu-info">
				<div class="usrPic">
					<img :src="info.profile_image_url" alt="">
				</div>
				<div class="usrName">
					<span>{{info.name}}</span>
					<img src="../../../static/icons/male.png" alt="" v-if="info.gender===1">
					<img src="../../../static/icons/female.png" alt="" v-if="info.gender ===2">
				</div>
				<p class="school">
					{{info.school}}
				</p>
			</div>
			<div class="course-stu-item">
				<div class="course-stu-item-cont">
					<img src="../../../static/icons/people.png" alt="">
					<p>已辅导：{{info.alreadyConsumeCourse}}节</p>
				</div>
				<div class="course-stu-item-cont">
					<img src="../../../static/icons/bell.png" alt="">
					<p>待辅导：{{info.leftCourse}}节</p>
				</div>
			</div>
			<div class="course-stu-item">
				<p class="course-stu-item-title">学管提示：</p>
				<div class="course-stu-item-cont">
					<img src="../../../static/icons/hat.png" alt="">
					<p>学生分数：{{info.score}}/100</p>
				</div>
				<div class="course-stu-item-cont">
					<img src="../../../static/icons/pc.png" alt="">
					<p>上课内容：18节</p>
				</div>

			</div>
			<div class="course-stu-item" v-if="messaged">
				<p class="course-stu-item-title">学生留言：</p>
				<p class="course-stu-item-txt">{{hasMessage}}</p>
			</div>
			<div class="course-stu-item">
				<p class="course-stu-item-title">上课备注：</p>
				<p class="course-stu-item-txt" v-if="!isShowTextArea">{{hasNote}}</p>
				<p class="add" v-if="!noted" @click="addNote">添加</p>
				<p class="add" v-if="noted" @click="addNote">编辑</p>
				<textarea name="" id="" cols="30" rows="10" placeholder="请在此输入上课备注，最多两百字" maxlength="200"
						  v-if="isShowTextArea" v-model="note"></textarea>
				<b-btn :styles="'orange'" :title="'保存'" :height="22" :width="60" :size="12" class="remarkBtn"
					   v-if="isSatisfy&&isShowTextArea" v-on:click.native="setNote"></b-btn>
				<b-btn :styles="'grey'" :title="'保存'" :height="22" :width="60" :size="12" class="remarkBtn"
					   v-if="!isSatisfy&&isShowTextArea"></b-btn>
			</div>
		</div>
	</div>
</template>

<script>
	import {judgeTime, parseTime} from '../../common/scripts/util'
	import {courseStatus} from '../../common/scripts/filters'
	import bBtn from '../../components/buttons/basicButtons.vue'
	export default {
		name: "classInfo",
		components: {
			bBtn
		},
		data () {
			return {
				noted: false, // 是否写备注
				messaged: false, // 是否留言了
				ware: false, // 是否有课件
				report: false,// 是否有上课报告

				isShowTextArea: false, // 是否显示填备注的输入框
				note: "", //备注信息
				info: {
					alreadyConsumeCourse: 0,
					bookVersionName: "",
					classContent: "",
					courseReportCreateTime: "",
					courseStatus: 0,
					course_name: "",
					courseware: 0,
					courseware_id: 0,
					evluate: {},
					full_marks: "",
					gender: 0,
					generateReport: 0,
					grade: 0,
					gradeName: "",
					leftCourse: 0,
					message: {},
					name: "",
					note: {},
					profile_image_url: "",
					school: "",
					score: "",
					star: 0,
					studentId: "",
					subject: 0,
					subjectName: "",
					teacherId: "",
					teacherIn: 0,
					teacherReply: {},
					time: {end: 0, begin: 0},
					type: 0
				}
			}
		},
		props: {
//			info: {
//				type: Object,
//				default: () => {
//					return {
//						"coursewareCreateTime": "2017-06-17 09:55",
//						"note": {},
//						"evluate": {},
//						"courseReportCreateTime": "2017-06-27 19:26",
//						"gender": 1,
//						"subject": 1,
//						"teacherIn": 0,
//						"alreadyConsumeCourse": 74,
//						"type": 1,
//						"studentId": "595356950eda8a7280ccb99e",
//						"score": "70",
//						"school": "前黄高级中学国际分校",
//						"knowlegeList": [
//							{
//								"knowleageName": "多项式乘多项式"
//							},
//							{
//								"knowleageName": "单项式乘多项式"
//							},
//							{
//								"knowleageName": "单项式乘单项式"
//							},
//							{
//								"knowleageName": "幂的乘方与积的乘方"
//							}
//						],
//						"courseware": 0,
//						"subjectName": "数学",
//						"courseware_id": 11044,
//						"gradeName": "高二",
//						"star": 0,
//						"course_name": "一对一直播课",
//						"teacherReply": {},
//						"generateReport": 1,
//						"bookVersionName": "人教版",
//						"profile_image_url": "http://q.qlogo.cn/qqapp/1105221050/A2028337875E9D64CF8FAD5C58466FC0/100",
//						"message": {'note': "老师给我重点讲一下三角函数的内容喔", "time": 12312},
//						"leftCourse": 0,
//						"teacherId": "b496b9ef-fcb0-459b-847a-c8e257ee8543",
//						"coursewareUrl": "https://webcast.91xuexibao.com/static/broadcast/dist/courseware/static/preview.html?11044",
//						"classContent": "完型，阅读讲解",
//						"grade": 11,
//						"name": "pipixia",
//						"time": {
//							"end": 1499432100000,
//							"begin": 1499428800000
//						},
//						"courseStatus": 7
//					}
//				}
//			}
		},
		computed: {
			hasNote(){
				if (this.info.note.note === undefined) {
					return "您暂时还没有添加上课备注哦~"
				} else {
					return this.info.note.note
				}
			},
			hasMessage(){
				if (this.info.message.note === undefined) {
				} else {
					return this.info.message.note
				}
			},
			courseSt(){
				return courseStatus(this.info.courseStatus)
			},
			stuDate(){
				if (judgeTime(this.info.time.end) == 0) {
					return "今天"
				}
				if (judgeTime(this.info.time.end) === 1) {
					return "明天"
				} else {
					let _tempDate = new Date(this.info.time.end);
					return `${_tempDate.getMonth() + 1}月${_tempDate.getDate()}日`
				}
			},
			stuTime(){
				return parseTime(this.info.time.begin)
			},
			endTime(){
				return parseTime(this.info.time.end)
			},
			isSatisfy(){
				return this.note.length > 1 // 备注所填长度是否满足要求
			}

		},
		created () {
			this._checkData()
			this.$api.getCourseDetail('', this.$store.state.courseId).then((res) => {
				let _data = res.data
				if (_data.status == '-1') {
					this.$message(_data.msg)
				}
				if (_data.status) {
					this.$message(_data.msg)
				} else {
			/*TODO:对接数据*/
					this.info = _data.detail
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
					this.$message(err)
				}
			})
		},
		mounted () {
		},
		methods: {
			//检查并判断数据*/
			_checkData(){
				this.info.message.note === {} ? this.messaged = false : this.messaged = true
				this.info.note === {} ? this.noted = false : this.noted = true
				if (this.info.courseware_id != 0) {
					this.ware = true
				}
				if (this.info.generateReport === 1) {
					this.report = true
				}
			},
			//去首页
			goMain(){
				this.$router.push('main')
			},
			//发送备注至后台
			setNote(){
				this.$api.setNote(this.$store.state.courseId, this.note, '').then((res) => {
					this.info.note.note = this.note
					this.isShowTextArea = false
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
			//添加备注
			addNote(){
				this.isShowTextArea = !this.isShowTextArea
			},
			//TODO:调用网页版的课件制作网页
			goPPTPage(){
			  window.location.href="http://t.91xuexibao.com"
			},
			goReportPage(){
				this.$ipc.sendSync('test', 'hello world')
			}
		}
	}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
	@import "../../common/styles/mixin";

	.course {
		@include rowBox();
		box-sizing: border-box;
		padding: 20px;
		/*width: 1000px;*/
		background: #ffffff;
		&-info {
			width: 680px;
			margin-right: 20px;
			//			@include underDashBorder();
			&-header {
				@include underDashBorder();
				@include rowBox();
				@include pdtb(30px, 30px);
				@include fontSizeColor(18px, $fontClr_1st);
				align-items: center;
				.trigger {
					cursor: pointer;
					height: 20px;
					width: 20px;
					margin-right: 15px;
				}
				img {
					@include wh(8px, 15px);
				}
				span {
					cursor: pointer;
				}
			}
			&-item {
				@include pdtb(30px, 30px);
				@include underDashBorder();
				&-title {
					@include fontSizeColor(18px, $fontClr_main);
					font-weight: bold;
					margin-bottom: 10px;
				}
				&-cont {
					position: relative;
					margin-top: 10px;
					@include rowBox();
					@include fontSizeColor(12px, $fontClr_main);
					&-btn {
						@include fontSizeColor(12px, $fontClr_ble);
						cursor: pointer;
					}
					&-time {
						@include fontSizeColor(12px, $fontClr_3rd);
						position: absolute;
						right: 20px;
					}
				}

			}

		}
		&-stu {
			width: 300px;
			border: solid;
			box-sizing: border-box;
			padding: 20px;
			border-color: $orange $border $border $border;
			border-width: 2px 1px 1px 1px;
			&-info {
				box-sizing: border-box;
				padding: 20px;
				@include allMidBox();
				.usrPic {
					@include wh(80px, 80px);
					border-radius: 100%;
					overflow: hidden;
					img {
						width: 100%;
						height: 100%;
					}
				}
				.usrName {
					display: flex;
					align-items: center;
					margin-top: 20px;
					@include fontSizeColor(20px, $fontClr_main);
					img {
						margin-left: 10px;
					}
				}
				.school {
					margin-top: 10px;
					@include fontSizeColor(14px, $fontClr_2nd);
				}
			}
			&-item {
				position: relative;
				box-sizing: border-box;
				padding: 20px 0 20px 0;
				border: dashed $border;
				border-width: 1px 0 0 0;
				&-title {
					@include fontSizeColor(14px, $fontClr_main);
					font-weight: bold;
					margin-bottom: 20px;
				}
				&-cont {
					@include rowBox();
					margin-top: 10px;
					@include fontSizeColor(12px, $fontClr_main)
					img {
						padding-top: 3px;
						@include wh(15px, 15px);
						margin-right: 20px;
					}
				}
				&-txt {
					@include fontSizeColor(12px, $fontClr_2nd);
				}
				.add {
					position: absolute;
					@include fontSizeColor(12px, $fontClr_ble);
					top: 22px;
					right: 0;
					cursor: pointer;
				}
				textarea {
					width: 100%;
					height: 6rem;
					box-sizing: border-box;
					padding: 8px;
					border: 1px solid $border;
					resize: none;
					font-size: 12px;
				}
				.remarkBtn {
					margin-top: 10px;
					float: right;
				}
			}
		}
	}
</style>
