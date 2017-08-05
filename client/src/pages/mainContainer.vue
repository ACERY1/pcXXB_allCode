<template>
	<div class="m">
		<top-bar :avatar="top_avatar" :name="top_username"></top-bar>
		<div class="mainContainer">
			<router-view></router-view>
		</div>
		<config-dialog></config-dialog>
	</div>
</template>

<script>
	import topBar from '../components/bars/topBar.vue'
	import configDialog from '../components/dialogs/configDialog.vue'

	export default {
		name: "mainContainer",
		components: {
			topBar,
			configDialog
		},
		data () {
			return {
				//顶部信息
//				top_avatar: this.$store.state.teacherInfo.avatar,
//				top_username: this.$store.state.teacherInfo.name,

			}
		},
		props: {},
		computed: {
			top_avatar(){
				return this.$store.state.teacherInfo.avatar
			},
			top_username(){
				return this.$store.state.teacherInfo.name
			}
		},
		created () {
			this.$router.push('main')
		},
		mounted () {

		},
		methods: {}
	}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
	@import "../common/styles/mixin";

	.mainContainer {
		padding-top: 50px;
		/*margin-top: 50px;*/
	}
</style>
