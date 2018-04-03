//企业管理（xxx有限公司）
import React, { Component } from 'react';
import QRCode from 'qrcode.react';
import Toast from '../components/Toast';
import Alert from '../components/Alert';


import styles from '../styles/EnterpriseManager.css';

import XHR from '../utils/request';
import API from '../api/index';
// import {admin ,server} from '../api/route';

import go from '../asset/manager/go.png';
import deleteImg from '../asset/manager/delete.png';

const BottomBar = ({ add, parent, deleteState }) => {           //底部选择栏组件
    if (add) {
        return (
            <div className={styles.bottomBar}>
                <div onClick={ev => parent.addDivision(ev)} className={deleteState === true ? styles.hideAdd : styles.add}>添加部门</div>
                <div onClick={ev => parent.editor(ev)} className={deleteState === true ? styles.hideEditor : styles.editor}>编辑</div>
                <div onClick={ev => parent.backState(ev)} className={deleteState === true ? styles.editor : styles.hideEditor}>完成</div>
            </div>
        )
    } else {
        return (
            <div className={styles.bottomBar}>
                <div onClick={ev => parent.cancelSelect(ev)} className={styles.cancel}>取消</div>
                <div onClick={ev => parent.addOne(ev)} className={styles.determine}>确定</div>
            </div>
        )
    }
}
const TabContent = ({ currentIndex, deleteSection, division, inputText, section, machineNum, parent, imgClick }) => {
    if (currentIndex === 1) {
        if (deleteSection === false) {
            return (
                <div className={styles.content}>
                    <div className={division === true ? styles.item : styles.hideInput}>
                        <input className={styles.designation} onChange={ev => parent.getInput(ev)} type="text" placeholder="请输入部门名称" value={inputText} />
                        <img className={styles.forward} src={go} alt="" />
                    </div>
                    {
                        section.map((item, index) =>
                            <div className={styles.item} key={index} onClick={ev => parent.departmentPerson(index)}>
                                <div className={styles.name}>{item.officeName}</div>
                                <img className={styles.forward} src={go} alt="" />
                            </div>
                        )
                    }
                    <BottomBar add={parent.state.selectState} parent={parent} deleteState={deleteSection}></BottomBar>
                </div>
            );
        } else {
            return (
                <div className={styles.content}>
                    {
                        section.map((item, index) =>
                            <div className={styles.deleteItem} key={index} onClick={ev => parent.deleteClick(index)}>
                                <img className={styles.deleteImg} src={deleteImg} alt='' />
                                <div className={styles.name}>{item.officeName}</div>
                                <img className={styles.forward} src={go} alt="" />
                            </div>
                        )
                    }
                    <BottomBar add={parent.state.selectState} parent={parent} deleteState={deleteSection}></BottomBar>
                </div>
            );
        }
    } else if (currentIndex === 2) {
        return (
            <div className={styles.content}>
                {
                    machineNum.map((item, index) =>
                        <div className={styles.item} key={index}>
                            <div className={styles.name}>考勤机{index + 1}: {item}</div>
                        </div>
                    )
                }
                <div onClick={ev => parent.scan(ev)} className={styles.addMachine}>添加考勤机</div>
            </div>
        )
    } else {
        return (
            <div className={styles.content}>
                <div className={styles.codeWrap}>
                    <div className={imgClick ? styles.hideCode : styles.code}>
                        <QRCode value={parent.state.invitationCode} />
                    </div>
                    <div className={imgClick ? styles.code : styles.hideCode}>
                        <img className={styles.imgSize} src={imgClick} alt="" />
                    </div>
                    <div className={styles.codetext}>邀请码</div>
                    <div className={styles.text}>长按二维码,分享邀请码即可让员工注册</div>
                </div>
            </div>
        )

    }
}
class EnterpriseManager extends Component {
    constructor() {
        super();
        this.state = {
            companyName: '',              //公司名字
            tipState: false,              //提示状态
            alertState: false,            //alert状态
            selectState: true,            //底部栏展示
            invitationCode: '0',          //邀请码
            currentIndex: 0,             //切换tab的index
            division: false,             //添加部门输入框状态
            section: [],                 //部门列表
            machineNum: [],              //考勤机列表
            inputText: '',                //部门名称
            deleteSection: false,          //删除部门状态
            imgBase64: ''
        }
    }
    componentDidMount() {
        this.getWX();
        this.selectIndex();
        this.getCompany();
        this.getOfficeList();
        this.getAttendanceMachineList();
    }
    componentWillUnmount() {
        window.sessionStorage.setItem('test', this.state.currentIndex);
    }
    selectIndex() {
        var test = window.sessionStorage.getItem('test');
        if (test) {
            this.setState({ currentIndex: +test })
            // this.setState({qr:window.sessionStorage.getItem('qr')})
        } else {
            this.setState({ currentIndex: 0 })
        }
    }
    departmentPerson(i) {
        window.officeId = this.state.section[i].officeId;
        window.sectionName1 = this.state.section[i].officeName;
        this.props.history.push('/department')
    }
    editor() {                             //删除部门页面显示
        this.setState({ deleteSection: true })
    }
    backState() {
        this.setState({ deleteSection: false })
    }
    addDivision() {                        //添加部门
        if (this.state.deleteSection) {
            return false;
        } else {
            this.setState({ inputText: '', division: true, selectState: false })
        }
    }
    cancelSelect() {                       //取消选择
        this.setState({ division: false });
        this.setState({ selectState: true });
    }
    selectTab(i) {                         //获取当前tab索引
        this.setState({ currentIndex: i });
    }
    getInput(ev) {                         //获取输入的部门
        this.setState({ inputText: ev.target.value });
    }
    deleteClick(i) {                       //删除部门
        this.setState({ alertState: true });
        window.index = i
        //    this.deleteOfficce(i);
    }
    scan() {                         //扫一扫
        window.wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: this.state.result.appId, // 必填，公众号的唯一标识
            timestamp: this.state.result.timestamp, // 必填，生成签名的时间戳
            nonceStr: this.state.result.nonceStr, // 必填，生成签名的随机串
            signature: this.state.result.signature,// 必填，签名
            jsApiList: ['scanQRCode'] // 必填，需要使用的JS接口列表
        });
        window.wx.ready(() => {
            window.wx.scanQRCode({
                needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
                success: function (res) {
                    var result = res.resultStr;
                    const data = JSON.parse(decodeURIComponent(res.resultStr).split('=')[1])['code']
                    window.location.href = window.server + '/AttendanceFront/index.html#/addAttendanceMachine/' +data + '/' + window.temp.companyName + '/' + window.temp.name + '/' + window.temp.phone + '/' + window.sessionStorage.getItem('loginName');
                }
            });
        })
    }
    async getWX() {                   //获取微信签名等信息
        const result = await XHR.post(window.admin + API.getSignature);
        if (JSON.parse(result).success === 'T') {
            this.setState({
                result: {
                    appId: JSON.parse(result).data.appId,
                    timestamp: JSON.parse(result).data.timestamp,
                    nonceStr: JSON.parse(result).data.noncestr,
                    signature: JSON.parse(result).data.signature
                }
            })
        }
    }
    addOne() {
        setTimeout(() => this.addOrUpdateOfficce(), 0);
    }
    async addOrUpdateOfficce() {            //增加部门
        this.setState({ division: false });
        this.setState({ selectState: true });
        const result = await XHR.post(window.admin + API.addOrUpdateOfficce, {
            companyid: window.sessionStorage.getItem('companyid'),
            officeName: this.state.inputText
        })
        if (JSON.parse(result).success === "T") {
            this.setState({ section: this.state.section });
            window.sessionStorage.setItem('test', this.state.currentIndex);
            window.location.reload();
        } else {
            this.setState({ tipState: true })
            setTimeout(() => {
                this.setState({ tipState: false })
            }, 2000)
        }
    }
    async deleteOfficce(i) {              //删除部门
        const Id = this.state.section[i].officeId;
        const result = await XHR.post(window.admin + API.deleteOfficce, { officeid: Id });
        if (JSON.parse(result).success === 'T') {
            this.state.section.splice(i, 1);
            this.setState({ section: this.state.section });
            this.setState({ deleteSection: false });
        } else {
            alert(JSON.parse(result).msg)
        }
    }
    getBase64(canvas) {
        if (this.state.currentIndex === 0) {
            var image = new Image();
            image.src = canvas.toDataURL("image/png");
            this.setState({ imgBase64: image.getAttribute('src') });
        } else {
            return false;
        }

    }
    async getCompany() {                   //获取公司信息
        if (this.state.currentIndex === 0) {
            const result = await XHR.post(window.admin + API.getCompany, { companyid: window.sessionStorage.getItem('companyid') });
            const admin1 = window.admin + 'oauthLogin.do?targetUrl={"name":"machine1","code":"' + JSON.parse(result).data.id + '"}';
            // console.log(encodeURI(admin1));
            this.setState({ invitationCode: encodeURI(admin1), companyName: JSON.parse(result).data.name });
            // console.log(this.state.invitationCode);
            document.querySelector('title').innerText = JSON.parse(result).data.name;
            this.getBase64(document.getElementsByTagName('canvas')[0]);
        } else {
            return false
        }

    }

    async getOfficeList() {                //获取公司部门列表
        const result = await XHR.post(window.admin + API.getOfficeList, { companyid: window.sessionStorage.getItem('companyid') });
        const dataSource = JSON.parse(result).data;
        const officeList = [];
        dataSource.forEach((item, index) =>
            officeList.push({
                officeName: dataSource[index].name,
                officeId: dataSource[index].id
            })
        )
        officeList.push({
            officeName: '其他',
            officeId: 'officeid'
        })
        this.setState({ section: officeList });

    }
    async getAttendanceMachineList() {     //获取考勤机列表
        const result = await XHR.post(window.admin + API.getAttendanceMachineList, { companyid: window.sessionStorage.getItem('companyid') });
        const dataSource = JSON.parse(result).data;
        const machineList = [];
        dataSource.forEach((item, index) =>
            machineList.push(dataSource[index].id)
        )
        this.setState({ machineNum: machineList });
    }
    selectBtn(dataState) {
        if (dataState) {
            this.deleteOfficce(window.index);
            this.setState({ alertState: false, deleteSection: false })
        } else {
            this.setState({ alertState: false, deleteSection: false })
        }

    }
    render() {
        const { section, machineNum, division, currentIndex, inputText, deleteSection, alertState, tipState } = this.state;
        const tab = ['邀请码', '部门管理', '考勤机编号']
        return (
            <div className={styles.container}>
                <div className={styles.timetable}>
                    {
                        tab.map((item, index) => <div onClick={ev => this.selectTab(index)} className={currentIndex === index ? styles.currentTab : styles.elseTab} key={index}>{item}</div>)
                    }
                </div>
                <TabContent
                    currentIndex={currentIndex}
                    deleteSection={deleteSection}
                    division={division}
                    inputText={inputText}
                    section={section}
                    machineNum={machineNum}
                    parent={this}
                    imgClick={this.state.imgBase64}
                />
                <Alert text='确定要删除部门吗' onSelect={ev => this.selectBtn(ev)} isShow={alertState} />
                <Toast isShow={tipState} text="部门名称不能为空" />
            </div>
        )
    }
}
export default EnterpriseManager;