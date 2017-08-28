<template>
	<div class="login">
		<div class="login-logo" :class="{isGetPwd:switchToGetPwd}">
			<img src="../../../static/logos/login.png" alt="">
		</div>
		<input type="number" class="login-input tel" placeholder="请输入手机号" v-model="userTel">
		<div class="login-input validate" v-if="switchToGetPwd">
			<input type="text" placeholder="请输入验证码" maxlength="20" v-model="verifyCode">
			<button class="valBtn" :disabled="isQueryCode" @click="queryCode">{{time}}</button>
		</div>
		<input type="password" class="login-input pwd" placeholder="请输入密码" v-model="password">

		<my-btn :styles="'yellow'" :height="50" :width="300" :title="'登录'" class="login-btn" v-if="!switchToGetPwd"
				:size="20" @click.native="login"></my-btn>
		<my-btn :styles="'yellow'" :height="50" :width="300" :title="'完成'" class="login-btn" v-if="switchToGetPwd"
				:size="20" @click.native="resetPwd"></my-btn>
		<div class="login-forget">
			<p v-if="!switchToGetPwd" @click="switchPwd">忘记密码？</p>
			<p v-if="switchToGetPwd" @click="switchPwd">返回登录</p>
		</div>
	</div>
</template>

<script>
	import {countFn, setUserInfoInLocal, setCookie, setStore} from '../../common/scripts/util'
	import myBtn from '../../components/buttons/basicButtons.vue'

	export default {
		name: "",
		components: {
			myBtn
		},
		data () {
			return {
				switchToGetPwd: false,
				isQueryCode: false, // 做防抖使用，防止多次请求
				time: "获取验证码",
				busy: false,
				verifyCode: '',

				//用户名密码
				userTel: '15711370918',
				password: '123456'
			}
		},
		props: {},
		computed: {},
		created () {
		},
		mounted () {
		},
		methods: {
			//切换到找回密码页面*/
			switchPwd(){
				this.switchToGetPwd = !this.switchToGetPwd
				this.password = ''
			},
			//请求验证码*/
			queryCode(){
				this.time = 60;
				this.isQueryCode = true
				this.$api.sendVerifyCode(this.userTel).then((res) => {
					if (res.data.success) {
						countFn(60, 1000, () => {
							this.time--
						}, this._queryDone)
					} else {
						this.$message({message: res.data.msg, duration: 2000})
					}

				}).catch((err) => {
					this.$message({message: `错误+${err}`, type: 'error', duration: 1000})
					this.isQueryCode = false
				})

			},
			//请求验证码60秒之后的回调函数*/
			_queryDone(){
				this.isQueryCode = false
				this.time = "获取验证码"
			},
			//登录*/
			login(){
				if (this.busy) {
					return false
				}
				this.busy = true
				if (this.$utils.verifyVal(this.userTel, this.password)) {
					this.$message({message: "密码，账号不能为空", type: 'error', duration: 1000})
					this.busy = false
					return false
				}

				this.$api.login(this.userTel, this.password).then((res) => {
					console.log(`Login Request code ${res.status}`)
					let _data = res.data
					if (_data.status == '0') {
						//登录成功*/
						//教师端 15711370918 123456
						setUserInfoInLocal(_data.teacherInfo) // 在本地保存用户数据
						this.$store.commit('RECORD_TEACHER_INFO', _data.teacherInfo) // 保存数据
						this.$store.commit('UPDATE_X_TOKEN', _data.x_token); // 保存x_token
						this.$store.commit('RECORD_IS_LOGIN') // 提交登录状态
						this.$message({message: "登录成功！", type: 'success', duration: 1000})
						setTimeout(() => {
							this.$router.push('main')
						}, 1000)

					} else {
						//业务验证失败*/
						this.$message({message: _data.msg, type: 'error', duration: 1000})
						this.busy = false
					}
				}).catch((err) => {
					this.$message({message: `错误${err.status},${err.statusText}`, type: 'error', duration: 1000})
					this.busy = false
				})
			},
			resetPwd(){
				if (this.verifyCode == '') {
					this.$message({
						message: '验证码不能为空',
						duration: 1000
					})
					return false
				}
				if (this.password == '') {
					this.$message({
						message: '新密码不能为空',
						duration: 1000
					})
					return false
				}

				this.$api.resetPassword(this.userTel, this.password, this.verifyCode).then((res) => {

					let _data = res.data
					if (_data.status == 0) {
						this.$message({message: "重置成功", type: 'error', duration: 1000})
					  	this.switchToGetPwd = !this.switchToGetPwd
					} else {
						this.$message({message: _data.msg, type: 'error', duration: 1000})
					}


//					if (_data.status = '-18') {
//						this.$message({message: _data.msg, type: 'error', duration: 1000})
//					}
				}).catch((err) => {
					this.$message({message: `错误+${err}`, type: 'error', duration: 1000})
					this.busy = false
				})
				console.log('reset!')
			}
		}
	}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
	@import "../../common/styles/mixin";

	.isGetPwd {
		margin-top: 35px !important;
	}

	.login {
		@include allMidBox();
		input {
			margin-top: 20px;
			box-sizing: border-box;
			@include fullBorder(1px, $border);
			@include wh(300px, 40px);
			@include fontSizeColor(14px, $fontClr_1st);
			padding-left: 10px;
			/*font-weight: bold;*/
		}
		input::-webkit-input-placeholder, textarea::-webkit-input-placeholder {
			@include fontSizeColor(14px, $fontClr_3rd)
		}
		&-logo {
			margin-top: 60px;
			margin-bottom: 10px;
		}
		&-btn {
			margin-top: 20px;
			margin-bottom: 20px;
		}
		&-forget {
			display: flex;
			flex-flow: row;
			margin: 20px 0;
			@include fontSizeColor(12px, $fontClr_2nd);
			padding: 0 20px 0;
			line-height: 1px;
			border-left: 100px solid #ddd;
			border-right: 100px solid #ddd;
			text-align: center;
			p {
				cursor: pointer;
			}
		}
		.validate {
			position: relative;
			.valBtn {
				@include fontSizeColor(14px, $orange);
				border: $fontClr_3rd solid;
				border-width: 0 0 0 1px;
				cursor: pointer;
				background: transparent;
				top: 28px;
				height: 25px;
				width: 100px;
				right: 0;
				padding: 0 10px 0 10px;
				position: absolute;
			}
		}

	}
</style>
