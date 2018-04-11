import React,{Component} from 'react';
import styles from '../styles/ExportData.css';
import Toast from '../components/Toast';

import XHR from '../utils/request';
import API from '../api/index';

import moment from 'moment';

class ExportData extends Component{
    constructor(){
        super();
        this.state={
            tipState:false,        //提示状态
            inputMail:'',           //输入的mail
            section:JSON.parse(window.sessionStorage.getItem("dataResultExport")).section,
            time:JSON.parse(window.sessionStorage.getItem("dataResultExport")).time,
            departmentId:JSON.parse(window.sessionStorage.getItem("dataResultExport")).departmentId  || '',
            userids:JSON.parse(window.sessionStorage.getItem("dataResultExport")).userids || '',
        }
    }
    componentDidMount() {
        document.querySelector('title').innerText = '导出数据';
    }
    componentWillUnmount() {
        window.sessionStorage.removeItem("dataResultExport");
    }
    getMail(ev) {
        this.setState({inputMail:ev.target.value})
    }
    exportData() {
        const {time,section,departmentId,userids} = this.state;
        if(time.length === 10){                     //日
            if(section === '全部') {      //全部
                this.getRecords(time,time);   
            }else{                                   //部门
                this.getRecords(time,time,departmentId);   
            }
        }else if(time.length === 7){                //月
            if(section === '全部') {      //全部
                this.getRecords(time + '-01',moment(time).endOf('month').format('YYYY-MM-DD'));   
            }else if(departmentId){                                   //部门
                this.getRecords(time + '-01',moment(time).endOf('month').format('YYYY-MM-DD'),departmentId)   
            }else {
                this.getRecords(time + '-01',moment(time).endOf('month').format('YYYY-MM-DD'),'',userids)   
            }
        }else{                                                  //年
            if(section === '全部') {      //全部
                this.getRecords(time + '-01-01',time+ '-12-31');   
            }else if(departmentId){                                   //部门
                this.getRecords(time + '-01-01',time+ '-12-31',departmentId)   
            }else{
                this.getRecords(time + '-01-01',time+ '-12-31','',userids)   
            }
        }
    }



    async getRecords(startTime,endTime,officeId,userId) {
        const result = await XHR.post(window.admin+ API.getRecords,{
            companyid:window.sessionStorage.getItem('companyid'),
            beginDate:startTime,
            endDate:endTime,
            officeid:officeId,
            userids:userId,                                       //不传useid与office则导全部
            export:"export",                                       //传useid则导个人。
            mail:this.state.inputMail                              //传部门则导部门人员
        })
        if(JSON.parse(result).success === 'T') {
            this.setState({tipState:true})
            setTimeout(()=>{
                this.setState({tipState:false})
            },2000)
        }else{
            alert(JSON.parse(result).msg)
        }
    }
    render() {
        const {inputMail,tipState,time,section} = this.state;
        return(
            <div className={styles.container}>
                <div className={styles.content}>
                    <div className={styles.describe}>
                        <div className={styles.dataDescribe}>数据描述</div>
                        <div><span>{time}</span>/<span>{section}</span></div>
                    </div>
                    <div className={inputMail === ''?styles.mailbox1:styles.mailbox}>
                        <div className={inputMail?styles.receiveMail:styles.hideReceive}>接收邮箱</div>
                        <input onChange={ev =>this.getMail(ev)} className={styles.inputBox} type="text" placeholder="接收邮箱" value={inputMail} />
                    </div>
                </div>
                <div onClick={ev =>this.exportData(ev)} className={inputMail === ''?styles.Button:styles.button}>发送</div>
                <Toast isShow={tipState} text="邮件发送成功"/>
            </div>
        )
    }
}
export default ExportData;