<template>
	<div class="ctn">
		<!--<video class="videoScreen" autoplay="autoplay" muted id="videoBox2" height="100" width="100" style="position: absolute;background-color: #3b3b3b;z-index: 99999"></video>-->

		<top-bar :avatar="top_avatar" :name="top_username"></top-bar>
		<div class="mainContainer">
			<router-view></router-view>
		</div>
		<config-dialog v-if="isShowDialog"></config-dialog>
		<about-dialog :close="showAbout"></about-dialog>
	</div>
</template>

<script>
	import topBar from '../components/bars/topBar.vue'
	import configDialog from '../components/dialogs/configDialog.vue'
	import aboutDialog from '../components/dialogs/aboutDialog.vue'
	import {getStore} from '../common/scripts/util'
	export default {
		name: "mainContainer",
		components: {
			topBar,
			configDialog,
			aboutDialog
		},
		data () {
			return {
				//顶部信息
//				top_avatar: this.$store.state.teacherInfo.avatar,
//				top_username: this.$store.state.teacherInfo.name,
				isShowAbout: true,
			}
		},
		props: {},
		computed: {
			top_avatar(){
				if(!this.$store.state.isLogin){
					return getStore("avatar")
				}
				return this.$store.state.teacherInfo.avatar
			},
			top_username(){
				if(!this.$store.state.isLogin){
					return getStore("name")
				}
				return this.$store.state.teacherInfo.name
			},
			isShowDialog(){
				return this.$store.state.showSetting
			}
		},
		created () {
//			this.$router.push('main')
		},
		mounted () {
		},
		methods: {
			showAbout(){
				this.$store.commit('UPDATE_SHOW_ABOUT')
			}
		}
	}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
	@import "../common/styles/mixin";

	.mainContainer {
		padding-top: 50px;
		/*margin-top: 50px;*/
	}
	.ctn{
		height: 100%;
	}
</style>
