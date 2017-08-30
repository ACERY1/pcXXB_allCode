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
				<b-btn :styles="'orange'" :title="'进入教室'" v-if="isOnClass == 1" :height="24" :width="60" :size="10"
					   class="inClassBtn" @click.native="goClass"></b-btn>
				<b-btn :styles="'grey'" :title="'进入教室'" v-if="isOnClass == 0" class="inClassBtn" :height="24"
					   :width="60" :size="10" @click.native="onClass"></b-btn>
			</div>
			<div class="course-info-item">
				<div class="course-info-item-title">课件</div>
				<div class="course-info-item-cont">上课课件：
					<div class="course-info-item-cont-btn" v-if="!ware" @click="goPPTPage">制作</div>
					<div class="course-info-item-cont-btn" v-if="ware" @click="checkPPT">查看</div>
					<div class="course-info-item-cont-btn" v-if="ware" @click="goPPTPage">&nbsp; &nbsp;修改</div>
					<div class="course-info-item-cont-time" v-if="ware">发布于 {{info.coursewareUpdateTime}}</div>
				</div>

				<!--未来版本需求-->
				<!--<div class="course-info-item-cont">知 识 点：-->
				<!--<p v-if="!ware">请在课件制作后查看</p>-->
				<!--<div class="course-info-item-cont-btn" v-if="ware" @click="checkPoint">查看</div>-->
				<!--</div>-->

			</div>
			<div class="course-info-item">
				<div class="course-info-item-title">上课</div>
				<div class="course-info-item-cont">上课报告：
					<div class="course-info-item-cont-btn" v-if="!report" @click="goReportPage">填写</div>
					<div class="course-info-item-cont-btn" v-if="report" @click="checkReport">查看</div>
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
				<p class="course-stu-item-txt" v-if="!isShowTextArea" v-text="hasNote">{{hasNote}}</p>
				<p class="add" v-show="!noted" @click="addNote">添加</p>
				<p class="add" v-show="noted" @click="addNote">编辑</p>
				<textarea name="" id="" cols="30" rows="10" placeholder="请在此输入上课备注，最多两百字" maxlength="200"
						  v-if="isShowTextArea" v-model="note"></textarea>
				<b-btn :styles="'orange'" :title="'保存'" :height="22" :width="60" :size="12" class="remarkBtn"
					   v-if="isSatisfy&&isShowTextArea" v-on:click.native="setNote"></b-btn>
				<b-btn :styles="'grey'" :title="'保存'" :height="22" :width="60" :size="12" class="remarkBtn"
					   v-if="!isSatisfy&&isShowTextArea"></b-btn>
			</div>
		</div>
		<!--<point-dialog :version="info.bookVersionName"></point-dialog>-->
		<el-dialog size="full" v-model="isShowCourseWare" :close-on-click-modal="true">
			<ul id="previewBox">
				<li class="previewImg" v-for="item in courseWareImages" :key="item">
					<img :src="item" alt="">
				</li>
			</ul>
		</el-dialog>
		<img src="../../../static/icons/close_wht.png" alt="" class="clsBtn" v-if="isShowCourseWare"
			 @click="isShowCourseWare=false;temp_scrollTop=0">
		<img src="../../../static/icons/toTop.png" class="toTopBtn" @click="scrollToTop" v-if="temp_scrollTop>1000">
	</div>
</template>

<script>
	import {judgeTime, parseTime, setSession, getSession, removeSession} from '../../common/scripts/util'
	import {courseStatus} from '../../common/scripts/filters'
	import fetch from '../../common/scripts/fetch'
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
				},
				isShowCourseWare: false,
				courseWareImages: [], // 课件预览图片
				temp_scrollTop: 0 // 用于计算弹窗内容滚动高度
			}
		},
		props: {},
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
			},
			isOnClass(){
//				console.log(this.info)
				return (this.info.time.begin <= +new Date() && this.info.time.end >= +new Date()) ? 1 : 0
			}

		},
		created () {
			if (getSession("temp_courseId") != null) {
				// 如果session里有 就从session里取 这里是从编辑课件跳转回来
				this.$store.commit("UPDATE_COURSE_ID", getSession("temp_courseId"))
				if (getSession('didPPT')) {
					this.$ipc.send("shrinkScreen")
				}
			}

			this.$api.getCourseDetail('', this.$store.state.courseId).then((res) => {
				let _data = res.data
				if (_data.status == '-1') {
					this.$message(_data.msg)
					setTimeout(() => {
						this.$router.push('/static/main')
					}, 1500)
				}
				if (_data.status) {
					setTimeout(() => {
						this.$router.push('/static/main')
					}, 1500)
					this.$message(_data.msg)
				} else {
					this.info = _data.detail
					// store更新数据
					this.$store.commit('UPDATE_COURSE_INFO', _data.detail)
					// session保存数据
					setSession('courseInfo', _data.detail)
					this._checkData()
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
			removeSession('didPPT')
			removeSession('temp_courseId')
			removeSession('temp_courseWareId')
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
				this.$store.commit('UN_SHOW_MENU')
				this.$router.push('main')
			},
			//发送备注至后台
			setNote(){
				this.$api.setNote(this.$store.state.courseId, this.note, '').then((res) => {
					this.info.note = {note: this.note}
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
			// 跳转至课件制作
			goPPTPage(){
				this.$api.makeCourseWare(this.$store.state.courseId).then((res) => {
					let _data = res.data
					if (_data.status) {
						this.$message({message: _data.msg, duration: 1500})
						return false
					} else {
						if (_data.courseWare_id == -1) {
							setSession("temp_courseWareId", this.info.courseware_id)
							setSession("temp_courseId", this.$store.state.courseId)
							setSession("didPPT", true);
							this.$ipc.send("courseWare")
							this.$ipc.send("fullScreen")

						} else {
							setSession("temp_courseId", this.$store.state.courseId)
							setSession("temp_courseWareId", _data.courseWare_id)
							setSession("didPPT", true);
							this.$ipc.send("courseWare")
							this.$ipc.send("fullScreen")
						}

					}

				})
			},
			// 上课报告
			goReportPage(){
				setSession("temp_courseId", this.$store.state.courseId)
				this.$router.push("/static/classreport")
//				this.$ipc.send("maximize")
				this.$ipc.send("fullScreen")
			},
			// 知识点查看
			checkPoint(){
				this.$store.commit('UN_SHOW_MENU')
				this.$api.getKnowledgeList(11, 1)
			},
			// 跳转到上课页面
			goClass(){
				this.$router.push('/static/onclass')
			},
			// 查看课件
			checkPPT(){
				this.isShowCourseWare = true
				this.courseWareImages = []
				let self = this
				setSession("temp_courseWareId", this.info.courseware_id)
				this.$api.previewCourseWare(getSession('temp_courseWareId')).then((res) => {
					let _data = res.data
					for (let item of _data.pageList) {
						this.courseWareImages.push(item.imageUrl)
					}
					$('#previewBox').on('scroll', function () {
						self.temp_scrollTop = this.scrollTop
					})
				}).catch((err) => {
					console.log(err)
				})

				// 打开弹框（too many fucking dialog!!）
			},
			// 滑到顶部
			scrollToTop(){
				$('#previewBox').scrollTop(0)
				this.temp_scrollTop = 0
			},
			// 查看报告
			checkReport(){
				setSession("temp_courseId", this.$store.state.courseId)
				setSession("didPPT", true);
		  /**/
				this.$ipc.send("report")
				this.$ipc.send("fullScreen")
			},
			onClass(){
		  /*TODO:测试*/
				console.log('保存session！')
				setSession('courseId_forClass', this.$store.state.courseId)
				this.$store.commit('UN_SHOW_MENU')
				this.$router.push('/static/onclass')
//				setSession("temp_courseId", this.$store.state.courseId)
//				setSession('temp_host', window.location.host)
			}
		}
	}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
	@import "../../common/styles/mixin";

	#previewBox {
		background-color: $btn_gry;
		overflow: scroll;
	}

	.clsBtn {
		cursor: pointer;
		z-index: 1000000;
		position: absolute;
	}

	.toTopBtn {
		z-index: 1000000;
		cursor: pointer;
		position: absolute;
	}

	@media screen and (min-width: 1000px) {
		// 最大化时候

		.clsBtn {
			right: 9vw;
			top: 120px;
		}
		.toTopBtn {
			right: 9vw;
			bottom: 110px;
		}

		#previewBox {
			@include wh(900px, 900px);
		}
		.previewImg {
			margin-bottom: 20px;
			@include allMidBox();
			@include wh(900px, 700px);
			img {
				@include wh(100%, 100%)
			}
			overflow: hidden;

		}

	}

	@media screen and (max-width: 1000px) {
		// 最小化时候
		.clsBtn {
			right: 40px;
			top: 80px;
		}
		.toTopBtn {
			right: 30px;
			bottom: 80px;
		}
		#previewBox {
			@include wh(800px, 500px);
		}
		.previewImg {
			margin-bottom: 20px;
			@include allMidBox();
			@include wh(800px, 600px);
			img {
				@include wh(100%, 100%)
			}
			overflow: hidden;

		}

	}

	.inClassBtn {
		position: absolute;
		right: 0;
		cursor: pointer;
		margin-top: -100px;
		float: right;
		margin-right: 20px;
	}

	.course {

		justify-content: center;
		@include rowBox();
		box-sizing: border-box;
		padding: 20px;
		/*width: 1000px;*/
		background: #ffffff;
		&-info {
			padding-left: 20px;
			border: dashed $border;
			border-width: 0 0 0 1px;
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
				position: relative;
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
