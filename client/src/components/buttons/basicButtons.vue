<!--TODO:根据需求继续封装，以后全部按钮均调用这个组件-->
<template>
	<div class="bscBtn" :style="'height:'+height+'px;width:'+width+'px;'">
		<!--浅灰按钮 -->
		<div v-if="styles === 'grey'" class="bscBtn-common bscBtn-disabled">
			<p :style="'font-size:'+size+'px;color:'+fontColor+';'">
				{{title}}
			</p>

		</div>

		<!--深灰按钮-->
		<div v-if="styles === 'grey_d'" class="bscBtn-common bscBtn-grey">
			<p :style="'font-size:'+size+'px;color:'+fontColor+';'">
				{{title}}
			</p>

		</div>

		<!--黄色按钮-->
		<div v-if="styles === 'yellow'" class="bscBtn-common bscBtn-yellow">
			<p :style="'font-size:'+size+'px;color:'+fontColor+';'">
				{{title}}
			</p>
		</div>

		<!--白色按钮-->
		<div v-if="styles === 'white'" class="bscBtn-common bscBtn-normal">
			<p :style="'font-size:'+size+'px;color:'+fontColor+';'">
				{{title}}
			</p>
		</div>

		<!--橙色按钮-->
		<div v-if="styles === 'orange'" class="bscBtn-common bscBtn-orange">
			<p :style="'font-size:'+size+'px;color:'+fontColor+';'">
				{{title}}
			</p>
		</div>
	</div>
</template>

<script>
	/*按钮组
	 * 接口详情
	 * 1. title按钮文字
	 * 2. styles(white,grey,yellow,orange)
	 * 3. size字体大小
	 * 4. height width 按钮的长宽
	 * 5. fontColor 按钮字体颜色*/
	export default {
		name: "",
		components: {},
		data () {
			return {}
		},
		props: {
			/*显示文字*/
			title: {
				type: String,
				default: '进入教室'
			},

			/*样式种类*/
			styles: {
				type: String,
				/*
				 white,grey,yellow,orange
				 */
				default: 'white'
			},
			size: {
				type: Number,
				default: 18
			},
			height: {
				type: Number,
				default: 50
			},
			width: {
				type: Number,
				default: 200
			},
			fontColor:{
				default:null
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
	@import "../../common/styles/mixin";

	.bscBtn {
		font-family: SimHei;
		cursor: pointer;
		&-common {
			@include allMidBox();
			@include borderRadius(0);
			height: 100%;
			width: 100%;
			border: none;
			box-sizing: border-box;
		}
		&-yellow {
			background: $yellow;
			color: $btn_wht;
		}
		&-disabled {
			background: $btn_gry;
			color: $btn_wht;
		}
		&-normal {
			@include fullBorder(1px, $border);
			/*下面这个颜色看得我贼jb难受*/
			background: #ffffff;
			color: $fontClr_main;
		}
		&-orange {
			background: $btn_org;
			color: $btn_wht;
		}
		&-grey{
			background: $btn_gry_d;
			color: $btn_wht;
		}
	}
</style>
