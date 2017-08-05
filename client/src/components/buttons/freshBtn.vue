<template>
	<div class="">
		<img src="../../../static/icons/fresh.png" alt="" class="freshBtn " :class="{rotate:triggerRotate} "
			 @click="rotate">
	</div>
</template>

<script>
	export default {
		name: "",
		components: {},
		data () {
			return {
				triggerRotate: false,
			}
		},
		props: {},
		computed: {},
		created () {
		},
		mounted () {
		},
		methods: {
			rotate(){
				this.triggerRotate = !this.triggerRotate

			},
		}
	}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
	@import "../../common/styles/mixin";

	.freshBtn {
		cursor: pointer;
	}
	.rotate {
		animation: myRotate 1.6s linear;
	}

	@keyframes myRotate {
		0% {
			transform: rotate(0deg);
		}
		50% {
			transform: rotate(360deg);
		}
		100% {
			transform: rotate(720deg);
		}
	}
</style>
