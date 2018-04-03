import React, { Component } from 'react';
import styles from '../styles/UserCenter.css';
import Toast from '../components/Toast';

import Alert from '../components/Alert';

import XHR from '../utils/request';
import API from '../api/index';
// import {admin ,server} from '../api/route';

import headPortrait from '../asset/userCenter/headPortrait.png';
import record from '../asset/userCenter/record.png';
import remind from '../asset/userCenter/remind.png';
import revise from '../asset/userCenter/revise.png';
import attendanceRecord from '../asset/manager/attendanceRecord.png';
import administration from '../asset/manager/administration.png';
import staff from '../asset/manager/staff.png';
import release from '../asset/manager/release.png';
import setUp from '../asset/manager/setUp.png';
import person from '../asset/manager/person-1.png';
import clock from '../asset/manager/location-2.png';
import go from '../asset/manager/go.png';
import scan from '../asset/manager/scan.png';
import person1 from '../asset/punchClock/person-2.png';
import clock2 from '../asset/punchClock/loction-2.png';
import notice from '../asset/punchClock/notice.png';
import warn from '../asset/punchClock/abnormal.png';
import load from '../asset/punchClock/load.png';
import successMin from '../asset/punchClock/successMin.png';
import success from '../asset/punchClock/success.png';
import redX from '../asset/punchClock/redX.png';
import yuanHuan from '../asset/punchClock/yuanHuan.png';
import yuanHuan1 from '../asset/punchClock/yuanHuan1.png';



const Notice = ({ noticeState, parent, title }) => {   //打卡顶部通告
    if (noticeState) {
        return (
            <div className={styles.noticeBoard}>
                <img className={styles.noticeImg} src={notice} alt="" />
                <span onClick={ev => parent.AnnouncementDetails(ev)} className={styles.noticeText}>{title}</span>
                <img onClick={ev => parent.noteceDelete(ev)} className={styles.noteceDelete} src={redX} alt="" />
            </div>
        )
    } else {
        return null
    }
}
const Header = ({ roleid, parent }) => {           //个人中心头部
    if (roleid === '3') {
        return (
            <div className={styles.header}>
                <div onClick={ev => parent.scan(ev)} className={styles.scanBox}><img className={styles.scanImg} src={scan} alt='' /><span className={styles.scanText}>后台登录</span></div>
                <div onClick={ev => parent.unbindUser(ev)} className={styles.unbindButton}>解绑企业</div>
            </div>
        )
    } else if (roleid === '2') {
        return (
            <div className={styles.header}>
                <div onClick={ev => parent.scan(ev)} className={styles.scanBox}><img className={styles.scanImg} src={scan} alt='' /><span className={styles.scanText}>后台登录</span></div>
            </div>
        )
    } else {
        return (
            <div className={styles.Userheader}>
                <div onClick={ev => parent.unbindUser(ev)} className={styles.unbindButton}>解绑企业</div>
            </div>
        )
    }
}

const Module = ({ roleid, superMan, ordinary, parent }) => {   //个人中心不同权限展示模块
    if (roleid === '2') {                //超级管理员
        return (
            <div>
                <div className={styles.emptyBox}></div>
                <div className={styles.jurisdictionModule_1}>
                    {
                        superMan.map((ev, index) =>
                            <div className={styles.item} key={index} onClick={ev => parent.moveToSuper(index)}>
                                <img className={styles.itemImg} src={ev.icon} alt="" />
                                <span className={styles.itemName}>{ev.name}</span>
                                <img className={styles.itemGo} src={go} alt="" />
                            </div>

                        )
                    }
                </div>
            </div>
        );
    } else if (roleid === '3') {           //普通管理员
        return (
            <div>
                <div className={styles.emptyBox}></div>
                <div className={styles.jurisdictionModule_1}>
                    {
                        ordinary.map((ev, index) =>
                            <div className={styles.item} key={index} onClick={ev => parent.moveToOrdinary(index)}>
                                <img className={styles.itemImg} src={ev.icon} alt="" />
                                <span className={styles.itemName}>{ev.name}</span>
                                <img className={styles.itemGo} src={go} alt="" />
                            </div>

                        )
                    }
                </div>
            </div>
        );
    } else {                              //一般用户
        return null
    }
}

const ClockPage = ({ prompt, parent, h, m, s }) => {
    if (prompt === 0) {            //搜索中
        return (
            <div className={styles.content}>
                <div className={styles.clickClock}>
                    <img className={styles.ring} src={yuanHuan} alt="" />
                    <div className={styles.clickButton}>
                        <div className={styles.clockOn}>打卡</div>
                        <div className={styles.clockDate}>{h}:{m}:{s}</div>
                    </div>
                </div>
                <div className={styles.prompt}>
                    <img className={styles.promptImg} src={load} alt="" /><span className={styles.text}>正在搜索考勤机...</span>
                </div>
                <div className={styles.refreshHide}>刷新页面</div>
                <div className={styles.promptText}>搜索考勤机时请保证网络连接正常,蓝牙为开启状态哦!</div>
            </div>
        )
    } else if (prompt === 1) {      //可打卡
        return (
            <div className={styles.content}>
                <div className={styles.clickClock}>
                    {/* <div className={styles.circular}></div> */}
                    <img className={styles.circular} src={yuanHuan1} alt="" />
                    <div onClick={ev => parent.clockIn(ev)} className={styles.clickButton}>
                        <div className={styles.clockCan}>打卡</div>
                        <div className={styles.clockDate}>{h}:{m}:{s}</div>
                    </div>
                </div>
                <div className={styles.prompt}>可以打卡了</div>
                <div className={styles.refreshHide}>刷新页面</div>
                <div className={styles.promptText}>搜索考勤机时请保证网络连接正常,蓝牙为开启状态哦!</div>
            </div>
        )
    } else if (prompt === 2) {     //打卡异常
        return (
            <div className={styles.content}>
                <div className={styles.clickClock}>
                    {/* <div className={styles.circular}></div> */}
                    <img className={styles.circular} src={yuanHuan1} alt="" />
                    <div className={styles.clickButton}>
                        <div className={styles.clockOn}>打卡</div>
                        <div className={styles.clockDate}>{h}:{m}:{s}</div>
                    </div>
                </div>
                <div className={styles.prompt}>
                    <img className={styles.promptImg} src={warn} alt="" /><span className={styles.text}>网络连接异常,蓝牙未打开</span>
                </div>
                <div onClick={ev => parent.refresh(ev)} className={styles.refreshShow}>刷新页面</div>
                <div className={styles.promptText}>搜索考勤机时请保证网络连接正常,蓝牙为开启状态哦!</div>
            </div>
        )
    } else if (prompt === 3) {                      //打卡成功
        return (
            <div className={styles.content}>
                <div className={styles.clickClock}>
                    <img className={styles.cardFinish} src={success} alt="" />
                    <div className={styles.cardTime}>
                        <div className={styles.clockDate1}>{h}:{m}:{s}</div>
                    </div>
                </div>
                <div className={styles.prompt}>
                    <img className={styles.promptImg} src={successMin} alt="" /><span className={styles.text}>打卡成功!</span>
                </div>
                <div className={styles.refreshHide}>刷新页面</div>
                <div className={styles.promptText}>搜索考勤机时请保证网络连接正常,蓝牙为开启状态哦!</div>
            </div>
        )
    } else {                      //附近无设备
        return (
            <div className={styles.content}>
                <div className={styles.clickClock}>
                    {/* <div className={styles.circular}></div> */}
                    <img className={styles.circular} src={yuanHuan1} alt="" />
                    <div className={styles.clickButton}>
                        <div className={styles.clockOn}>打卡</div>
                        <div className={styles.clockDate}>{h}:{m}:{s}</div>
                    </div>
                </div>
                <div className={styles.prompt}>
                    <img className={styles.promptImg} src={warn} alt="" /><span className={styles.text}>您不在考勤范围内</span>
                </div>
                <div onClick={ev => parent.refresh(ev)} className={styles.refreshShow}>刷新页面</div>
                <div className={styles.promptText}>搜索考勤机时请保证网络连接正常,蓝牙为开启状态哦!</div>
            </div>
        )
    }
}

class UserCenter extends Component {
    constructor() {
        super();
        window.temp = {};
        this.state = {
            tipState: false,        //提示状态
            tipState1: false,
            alertState: false,      //alert状态
            id: '',                 //用户Id
            showUserCenter: false,   //展示模块1
            showPunchClock: true,  //展示模块2
            companyid: '',         //公司Id
            roleid: '',            //用户权限
            dataSource: {},        //用户信息
            result: {},            //签名内容
            prompt: 0,            //考勤机状态
            noticeState: false,    //通知显示
            noticeTitle: '',       //公告标题
            normalDay: ''
        }
        this.timer =  null;
        this.closeTimeout =  null;
    }
    componentDidMount() {
        document.querySelector('title').innerText = '考勤打卡';
        this.getUser();
        this.showTime();
        this.getNewNotice();
        this.mainPage();
        this.getWX();
        this.firstIbeacons();
    }
    componentWillUnmount() {
        var main = {
            showUserCenter: this.state.showUserCenter,
            showPunchClock: this.state.showPunchClock,
            prompt: this.state.prompt,
            roleid: this.state.roleid,
        }
        window.sessionStorage.setItem('mainPage', JSON.stringify(main));
    }
    mainPage() {
        var test = JSON.parse(window.sessionStorage.getItem('mainPage'));
        if (test) {
            this.setState({
                showUserCenter: test.showUserCenter,
                showPunchClock: test.showPunchClock,
                prompt: test.prompt,
                roleid: test.roleid,
            })
            if (test.showUserCenter === true) {
                document.querySelector('title').innerText = '个人中心';
            } else {
                document.querySelector('title').innerText = '考勤打卡';
            }
        } else {
            this.setState({
                showUserCenter: false,   //展示模块1
                showPunchClock: true,  //展示模块2
                prompt: 0,
                roleid: '',
            })
        }
    }

    stopBeacons() {
        setTimeout(() => this.stopSearch(), 0)
    }
    AnnouncementDetails(ev) {         //切换至公告详情
        ev.stopPropagation();
        this.props.history.push('/AnnouncementDetails');
    }
    showTime() {                      //刷新当前时间/1秒
        setInterval(ev => this.getTime(ev), 1000)
    }
    hideMask() {
        this.setState({ mask: false }); //隐藏
    }
    showMask() {
        this.setState({ mask: true });  //显示
        this.rankingList();
    }
    refresh() {                       //刷新页面
        this.setState({ prompt: 0 });
        this.searchIbeacons();
    }
    noteceDelete() {                  //删除通知
        this.setState({ noticeState: false });
    }
    getTime() {                       //获取当前时/分/秒/月/日/星期
        var data = new Date();
        this.setState({ h: data.getHours() < 10 ? '0' + data.getHours() : data.getHours() });
        this.setState({ m: data.getMinutes() < 10 ? '0' + data.getMinutes() : data.getMinutes() });
        this.setState({ s: data.getSeconds() < 10 ? '0' + data.getSeconds() : data.getSeconds() });
    }
    async getNewNotice() {
        const result = await XHR.post(window.admin + API.getNewNotice, { companyid: this.props.match.params.companyId });
        if (JSON.parse(result).data) {
            this.setState({ noticeState: true, noticeTitle: JSON.parse(result).data.title });
            window.sessionStorage.setItem('listId', JSON.parse(result).data.id)
        } else {
            this.setState({ noticeState: false })
            return false;
        }
    }
    async clockIn() {                //员工打卡
        const result = await XHR.post(window.admin + API.clockIn, { loginName: this.props.match.params.loginName });
        if (JSON.parse(result).success === "T") {
            this.setState({ prompt: 3 })
        } else {
            this.setState({ prompt: 2 })
        }
    }

    selectBtn(dataState) {
        if (dataState) {
            this.unbind();
            this.setState({ alertState: false })
        } else {
            this.setState({ alertState: false })
            return false
        }


    }
    punchClock() {
        document.querySelector('title').innerText = '考勤打卡';
        this.setState({ showUserCenter: false, showPunchClock: true, prompt: 0 });
        this.searchIbeacons();
        this.getNewNotice();
    }
    personCenter() {
        document.querySelector('title').innerText = '个人中心';
        this.setState({ showUserCenter: true, showPunchClock: false });
        this.stopSearch()
    }
    attendanceData() {
        this.props.history.push('/attendanceData')
    }
    moveToUser(i) {                   //一般用户选项跳转
        this.getOfficeList();
        const userUrl = ['/attendanceRecord/' + this.state.companyid + '/' + this.state.id, '/cardReminding', '/revisionDepartment'];
        this.props.history.push(userUrl[i]);
    }
    moveToOrdinary(i) {               //普通管理员选项跳转
        this.getOfficeList();
        window.sessionStorage.removeItem('test');
        window.sessionStorage.removeItem('dataResult');
        const ordinaryUrl = ['/attendanceData', '/ordinaryEnterorise', '/employeeInformation', '/releaseAnnouncement']
        this.props.history.push(ordinaryUrl[i]);
    }
    moveToSuper(i) {                 //超级管理员选项跳转
        this.getOfficeList();
        window.sessionStorage.removeItem('test');
        window.sessionStorage.removeItem('dataResult');
        const superUrl = ['/attendanceData', '/enterpriseManager', '/employeeInformation', '/releaseAnnouncement', '/attendanceManagement']
        this.props.history.push(superUrl[i]);
    }
    scan() {                         //扫一扫
        window.wx.ready(() => {
            window.wx.scanQRCode({
                needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
                success: function (res) {
                    var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结
                    window.sessionStorage.setItem("result", result);
                    window.location.href = window.server + '/AttendanceFront/index.html#/backstagelogon';
                }
            });
        })
    }
    stopSearch() {
        clearTimeout(this.closeTimeout);
        window.wx.stopSearchBeacons({
            complete: (res) => {
                clearTimeout(this.timer);
            }
        });
    }
    firstIbeacons() {
        window.wx.ready(() => {
            this.searchIbeacons();
        })
    }
    searchIbeacons() {
        let that = this;
        clearTimeout(this.timer);
        this.timer = setTimeout(()=>{
            window.wx.startSearchBeacons({       //开启ibeacons
                ticket: "",
                complete: (argv) => {
                    //开启查找完成后的回调函数
                    if (argv.errMsg === "startSearchBeacons:ok") {
                        this.closeTimeout = setTimeout(() => { 
                            this.setState({ prompt: 4 });
                            this.stopSearch();
                        }, 15000);
                        // 监听iBeacon信号
                        window.wx.onSearchBeacons({
                            complete: (argv) => {
                                clearTimeout(this.closeTimeout)
                                //回调函数，可以数组形式取得该商家注册的在周边的相关设备列表
                                if (argv.beacons.length > 0) {
                                    const backData = [];
                                    argv.beacons.forEach((ev, index) => {
                                        backData.push({
                                            major: ev.major,
                                            minor: ev.minor
                                        })
                                    })
                                    this.backState(backData);
                                } else {
                                    this.setState({ tipState: true })
                                    setTimeout(() => {
                                        this.setState({ tipState: false })
                                    }, 2000);
                                }
                                this.stopSearch();
                            }
                        });
                    } else {
                        //停止搜索ibeacons
                        this.setState({ prompt: 2 })
                        this.stopSearch();
                    }
                }
            }) 
        } ,2e3)
    }
    unbindUser() {                  //解绑员工二次确认
        this.setState({ alertState: true })
    }
    async backState(data) {
        const result = await XHR.post(window.admin + API.judgeDevice, {
            companyid: this.state.companyid,
            devices: data
        })
        if (JSON.parse(result).success === 'T') {
            this.setState({ prompt: 1 })
        } else {
            this.setState({ prompt: 4 })
        }
    }
    async getWX() {
        const result = await XHR.post(window.admin + API.getSignature);
        if (JSON.parse(result).success === 'T') {
            window.wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: JSON.parse(result).data.appId, // 必填，公众号的唯一标识
                timestamp: JSON.parse(result).data.timestamp, // 必填，生成签名的时间戳
                nonceStr: JSON.parse(result).data.noncestr, // 必填，生成签名的随机串
                signature: JSON.parse(result).data.signature,// 必填，签名
                jsApiList: ['scanQRCode', 'startSearchBeacons', 'stopSearchBeacons', 'onSearchBeacons'] // 必填，需要使用的JS接口列表
            });
        }
    }
    async getOfficeList() {          //部门列表
        const result = await XHR.post(window.admin + API.getOfficeList, { companyid: this.state.companyid });
        const dataSource = JSON.parse(result).data || [];
        const sectionList = [];
        dataSource.forEach((item, index) => {
            sectionList.push({
                name: item.name,
                id: item.id
            })
        });
        window.sessionStorage.setItem("officeList", JSON.stringify(sectionList));
    }
    async unbind() {                //解绑员工   
        const result = await XHR.post(window.admin + API.unbindUser, { loginName: this.props.match.params.loginName });
        if (JSON.parse(result).success === 'T') {
            this.props.history.replace('/personalRegister/' + this.props.match.params.companyId + '/' + this.props.match.params.loginName)
        } else {
            alert(JSON.stringify(result).msg);
        }
    }
    async getUser() {              //获取用户信息
        const result = await XHR.post(window.admin + API.getUser, { loginName: this.props.match.params.loginName });
        this.setState({ dataSource: JSON.parse(result).data, roleid: JSON.parse(result).data.roleid, companyid: JSON.parse(result).data.companyid, id: JSON.parse(result).data.id });
        window.temp = {
            name: JSON.parse(result).data.name,
            officeName: JSON.parse(result).data.officeName,
            phone: JSON.parse(result).data.phone,
            companyName: JSON.parse(result).data.companyName
        }
        window.sessionStorage.setItem('loginName', this.props.match.params.loginName);
        window.sessionStorage.setItem('companyid', JSON.parse(result).data.companyid);
        window.sessionStorage.setItem('id', JSON.parse(result).data.id);
    }
    render() {

        const { roleid, dataSource, prompt, h, m, s, noticeState, noticeTitle, showUserCenter, showPunchClock, alertState, tipState, tipState1 } = this.state;
        const user = [{ icon: record, name: '考勤记录' }, { icon: remind, name: '打卡提醒' }, { icon: revise, name: '修改部门' }];
        const superMan = [{ icon: attendanceRecord, name: '员工考勤记录' }, { icon: administration, name: '企业管理' }, { icon: staff, name: '员工资料' }, { icon: release, name: '发布公告' }, { icon: setUp, name: '设置考勤' }];
        const ordinary = [{ icon: attendanceRecord, name: '员工考勤记录' }, { icon: administration, name: '企业管理' }, { icon: staff, name: '员工资料' }, { icon: release, name: '发布公告' }];
        return (
            <div className={showUserCenter === true ? styles.container : styles.container1}>
                <div>
                    <div className={showUserCenter === true ? styles.moduleShow : styles.moduleHide}>
                        <div className={styles.headerBox}>
                            <Header roleid={roleid} parent={this}></Header>
                            <div className={styles.information}>
                                <img className={styles.informationPhoto} src={headPortrait} alt="" />
                                <div className={styles.personalInformation}>
                                    <div className={styles.name}>
                                        <span>{dataSource.fingerprintNum}</span>
                                        <span>{dataSource.name}</span>
                                        <span>({dataSource.roleNames})</span>
                                    </div>
                                    <div className={styles.phone}>{dataSource.phone}</div>
                                    <div className={styles.company}>
                                        <span>{dataSource.companyName}</span>
                                        <span>{dataSource.officeName ? '/' + dataSource.officeName : ''}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.content}>
                            {
                                user.map((ev, index) =>
                                    <div className={styles.item} key={index} onClick={ev => this.moveToUser(index)}>
                                        <img className={styles.itemImg} src={ev.icon} alt="" />
                                        <span className={styles.itemName}>{ev.name}</span>
                                        <img className={styles.itemGo} src={go} alt="" />
                                    </div>
                                )
                            }
                        </div>
                        <Module roleid={roleid} superMan={superMan} ordinary={ordinary} parent={this}></Module>
                    </div>
                    <div className={showPunchClock === true ? styles.moduleShow : styles.moduleHide}>
                        <Notice noticeState={noticeState} parent={this} title={noticeTitle}></Notice>
                        <ClockPage prompt={prompt} parent={this} h={h} m={m} s={s}></ClockPage>
                    </div>
                </div>
                <div className={styles.tabBox}>
                    <div className={styles.tab} onClick={ev => this.punchClock(ev)}>
                        <img className={styles.tabImg1} src={showPunchClock === true ? clock2 : clock} alt="" />
                        <div className={showPunchClock === true ? styles.currenTabText : styles.tabText}>考勤打卡</div>
                    </div>
                    <div className={styles.tab} onClick={ev => this.personCenter(ev)}>
                        <img className={styles.tabImg} src={showUserCenter === true ? person : person1} alt="" />
                        <div className={showUserCenter === true ? styles.currenTabText : styles.tabText}>个人中心</div>
                    </div>
                </div>
                <Toast isShow={tipState} text="附近没有可打卡的考勤设备" />
                <Toast isShow={tipState1} text="解绑成功" />
                <Alert text='解绑后您的资料与考勤记录将消失,确认解绑吗？' onSelect={ev => this.selectBtn(ev)} isShow={alertState} />
            </div>
        )
    }

}
export default UserCenter;