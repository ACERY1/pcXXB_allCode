<template>
	<div class="indexCnt" id="guide">
		<cls-btn :on="isOn" class="indexCnt-clsBtn pointer"></cls-btn>
		<router-view></router-view>
	</div>
</template>

<script>
	import clsBtn from '../components/buttons/closeBtn.vue'
	export default {
		name: "",
		components: {
			clsBtn
		},
		data () {
			return {
				isOn:true
			}
		},
		props: {
		},
		computed: {},
		created () {
//			this.$router.push('guide/install')
		},
		mounted () {
		},
		methods: {}
	}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
	@import "../common/styles/mixin";
	.indexCnt{
		position: relative;
		box-sizing: border-box;
		padding: 20px;
		height: 100%;
		/*width: 800px;*/
		background: $bg_wht;
		box-shadow:  rgba(0,0,0,.15) 0 3px 7px;
	}
</style>
