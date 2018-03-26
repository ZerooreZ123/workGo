
const API = {
  register:'register.do',                                 //登录注册
  update:'update.do',                                     //更新用户信息和公司信息
  getOfficeList:'getOfficeList.do',                       //获取公司部门列表
  login:'login.do',                                       //二维码登录客户端
  getCompany:'getCompany.do',                             //获取公司信息
  getUser:'getUser.do',                                   //获取员工信息
  clockIn:'clockIn.do',                                   //员工打卡
  unbindUser:'unbindUser.do',                             //解绑员工
  getRecords:'getRecords.do',                             //获取打卡记录
  clockInRemind:'clockInRemind.do',                       //个人打卡提醒设置
  getUserRemind:'getUserRemind.do',                       //个人打卡提醒查询
  getStatisticalInfo:'getStatisticalInfo.do',             //所有员工的考勤记录统计
  getAttendanceMachineList:'getAttendanceMachineList.do', //公司绑定考勤机列表
  addOrUpdateOfficce:'addOrUpdateOfficce.do',             //添加或修改公司部门信息
  deleteOfficce:'deleteOfficce.do',                       //删除公司部门信息
  upload:'upload.do',                                     //图片上传
  announce:'announce.do',                                 //发布公告
  noticeDetails:'noticeDetails.do',                       //公告详情
  noticeList:'noticeList.do',                             //公告列表
  getAttendanceManagement:'getAttendanceManagement.do',   //获取公司考勤时间配置
  attendanceManagement:'attendanceManagement.do',         //公司考勤时间设置
  getOfficeUserList:'getOfficeUserList.do',               //公司每个部门员工
  sendSms:'sendSms.do',                                   //发送验证码
  rankingList:'rankingList.do',                           //排行榜
  getTime:'getTime.do',                                   //连续正常打卡天数
  getSignature:'getSignature.do',                         //微信签名参数
  getNewNotice:'getNewNotice.do',                         //获取最新通告
  judge:'judge.do',                                       //验证考勤机是否被注册
  judgeDevice:'judgeDevice.do',
  attention:'attention.do',
};
  
// export { admin ,server
// }
export default API