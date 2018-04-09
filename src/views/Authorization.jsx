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
      // this.icensing();

  }
  scanQR() {
     window.workgo.scanQRCode((result)=>{
       alert(result)
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