/**
 * Created by Acery on 2017/8/4.
 */
import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'
import getters from './getters'

Vue.use(Vuex)

const state = {
	teacherInfo: {
		age: '',
		avatar: "../../../static/icons/topBar/indexPic.png",
		gender: '',
		mobile: "",
		name: "请登录",
		star: ''
	},// 教师登录信息
	setting: {
		micVal: 50,
		voiceVal: 60
	}, // 保存当前用户的设置
	isLogin: false, // 判断是否登录
	showSetting: false, // 判断显示设备检测
	showAbout: false, // 判断显示关于弹窗
	showPoint:false,
	showMenu: false, // 判断显示菜单
	courseId: null, // 暂时保存课程ID
	courseList: {
		currentIndex: 0, // 待上课程索引
		historyIndex: 0, // 历史课程索引
		mountPoint: 0, // 保存的锚点值
		focus:1,  // 1代表choose待上课程 0代表历史课程
		courseInfo:[] //保存已经加载过的课程信息
	},
	x_token: null, //登录token
	courseInfo:{
		name:null,
		school:null,
		gradeName:null,
		subjectName:null,
		avatar:null
	},
	isCountingTime:false
}
export default new Vuex.Store({
	state,
	// getters, 计算属性暂时不用
	actions,
	mutations,
})