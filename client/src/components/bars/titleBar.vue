<template>
	<div class="tBar">
		<div class="tBar-bar"></div>
		<div class="tBar-title">{{title}}</div>
	</div>
</template>

<script>
	export default {
		name: "",
		components: {},
		data () {
			return {}
		},
		props:{
			title:{
				default:'未指定标题'
			}
		},
		computed: {},
		created () {
		},
		mounted () {},
		methods: {}
	}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
	@import "../../common/styles/mixin";
	.tBar{
		@include rowBox();
		@include wh(100%,20px);
		align-items: center;
		height: 20px;
		width: 100%;
		&-bar{
			margin-right: 20px;
			@include wh(5px,100%);
			background: $orange;
		}
		&-title{
			@include fontSizeColor(16px,$fontClr_1st)
			font-weight: bold;
		}
	}
</style>
