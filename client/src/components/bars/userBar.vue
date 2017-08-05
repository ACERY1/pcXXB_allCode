<template>
	<div class="">

	</div>
</template>

<script>
	/*用户栏
	* 接口详情
	* 1. info(name,headPic)*/
	export default {
		name: "",
		components: {},
		data () {
			return {}
		},
		props: {
			info: {
				type: Object,
				default: () => {
					return {
						headPic:'',
						name:'',
					}
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
</style>
