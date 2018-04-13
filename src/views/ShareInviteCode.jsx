import React, { Component } from 'react';
import QRCode from 'qrcode.react';
import styles from '../styles/ShareInviteCode.css';

import XHR from '../utils/request';
import API from '../api/index';
class ShareInviteCode extends Component {
  constructor() {
    super();
    this.state = {
      invitationCode:'',
      imgBase64:''
    }
  } 
  componentDidMount() {
    document.querySelector('title').innerText = '分享邀请码';
    this.getCompany();
  }
  
  enterCode(){
    window.sessionStorage.setItem('AdminRegister','Y');
    this.props.history.replace('/attendanceManagement');
  }
  getBase64(canvas){ 
        var image = new Image();  
        image.src = canvas.toDataURL("image/png");
        this.setState({imgBase64:image.getAttribute('src')});
}
 async getCompany() {                   //获取公司信息
    const result = await XHR.post(window.admin + API.getCompany,{companyid:window.sessionStorage.getItem('companyid')});
    const admin1 = window.admin + 'oauthLogin.do?targetUrl={"name":"machine1","code":"' + window.sessionStorage.getItem('companyid') + '"}';
    this.setState({invitationCode:encodeURI(admin1)});
    this.getBase64(document.getElementsByTagName('canvas')[0]);
  }
  render() {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
            <div className={styles.codeWrap}>
                <div className={this.state.imgBase64?styles.hideCode:styles.code}>
                    <QRCode value={this.state.invitationCode} />
                </div>
                <div className={this.state.imgBase64?styles.code:styles.hideCode}> 
                    <img className={styles.imgSize} src={this.state.imgBase64} alt=""/>
                </div>
                <div className={styles.codetext}>邀请码</div>
                <div className={styles.text}>分享邀请码即可让员工注册</div>
            </div>    
        </div>
        {/* <div onClick={ev =>this.enterCode(ev)} className={styles.enterCode}>进入公众号</div> */}
        <div onClick={ev =>this.enterCode(ev)} className={styles.footer}>完成并设置考勤时间</div>
      </div>
    );
  }
}

export default ShareInviteCode;