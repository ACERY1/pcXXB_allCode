<template>
	<div class="clsBtn" @click="close">
		<img src="../../../static/icons/close_0.png" alt="" v-if=" on === false" class="item">
		<img src="../../../static/icons/close_1.png" alt="" v-if=" on === true" class="item">
	</div>
</template>

<script>
	export default {
		name: "",
		components: {},
		data () {
			return {}
		},
		props: {
			on: {
				default: true
			},
			close: {
				type: Function,
				default: () => {
					console.log('close!')
				}
			}
		},
		computed: {},
		created () {
		},
		mounted () {
		},
		methods: {}
	}
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
	.clsBtn {
		cursor: pointer;
		width: 100%;
		display: block;
		.item {
			float: right;
		}
	}
</style>
