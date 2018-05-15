import React, { Component } from "react";

import XHR from "../utils/request";
import API from "../api/index";

import styles from "../styles/Authorization.css";

import loading from "../asset/ico/loading.gif";

class LoginJump extends Component {
  constructor() {
    super();
    this.state = {
      phone: ""
    };
  }
  componentDidMount() {
    setTimeout(() => {
      window.workgo.getAuth(window.appId, window.secretKey, result => {
        if (result.success) {
          this.workGoUser();
        } else {
          alert(result.errMsg);
        }
      });
    }, 100);
  }
  workGoUser() {
    //获取用户信息
    window.workgo.getUserInfo(result => {
      const phone = result.mobile;
      const workid = result.userId;
      this.judgeUser(workid, phone);
    });
  }
  async judgeUser(userId, userPhone) {
    const result = await XHR.post(window.main + API.judgeUser, {
      phone: userPhone,
      workGoId: userId
    });
    const data = JSON.parse(result).data;
    if (JSON.parse(result).success === "T") {
      if (data.hasOwnProperty("companyid") && data.companyid !== "") {
        this.props.history.replace("/userCenter/" + data.loginName + "/" + data.companyid);
      } else {
        this.props.history.replace("/authorization");
        window.sessionStorage.setItem("workLoginId", data.loginName);
      }
    } else {
      alert(JSON.parse(result).data);
    }
  }
  render() {
    return (
      <div className={styles.wrap}>
        <div className={styles.box}>
          <div onClick={ev => this.getphone(ev)} className={styles.imgBox}>
            <img className={styles.imgPhoto} src={loading} alt="" />
          </div>
        </div>
      </div>
    );
  }
}

export default LoginJump;
