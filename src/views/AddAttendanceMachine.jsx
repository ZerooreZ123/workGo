//添加考勤机（超级管理）
import React,{Component} from 'react';
import styles from '../styles/AddAttendanceMachine.css';

import XHR from '../utils/request';
import API from '../api/index';

class AddAttendanceMachine extends Component{
    constructor() {
        super();
        this.state={
        }
    }
    componentDidMount() {
        document.querySelector('title').innerText = '添加考勤机';
        console.log(this.props.match.params);
    }
    async update() {
        const result = await XHR.post(window.admin + API.update,{
            loginName:this.props.match.params.loginName,
            serialNumber:this.props.match.params.machineNum
        });
        alert(JSON.parse(result).msg)
    }
    render() {
        return(
            <div className={styles.contianer}>
                <div className={styles.content}>
                     <div className={styles.item}>
                       <div className={styles.machineNum}>考勤机编号</div>
                       <div className={styles.num}>{this.props.match.params.machineNum}</div>
                     </div>
                     <div className={styles.item}>
                       <div className={styles.companyInfo}>企业信息</div>
                       <div className={styles.company}>{this.props.match.params.company}</div>
                     </div>
                     <div className={styles.item}>
                       <div className={styles.superManage}>超级管理员信息</div>
                       <div className={styles.name}>{this.props.match.params.name}</div>
                       <div className={styles.phone}>{this.props.match.params.phone}</div>
                     </div>
                </div>
                <div className={styles.binding} onClick={ev =>this.update(ev)}>确认绑定</div>
            </div>
        )
    }

}
export default AddAttendanceMachine;