/**
 * Created by Acery on 2017/7/28.
 * http request methods
 * baseUrl + relativeUrl
 */

/*staticEnv 用于当前环境的判断*/
/*2017.8.2: 以后再没有什么baseUrl了
 * 直接用nginx代理 使得服务端和客户端在同域下即可*/
// import {baseUrl} from '../../config/baseUrl'
import axios from 'axios'

axios.interceptors.response.use(function (response) {
	return response;
}, function (error) {
	if (error.response) {
		// The request was made and the server responded with a status code
		// that falls out of the range of 2xx
		return Promise.reject({
			error: error.response.data.msg,
			status: error.response.status,
			statusText: error.response.statusText
		})
	} else if (error.request) {
		// The request was made but no response was received
		return Promise.reject(error.request)
	} else {
		// Something happened in setting up the request that triggered an Error
		return Promise.reject(error.message)
	}
})

export default async(type = 'GET', url = '', data = {}, config = {}) => {
	type = type.toUpperCase();
	// 提示： 这里的url填相对路径 例如'/test/example'
	if (type === 'GET') {
		let dataStr = ''; //数据拼接字符串
		Object.keys(data).forEach(key => {
			dataStr += key + '=' + data[key] + '&';
		});
		if (dataStr !== '') {
			dataStr = dataStr.substr(0, dataStr.lastIndexOf('&')); // 去掉最后一个&
			url = url + '?' + dataStr; // 加上 ？ 号
		}
		return axios.get(url);
	}
	if (type === 'POST') {
		if (JSON.stringify(data) == '{}') {
			return axios.post(url, '', {
				header: {
					'Content-Type': 'application/x-www-form-urlencoded',
				}
				
			});
		}
		else {
			return axios.post(url, data, {
				header: {
					'Content-Type': 'application/x-www-form-urlencoded',
				}
			});
		}
		
	}
	if (type === 'UPLOAD') {
		if (config.token == undefined) {
			return Promise.reject('wrong params')
		}
		return axios.post(url, data, {
			headers: {
				'Content-Type': 'application/octet-stream',
				'Authorization': "UpToken " + config.token
			}
		});
	}
	
}


// console.log('ths request basic URL is', baseUrl)





