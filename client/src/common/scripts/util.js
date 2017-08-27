/**
 * Created by Acery on 2017/7/23.
 */
/* 常用工具函数
 * @author Acery
 * @version 0.0.3
 * @mention: 需要拆分
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
		if (i == '' || i == null || i == undefined) {
			return 1
		}
	}
	return 0
}

/**
 * 获取设备音视频
 * @param hasAudio
 * @param hasVideo
 * @returns {*}
 */
const setMediaStream = (hasAudio, hasVideo) => {
	let constraint = {
		audio: hasAudio,
		video: hasVideo
	}
	return navigator.mediaDevices.getUserMedia(constraint) // Promise
}

/**
 * 获取一个接入了分析器的audioBox
 * @param stream
 * @param fftSize
 * @returns {*}
 */
const outputAudioData = (stream, fftSize) => {
	let audioCtx = new AudioContext();
	let gainNode = audioCtx.createGain();
	let source = audioCtx.createMediaStreamSource(stream);
	let analyser = audioCtx.createAnalyser()
	source.connect(gainNode)
	source.connect(analyser)
	analyser.fftSize = fftSize
	return {analyser, gainNode, audioCtx}
}

/**
 * 输入频域数据（数组元素为0~255int 的数组），得到一个整数音量值，fold用于调节输出整数的大小
 * @param array
 * @param fold
 * @returns {Number}
 */
const computeVolume = (array, fold) => {
	/*array is 32 length*/
	let _result = 0
	array.forEach((item) => {
		_result += item
	})
	return parseInt(_result / fold)
}

/**
 * 拿到音频的src，输出傅里叶变换之后的频域图 和分析器 以及audioCtx
 * @param audioSrc
 * @param ffSize 快速傅里叶变换的横坐标
 */
const readAudioTo_HZ_Array = (audioSrc, ffSize) => {
	let audio = new Audio();
	audio.src = audioSrc;
	let audioBox = new AudioContext(); // 申请一个音频容器，可以对数据进行解码
	let analyser = audioBox.createAnalyser();
	let source = audioBox.createMediaElementSource(audio);
	source.connect(analyser)
	analyser.connect(audioBox.destination)
	analyser.fftSize = ffSize
	return {array: new Uint8Array(analyser.frequencyBinCount), analyser, audio, audioBox}
}

const setSession = (name, content) => {
	if (!name) return;
	if (typeof content !== 'string') {
		content = JSON.stringify(content);
	}
	window.sessionStorage.setItem(name, content);
}

/**
 * 获取STORE
 * @param name 存贮的名字
 */
const getSession = name => {
	if (!name) return;
	return window.sessionStorage.getItem(name);
}

/**
 * 删除sessionSTORE
 * @param name
 */
const removeSession = name => {
	if (!name) return;
	window.sessionStorage.removeItem(name);
}

/**
 * 清除所有的localStorage
 */
const removeAllSession = () => {
	for (let i of Object.keys(window.sessionStorage)) {
		window.sessionStorage.removeItem(i)
	}
}

/**
 *  存储本地STORE
 * @param name
 * @param content
 */
const setStore = (name, content) => {
	if (!name) return;
	if (typeof content !== 'string') {
		content = JSON.stringify(content);
	}
	window.localStorage.setItem(name, content);
}

/**
 * 获取本地STORE
 * @param name 存贮的名字
 */
const getStore = name => {
	if (!name) return;
	return window.localStorage.getItem(name);
}


/**
 * 删除本地STORE
 * @param name
 */
const removeStore = name => {
	if (!name) return;
	window.localStorage.removeItem(name);
}

/**
 * 页面到达底部，加载更多
 */
const loadMore = (element, callback) => {
	let windowHeight = window.screen.height;
	let height;
	let setTop;
	let paddingBottom;
	let marginBottom;
	let requestFram;
	let oldScrollTop;
	
	document.body.addEventListener('scroll', () => {
		loadMore();
	}, false)
	//运动开始时获取元素 高度 和 offseTop, pading, margin
	element.addEventListener('touchstart', () => {
		height = element.offsetHeight;
		setTop = element.offsetTop;
		paddingBottom = getStyle(element, 'paddingBottom');
		marginBottom = getStyle(element, 'marginBottom');
	}, {passive: true})
	
	//运动过程中保持监听 scrollTop 的值判断是否到达底部
	element.addEventListener('touchmove', () => {
		loadMore();
	}, {passive: true})
	
	//运动结束时判断是否有惯性运动，惯性运动结束判断是非到达底部
	element.addEventListener('touchend', () => {
		oldScrollTop = document.body.scrollTop;
		moveEnd();
	}, {passive: true})
	
	const moveEnd = () => {
		requestFram = requestAnimationFrame(() => {
			if (document.body.scrollTop != oldScrollTop) {
				oldScrollTop = document.body.scrollTop;
				loadMore();
				moveEnd();
			} else {
				cancelAnimationFrame(requestFram);
				//为了防止鼠标抬起时已经渲染好数据从而导致重获取数据，应该重新获取dom高度
				height = element.offsetHeight;
				loadMore();
			}
		})
	}
	
	const loadMore = () => {
		if (document.body.scrollTop + windowHeight >= height + setTop + paddingBottom + marginBottom) {
			callback();
		}
	}
}

/**
 * 遍历一个对象，并设置localStorage
 * @param info
 */
const setUserInfoInLocal = (info) => {
	for (let i = 0; i < Object.keys(info).length; ++i) {
		setStore(Object.keys(info)[i], Object.values(info)[i])
		// console.log(window.localStorage)
	}
}

/**
 * 清除所有的localStorage
 */
const removeAllStore = () => {
	for (let i of Object.keys(window.localStorage)) {
		window.localStorage.removeItem(i)
	}
}

/**
 * 判断某个时间是否过期，如果过期 return 1
 * @param Expires
 * @returns {number} 1 过期 0 没过期
 */
const judgeOutDate = (Expires) => {
	let nowDate = +new Date()
	let expTime = +new Date(Expires)
	if (expTime - nowDate > 0) {
		/*没过期*/
		return 0
	} else {
		return 1
	}
}

/**
 * 根据名字拿到cookie的值
 * @param name
 * @returns {*}
 */
const getCookie = (name) => {
	let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
	if (arr = document.cookie.match(reg))
		return (arr[2]);
	else
		return null;
}

/**
 * 根据名字设置cookie
 * @param name
 */
const delCookie = (name) => {
	let exp = new Date();
	exp.setTime(exp.getTime() - 1);
	let cval = getCookie(name);
	if (cval != null) {
		let a = `x_token=${name};Path=/;Domain=localhost:2048;Expires=Thu, 01-Jan-1970 00:00:00 GMT`;
		console.log(a)
		// document.cookie = name + "=" + cval + "Path=/;expires=" + exp.toGMTString();
		 document.cookie = a;

	}
	
}

/**
 * 设置cookie的名字 值 和 过期时间（秒）
 * @param name
 * @param value
 * @param seconds
 */
const setCookie = (name, value, seconds) => {
	seconds = seconds || 0; //seconds有值就直接赋值，没有为0，这个根php不一样。
	let expires = "";
	if (seconds != 0) { //设置cookie生存时间
		let date = new Date();
		date.setTime(date.getTime() + (seconds * 1000));
		expires = "; expires=" + date.toGMTString();
	}
	document.cookie = name + "=" + value.toString() + expires + "; path=/";
	
}

export {
	countFn, parseTime, judgeTime, randomNum, verifyVal, setMediaStream, outputAudioData, computeVolume,
	readAudioTo_HZ_Array, getStore, removeStore, loadMore, setStore, setUserInfoInLocal, judgeOutDate, getCookie,
	delCookie, setCookie, removeAllStore,getSession,setSession,removeSession,removeAllSession
}