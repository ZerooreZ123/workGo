import React,{Component} from 'react';
import Toast from '../components/Toast';
import styles from '../styles/EnterpriseRegistration.css';

import XHR from '../utils/request';
import API from '../api/index';

class EnterpriseRegistration extends Component {
  constructor() {
    super();
    this.state = {
        msg:'',
        tipState:false,
        canState:true,            //可点击
        sendState:'发送验证码',   //发送状态
        inputCode:'',             //输入验证码
        inputPhone:'',            //手机号
        code:'',                  //返回验证码

    }
}
componentDidMount() {
    document.querySelector('title').innerText = '企业注册';
    console.log(this.props.match.params.serialNumber)
}
getCode(ev) {
    this.setState({inputCode:ev.target.value})
}
getPhone(ev) {
    this.setState({inputPhone:ev.target.value})
}
async goToNextStep() {          //下一步
    if((this.state.inputPhone !== '') && (this.state.inputCode !== '')) {     
            if(this.state.code === this.state.inputCode){
                const result = await XHR.post(window.admin + API.judge,{serialNumber:this.props.match.params.serialNumber});
                if(JSON.parse(result).data === true ) {   
                    this.props.history.replace('/writeInformation');
                    window.sessionStorage.setItem('serialNumber',this.props.match.params.serialNumber);
                    window.sessionStorage.setItem('LoginName',this.props.match.params.loginName);
                    window.sessionStorage.setItem("Phone",this.state.inputPhone);
                }else{
                    alert("该考勤机已经被绑定")
                }
            }else{
                alert("请输入正确的验证码")
            }
    }else{
        alert("请检查手机号或者验证码是否输入")
    }
}
async sendSms() {                  //获取验证码
    if(!(/^1[34578]\d{9}$/.test(this.state.inputPhone))){
        alert("手机号码格式不正确!");
    }else{
        var countdown = 60;
        var timeShow = setInterval(() => {
            countdown--;
            if( countdown<1){
                this.setState({sendState:'重新发送',canState:true})
                clearInterval(timeShow);
            }else{
                this.setState({sendState:countdown + 's',canState:false});
            }
        },1000)
        if(this.state.canState) {
            const result = await XHR.post(window.admin + API.sendSms,{phone:this.state.inputPhone});
            if(JSON.parse(result).success === 'T') {
                this.setState({code:JSON.parse(result).data});
            }else{
                this.setState({msg:JSON.parse(result).data,tipState:true});
                setTimeout(()=>{
                    this.setState({tipState:false})
                },2000)
            }
        }else{
            return false
        }
    }
}
render() {
    const {inputCode,inputPhone,sendState,canState,tipState,msg} = this.state;
    return (
      <div className = {styles.container}>
        <div className = {styles.headImage}>
            <div className={styles.Num}>考勤机编号</div>
            <div className={styles.inputNum}>{this.props.match.params.serialNumber}</div>
        </div>

        <div className = {styles.invite}>
          <div className={inputPhone?styles.showPhone:styles.hidePhone}>手机号</div>
          <input className={styles.inputClass} onChange={ev =>this.getPhone(ev)} type="text" placeholder = "手机号" value={inputPhone}/>
        </div>

        <div className = {styles.getCode}>
          <div className={inputCode?styles.showCode:styles.hideCode}>验证码</div>
          <input className={styles.inputClass} onChange={ev =>this.getCode(ev)} type="text" placeholder = "验证码" value={inputCode}/>
          <input onClick={ev =>this.sendSms(ev)} type="button" className={canState === false?styles.noSendCode:styles.sendCode} value={sendState}/>
        </div>

        <div className={styles.next}>
          <div className = {(inputCode && inputPhone) ? styles.nextCan:styles.nextStep} onClick={ev =>this.goToNextStep(ev)}>下一步</div>
        </div>
        <Toast isShow={tipState} text={msg}/>
      </div>
    );
  }
}

export default EnterpriseRegistration;