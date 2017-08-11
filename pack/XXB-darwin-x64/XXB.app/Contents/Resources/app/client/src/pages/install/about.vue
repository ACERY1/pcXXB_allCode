<!--TODO:弃用-->
<!--<template>-->
	<!--<div class="about">-->
		<!--<img src="../../../static/logos/main.png" alt="" class="about-logo"/>-->
		<!--<p class="about-version">版本 v{{version}}</p>-->
		<!--<div class="about-check">-->
			<!--<img src="../../../static/icons/agree.png" alt=""/>-->
			<!--<p>已是最新版本</p>-->
		<!--</div>-->
		<!--<div class="about-item">-->
			<!--<p>客服电话：</p>-->
			<!--<p>{{serviceTel}}</p>-->
		<!--</div>-->
		<!--<div class="about-item">-->
			<!--<p>教师端官网：</p>-->
			<!--<p>{{webStation}}</p>-->
		<!--</div>-->
		<!--<div class="about-copyRight">-->
			<!--<p>Copyright@2014-2017 xuexibao</p>-->
		<!--</div>-->
	<!--</div>-->
<!--</template>-->

<!--<script>-->
	<!--export default {-->
		<!--name: "",-->
		<!--components: {},-->
		<!--data () {-->
			<!--return {-->
				<!--version:"1.0.0",-->
				<!--serviceTel:'400-816-1991',-->
				<!--webStation:'t.91xuexibao.com'-->
			<!--}-->
		<!--},-->
		<!--props: {},-->
		<!--computed: {},-->
		<!--created () {-->
		<!--},-->
		<!--mounted () {-->
		<!--},-->
		<!--methods: {}-->
	<!--}-->
<!--</script>-->

<!--<style lang="scss" rel="stylesheet/scss" scoped>-->
	<!--@import "../../common/styles/mixin";-->
	<!--.about{-->
		<!--@include allMidBox();-->

		<!--&-logo{-->
			<!--margin-top: 50px;-->
		<!--}-->
		<!--&-version{-->
			<!--margin-top: 10px;-->
			<!--@include fontSizeColor(16px,$fontClr_main);-->
		<!--}-->
		<!--&-check{-->
			<!--margin-top: 60px;-->
			<!--img{-->
				<!--padding-top: 2px;-->
				<!--@include wh(18px,18px);-->
				<!--margin-right: 10px;-->
			<!--}-->
			<!--margin-bottom: 10px;-->
			<!--@include rowBox();-->
		<!--}-->
		<!--&-item{-->
			<!--font-size: 14px;-->
			<!--@include rowBox();-->
			<!--align-items: center;-->
			<!--margin-top: 20px;-->
			<!--p:nth-child(2){-->
				<!--@include fontSizeColor(14px,$fontClr_ble)-->
				<!--cursor: pointer;-->
			<!--}-->
		<!--}-->
		<!--&-copyRight{-->
			<!--margin-top: 60px;-->
			<!--@include fontSizeColor(12px,$fontClr_2nd)-->
		<!--}-->
	<!--}-->
<!--</style>-->
