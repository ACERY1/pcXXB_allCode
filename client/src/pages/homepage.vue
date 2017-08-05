<template>
	<div class="home">
		<choose-bar></choose-bar>
		<el-row>
			<el-col :span="24">
				<class-item v-for="i in 1" :key="i"></class-item>
			</el-col>
		</el-row>
	</div>
</template>

<script>
	import chooseBar from '../components/bars/chooseBar.vue'
	import classItem from '../components/items/classItem.vue'
	export default {
		name: "",
		components: {
			chooseBar,
			classItem,
		},
		data () {
			return {}
		},
		props: {},
		computed: {},
		created () {
		},
		mounted () {
		},
		methods: {

		}
	}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
