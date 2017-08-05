<!--已丢弃-->
<template>
	<div class="message">
		<div class="message-my" v-if="done">
			<span>我的留言</span>
			<div class="message-my-cont">
				{{cont}}
			</div>
		</div>
		<div class="message-text" v-if="!done">
			<el-row type="flex" justify="center">
				<el-col :span="18">
					<el-input
							type="textarea"
							resize="none"
							maxlength="200"
							rows="8"
							v-model="textVal"
							placeholder="写下你需要老师准备或注意的问题吧，最少10个字哦！"
							class="message-text-area">
					</el-input>
				</el-col>
			</el-row>

		</div>
		<div class="message-btn" v-if="!done">
			<el-row type="flex" justify="center">
				<el-col :span="6"  class="message-btn-mid">
					<myBtn :styles="'disabled'" :title="'取消'"></myBtn>
				</el-col>
				<el-col :span="6" class="message-btn-mid">
					<myBtn :styles="'yellow'" :title="'提交'"></myBtn>
				</el-col>
			</el-row>
		</div>
	</div>
</template>

<script>
	import myBtn from '../../components/buttons/basicButtons.vue'
	export default {
		name: "",
		components: {
			myBtn
		},
		data () {
			return {
				textVal:null,
			}
		},
		props:{
			done:{
				type:Boolean,
				default:true
			},
			cont:{
				type:String,
				default:'test words'
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
	.message{

		/*按钮样式*/
		&-btn{
			&-mid{
				@include allMidBox();
			}
		}

		&-text{
			&-area{
			}
		}
	}
</style>
