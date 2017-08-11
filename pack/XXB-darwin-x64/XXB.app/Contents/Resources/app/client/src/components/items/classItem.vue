<template>
	<div class="classItem">
		<div class="classItem-headPic" @click="goInfo">
			<img :src="courseInfo.profile_image_url" alt="">
		</div>
		<div class="classItem-info" @click="goInfo">
			<div class="classItem-info-usr">
				<span class="classItem-info-usr-name">
					{{courseInfo.name}}
				</span>
				<span class="classItem-info-usr-sex">
					<img src="../../../static/icons/male.png" alt="" v-if="courseInfo.gender===1">
					<img src="../../../static/icons/female.png" alt="" v-if="courseInfo.gender ===2">
				</span>
				<span class="classItem-info-usr-status">
					<img src="../../../static/icons/onClass.png" alt="" v-if="courseInfo.status === 1">
				</span>
			</div>
			<div class="classItem-info-school">
				{{courseInfo.edu_school}}
			</div>
			<div class="classItem-info-class">
				<span class="classItem-info-class-date">{{stuDate}}</span>
				<span class="classItem-info-class-start">{{stuTime.hour}}</span>
				<span>:</span>
				<span class="classItem-info-class-start">{{stuTime.minute}}</span>
				<span>--</span>
				<span class="classItem-info-class-end">{{endTime.hour}}</span>
				<span>:</span>
				<span class="classItem-info-class-end">{{endTime.minute}}</span>
				<span class="classItem-info-class-subject">{{courseInfo.subject}}</span>
				<span class="classItem-info-class-grade">{{courseInfo.edu_grade}}</span>
			</div>
		</div>
		<div class="clickArea" @click="goInfo"></div>
		<div class="classItem-btn">
			<my-btn :styles="'orange'" :height="25" :width="80" :size="12" v-if="isOnClass == 1"
					v-on:click.native="goClass"></my-btn>
			<my-btn :styles="'grey_d'" :height="25" :width="80" :size="12" v-if="isOnClass == 0"></my-btn>
		</div>
	</div>
</template>

<script>
	/*课程简介信息
	 * 接口详情
	 * 1.courseInfo (Object)
	 * */
		import myBtn from '../../components/buttons/basicButtons.vue'
		import {judgeTime, parseTime} from '../../common/scripts/util'
		export default {
			name: "",
			components: {
				myBtn
			},
			data () {
				return {
					isOnClass: (this.courseInfo.begin_time <= +new Date() && this.courseInfo.end_time >= +new Date()) ? 1 : 0
				}
			},
			props: {
				courseInfo: {
					type: Object,
					default: () => {
						return {
							"courseware_id": 36,
							"gender": 2,
							"edu_grade": "高三",
							"subject": "数学",
							"end_time": 1485820500000,
							"student_id": "540ab33670616000000000e7",
							"begin_time": 1485817200000,
							"profile_image_url": "http://simg.91xuexibao.com/public/user_data/images/20150228/profile/1668966142!",
							"message": 0,
							"courseName": "一对一直播课",
							"edu_school": "扎赉特旗音德尔第一中学",
							"price": "88",
							"grade": "六年级",
							"name": "小燕子",
							"courseId": "11346",
							"courseware": 0,
							"status": 1
						}
					}
				}
//		"courseware_id": 36,
//			"gender": 2,
//			"edu_grade": "高三",
//			"subject": "数学",
//			"end_time": 1485820500000,
//			"student_id": "540ab33670616000000000e7",
//			"begin_time": 1485817200000,
//			"profile_image_url": "http://simg.91xuexibao.com/public/user_data/images/20150228/profile/1668966142!",
//			"message": 0,
//			"courseName": "一对一直播课",
//			"edu_school": "扎赉特旗音德尔第一中学",
//			"price": "88",
//			"grade": "六年级",
//			"name": "小燕子",
//			"courseId": "11346",
//			"courseware": 0,
//			"status": 7
			},
			computed: {
				stuDate(){
					if (judgeTime(this.courseInfo.end_time) == 0) {
						return "今天"
					}
					if (judgeTime(this.courseInfo.end_time) === 1) {
						return "明天"
					} else {
						let _tempDate = new Date(this.courseInfo.end_time);
						return `${_tempDate.getMonth() + 1}月${_tempDate.getDate()}日`
					}
				},
				stuTime(){
					return parseTime(this.courseInfo.begin_time)
				},
				endTime(){
					return parseTime(this.courseInfo.end_time)
				},

			},
			created () {
//		  console.log(this.courseInfo.begin_time+'****'+ +new Date())
//		  console.log(this.courseInfo.begin_time <= +new Date() && this.courseInfo.end_time >= +new Date())
			},
			mounted () {
			},
			methods: {
				goInfo(){
			/*保存课程ID*/
					this.$store.commit('UN_SHOW_MENU')
					this.$store.commit("UPDATE_COURSE_ID", this.courseInfo.courseId)
					this.$router.push('/static/classInfo')

				},
				goClass(){
					this.$store.commit('UN_SHOW_MENU')
					this.$router.push('/static/onclass')
				}
			}
		}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

	.clickArea {
		position: absolute;
		right: 16%;
		height: 130px;
		width: 46%;
	}

	@import "../../common/styles/mixin";

	.classItem:hover {
		cursor: pointer;
		background: lighten($border, 10%);
		transition: all ease-in-out .2s;
	}

	.classItem {

		background: #ffffff;
		position: relative;
		display: flex;
		flex-flow: row nowrap;
		/*width: 1000px;*/
		border: solid $border;
		border-width: 0 0 1px 0;
		&-headPic {
			@include wh(66px, 66px);
			margin-right: 20px;
			margin-left: 20px;
			margin-top: 28px;
			border-radius: 100%;
			overflow: hidden;
			img {
				width: 100%;
				height: 100%;
			}
		}
		&-info {
			&-usr {
				display: flex;
				flex-flow: row nowrap;
				margin-top: 20px;
				align-items: center;
				&-name {
					@include fontSizeColor(18px, $fontClr_main);
					font-weight: bold;
				}
				&-sex {
					padding-top: 2px;
					margin-left: 10px;
				}
				&-status {
					padding-top: 3px;
					margin-left: 10px;
				}
			}
			&-school {
				@include fontSizeColor(14px, $fontClr_main);
				margin-top: 15px;
			}
			&-class {
				margin-top: 10px;
				margin-bottom: 20px;
				@include fontSizeColor(12px, $fontClr_2nd)
			}

		}
		&-btn {
			top: 52px;
			right: 20px;
			position: absolute;
		}
	}
</style>
