/**
 * Created by Acery on 2017/8/3.
 */

const home = r => require.ensure([], () => r(require('../pages/homepage.vue')), 'home'); // 首页
const guide = r => require.ensure([], () => r(require('../pages/indexContainer.vue')), 'guide'); // 引导
const install = r => require.ensure([], () => r(require('../pages/install/install.vue')), 'install'); // 安装
const update = r => require.ensure([], () => r(require('../pages/install/update.vue')), 'update'); // 安装
const about = r => require.ensure([], () => r(require('../pages/install/about.vue')), 'about'); // 关于
const login = r => require.ensure([], () => r(require('../pages/login/login.vue')), 'login'); // 安装&注册
const classInfo = r => require.ensure([], () => r(require('../pages/class/classInfo.vue')), 'classInfo'); // 的
const mainContainer = r => require.ensure([], () => r(require('../pages/mainContainer.vue')), 'mainContainer.vue'); // 的


export default [
	{
		path: '',
		redirect: '/static/home'
	},
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
			},
			{
				path:'/static/about',
				name:'about',
				component:about,
			}
		]
	},
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
		]
	},
	{
		path:'/static/update',
		name:'update',
		component:update,
	}
	
]