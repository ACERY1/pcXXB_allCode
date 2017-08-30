<template>
	<div class="topBar">
		<div class="topBar-logo">
			<img src=../../../static/logos/top.png alt="">
		</div>
		<p class="topBar-title">学习宝教师端</p>
		<div class="topBar-usr">
			<div class="topBar-usr-pic" @click="goLogin">
				<img :src="avatar" alt="">
			</div>
			<p>{{name}}</p>
			<div class="topBar-usr-drop" @click="showMenu">
				<img src="../../../static/icons/topBar/pullDown.png" alt="">
			</div>
		</div>
		<div class="topBar-btns">
			<img src="../../../static/icons/topBar/minimize.png" alt="" @click="minimize">
			<img src="../../../static/icons/topBar/square.png" alt="" @click="maximize">
			<img src="../../../static/icons/topBar/close.png" alt="" @click="quit">
		</div>


		<transition name="fade">
			<div class="topBar-menu" v-show="isShowMenu">
				<div class="topBar-menu-item" @click="itemOne">
					<img src="../../../static/icons/setting.png" alt="">
					<p>设备检测</p>
				</div>
				<div class="topBar-menu-item" @click="itemTwo">
					<img src="../../../static/icons/people.png" alt="">
					<p>关于我们</p>
				</div>
				<div class="topBar-menu-item" @click="itemThree">
					<img src="../../../static/icons/exit.png" alt="">
					<p>退出登录</p>
				</div>
			</div>
		</transition>

	</div>
</template>

<script>
	import {
		getCookie, removeAllStore, setUserInfoInLocal, removeAllSession, delCookie, getStore, getSession
	} from '../../common/scripts/util'
	import confD from '../../components/dialogs/configDialog.vue'
	export default {
		name: "",
		components: {},
		data () {
			return {
		  /*显示下拉菜单*/

			}
		},
		props: {
			avatar: {
				default: '../../../static/icons/topBar/indexPic.png'
			},
			name: {
				default: "皮皮虾"
			},
//			itemTwo: {
//				type: Function,
//			}
		},
		computed: {
			isShowMenu(){
				return this.$store.state.showMenu
			}
		},
		created () {
		},
		mounted () {
		},
		methods: {
			goLogin(){
		  /*TODO:这个判断有问题 ps:现在解决了*/
				if (getCookie("x_token") == null || !getStore('name')) {
					this.$router.push('/static/login')
				} else {
//					this.$router.push('/static/main')
				}
			},
			//设备检测*/
			itemOne(){
				this.$store.commit('UN_SHOW_MENU')
				this.$store.commit('UPDATE_SHOW_SETTING')
			},
			//关于我们*/
			itemTwo(){
				this.$store.commit('UN_SHOW_MENU')
				this.$store.commit('UPDATE_SHOW_ABOUT')
			},
			//退出登录*/
			itemThree(){
		  /*TODO: 这个地方已经完成了：既在STORE里保存登录状态，又在LocalStorage里面保存了*/
				this.$store.commit('UN_SHOW_MENU')
				let logOut = () => {
					this.$store.commit('CLEAR_TEACHER_INFO') // 清除登录信息
					this.$store.commit('RECORD_IS_LOGOUT') // 标记退出登录
					setUserInfoInLocal({
						age: '',
						avatar: "../../../static/icons/topBar/indexPic.png",
						gender: '',
						mobile: "",
						name: "请登录",
						star: ''
					}) //清空数据
					this.$store.commit('UN_SHOW_MENU')
					this.$api.logout().then((res) => {
						let _data = res.data
						if (_data.status) {
							this.$message({
								message: _data.msg,
								duration: 1500
							})
						} else {

							this.$message({
								message: "再见！",
								duration: 1200
							})
							setTimeout(() => {
								removeAllStore()
								removeAllSession()
								this.goLogin()
							}, 1500)


						}
					})
				}
				if (this.$store.state.isCountingTime || getSession('courseId_forClass')) {
					this._showMessageBox('正在上课，是否退出登录？', () => {
						logOut()
					}, () => {
					})
				} else {
					logOut()
				}

			},
			//显示菜单
			showMenu(){
				this.$store.state.showSetting = false
				this.$store.state.showAbout = false
				this.$store.commit('UPDATE_SHOW_MENU')
			},
			minimize(){
				this.$ipc.send('minimize')
			},
			maximize(){
				this.$ipc.send('maximize')
			},
			quit(){
//				console.log(this.$store.state.isCountingTime || getSession('courseId_forClass'))
				this.$store.commit('UN_SHOW_MENU')
				if (this.$store.state.isCountingTime || getSession('courseId_forClass')) {
					this._showMessageBox('正在上课，是否退出学习宝教师端?', () => {
						this.$message({
							message: '再见'
						});
						setTimeout(() => {
							this.$ipc.send('quitApp')
						}, 1500)
					}, () => {
					})
				} else {
					this._showMessageBox('是否退出学习宝客户端', () => {
						this.$message('正在上课，是否退出学习宝教师端?', {
							message: '再见'
						});
						setTimeout(() => {
							this.$ipc.send('quitApp')
						}, 1500)
					})
//					this.$ipc.send('quitApp')
				}

			},
			_showMessageBox(word, yesFn, noFn = () => {
			}){
				this.$confirm(word, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					yesFn()
				}).catch(() => {
					noFn()
				});
			}
		}
	}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
	@import "../../common/styles/mixin";

	.fade-enter-active, .fade-leave-active {
		transition: transform .3s;

	}

	.fade-enter, .fade-leave-to /* .fade-leave-active in below version 2.1.8 */
	{
		transform: translateY(-10px);
		opacity: 0
	}

	.topBar {
		position: fixed;
		z-index: 2048;
		width: 100%;
		@include rowBox();
		align-items: center;
		background: $bg_gry;
		height: 50px;
		/*width: 1000px;*/
		&-logo {
			@include allMidBox();
			margin-left: 10px;
			margin-right: 10px;
		}
		&-title {
			@include fontSizeColor(14px, $bg_wht)
		}
		&-usr {
			p {
				cursor: default;
				@include fontSizeColor(12px, #b9b9ba)
			}
			position: absolute;
			right: 140px;
			@include rowBox();
			align-items: center;
			&-pic {
				img {
					overflow: hidden;
					border-radius: 100%;
					@include wh(30px, 30px)
				}
				cursor: pointer;
				margin-right: 10px;
			}
			&-drop {
				cursor: pointer;
				margin-top: -3px;
				margin-left: 10px;
			}
		}
		&-btns {
			right: 20px;
			top: 15px;
			position: absolute;
			align-items: center;
			@include rowBox();
			img:first-child {
				padding-top: 8px;
				padding-bottom: 8px;
				@include wh(12px, 2px)
			}
			img {
				cursor: pointer;
			}
			img:not(:first-child) {
				margin-left: 15px;
				@include wh(12px, 12px)
			}
		}
		&-menu {
			border-radius: 0 0 4px 4px;
			box-shadow: 0px 0px 6px $fontClr_2nd;
			top: 52px;
			right: 100px;
			position: absolute;
			z-index: inherit;
			background: #ffffff;
			width: 150px;
			&-item {
				cursor: pointer;
				margin-bottom: 10px;
				@include fontSizeColor(14px, $fontClr_1st);
				img {
					@include wh(14px, 14px);
					margin-left: 20px;
					margin-right: 20px;
				}
				@include rowBox();
				align-items: center;
			}
			&-item:first-child {
				margin-top: 10px !important;
			}
		}
	}
</style>
