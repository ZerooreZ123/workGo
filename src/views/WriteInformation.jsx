import React,{Component} from 'react';

import styles from '../styles/WriteInformation.css';

import XHR from '../utils/request';
import API from '../api/index';

class WriteInformation extends Component {
  constructor() {
    super();
    this.state = {
      inputValue:'',         //姓名
      inputText:'',          //公司名
    }
}
componentDidMount() {
    document.querySelector('title').innerText = '填写资料'; 
}
async ShareInviteCode() {                //公司注册
    const result = await XHR.post(window.admin + API.register,{
        serialNumber:window.sessionStorage.getItem('serialNumber'),
        loginName:window.sessionStorage.getItem('LoginName'),
        phone:window.sessionStorage.getItem("Phone"),
        companyName:this.state.inputText,
        userName:this.state.inputValue
    });
    if(JSON.parse(result).success === 'T') {
      this.props.history.replace('/shareInviteCode');
      window.sessionStorage.setItem("companyid",JSON.parse(result).data.companyid)
      window.sessionStorage.setItem("id",JSON.parse(result).data.id)
      window.localStorage.setItem('codeUrl',JSON.parse(result).data.codeStr)
    }else{
      alert(JSON.parse(result).msg);
    }  
}
getCompany(ev) {
    this.setState({inputText:ev.target.value});
}
getName(ev) {
    this.setState({inputValue:ev.target.value});
} 
render() {
    const {inputValue,inputText} = this.state;
    return (
      <div className = {styles.container}>
        <div className = { inputText?styles.getCode1:styles.getCode}>
          <div className={inputText?styles.showCompany:styles.hideCompany}>公司名</div>
          <input className={styles.inputClass} onChange={ev =>this.getCompany(ev)} type="text" placeholder = "公司名" value={inputText}/>
          <div className={styles.prompt}>必填</div>
        </div>

        <div className = {inputValue?styles.getCode1:styles.getCode}>
          <div className={inputValue?styles.showName:styles.hideName}>姓名</div>
          <input className={styles.inputClass} onChange={ev =>this.getName(ev)} type="text" placeholder = "姓名" value={inputValue}/>
          <div className={styles.prompt}>必填</div>
        </div>

        <div className={styles.next}>
          <div onClick={ev =>this.ShareInviteCode(ev)} className = {(inputValue && inputText) ? styles.nextCan:styles.nextStep}>完成</div>
        </div>
      </div>
    );
  }
}

export default WriteInformation;