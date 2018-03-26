import React, { Component } from 'react';
import QRCode from 'qrcode.react';
import styles from '../styles/QrCode.css';
import XHR from '../utils/request';
import API from '../api/index';


class QrCode extends Component {
  constructor() {
    super();
    this.state = {
      invitationCode:'',
      imgBase64:''
    }
  } 
  componentDidMount() {
    document.querySelector('title').innerText = '公众号二维码';
    // this.attention();
    setTimeout(()=>{
      this.attention();
    },500)
    setTimeout(() => {
   
      this.setState({invitationCode:decodeURIComponent(this.props.match.params.code)});
      const image = new Image(); 
      const canvas = document.getElementsByTagName('canvas')[0];
      image.src = canvas.toDataURL("image/png");
      this.setState({imgBase64:image.getAttribute('src')});
    }, 0);
  }
  async attention() {
    const loginName=this.props.match.params.loginName;
    const result = await XHR.post(window.admin+API.attention,{loginName:loginName});
    if(JSON.parse(result).success === 'T'){         //判断超管
      const companyId=JSON.parse(result).data;
      if(companyId.length > 0){         //判断是否已关注  true已关注   false未关注
        this.props.history.replace('/userCenter/'+loginName+'/'+companyId);
      }  
    }
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
                <div className={styles.text}>长按二维码,即可关注公众号</div>
            </div>    
        </div>
      </div>
    );
  }
}

export default QrCode;