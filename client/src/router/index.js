/**
 * Created by Acery on 2017/8/3.
 */
const test= r => require.ensure([], () => r(require('../pages/class/classReport.vue')), 'test'); // 上课


const home = r => require.ensure([], () => r(require('../pages/homepage.vue')), 'home'); // 首页
const guide = r => require.ensure([], () => r(require('../pages/indexContainer.vue')), 'guide'); // 引导
const install = r => require.ensure([], () => r(require('../pages/install/install.vue')), 'install'); // 安装
const update = r => require.ensure([], () => r(require('../pages/install/update.vue')), 'update'); // 安装
const login = r => require.ensure([], () => r(require('../pages/login/login.vue')), 'login'); // 安装&注册
const classInfo = r => require.ensure([], () => r(require('../pages/class/classInfo.vue')), 'classInfo'); // 课程详情
const mainContainer = r => require.ensure([], () => r(require('../pages/mainContainer.vue')), 'mainContainer.vue'); // 容器
const onClass= r => require.ensure([], () => r(require('../pages/class/onClass.vue')), 'onclass'); // 上课
const classReport= r => require.ensure([], () => r(require('../pages/class/classReport.vue')), 'classReport'); //填写报告




export default [
	{
		path: '',
		redirect: '/static/home' // 重定向
	},
	/*安装 登录 卸载  更新进程页面 */
	{
		path:'/static/guide',
		name:'guide',
		component:guide,// 引导容器
		children:[
			{
				path:'/static/install',
				name:'install',
				component:install,
			},
			{
				path:'/static/login',
				name:'login',
				component:login,
			}
		]
	},
	/*首页及其子页面*/
	{
		path:'/static/home',
		name:'home',
		component:mainContainer, //主容器
		children:[
			{
				path:'/static/main',
				name:'main',
				component:home, // 首页
			},
			{
				path:'/static/classInfo',
				name:'classInfo',
				component:classInfo, // 课程详情页
			},
			{
				path:'/static/onclass',
				name:'onclass',
				component:onClass, // 首页
			},
			{
				path:'/static/classreport',
				name:'classreport',
				component:classReport, // 首页
			},
		]
	},
	
	/*提示更新页面*/
	{
		path:'/static/update',
		name:'update',
		component:update,
	},
	
	{
		path:'/static/test',
		name:'test',
		component:test,
	}
]