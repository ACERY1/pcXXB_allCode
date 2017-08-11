/**
 * Created by Acery on 2017/8/4.
 * 注册全局使用api
 */
import * as api from '../service/getData'

export default {
	install (Vue) {
		Vue.prototype.$api = api
		Vue.api = api
	},
	$api: api
}

export const $api = api