/**
 * Created by Acery on 2017/9/5.
 */

/*LOCAL 本地 DEV 测试 BETA 正式
* ------------修改以下变量用于更改请求URL------------------*/
const ENV = process.env.BUILD_ENV||"LOCAL"
/*-----------------------------------------------------*/

let baseURL, wsURL

switch (ENV) {
	case "LOCAL":
		baseURL = 'http://localhost:2048'
		wsURL = 'ws://localhost:2048'
		break;
	case "DEV":
		baseURL = "http://test.91xuexibao.com"
		wsURL = "ws://124.251.0.199:10002"
		break;
	case "BETA":
		baseURL = 'https://webapi.91xuexibao.com'
		wsURL = "ws://124.251.0.199:10001"
		// wsURL = "wss://webcast.91xuexibao.com" // 正式环境域名版
		break;
}

export {baseURL, wsURL}
