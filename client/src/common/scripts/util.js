/**
 * Created by Acery on 2017/7/23.
 */
/* 常用工具函数
 * @author Acery
 * @version 0.0.2
 */

/**
 * 循环计数器
 * @param countTime 计数次数
 * @param basicMs   单位计数间隔
 * @param progressFn  单位计数触发函数
 * @param callBackFn  计数完成回调函数
 */
const countFn = (countTime, basicMs, progressFn, callBackFn) => {
	for (let i = 0; i < countTime; ++i) {
		((j = i) => {
			setTimeout(() => {
				if (i === 0) {
					console.log("count start!")
				}
				if (i == countTime - 1) {
					console.log("count done!")
					callBackFn()
				} else {
					progressFn()
				}
			}, basicMs * j)
		})(i)
	}
}

/**
 *
 * @param msTime 日期的毫秒表示
 * @returns {{hour: string, minute: string}}
 */
const parseTime = (msTime) => {
	let _tempDate = new Date(msTime)
	return {
		hour: _tempDate.getHours() > 9 ? _tempDate.getHours().toString() : '0' + _tempDate.getHours().toString(),
		minute: _tempDate.getMinutes() > 9 ? _tempDate.getMinutes().toString() : '0' + _tempDate.getMinutes().toString()
	}
}

/**
 * 判断时间与今日的关系（明天/今天）
 * @param msTime 传进日期的毫秒表示
 * @returns {number} -2: 年月不同 -1： 课程还差很久到今天 2：课程已过时 1： 课程是明天 0： 课程是今天
 */
const judgeTime = (msTime) => {
	let _nowDate = new Date()
	let _msTime = new Date(msTime)
	let _y = _nowDate.getFullYear()
	let _m = _nowDate.getMonth() + 1
	let _d = _nowDate.getDate()
	if (_y === _msTime.getFullYear() && _m === _msTime.getMonth() + 1) {
		if (_d - _msTime.getDate() === 0) {
			return 0 // 课程是今天
		}
		if (_d - _msTime.getDate() === -1) {
			return 1 // 课程是明天
		}
		if (_d - _msTime.getDate() > 0) {
			return 2 // 课程已过时
		} else {
			return -1 // 课程还差很久才到
		}
	} else {
		return -2 //  年/月不相同
	}
}

/**
 * randomNum 随机数
 * @param fromNum 最小值
 * @param toNum  最大值
 * @returns {Number} 输出产生的随机数，是整数
 */
const randomNum = (fromNum, toNum) => {
	let _a = Math.random() * toNum;
	while (_a < fromNum || _a > toNum) {
		_a = Math.random() * toNum;
	}
	if (_a > toNum - 0.5) {
		_a = toNum
	}
	return parseInt(_a);
}

/**
 * 值检测函数，用于确定一些值是否得到赋值或者初始化
 * @param values 不定参数
 * @returns {number} 0代表都有值 1代表存在没有赋值的
 */
const verifyVal = (...values) => {
	// console.log(values)
	for (let i of values) {
		if (i==''||i==null || i==undefined){
			return 1
		}
	}
	return 0
}


export {countFn, parseTime, judgeTime, randomNum,verifyVal}