//企业管理（普通管理员）
import React, { Component } from 'react';
import QRCode from 'qrcode.react';
import styles from '../styles/EnterpriseManager.css';

import XHR from '../utils/request';
import API from '../api/index';

import go from '../asset/manager/go.png';

class OrdinaryEnterorise extends Component {
    constructor() {
        super();
        this.state = {
            invitationCode: '',           //二维码
            currentIndex:0,             //切换tab的index
            division: false,
            section: [],                 //部门列表
            machineNum: [],              //考勤机列表
            inputText:'',                //部门名称
            imgBase64:''
        }
    }
    componentWillUnmount(){
        window.sessionStorage.setItem('test',this.state.currentIndex);
    }
    componentDidMount() {
        this.getCompany();
        this.getOfficeList();
        this.getAttendanceMachineList();
        this.selectIndex();
    }
    selectIndex() {
        var test=window.sessionStorage.getItem('test');
        if(test){
            this.setState({currentIndex:+test})
        }else{
            this.setState({currentIndex:0})
        }
    }
    selectTab(i) {                         //获取当前tab索引
        this.setState({ currentIndex: i });
    }
    getInput(ev) {
        this.setState({inputText:ev.target.value})
    }
    goToDepartment(i) {
        window.officeId = this.state.section[i].id;
        window.sectionName1 = this.state.section[i].name;
        this.props.history.push("/department");
    }
    getBase64(canvas){
        if(this.state.currentIndex === 0) {
            var image = new Image();  
            image.src = canvas.toDataURL("image/png");
            this.setState({imgBase64:image.getAttribute('src')})    
        }else{
            return false;
        }    
    }
    async getCompany() {                   //获取公司信息
        const result = await XHR.post(window.admin + API.getCompany,{companyid:window.sessionStorage.getItem('companyid')});
        const admin1 =window.admin +  'oauthLogin.do?targetUrl={"name":"machine1","code":"' + JSON.parse(result).data.id + '"}';
        document.querySelector('title').innerText = JSON.parse(result).data.name;
        this.setState({invitationCode:encodeURI(admin1)})
        this.getBase64(document.getElementsByTagName('canvas')[0])
    }
    async getOfficeList() {                //获取公司部门列表
        const result = await XHR.post(window.admin + API.getOfficeList, { companyid:window.sessionStorage.getItem('companyid')});
        const dataSource = JSON.parse(result).data || [];
        const officeList = [];
        dataSource.forEach((item, index) =>
            officeList.push({
               name: dataSource[index].name,
               id:dataSource[index].id
            })
        )
        officeList.push({
            name:'其他',
            id:'officeid'
        })
        this.setState({section: officeList });

    }
    async getAttendanceMachineList() {     //获取考勤机列表
        const result = await XHR.post(window.admin + API.getAttendanceMachineList, { companyid:window.sessionStorage.getItem('companyid')});
        const dataSource = JSON.parse(result).data || [];
        const machineList = [];
        dataSource.forEach((item, index) =>
            machineList.push(dataSource[index].id)
        )
        this.setState({ machineNum: machineList });
    }
    render() {
        const { section, machineNum,currentIndex} = this.state;
        const tab = ['邀请码', '部门管理', '考勤机编号']
        const TabContent = props => {
            if (this.state.currentIndex === 1) {
                return (
                    <div className={styles.content}>
                        {
                            section.map((item, index) =>
                                <div onClick={ev =>this.goToDepartment(index)} className={styles.item} key={index}>
                                    <div className={styles.name}>{item.name}</div>
                                    <img className={styles.forward} src={go} alt="" />
                                </div>
                            )
                        }
                    </div>
                );
            } else if (this.state.currentIndex === 2) {
                return (
                    <div className={styles.content}>
                        {
                            machineNum.map((item, index) =>
                                <div className={styles.item} key={index}>
                                    <div className={styles.name}>考勤机{index + 1}: {item}</div>
                                </div>
                            )
                        }
                    </div>
                )
            } else {
                return (
                    <div className={styles.content}>
                        <div className={styles.codeWrap}>
                            <div className={styles.hideCode}>
                                <QRCode value={this.state.invitationCode} />
                            </div>
                            <div className={styles.code}> 
                                <img className={styles.imgSize} src={this.state.imgBase64} alt=""/>
                            </div>
                            <div className={styles.codetext}>邀请码</div>
                            <div className={styles.text}>分享邀请码即可让员工注册</div>
                        </div>
                    </div>
                )

            }
        }
        return (
            <div className={styles.container}>
                <div className={styles.timetable}>
                    {
                        tab.map((item, index) => <div onClick={ev => this.selectTab(index)} className={currentIndex === index ? styles.currentTab : styles.elseTab} key={index}>{item}</div>)
                    }
                </div>
                <TabContent></TabContent>
            </div>
        )
    }
}
export default OrdinaryEnterorise;
