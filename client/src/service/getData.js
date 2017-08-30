import fetch from '../common/scripts/fetch'


/*教师登录*/
/**
 * 用于登录
 * @param mobile 手机号String must
 * @param password 密码String must
 * @returns {Promise}
 */
const login = (mobile, password) => {
	return fetch('post', '/teacher/api/login', {mobile, password})
}

/*获取自己有没有直播权限*/
/**
 * 获取直播权限
 * @returns {Promise}
 */
const getPrivilege = () => {
	return fetch('post', '/teacher/api/webcast/privilege', {})
}
/*获取指定时间内老师时间表*/
/**
 *
 * @param begin 开始时间 毫秒数 must
 * @param end  结束时间 毫秒数 must
 * @returns {Promise}
 */
const getSchedule = (begin, end) => {
	return fetch('post', '/teacher/api/webcast/getSchedule', {begin, end})
}

/*设置时间*/
/**
 *
 * @param schedule
 * @returns {Promise}
 */
const setSchedule = (schedule) => {
	return fetch('post', '/teacher/api/webcast/setSchedule', {schedule})
}

/*教师端获取课程信息*/
/**
 *
 * @param courseIds
 * @param courseId
 * @returns {Promise}
 */
const getCourseDetail = (courseIds, courseId) => {
	return fetch('post', '/webcast/api/getCourseDetail_V25', {courseIds, courseId})
}

/*教师设置备注*/
/**
 *
 * @param courseId 课程id must
 * @param notes 备注内容 must
 * @returns {Promise}
 */
const setNote = (courseId, notes) => {
	return fetch('post', '/teacher/api/webcast/setNote', {courseId, notes})
}


/**
 *  获取课程列表
 * @param config
 * @returns {Promise}
 */
const getCourseList = (config) => {
	return fetch('post', '/teacher/api/webcast/courseList', {
		status: config.status, statusList: config.statusList, pageSize: config.pageSize, pageIndex: config.pageIndex,
		order: config.order, begin: config.begin, end: config.end
	})
}

/*教师对学生评价*/
/**
 *
 * @param courseId must
 * @param behavior 课堂表现 must
 * @returns {Promise}
 */
const evaluateStudent = (courseId, behavior) => {
	return fetch('post', '/teacher/api/webcast/evaluateStudent', {courseId, behavior})
}

/*获取知识点*/
/**
 *
 * @param gradeId 年级ID
 * @param subjectId 科目ID
 * @returns {Promise}
 */
const getKnowledgeList = (gradeId, subjectId) => {
	return fetch('post', '/teacher/api/webcast/getKnowledgeList', {gradeId, subjectId})
}

/*上课*/
/**
 *
 * @param courseId must
 * @returns {Promise}
 */
const onCourse = (courseId) => {
	return fetch('post', '/teacher/api/webcast/onCourse', {courseId})
}

/*教师退出登录*/
const logout = () => {
	return fetch('post', '/teacher/api/logout', {})
}

/*教师下课*/
const teacherFinishCourse = (courseId) => {
	return fetch('post', '/teacher/api/teacherFinishCourse', {courseId})
}

/*教师配置*/
/**
 *
 * @param courseId must
 * @returns {Promise}
 */
const teacherConfigure = (courseId) => {
	return fetch('post', '/webcast/api/teacherConfigure', {courseId})
}

/*视频工作平台*/
/**
 *
 * @param courseId 课程ID must
 * @param platform 平台 must
 * @returns {Promise}
 */
const videoPlatform = (courseId, platform) => {
	return fetch('post', '/webcast/api/videoPlatform', {courseId, platform})
}

/*获取课程评价*/
/**
 *
 * @param courseId must
 * @returns {Promise}
 */
const getTeacherEvluateNew = (courseId) => {
	return fetch('post', '/teacher/api/webcast/getTeacherEvluateNew', {courseId})
}

/*获取当前课程*/
/**
 *
 * @param courseId must
 * @returns {Promise}
 */
const getCurrentCourse = (courseId) => {
	return fetch('post', '/teacher/api/webcast/getCurrentCourse', {courseId})
}

/*新版保存教师评价*/
/**
 *
 * @param courseId must
 * @param knowleageEvl 知识点评价 must
 * @param classroomPerformance 课堂表现 must
 * @param teacherArragement 下次课程教育安排 must
 * @param leaveMessage 给家长留言
 * @param homework 课后作业
 * @returns {Promise}
 */
const saveTeacherEvluateNew = (courseId, knowleageEvl, classroomPerformance, teacherArragement, leaveMessage, homework) => {
	return fetch('post', '/teacher/api/webcast/saveTeacherEvluateNew', {
		courseId, knowleageEvl, classroomPerformance, teacherArragement, leaveMessage, homework
	})
}

/*上传报告图片*/
/**
 *
 * @param courseId
 * @param imgUrl must
 * @returns {Promise}
 */
const uploadReportImage = (courseId, imgUrl) => {
	return fetch('post', '/teacher/api/webcast/uploadReportImage', {courseId, imgUrl})
}

/*教师回复学生评价*/
/**
 *
 * @param courseId must
 * @param teacherReply 教师回复 must
 * @returns {Promise}
 */
const teacherReply = (courseId, teacherReply) => {
	return fetch('post', '/webcast/api/teacherReply', {courseId, teacherReply})
}


/*备用*/
// const  =()=>{
// 	return fetch('post','',{})
// }

/**
 *  重置密码
 * @param mobile 手机号
 * @param password 新密码
 * @param verifyCode 验证码
 * @returns {Promise}
 */
const resetPassword = (mobile, password, verifyCode) => {
	return fetch('post', '/teacher/api/resetPassword', {mobile, password, verifyCode})
}

/**
 * 重置密码
 * @param mobile 手机号
 * @param type 类型 默认6
 * @returns {Promise}
 */
const sendVerifyCode = (mobile, type = 6) => {
	return fetch('post', '/user/api/verifycode', {mobile, type})
}


/**
 * 查询是否制作了课件
 * @param courseId
 * @returns {Promise}
 */
const makeCourseWare = (courseId) => {
	return fetch('post', '/courseware/api/makeCourseWare_V2', {course_id: courseId})
}

/**
 * 查看课件
 * @param coursewareId
 * @returns {Promise}
 */
const previewCourseWare = (coursewareId) => {
	return fetch('get', '/courseware/api/listPage', {coursewareId})
}


/**
 * 根据本地x_token拿到图片上传token
 * @param x_token
 * @returns {Promise}
 */
const getToken = (x_token) => {
	return fetch('get', '/fs/api/getToken', {x_token})
}

/**
 * 上传图片
 * @param url
 * @param base64
 * @param token
 * @returns {Promise}
 */
const uploadPic = (url, base64, token) => {
	return fetch('UPLOAD', url, base64, {token})
}

/**
 * 获取上课权限
 * @param courseId
 * @returns {Promise}
 */
const getLessonToken = (courseId) => {
	return fetch('get', '/lesson/teacher/api/lessonToken', {courseId})
}

/**
 * 查询课件
 */
const searchCourseware = (courseId) => {
	return fetch('get', '/courseware/api/searchCourseware', {courseId})
}

/**
 *
 * @param pagNum
 * @param coursewareId
 * @returns {Promise}
 */
const insertPage = (pagNum, coursewareId) => {
	return fetch('get', '/courseware/api/insertPage', {
		pagNum, htmlContent: '<i style="display:none;">??????</i>', pageType: -1, coursewareId
	})
}

/**
 * 上课发送信息.命令
 * @param lessonToken
 * @param cmd
 * @param data
 * @returns {Promise}
 */
const sendMessage = (lessonToken, cmd, data) => {
	return fetch('post', '/lesson/teacher/api/sendMessage', {lessonToken, cmd, data})
}

/**
 * 轮询消息
 * @param lessonToken
 * @returns {Promise}
 */
const syncLessonMessage = (lessonToken) => {
	return fetch('post', '/lesson/teacher/api/syncLessonMessage', {lessonToken})
}

/**
 * 真 *开始上课
 * @param lessonToken
 * @returns {Promise}
 */
const startLesson = (lessonToken) => {
	return fetch('post', '/lesson/teacher/api/startLesson', {lessonToken})
}

/**
 * 断点续上课
 */
const searchHistory = (lessonToken) => {
	return fetch('post', '/lesson/teacher/api/history', {lessonToken})
}


export {
	login, getPrivilege, getSchedule, setSchedule, getCourseDetail, setNote, getCourseList, evaluateStudent,
	getKnowledgeList, onCourse, logout, teacherFinishCourse, teacherConfigure, videoPlatform, getTeacherEvluateNew,
	getCurrentCourse, saveTeacherEvluateNew, uploadReportImage, teacherReply, resetPassword, sendVerifyCode,
	makeCourseWare, previewCourseWare, getToken, uploadPic, getLessonToken, insertPage, searchCourseware,
	syncLessonMessage, searchHistory, startLesson,sendMessage
}


//
let a = {
	"note": {},
	"evluate": {},
	"courseReportCreateTime": "",
	"gender": 2,
	"subject": 1,
	"teacherIn": 0,
	"alreadyConsumeCourse": 105,
	"type": 1,
	"studentId": "57fd54ea30202b4e3b18ac2b",
	"score": "",
	"school": "郑州市第七十三中学",
	"courseware": 0,
	"subjectName": "数学",
	"courseware_id": 0,
	"gradeName": "高一",
	"star": 0,
	"course_name": "一对一直播课",
	"full_marks": "",
	"teacherReply": {},
	"generateReport": 0,
	"bookVersionName": "",
	"profile_image_url": "http://simg.91xuexibao.com/public/user_data/images/20170818/topic/8e45196ffa!",
	"message": {},
	"leftCourse": 36,
	"teacherId": "69ad9a67-72e6-427b-906d-fcb02b4630d6",
	"classContent": "",
	"grade": 10,
	"courseStatus": 3,
	"name": "cookie",
	"time": {
		"end": 1503647700000,
		"begin": 1503644400000
	}
}

