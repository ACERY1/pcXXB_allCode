/**
 * Created by Acery on 2017/7/25.
 */

/*不同的状态码对应不同的课程状态*/
/**
 *
 * @param code
 * @returns {string}
 */
const courseStatus = (code)=>{
	switch (code){
		case 1: return "正在上课"; break;
		case 2: return "已结束"; break;
		case 3: return "待上课"; break;
		case 4: return "教师旷课"; break;
		case 5: return "已取消"; break;
		case 6: return "学生旷课"; break;
		case 7: return "教师和学生均旷课"; break;
	}
}


export {courseStatus}