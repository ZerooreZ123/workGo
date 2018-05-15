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
  scanQR() {                                  //扫描二维码进行注册
    window.workgo.scanQRCode((dataResult) => {
      const qrSrc = decodeURIComponent(dataResult['result']).split('=')[1];
      const data = JSON.parse(qrSrc).name;
      const code = JSON.parse(qrSrc).code;
      const workLoginId = window.sessionStorage.getItem('workLoginId')
      if(data === 'machine1'){          //个人注册
        this.props.history.replace('/personalRegister/'+ code + '/' + workLoginId)
      }else if (data === 'machine'){    //公司注册
        this.props.history.replace('/enterpriseRegistration/'+ code + '/'+ workLoginId)
      }
    })
  }
  render() {
    return (
      <div className={styles.wrap}>
          <div className={styles.box}>
                <div onClick = {ev =>this.scanQR(ev)} className={styles.imgBox}><img className={styles.imgPhoto} src={scanIcon} alt=""/></div>
                <div className = {styles.text}>点击图标扫描二维码进行注册</div>
          </div>
      </div>
    );
  }
}

export default Authorization;