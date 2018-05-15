//考勤管理（超级管理）
import React, { Component } from "react";
import moment from "moment";
import TimePicker from "rc-time-picker";
import Toast from "../components/Toast";

import styles from "../styles/AttendanceManagement.css";

import XHR from "../utils/request";
import API from "../api/index";

import icon from "../asset/ico/icon.png";
import top from "../asset/manager/triangle-top.png";
import check from "../asset/manager/Check.png";
import nocheck from "../asset/manager/noCheck.png";

const CheckBtn = props => {
  if (props.checked === true) {
    return <img src={check} alt="" />;
  } else {
    return <img src={nocheck} alt="" />;
  }
};
const Icon = props => {
  if (props.checked === true) {
    return <img className={styles.icon} src={icon} alt="" />;
  } else {
    return <img className={styles.icon} src={icon} alt="" />;
  }
};
class AttendanceManagement extends Component {
  constructor() {
    super();
    window.temp = {};
    this.state = {
      tipState: false, //提示状态
      iconState1: false, //上小三角状态
      iconState2: false, //下小三角状态
      value: moment(),
      status: [], //勾选状态
      data: [], //初始数据
      now: moment()
        .hour(0)
        .minute(0),
      now1: moment()
        .hour(0)
        .minute(0)
    };
  }

  componentDidMount() {
    document.querySelector("title").innerText = "考勤管理";
    this.getAttendanceManagement();
  }
  addZero(s) {
    //时间格式转化
    return s < 10 ? "0" + s : s;
  }
  clickUp() {
    this.setState({ iconState1: true });
  }
  clickDown() {
    this.setState({ iconState2: true });
  }
  handleValueChange(time, s) {
    if (s === 0) {
      this.setState({ now: time, iconState1: false });
    } else {
      this.setState({ now1: time, iconState2: false });
    }
  }
  checkBtn(i) {
    //勾选或取消
    this.state.status[i] = !this.state.status[i];
    this.setState({ status: this.state.status });
  }
  async getAttendanceManagement() {
    //公司考勤时间配置及数据渲染
    const result = await XHR.post(window.admin + API.getAttendanceManagement, { companyid: window.sessionStorage.getItem("companyid") });
    const dataSource = JSON.parse(result).data;
    this.setState({ data: dataSource });
    var T1 = dataSource.forenoonLatest.split(":");
    var T2 = dataSource.afternoonFirst.split(":");
    const now = moment()
      .hour(T1[0])
      .minute(T1[1]);
    const now1 = moment()
      .hour(T2[0])
      .minute(T2[1]);
    this.setState({
      now,
      now1
    });
    const Num = [1, 2, 3, 4, 5, 6, 7]; //一周时间
    const weekDay = dataSource.workingTime.split(","); //初始勾选日期
    const weekDayNum = []; //初始勾选日期类型转换
    const weekSelect = []; //勾选日期state
    weekDay.forEach(ev => weekDayNum.push(parseInt(ev)));
    weekDayNum.forEach((ev, index) => {
      if (Num.indexOf(ev) > -1) {
        weekSelect[Num.indexOf(ev)] = true;
        this.setState({ status: weekSelect });
      }
    });
  }
  async attendanceManagement() {
    //公司考勤时间设置
    var d = new Date(this.state.now);
    var c = new Date(this.state.now1);
    var morTime = this.addZero(d.getHours()) + ":" + this.addZero(d.getMinutes()) + ":" + this.addZero(d.getSeconds());
    var aftTime = this.addZero(c.getHours()) + ":" + this.addZero(c.getMinutes()) + ":" + this.addZero(d.getSeconds());

    var list = [];
    this.state.status.forEach((ev, index) => {
      if (ev === true) {
        list.push(index + 1);
      }
    });

    const result = await XHR.post(window.admin + API.attendanceManagement, {
      companyid: window.sessionStorage.getItem("companyid"),
      forenoonLatest: morTime,
      afternoonFirst: aftTime,
      workingTime: list.toString(),
      id: this.state.data.id
    });
    const resultJson = JSON.parse(result);
    if (resultJson.success === "T") {
      this.setState({ tipState: true });
      setTimeout(() => {
        this.setState({ tipState: false });
      }, 2000);
    } else {
      alert(resultJson.msg);
    }
    const adminRegister = window.sessionStorage.getItem("AdminRegister");
    if (adminRegister && adminRegister === "Y") {
      // this.props.history.replace("/qrCode/" + window.sessionStorage.getItem("codeUrl") + "/" + window.sessionStorage.getItem("LoginName"));
      this.props.history.replace("/userCenter/" + window.sessionStorage.getItem("LoginName") + "/" + window.sessionStorage.getItem("companyid"));
    } else this.props.history.goBack();
  }
  render() {
    const { status, iconState1, iconState2, tipState } = this.state;
    const format = "HH:mm";

    const week = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.clockTime}>
            <div className={styles.clock}>打卡时间</div>
            <div className={styles.time}>
              <div>上午</div>
              <div onClick={ev => this.clickUp(ev)} className={styles.dateClass}>
                <TimePicker showSecond={false} value={this.state.now} onChange={time => this.handleValueChange(time, 0)} format={format} use24Hours />

                <Icon checked={iconState1} />
              </div>
            </div>
            <div className={styles.time}>
              <div>下午</div>
              <div onClick={ev => this.clickDown(ev)} className={styles.dateClass}>
                <TimePicker showSecond={false} value={this.state.now1} onChange={time => this.handleValueChange(time, 1)} format={format} use24Hours />
                <Icon checked={iconState2} />
              </div>
            </div>
          </div>

          <div className={styles.workTime}>
            <div className={styles.work}>工作时间 (自定义)</div>
            <div className={styles.week}>
              {week.map((item, index) => (
                <div onClick={ev => this.checkBtn(index)} className={styles.item} key={index}>
                  <CheckBtn checked={status[index]} />
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div onClick={ev => this.attendanceManagement(ev)} className={styles.determine}>
            确定
          </div>
        </div>
        <Toast isShow={tipState} text="考勤设置成功" />
      </div>
    );
  }
}

export default AttendanceManagement;
