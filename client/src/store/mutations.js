/**
 * Created by Acery on 2017/8/4.
 */
import {
	RECORD_TEACHER_INFO,
	RECORD_IS_LOGIN,
	UPDATE_SHOW_SETTING,
	UPDATE_SHOW_ABOUT,
	CLEAR_TEACHER_INFO,
	UPDATE_SHOW_MENU,
	UN_SHOW_MENU,
	REVERT_SETTING_DATA,
	UPDATE_COURSE_ID
} from './mutation_types'

export default {
	/*记录登录信息*/
	[RECORD_TEACHER_INFO](state, teacherInfo){
		state.teacherInfo.mobile = teacherInfo.mobile //手机
		state.teacherInfo.name = teacherInfo.name // 姓名
		state.teacherInfo.age = teacherInfo.age  // 年龄
		state.teacherInfo.avatar = teacherInfo.avatar // 头像
		state.teacherInfo.gender = teacherInfo.gender // 性别
		state.teacherInfo.star = teacherInfo.star // 星级
	},
	/*标记是否登录*/
	[RECORD_IS_LOGIN](state){
		state.isLogin = true
	},
	/*标记是否打开设置*/
	[UPDATE_SHOW_SETTING](state){
		state.showSetting = !state.showSetting
	},
	/*标记是否显示下拉菜单*/
	[UPDATE_SHOW_MENU](state){
		state.showMenu = !state.showMenu
	},
	/*关闭下拉菜单*/
	[UN_SHOW_MENU](state){
		state.showMenu = false
	},
	/*更新关于弹框显示状态*/
	[UPDATE_SHOW_ABOUT](state){
		state.showAbout= !state.showAbout
	},
	/*清除登录数据*/
	[CLEAR_TEACHER_INFO](state){
		state.teacherInfo = {
			age: '',
			avatar: "../../../static/icons/topBar/indexPic.png",
			gender: '',
			mobile: "",
			name: "请登录",
			star: ''
		}
		state.isLogin = false
	},
	/*重置设置数据*/
	[REVERT_SETTING_DATA](state,data){
		state.setting.micVal= data.mic
		state.setting.voiceVal = data.voice
	},
	/*更新courseId*/
	[UPDATE_COURSE_ID](state,data){
		state.courseId = data
	}
}