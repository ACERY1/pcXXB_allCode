<template>
	<div class="boolBtn">
		<bsc-btn :styles="'white'" :title="noTitle" :height="30" :width="80" :size="14" style="margin-right: 10px" v-on:click.native="no"></bsc-btn>
		<bsc-btn :styles="'orange'" :title="yesTitle" :height="30" :width="80" :size="14" v-on:click.native="yes"></bsc-btn>
	</div>
</template>

<script>
	/*boolBtn
	 * 接口详情
	 * 1.yesTitle 按钮显示文字
	 * 2.noTitle  同上*/
	import bscBtn from './basicButtons.vue'
	export default {
		name: "",
		components: {
			bscBtn
		},
		data () {
			return {}
		},
		props: {
			yesTitle: {
				default: 'yes'
			},
			noTitle: {
				default: 'no'
			}
		},
		computed: {},
		created () {
		},
		mounted () {
		},
		methods: {
			yes(){
				this.$emit('yes',1)
			},
			no(){
				this.$emit('no',0)
			}
		}
	}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
	.boolBtn{
		display: flex;
		justify-content: center;
	}
</style>
