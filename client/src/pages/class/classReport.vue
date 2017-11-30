<template>
	<div class="midBox">
		<div class="classReport">
			<!--头部提示文字-->
			<div class="classReport-bar  paddingBox">
				<p>请你对本次直播进行评价</p>
			</div>
			<!--学生信息-->
			<div class="classReport-info paddingBox" v-if="!nowSteps">
				<title-bar :title="'学生信息'"></title-bar>
				<div class="classReport-info-ctx">
					<div class="imgBox">
						<img :src="classInfo.avatar" alt="">
					</div>
					<div class="infoBox">
						<p class="userName">{{classInfo.name}}</p>
						<ul class="infoMain">
							<li>
								<span class="infoTitle">所在学校：</span>
								<span class="infoCont">{{classInfo.school}}</span>
							</li>
							<li>
								<span class="infoTitle">授课年级：</span>
								<span class="infoCont">{{classInfo.gradeName}}</span>
							</li>
							<li>
								<span class="infoTitle">授课科目：</span>
								<span class="infoCont">{{classInfo.subjectName}}</span>
							</li>
						</ul>

					</div>
				</div>
				<title-bar :title="'课堂表现'"></title-bar>
				<div class="classReport-info-selector">
					<el-form label-width="138px">
						<el-form-item label="学生课堂表现：">
							<el-select v-model="classroomPerformance" placeholder="未选择">
								<el-option label="优秀，能够及时与老师互动，对所学习的知识有自己的观点和思考。"
										   value="优秀，能够及时与老师互动，对所学习的知识有自己的观点和思考。"></el-option>
								<el-option label="良好，上课注意力集中，能按要求完成学习任务。" value="良好，上课注意力集中，能按要求完成学习任务。"></el-option>
								<el-option label="一般，一定程度上能保障课堂效率，偶尔出现分心情况。"
										   value="一般，一定程度上能保障课堂效率，偶尔出现分心情况。"></el-option>
								<el-option label="其它" value="其它"></el-option>
							</el-select>
						</el-form-item>
					</el-form>
				</div>
			</div>
			<!--知识点评价-->
			<div class="classReport-evaluate paddingBox" v-if="!nowSteps">
				<title-bar :title="'知识点评价'"></title-bar>
				<div class="evaContainer">
					<p class="grayFont">添加本节课所教授知识点,学生对知识点的掌握情况,知识点的重要等级</p>
					<div class="classReport-evaluate-title">
						<span>知识点</span>
						<span>掌握程度</span>
						<span>重要等级</span>
					</div>
					<ul class="classReport-evaluate-cont">
						<li v-for="item,index in knowleageEvl" :key="item.knowleageName">
							<div class="item-title">{{item.knowleageName}}</div>
							<div class="item-progress">
								<img src="../../../static/icons/add_square.png" alt="" style="cursor: pointer"
									 v-if="item.masterDegree ==null" @click="chooseLevel(index)">
								<span v-if="item.masterDegree!=null">{{filter(item.masterDegree)}}</span>
							</div>
							<div class="item-level">
								<el-rate v-model="item.importLevel"></el-rate>
							</div>
							<div class="item-delete" @click="deletePoint(index)">
								<img src="../../../static/icons/delete_circle2.png" alt="" style="cursor: pointer">
							</div>
						</li>
					</ul>
					<div class="addPoint" @click="addPoint" style="cursor: pointer">
						<img src="../../../static/icons/add_square.png" alt="" style="cursor: pointer">
					</div>
					<span class="addRed">*</span>
					<span class="hintFont">知识点填写完毕后，请根据知识点的重要情况，手动填涂重要的星级</span>
				</div>
			</div>
			<!--教学计划和反馈-->
			<div class="classReport-plan paddingBox" v-if="!nowSteps">
				<title-bar :title="'教学计划及反馈'"></title-bar>
				<p>下次课程教学安排：</p>
				<el-input
						type="textarea"
						:rows="4"
						placeholder="最多可输入200字"
						v-model="teacherArrangement"
						resize="none"
						:maxlength="200"
				>
				</el-input>
				<p>留给家长的话（选填）：</p>
				<el-input
						type="textarea"
						:rows="4"
						placeholder="最多可输入200字"
						v-model="leaveMessage"
						resize="none"
						:maxlength="200"
				>
				</el-input>
				<span class="addRed">*</span>
				<span class="hintFont">请你确认以上信息填写无误，再点击下一步按钮</span>
			</div>


			<div class="classReport-btn" v-if="!nowSteps">
				<b-btn :styles="'orange'" :height="30" :width="100" :size="14" :title="'下一步'"
					   @click.native="nowSteps=1"></b-btn>
			</div>


			<!--课后作业-->
			<div class="classReport-homework paddingBox" v-if="nowSteps">
				<title-bar :title="'课后作业'"></title-bar>
			</div>

			<ul class="uploader" v-if="nowSteps">
				<transition-group name="slide-fade">
					<li class="uploader-item" v-for="item,index in homework" :key="index">
						<div class="uploader-item-title">
							<p>题目{{index+1}}</p>
						</div>
						<textarea v-model="item.data" cols="30" rows="10" class="uploader-item-input" maxlength="200"
								  placeholder="请在此处填写作业内容，一次一道题（大题包含小题），最多1000字" v-if="item.type == 2"></textarea>
						<div class="uploader-item-cancelBtn" v-if="item.type == 2">
							<b-btn :title="'取消'" :height="30" :width="100" :size="12"
								   @click.native="cancelWork(index)"></b-btn>
						</div>
						<div class="rowBox" v-if="item.type == 1">
							<div class="uploader-item-imgBox" v-for="img,num in item.url">
								<img :src="img" alt="">
								<div class="delPicBtn" @click="delPic(index,num)">
									<img src="../../../static/icons/delPic.png" alt="">
								</div>
							</div>
							<div class="uploader-item-addPic" v-if="item.url.length<4">
								<input type="file" @change="handleUpload" @click="getPicPos(index)">
								<img src="../../../static/icons/addPic.png" alt="">
								<p>添加图片</p>
							</div>
						</div>
					</li>
				</transition-group>
			</ul>
			<div class="toolBox" v-if="nowSteps">
				<div class="uploader-item-title">
					<p>题目{{homework.length+1}}</p>
				</div>
				<div class="rowBox">
					<div class="uploader-item-addPic">
						<input type="file" @change="handleUpload" @click="getPicPos(homework.length+1)">
						<img src="../../../static/icons/addPic.png" alt="">
						<p>添加图片</p>
					</div>
					<div class="uploader-item-addText" @click="addText">
						<img src="../../../static/icons/addText.png" alt="">
						<p>添加文字</p>
					</div>
				</div>

			</div>
			<!--按钮-->
			<div class="classReport-btn" v-if="nowSteps">
				<b-btn :styles="'grey'" :height="30" :width="100" :size="14" :title="'上一步'" @click.native="nowSteps=0"
					   class="btn"></b-btn>
				<b-btn :styles="'orange'" :height="30" :width="100" :size="14" :title="'提交'"
					   @click.native="confirm"></b-btn>
			</div>

			<!--弹窗-->
			<el-dialog title="填写知识点" v-model="isShowPoint" size="normal" class="pointDialog" top="40%">
			<textarea maxlength="200" cols="30" rows="10" placeholder="请在此处填写知识点内容，最多200字"
					  v-model="tempPoint"></textarea>
				<div class="btn-grp">
					<el-button @click="cancelAdd">取 消</el-button>
					<el-button type="primary" @click="selectAdd">确 定</el-button>
				</div>
			</el-dialog>

			<el-dialog title="知识点掌握难度" v-model="isShowLevel" size="normal" class="pointDialog" top="40%">
				<el-radio-group v-model="tempLevel">
					<el-radio-button label="不会"></el-radio-button>
					<el-radio-button label="了解"></el-radio-button>
					<el-radio-button label="理解"></el-radio-button>
					<el-radio-button label="掌握"></el-radio-button>
					<el-radio-button label="应用"></el-radio-button>
				</el-radio-group>
				<p class="grayFont" style="margin-bottom: 60px;font-size: 12px;position: absolute; left: 20px;">
					*请根据学生对此知识点的掌握程度进行客观评价</p>
				<div class="btn-grp">
					<el-button @click="cancelLevel">取 消</el-button>
					<el-button type="primary" @click="selectLevel">确 定</el-button>
				</div>
			</el-dialog>

			<el-dialog title="评价确认按钮" v-model="isShowAcquire" size="normal" class="pointDialog" top="40%"
					   custom-clas="test">
				<div class="confirm">
					<p>您确定此份直播评价已填写完整,无误,可以提交？</p>
				</div>
				<div class="btn-grp">
					<el-button @click="cancelConfirm">取 消</el-button>
					<el-button type="primary" @click="commitForm">确 定</el-button>
				</div>
			</el-dialog>
		</div>
	</div>
</template>

<script>
	import titleBar from '../../components/bars/titleBar.vue'
	import {getCookie, getSession} from '../../common/scripts/util'
	import bBtn from '../../components/buttons/basicButtons.vue'
	export default {
		name: "classReport",
		components: {
			titleBar,
			bBtn
		},
		data () {
			return {
				// 课堂表现
				classroomPerformance: null,
				// 知识点
				knowleageEvl: [],
				// 下次课堂安排
				teacherArrangement: null,
				// 给家长留言
				leaveMessage: null,
				// 课后作业
				homework: [],

//				//masterStatus
//				masterStatus: [],

				// 显示知识点弹窗
				isShowPoint: false,
				// 显示掌握程度弹窗
				isShowLevel: false,
				// 	确认弹窗
				isShowAcquire: false,

				// 临时知识点
				tempPoint: '',
				// 临时掌握难度
				tempLevel: '',
				tempIndex: 0,
				// 临时坐标
				tempPicPos: null,
				// 控制页面转换
				nowSteps: 0,
				// 上传图片的token
				uploadToken: null
			}
		},
		props: {},
		computed: {
			level(number){
				switch (number) {
					case 1:
						return '不会';
						break;
					case 2:
						return '了解';
						break;
					case 3:
						return '理解';
						break;
					case 4:
						return '掌握';
						break;
					case 5:
						return '应用';
						break;
				}
			},
			classInfo: {
				get (){
					return this.$store.state.courseInfo || getSession('courseInfo')
				}

			}
		},
		created () {
		},
		mounted () {
			this._getToken();
		},
		methods: {
			// 获取图片上传token
			_getToken(){
				let _x_token
				// 判断x_token来源
				if (this.$store.state.x_token == null) {
//					this.$message({message: '获取课程信息失败', duration: 1500})
					_x_token = getCookie('x_token')
//					setTimeout(() => {
//						this.$router.push('/static/main')
//					}, 1500)
				} else {
					_x_token = this.$store.state.x_token
				}

				this.$api.getToken(_x_token)
					.then((res) => {
						if (res.data.status) {
							this.$message(res.data.msg)
							return false
						}
						this.uploadToken = res.data.result
					})
					.catch((err) => {
						this.$message(err.status)
						return false
					})
			},
			// 上传图片URL获得
			_putB64(base64){
				let str = 'qiniuUpload/' + new Date().getTime() + (Math.random(1000000) + '').substring(2, 10);
				let key = window.btoa(str);
				let qiniuUploadUrl;
				if (window.location.protocol === 'https:') {
					return qiniuUploadUrl = 'https://up-z1.qbox.me/putb64/-1/key/' + key;
				} else {
					return qiniuUploadUrl = 'http://upload-z1.qiniu.com/putb64/-1/key/' + key;
				}
			},
			// 添加知识点
			addPoint(){
				this.isShowPoint = true
				// 1.填写知识点
			},
			// 退出弹窗
			cancelAdd(){
				this.isShowPoint = false
				this.tempPoint = ''
			},
			// 弹窗确认选择
			selectAdd(){
				let _temp = {
					"knowleageName": "", // 知识点
					"masterDegree": null, // 掌握程度
					"importLevel": 0 // 重要等级
				}
				// 2.push 进数组 然后设置默认数据
				if (this.tempPoint.length < 2) {
					this.$message({message: "字数不能小于两个字", duration: 1000})
					this.cancelAdd()
					return false
				}
				_temp.knowleageName = this.tempPoint
				this.knowleageEvl.push(_temp)
				this.cancelAdd()
			},
			// 删除知识点
			deletePoint(index){
				this.knowleageEvl.splice(index, 1)
			},
			// 选择掌握程度
			chooseLevel(index){
				this.isShowLevel = true
				this.tempIndex = index
			},
			// 退出掌握程度弹框
			cancelLevel(){
				this.tempLevel = ''
				this.isShowLevel = false
				this.tempIndex = 0
			},
			// 掌握程度弹框确认按钮
			selectLevel(){
				let filer = (level) => {
					switch (level) {
						case '不会':
							return 1;
							break;
						case '了解':
							return 2;
							break;
						case '理解':
							return 3;
							break;
						case '掌握':
							return 4;
							break;
						case '应用':
							return 5;
							break;
					}
				}
				this.knowleageEvl[this.tempIndex].masterDegree = filer(this.tempLevel)
				this.cancelLevel()
			},
			// 数据转换
			filter(number){
				switch (number) {
					case 1:
						return '不会';
						break;
					case 2:
						return '了解';
						break;
					case 3:
						return '理解';
						break;
					case 4:
						return '掌握';
						break;
					case 5:
						return '应用';
						break;
				}
			},
			// 取消题目按钮
			cancelWork(index){
				this.homework.splice(index, 1);
			},
			// 上传图片
			handleUpload(e){
				let file = e.target.files[0]
				let fr = new FileReader()
				let self = this
				//是否支持fileReader
				if (typeof FileReader == 'undefined') {
					return;
				}
				//是否图像文件
				if (!/image/.test(file.type)) {
					return;
				}
				fr.readAsDataURL(file)

				fr.onload = (e) => {
					// 拿到base64字符串
					let base64 = e.target.result.split(',')[1];
					// 拿到上传URL
					let url = this._putB64(base64);
					let staticURL = 'http://fs.91xuexibao.com/'
					this.$api.uploadPic(url, base64, this.uploadToken).then((res) => {
						if (this.tempPicPos == this.homework.length + 1) {
							let _temp = {type: 1, url: []}
							_temp.url.push(staticURL + res.data.key)
							this.homework.push(_temp)
						} else {
							this.homework[this.tempPicPos].url.push(staticURL + res.data.key)
						}

						this.clearPicPos()
					}).catch((err) => {
						console.log(err)
						this.$message({message: "上传失败，请重试！", duration: 1500})
					})
				}

//				let picUrl = e.target.files[0].path.toString();
//				console.log(e.target.files[0])
				//	调取上传接口
			},
			// 获取图片的插入数据位置
			getPicPos(index){
				this.tempPicPos = index
			},
			// 清除图片的插入数据位置
			clearPicPos(){
				this.tempPicPos = null
			},
			// 添加文字
			addText(){
				let _temp = {
					type: '2',
					data: ''
				}
				this.homework.push(_temp)
			},
			// 添加图片
			addPic(){
				// 该方法废弃
				// 在这里会上传一张图片，然后创建一个新的题目
				let _temp = {
					type: 1,
					url: []
				}
			},
			// 删除图片
			delPic(index, num){
				this.homework[index].url.splice(num, 1)
				if (this.homework[index].url.length == 0) {
					this.homework.splice(index, 1)
				}
			},
			// 提交表单
			commitForm(){
				// 在这里发送请求提交表单
				if (getSession('temp_courseId') == null) {
					this.$message({message: "课程id有误！请重新登录", duration: 1500})
					return;
				}
				this.$api.saveTeacherEvluateNew(getSession('temp_courseId'), JSON.stringify(this.knowleageEvl), this.classroomPerformance,
					this.teacherArrangement, this.leaveMessage, JSON.stringify(this.homework))
					.then((res) => {
						let _data = res.data
						if (_data.status) {
							this.$message({message: _data.msg, duration: 1500})
							this.cancelConfirm()
							return false;
						} else {
							this.$message({message: "上传成功！", duration: 1500})
						  	this.cancelConfirm()
							setTimeout(() => {
								this.$router.push('/static/classInfo')
								this.$ipc.send("maximize")
							}, 1500)
						}
					})
					.catch((err) => {
						this.$message({message: err, duration: 1500})
					})
			},
			// 确认框
			cancelConfirm(){
				this.isShowAcquire = false
			},
			confirm (){
				// 在这里验证字段
				if (this.classroomPerformance == null) {
					this.$message({message: "课堂表现不能为空", duration: 1500})
					return;
				}

				if (this.knowleageEvl.length == 0) {
					this.$message({message: "知识点评价不能为空", duration: 1500})
					return;
				}

				for (let item of this.knowleageEvl) {
					if (item.masterDegree == null || item.importLevel == 0) {
						this.$message({message: "知识点信息填写不完善", duration: 1500})
						return;
					}
				}

				if (this.homework.length == 0) {
					this.$message({message: "还未布置作业", duration: 1500})
					return;
				}

				console.log(this.homework)
				for (let item of this.homework) {
					if (item.type == 2 && item.data.length < 2) {
						this.$message({message: "题目字数不能小于两个字", duration: 1500})
						return;
					}
				}

				if (this.teacherArrangement == null) {
					this.$message({message: "你还未布置下次教学安排", duration: 1500})
					return;
				}
				this.isShowAcquire = true
			}
		}
	}
</script>

<style lang="scss" type="text/scss">
	@import "../../common/styles/mixin";

	.midBox {
		display: flex;
		justify-content: center;
	}

	.el-input {
		width: 500px;
		.el-input__inner {
			@include fontSizeColor(12px, $fontClr_2nd);
		}

	}

	.confirm {
		@include allMidBox();
		height: 200px;
		p {
			margin-top: -50px;
			@include fontSizeColor(16px, $fontClr_1st);
			font-weight: bold;
		}
	}

	.el-textarea {
		margin: 20px 0 20px 0;

	}

	.el-input__inner {
		border-color: $border;
	}

	.el-input__inner::-webkit-input-placeholder {
		border-color: $border;
	}

	.el-textarea__inner:focus {
		border-color: $orange;
	}

	.el-select .el-input__inner:focus {
		border-color: $orange;
	}

	.el-textarea__inner {
		border-color: $border;
	}

	.el-rate__item:nth-child(5) {
		display: none;
	}

	.el-select-dropdown__item.selected.hover {
		background: $orange;
	}

	.el-form-item__label {
		color: $fontClr_1st;
	}

	.el-select-dropdown__item.selected {
		background: $orange;
	}

	.el-dialog {

		width: 400px;
	}

	.el-radio-button .el-radio-button__inner {
		border: none;
	}

	.el-radio-button:first-child .el-radio-button__inner {
		border: none;
	}

	.el-radio-button__orig-radio:checked + .el-radio-button__inner {
		background: $orange;
		border-color: $orange;
		box-shadow: none;
	}

	.el-radio-button__inner:hover {
		color: $orange;
	}

	.el-dialog__body {
		textarea {
			margin-left: 27px;
			margin-top: 20px;
			margin-bottom: 70px;
			width: 88%;
			@include fontSizeColor(14px, $fontClr_2nd)
		}
		.el-radio-group {
			border: solid $border;
			border-width: 1px 0 0 0;
			padding-top: 30px;
			height: 200px;
			.el-radio-button {
				margin: 0 10px 0 10px;
				border: none;
			}
		}
		.el-button {
			border-radius: 14px;
			width: 90px;
		}
		.el-button:hover {
			color: $orange;
			border-color: $orange;
		}
		.el-button--primary {
			border-color: $orange;
			background: $orange;
		}
		.el-button--primary:hover {
			color: #ffffff;
		}
		.btn-grp {
			bottom: 12px;
			right: 6%;
			position: absolute;
		}
	}

	input {
		border: 1px solid $border;
		height: 30px;
		width: 600px;
		padding: 10px;
		@include fontSizeColor(12px, $fontClr_2nd);
		font-weight: bold;
	}

	textarea {
		padding: 10px;
		border: 1px solid $border;
		resize: none;
		background: $bg_wht;
	}

	.pullDownBtn {
		height: 30px;
		width: 30px;
		background: $orange;
		@include allMidBox();
		img {
			@include wh(12px, 8px);
		}
	}

	.addRed {
		color: $fontClr_red;
	}

	.grayFont {
		@include fontSizeColor(14px, $fontClr_2nd);
		font-weight: bold;
	}

	.hintFont {
		font-size: 12px;
	}

	.normalFont {
		@include fontSizeColor(14px, $fontClr_1st);
	}

	.paddingBox {
		box-sizing: border-box;
		padding: 20px;
	}

	.classReport {
		width: 1000px;
		&-bar {
			@include fontSizeColor(16px, $fontClr_1st);
			background: #ffffff;
			height: 60px
		}
		&-info {
			background: #ffffff;
			margin-top: 20px;
			&-ctx {
				@include rowBox();
				align-items: center;

				.imgBox {
					@include wh(100px, 100px);
					margin-right: 40px;
					overflow: hidden;
					img {
						border-radius: 100%;
						@include wh(100%, 100%);
					}
				}
				.infoBox {
					margin-top: 20px;
					margin-bottom: 50px;
					.userName {
						@include fontSizeColor(24px, $fontClr_1st);
						font-weight: bold;
						margin-bottom: 10px;
					}
					.infoMain {
						li {
							margin-top: 20px;
						}
						.infoTitle {
							@include fontSizeColor(14px, $fontClr_2nd);
						}
						.infoCont {
							@include fontSizeColor(14px, $fontClr_1st);
							font-weight: bold;
						}
					}

				}
			}
			&-selector {
				margin-top: 20px;
				@include rowBox();
			}
		}
		&-evaluate {
			background: #ffffff;
			margin-top: 20px;
			.evaContainer {
				padding: 20px;
			}
			&-title {
				margin-top: 20px;
				border: dashed $border;
				border-width: 1px 0 1px 0;
				@include rowBox();
				align-items: center;
				height: 60px;
				width: 100%;
				span {
					text-align: center;
					display: block;
					width: 30%;
				}
			}
			&-cont {
				width: 100%;
				li {
					border: dashed $border;
					border-width: 0 0 1px 0;
					height: 80px;
					padding: 20px 0 20px;
					@include rowMidBox();
				}
			}
		}
		&-plan {
			p {
				margin-top: 20px;
			}
			background: #ffffff;
		}
		&-homework {
			margin-top: 20px;
			background: #ffffff;
		}
		&-btn {
			margin-top: 20px;
			height: 80px;
			display: flex;
			flex-flow: row nowrap;
			justify-content: center;
			align-items: center;
			background: #ffffff;
			.btn {
				margin-right: 20px;
			}
		}
	}

	/*知识点*/
	.item {
		&-title {
			@include allMidBox();
			width: 30%;
		}
		&-progress {
			@include allMidBox();
			width: 30%;
		}
		&-level {
			@include allMidBox();
			width: 28%;
		}
		&-delete {
		}
	}

	.addPoint {
		margin-left: 12%;
		margin-top: 20px;
		margin-bottom: 20px;
	}

	.rowBox {
		padding: 20px 0 20px 0;
		@include rowBox();
	}

	.toolBox {
		padding: 20px;
		margin-top: 20px;
		background: #ffffff;
	}

	.uploader {
		li:not(:first-child) {
			margin-top: 20px;
		}
		li {
			padding: 20px;
			background: #ffffff;
		}
		&-item {
			&-title {
				@include rowMidBox();
				@include wh(100%, 20px);
				padding: 20px;
				border: dashed $border;
				border-width: 0 0 1px 0;
			}
			&-input {
				@include wh(100%, 100px);
				margin-top: 20px;
				@include fontSizeColor(14px, $fontClr_2nd)
			}
			&-addPic {
				@include wh(200px, 200px);
				@include allMidBox();
				margin-right: 10px;
				background: $bg_wht;
				position: relative;
				input {
					cursor: pointer;
					position: absolute;
					left: 0;
					top: 0;
					opacity: 0;
					height: 100%;
					width: 100%;
				}
				p {
					margin-top: 10px;
					@include fontSizeColor(12px, $fontClr_2nd)
				}
			}
			&-addText {
				@include wh(200px, 200px);
				@include allMidBox();
				margin-right: 10px;
				background: $bg_wht;
				p {
					margin-top: 10px;
					@include fontSizeColor(12px, $fontClr_2nd)
				}
				cursor: pointer;
			}
			&-imgBox {
				position: relative;
				margin-right: 10px;
				@include wh(200px, 200px);
				overflow: hidden;
				img {
					@include wh(100%, 100%);
				}
			}
			&-cancelBtn {
				display: flex;
				justify-content: flex-end;
				margin-top: 20px;
				margin-bottom: 20px;
			}
		}
	}

	.delPicBtn {
		cursor: pointer;
		top: 10px;
		right: 10px;
		@include wh(18px, 18px);
		z-index: 100;
		position: absolute;
		img {
			@include wh(100%, 100%)
		}
	}

	.slide-fade-enter-active {
		transition: all .2s ease;
	}

	.slide-fade-leave-active {
		transition: all .3s;
		transform: translateX(-100px);
	}

	.slide-fade-enter, .slide-fade-leave-to
		/* .slide-fade-leave-active for below version 2.1.8 */
	{
		transform: translateX(-100px);
		opacity: 0;
	}

</style>
