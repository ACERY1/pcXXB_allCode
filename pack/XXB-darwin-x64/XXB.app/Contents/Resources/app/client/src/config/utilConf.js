/**
 * Created by Acery on 2017/8/4.
 * 注册全局使用工具js
 */
import * as utils from '../common/scripts/util'

export default {
	install (Vue) {
		Vue.prototype.$utils= utils
		Vue.utils = utils
	},
	$utils: utils
}

export const $utils = utils