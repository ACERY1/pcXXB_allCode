<template>
	<div class="toolsBar">
		<div class="toolsBar-time">
			<p v-if="!isCounting">00:00/55:00</p>
			<p v-if="isCounting">{{countMin<=9?'0'+countMin:countMin}}:{{countSec<=9?'0'+countSec:countSec}}/55:00</p>
		</div>
		<div class="toolsBar-offClass">
			<img src="../../../static/icons/live/offClass.png" alt="" @click="offClass">
		</div>
		<div class="toolsBar-toolBtn">
			<div class="toolsBar-toolBtn-item">
				<div class="toBox" v-if="isShowColor">
					<img src="../../../static/icons/live/red.png" alt="" v-if="!pickBool[0]" @click="pickColor(0)">
					<img src="../../../static/icons/live/red_picked.png" v-if="pickBool[0]" alt=""
						 @click="pickColor(0)">
					<img src="../../../static/icons/live/blue.png" alt="" v-if="!pickBool[2]" @click="pickColor(2)">
					<img src="../../../static/icons/live/blue_picked.png" alt="" v-if="pickBool[2]"
						 @click="pickColor(2)">
					<img src="../../../static/icons/live/black.png" alt="" v-if="!pickBool[1]" @click="pickColor(1)">
					<img src="../../../static/icons/live/black_picked.png" alt="" v-if="pickBool[1]"
						 @click="pickColor(1)">
				</div>
				<img src="../../../static/icons/live/color.png" alt="" @click="showColor">
			</div>
			<div class="toolsBar-toolBtn-item">
				<div class="toBox" v-if="isShowLine">
					<img src="../../../static/icons/live/lg.png" alt="" v-if="!pickBool2[0]" @click="pickLine(0)">
					<img src="../../../static/icons/live/lg_picked.png" alt="" v-if="pickBool2[0]" @click="pickLine(0)">
					<img src="../../../static/icons/live/mid.png" alt="" v-if="!pickBool2[1]" @click="pickLine(1)">
					<img src="../../../static/icons/live/mid_picked.png" alt="" v-if="pickBool2[1]"
						 @click="pickLine(1)">
					<img src="../../../static/icons/live/xs.png" alt="" v-if="!pickBool2[2]" @click="pickLine(2)">
					<img src="../../../static/icons/live/xs_picked.png" alt="" v-if="pickBool2[2]" @click="pickLine(2)">
				</div>
				<img src="../../../static/icons/live/line.png" alt="" @click="showLine">
			</div>
			<div class="toolsBar-toolBtn-item" :class="{isUseEraser:isUseEraser}">
				<img src="../../../static/icons/live/clear.png" alt="" @click="useEraser">
			</div>
			<div class="toolsBar-toolBtn-item">
				<img src="../../../static/icons/live/delete.png" alt="" @click="clearCanvas">
			</div>
		</div>
		<div class="toolsBar-pager">
			<img src="../../../static/icons/live/left.png" alt="" v-if="nowPage === 1">
			<img src="../../../static/icons/live/left_l.png" alt="" v-if="nowPage != 1" @click="back">
			<p>{{nowPage}}/{{allPage}}</p>
			<img src="../../../static/icons/live/right.png" alt="" v-if="nowPage === allPage">
			<img src="../../../static/icons/live/right_l.png" alt="" v-if="nowPage != allPage" @click="forward">
		</div>
		<div class="toolsBar-addPaper" @click="addNewPage">
			<img src="../../../static/icons/live/addNew.png" alt="">
		</div>
		<p v-show="false">{{counting}}</p>
	</div>
</template>

<script>
	import {countFn} from '../../common/scripts/util'
	// 0红 1黑 2蓝 0粗 1中 2细
	export default {
		name: "",
		components: {},
		data () {
			return {
//				nowPage: 1,
//				allPage: 1,
				isUseEraser: false,
				isShowColor: false,
				isShowLine: false,
				pickBool: [0, 0, 0],
				pickBool2: [0, 0, 0],
				isPickLine: false,
				isCounting: false,
				countMin: 0,
				countSec: 0
			}
		},
		props: {
			nowPage: {
				type: Number,
				default: () => {
					return 1
				}
			},
			allPage: {
				type: Number,
				default: () => {
					return 1
				}
			},
		},
		computed: {
			counting: {
				get (){
					if (this.$store.state.isCountingTime) {
						this.countTime()
					}
					return this.$store.state.isCountingTime
				}
			}
		},
		created () {
		},
		mounted () {

		},
		methods: {
			_clearStatus(){
				this.isShowLine = false
				this.isShowColor = false
			},
			back(){
				if (this.nowPage != 1) {
					this.$emit('backPage')
				}
			},
			forward () {
				if (this.nowPage != this.allPage) {
					this.$emit('forwardPage')
				}
			},
			addNewPage(){
//				this.allPage++
				this.$emit('addNewPage')
			},
			showColor(){
				this.isShowLine = false
				this.isShowColor = !this.isShowColor
			},
			showLine(){
				this.isShowColor = false
				this.isShowLine = !this.isShowLine
			},
			pickColor(code){
				for (let i in this.pickBool) {
					this.pickBool.splice(i, 1, 0)
				}
				this.pickBool.splice(code, 1, 1)
				this.isShowColor = !this.isShowColor
				this.$emit('changeColor', code)
			},
			pickLine(code){
				for (let i in this.pickBool) {
					this.pickBool2.splice(i, 1, 0)
				}
				this.pickBool2.splice(code, 1, 1)
				this.isShowLine = !this.isShowLine
				this.$emit('changeSize', code)
			},
			useEraser (){
				this._clearStatus()
				if (this.isUseEraser) {
					this.$emit('cancelEraser')
					this.isUseEraser = false
				} else {
					this.$emit('useEraser')
					this.isUseEraser = true
				}
			},
			clearCanvas (){
				this._clearStatus()
				this.$emit('clearCanvas')
			},
			offClass () {
				this.$emit('offClass')
			},
			countTime(){
				this.isCounting = true
				countFn(55 * 60, 1000, () => {
					if (this.countSec == 59) {
						this.countMin++
						this.countSec = 0
					} else {
						this.countSec++
					}
				}, () => {
					this.$emit('timeUp')
				})

			}

		}
	}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
	@import "../../common/styles/mixin";

	.toolsBar {
		position: relative;
		@include rowBox();
		width: 100%;
		height: 30px;
		background: $bar_bg;
		&-time {
			padding-top: 2px;
			margin-left: 10px;
			margin-right: 20px;
			@include rowMidBox();
			@include fontSizeColor(12px, $bg_wht)
		}
		&-offClass {
			cursor: pointer;
			@include rowMidBox();
		}
		&-toolBtn {
			right: 42%;

			position: absolute;
			@include rowBox();
			&-item {
				position: relative;
				@include allMidBox();
				width: 40px;
				height: 30px;
				img {
					@include wh(22px, 22px);
					cursor: pointer;
				}
			}
			&-item:not(:nth-child(3)):hover {
				cursor: pointer;
				transition: all ease-in-out .3s;
				background: $bar_focus;
			}
		}
		&-pager {
			position: absolute;
			top: 8px;
			right: 100px;
			@include rowMidBox();
			p {
				text-align: center;
				@include fontSizeColor(12px, $bg_wht);
				width: 40px;
			}
			img {
				cursor: pointer;
			}
		}
		&-addPaper {
			img {
				cursor: pointer;
			}
			top: 4px;
			right: 20px;
			position: absolute;
		}
	}

	.toBox {
		position: absolute;
		z-index: 10;
		display: flex;
		flex-flow: column nowrap;
		align-items: center;
		height: 140px;
		width: 35px;
		background: $bg_wht;
		bottom: 30px;
		img {
			cursor: pointer;
			margin-top: 15px;
			@include wh(27px, 27px)
		}
	}

	.isUseEraser {
		background: #b3b3b3;
	}
</style>
