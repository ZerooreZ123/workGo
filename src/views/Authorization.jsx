import React, { Component } from 'react';

import styles from '../styles/Authorization.css';

import scanIcon from '../asset/ico/scanIcon.png';


class Authorization extends Component {
  constructor() {
    super();
    this.state = {
    }
  } 
  componentDidMount() {
  }
  scanQR() {                                      //扫描二维码进行注册
    window.workgo.scanQRCode((result)=>{
      const data = JSON.parse(decodeURIComponent(result).split('=')[1])['name'];
      const code = JSON.parse(decodeURIComponent(result).split('=')[1])['code'];
      const loginName = window.sessionStorage.getItem('workLoginId')
      if(data.toString()=== 'machine1'){          //个人注册
        this.props.history.replace('/personalRegister/'+code +'/' + loginName )
      }else if (data.toString()=== 'machine'){    //公司注册
        this.props.history.replace('/enterpriseRegistration/'+code +'/'+ loginName)  
      }
    })
  }
  render() {
    return (
      <div className={styles.wrap}>
          <div className={styles.box}>
                <div onClick = {ev =>this.scanQR(ev)} className={styles.imgBox}><img className={styles.imgPhoto} src={scanIcon} alt=""/></div>
                <div className={styles.text}>点击图标扫描二维码进行注册</div>
          </div>
      </div>
    );
  }
}

export default Authorization;