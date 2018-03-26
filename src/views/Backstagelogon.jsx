import React,{Component} from 'react';
import styles from '../styles/Backstagelogon.css';

import computer from '../asset/computer.png';
import XHR from '../utils/request';
import API from '../api/index';

class Backstagelogon extends Component {
    constructor() {
        super();
        this.state={
        }
    }
    componentDidMount() {
        document.querySelector('title').innerText = '后台登录';
    }
    cancel() {
        window.history.go(-1)
    }
    async register() {
        const result = await XHR.post(window.admin + API.login,{
            loginName:window.sessionStorage.getItem("loginName"),
            quickMark:window.sessionStorage.getItem("result")
        })
        if(JSON.parse(result).success === 'T') {
            alert("登录成功");
            window.history.go(-1)
        }else{
            alert(JSON.parse(result).msg)
        }
    }
    render() {
        return(
            <div className={styles.container}>
              <div className={styles.content}>
                  <img className={styles.photo} src={computer} alt=""/>
                  <div className={styles.text}>电脑端登录确认</div>
                  <div onClick={ev =>this.register(ev)} className={styles.login}>登录</div>
                  <div onClick={ev =>this.cancel(ev)} className={styles.cancel}>取消登录</div>  
              </div>
            </div>
        )
    }
}
export default Backstagelogon
