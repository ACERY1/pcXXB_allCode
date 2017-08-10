import fetch from '../common/scripts/fetch'


/*教师登录*/
/**
 * 用于登录
 * @param mobile 手机号String must
 * @param password 密码String must
 * @returns {Promise}
 */
const login = (mobile,password) => {
	return fetch('post', '/teacher/api/login',{mobile,password})
}

/*获取自己有没有直播权限*/
/**
 * 获取直播权限
 * @returns {Promise}
 */
const getPrivilege =()=>{
	return fetch('post','/teacher/api/webcast/privilege',{})
}

/*获取指定时间内老师时间表*/
/**
 *
 * @param begin 开始时间 毫秒数 must
 * @param end  结束时间 毫秒数 must
 * @returns {Promise}
 */
const  getSchedule=(begin,end)=>{
	return fetch('post','/teacher/api/webcast/getSchedule',{begin,end})
}

/*设置时间*/
/**
 *
 * @param schedule
 * @returns {Promise}
 */
const  setSchedule=(schedule)=>{
	return fetch('post','/teacher/api/webcast/setSchedule',{schedule })
}

/*教师端获取课程信息*/
/**
 *
 * @param courseIds
 * @param courseId
 * @returns {Promise}
 */
const getCourseDetail =(courseIds,courseId)=>{
	return fetch('post','/webcast/api/getCourseDetail_V25',{courseIds,courseId})
}

/*教师设置备注*/
/**
 *
 * @param courseId 课程id must
 * @param note 备注内容 must
 * @returns {Promise}
 */
const setNote =(courseId,notes)=>{
	return fetch('post','/teacher/api/webcast/setNote',{courseId,notes})
}

/*教师获取课程信息*/
/**
 *
 * @param status 状态
 * @param statusList 状态列表
 * @param pageSize 每一页数量
 * @param pageIndex 页码
 * @param order 排序
 * @param begin 开始时间
 * @param end 结束时间
 * @returns {Promise}
 */
const  getCourseList=(status,statusList,pageSize,pageIndex,order,begin,end)=>{
	return fetch('post','/teacher/api/webcast/courseList',{status,statusList,pageSize,pageIndex,order,begin,end})
}

/*教师对学生评价*/
/**
 *
 * @param courseId must
 * @param behavior 课堂表现 must
 * @returns {Promise}
 */
const  evaluateStudent=(courseId,behavior)=>{
	return fetch('post','/teacher/api/webcast/evaluateStudent',{courseId,behavior})
}

/*获取知识点*/
/**
 *
 * @param gradeId 年级ID
 * @param subjectId 科目ID
 * @returns {Promise}
 */
const  getKnowledgeList=(gradeId,subjectId)=>{
	return fetch('post','/teacher/api/webcast/getKnowledgeList',{gradeId,subjectId})
}

/*上课*/
/**
 *
 * @param courseId must
 * @returns {Promise}
 */
const  onCourse=(courseId)=>{
	return fetch('post','/teacher/api/webcast/onCourse',{courseId})
}

/*教师退出登录*/
const  logout=()=>{
	return fetch('post','/teacher/api/logout',{})
}

/*教师下课*/
const  teacherFinishCourse=(courseId)=>{
	return fetch('post','/teacher/api/teacherFinishCourse',{courseId})
}

/*教师配置*/
/**
 *
 * @param courseId must
 * @returns {Promise}
 */
const  teacherConfigure=(courseId)=>{
	return fetch('post','/webcast/api/teacherConfigure',{courseId})
}

/*视频工作平台*/
/**
 *
 * @param courseId 课程ID must
 * @param platform 平台 must
 * @returns {Promise}
 */
const  videoPlatform=(courseId,platform)=>{
	return fetch('post','/webcast/api/videoPlatform',{courseId,platform})
}

/*获取课程评价*/
/**
 *
 * @param courseId must
 * @returns {Promise}
 */
const  getTeacherEvluateNew=(courseId)=>{
	return fetch('post','/teacher/api/webcast/getTeacherEvluateNew',{courseId})
}

/*获取当前课程*/
/**
 *
 * @param courseId must
 * @returns {Promise}
 */
const getCurrentCourse=(courseId )=>{
	return fetch('post','/teacher/api/webcast/getCurrentCourse',{courseId})
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
const  saveTeacherEvluateNew=(courseId,knowleageEvl,classroomPerformance,teacherArragement,leaveMessage,homework)=>{
	return fetch('post','/teacher/api/webcast/saveTeacherEvluateNew',{courseId,knowleageEvl,classroomPerformance,teacherArragement,leaveMessage,homework})
}

/*上传报告图片*/
/**
 *
 * @param courseId
 * @param imgUrl must
 * @returns {Promise}
 */
const  uploadReportImage=(courseId,imgUrl)=>{
	return fetch('post','/teacher/api/webcast/uploadReportImage',{courseId,imgUrl})
}

/*教师回复学生评价*/
/**
 *
 * @param courseId must
 * @param teacherReply 教师回复 must
 * @returns {Promise}
 */
const  teacherReply=(courseId,teacherReply)=>{
	return fetch('post','/webcast/api/teacherReply',{courseId,teacherReply})
}


/*备用*/
// const  =()=>{
// 	return fetch('post','',{})
// }

export {login,getPrivilege,getSchedule,setSchedule,getCourseDetail,setNote,getCourseList,evaluateStudent,getKnowledgeList,onCourse,logout,teacherFinishCourse,teacherConfigure,videoPlatform,getTeacherEvluateNew,getCurrentCourse,saveTeacherEvluateNew,uploadReportImage,teacherReply}