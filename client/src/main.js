import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import ElementUI from 'element-ui' // 导入elementUI
import 'element-ui/lib/theme-default/index.css'
import routes from './router/index' // 导入路由路径配置
import  api from './config/api'
import  utils from './config/utilConf'
import store from './store/'
import $ from 'jquery'
import infiniteScroll from 'vue-infinite-scroll'
import Loadmore from 'vue-loadmore';


Vue.use(infiniteScroll)
Vue.component('loadmore', Loadmore);
// register vueRouter
Vue.use(VueRouter)


// 使用工具函数
Vue.use(utils)

// 使用接口
Vue.use(api)



Vue.use({
	install (Vue, options) {
		//添加实例方法
		Vue.prototype.$ipc = global.ipcRenderer || {}; // emit event to .ipcMain
		Vue.prototype.$remoteApi = global.remoteApi;
	}
});

// 注册使用elementUI
Vue.use(ElementUI)

//配置路由
const router = new VueRouter({
	mode:'history',
	routes
})




Vue.config.productionTip = false

/*实例化root_Vue实例*/
new Vue({
	el: '#app',
	router,
	store,
	template: '<App/>',
	components: {App}
})
