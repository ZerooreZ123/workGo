import React,{Component} from 'react';
import Toast from '../components/Toast';
import styles from '../styles/PersonalRegister.css';

import XHR from '../utils/request';
import API from '../api/index';

import headPortrait from '../asset/userCenter/headPortrait.png';


class PersonalRegister extends Component {
  constructor() {
    super();
    this.state = {
        msg:'',
        tipState:false,
        canState:true,            //可点击
        sendState:'发送验证码',   //发送状态
        inputText:'',            //输入的手机号
        inputValue:'',           //输入的验证码
        code:''                  //获得的验证码
    }
}
componentDidMount() {
    document.querySelector('title').innerText = '注册';
    console.log(this.props.match.params.companyid)
    window.sessionStorage.setItem('comID',this.props.match.params.companyid);
    window.sessionStorage.setItem('LoginName',this.props.match.params.loginName);
}
getPhone(ev) {
    this.setState({inputText:ev.target.value});
}
getCode(ev) {
    this.setState({inputValue:ev.target.value});
}  
async sendSms() {                  //获取验证码
    if(!(/^1[34578]\d{9}$/.test(this.state.inputText))){
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
            const result = await XHR.post(window.admin + API.sendSms,{phone:this.state.inputText});
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
        window.sessionStorage.setItem("phone",this.state.inputText); 
    }
}
goToNextStep() {
   if((this.state.inputText !== '') && (this.state.inputValue !== '')) {
        if(this.state.inputValue === this.state.code) {
            this.props.history.replace('/inviteCodeDetail')
        }else{
            alert("请输入正确的验证码")
        }
   }else{
       alert("请检查手机号或者验证码是否输入")
   }
}
render() {
    const {inputValue,inputText,sendState,canState,tipState,msg} = this.state;
    return (
      <div className = {styles.container}>
        <div className = {styles.headImage}>
           <img className={styles.informationPhoto} src={headPortrait} alt=""/>
        </div>

        <div className = {inputText?styles.showBorder:styles.invite}>
          <div className={inputText?styles.showPhone:styles.hidePhone}>手机号</div>
          <input className={styles.inputClass} onChange={ev =>this.getPhone(ev)} type="text" placeholder = "手机号" value={inputText}/>
        </div>
         
        <div className={styles.box}>
            <div className={inputValue?styles.showCode:styles.hideCode}>验证码</div>
            <div className = {inputValue?styles.getCode1:styles.getCode}>
                <input className={styles.codeClass} onChange={ev =>this.getCode(ev)} type="text" placeholder = "验证码" value={inputValue}/>
                <input onClick={ev =>this.sendSms(ev)} type="button" className={canState === false?styles.noSendCode:styles.sendCode} value={sendState} />
            </div>
        </div>
        

        <div className={styles.next}>
          <div className = {(inputText && inputValue) ? styles.nextCan:styles.nextStep} onClick={ev =>this.goToNextStep(ev)}>下一步</div>
        </div>
        <Toast isShow={tipState} text={msg}/>
      </div>
    );
  }
}

export default PersonalRegister;

