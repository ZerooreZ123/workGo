//员工个人信息(王大陆)
import React, { Component } from "react";
import moment from "moment";
import Toast from "../components/Toast";
import styles from "../styles/PersonalInformation.css";

import XHR from "../utils/request";
import API from "../api/index";

import data from "../asset/statePrompt/data.png";

const BottomBar = ({ visible, parent }) => {
  if (visible) {
    return (
      <div className={styles.bottomBar}>
        <div onClick={ev => parent.getMore(ev)} className={styles.add}>
          查看更多
        </div>
        <div onClick={ev => parent.editData(ev)} className={styles.editor}>
          修改资料
        </div>
      </div>
    );
  } else {
    return (
      <div className={styles.bottomBar}>
        <div onClick={ev => parent.getMore(ev)} className={styles.more}>
          查看更多
        </div>
      </div>
    );
  }
};

class PersonalInformation extends Component {
  constructor() {
    super();
    this.state = {
      tipState: false, //提示状态
      dataSource: [], //全部
      dataAbnormal: [], //异常
      showState: true, //默认展示全部
      monthList: [], //月份列表
      monthIndex: 0, //月份索引
      tabIndex: 0, //tab索引
      barState: window.Person.barState //底部bar状态
    };
  }
  componentDidMount() {
    document.querySelector("title").innerText = window.Person.name;
    this.showAll();
    this.getTime();
    this.canTip();
  }
  componentWillUnmount() {
    window.sessionStorage.removeItem("editState");
  }
  canTip() {
    const data = window.sessionStorage.getItem("editState");
    if (data) {
      this.setState({ tipState: data });
      this.hideTip();
    } else {
      this.setState({ tipState: false });
    }
  }
  hideTip() {
    setTimeout(() => this.hide(), 2000);
  }
  hide() {
    this.setState({ tipState: false });
  }
  editData() {
    //跳转至修改资料
    this.props.history.push("/editProfile");
  }
  showAll(i) {
    //展示所有
    this.setState({ showState: true, tabIndex: 0, monthIndex: 0 });
    this.getRecords(i);
  }
  showAbnormal(i) {
    //展示异常
    this.setState({ showState: false, tabIndex: 1, monthIndex: 0 });
    this.getAbnormal(i);
  }
  getTime() {
    //获取当前月及前三月
    var nowMonth = moment().format("M");
    var previous = moment()
      .subtract(1, "months")
      .format("M");
    var penult = moment()
      .subtract(2, "months")
      .format("M");
    var last = moment()
      .subtract(3, "months")
      .format("M");
    var list = [nowMonth, previous, penult, last];
    this.setState({ monthList: list });
  }
  async getRecords(i) {
    //切换月份展示记录
    this.setState({ monthIndex: i });
    var startTime = "";
    var endTime = "";
    switch (i) {
      case 1:
        startTime = moment()
          .startOf("month")
          .subtract(1, "months")
          .format("YYYY-MM-DD");
        endTime = moment()
          .endOf("month")
          .subtract(1, "months")
          .format("YYYY-MM-DD");
        break;
      case 2:
        startTime = moment()
          .startOf("month")
          .subtract(2, "months")
          .format("YYYY-MM-DD");
        endTime = moment()
          .endOf("month")
          .subtract(2, "months")
          .format("YYYY-MM-DD");
        break;
      case 3:
        startTime = moment()
          .startOf("month")
          .subtract(3, "months")
          .format("YYYY-MM-DD");
        endTime = moment()
          .endOf("month")
          .subtract(3, "months")
          .format("YYYY-MM-DD");
        break;
      default:
        startTime = moment()
          .startOf("month")
          .format("YYYY-MM-DD");
        endTime = moment().format("YYYY-MM-DD");
    }
    const result = await XHR.post(window.admin + API.getRecords, {
      companyid: window.sessionStorage.getItem("companyid"),
      beginDate: startTime,
      endDate: endTime,
      userids: window.Person.userid
      // userids:"92548d4571604ff2912652ec8e3d44a6"
    });

    const dataResult = [];

    JSON.parse(result).data.forEach((ev, i) => {
      dataResult.push({
        dateDay: ev.date.slice(0, 10),
        week: ev.week,
        goState: ev.gotoWorkStatus,
        goTime: ev.upWork ? ev.upWork : "--:--:--",
        backState: ev.getoffWorkStatus,
        backTime: ev.downWork ? ev.downWork : "--:--:--"
      });
    });
    var dataResult1 = dataResult.reverse();
    this.setState({ dataSource: dataResult1 || [] });
  }
  getMore() {
    window.sessionStorage.removeItem("personResult");
    this.props.history.push("/personalRecord");
  }
  async getAbnormal(i) {
    //获取异常打卡记录
    this.setState({ monthIndex: i });
    var startTime = "";
    var endTime = "";
    switch (i) {
      case 1:
        startTime = moment()
          .startOf("month")
          .subtract(1, "months")
          .format("YYYY-MM-DD");
        endTime = moment()
          .endOf("month")
          .subtract(1, "months")
          .format("YYYY-MM-DD");
        break;
      case 2:
        startTime = moment()
          .startOf("month")
          .subtract(2, "months")
          .format("YYYY-MM-DD");
        endTime = moment()
          .endOf("month")
          .subtract(2, "months")
          .format("YYYY-MM-DD");
        break;
      case 3:
        startTime = moment()
          .startOf("month")
          .subtract(3, "months")
          .format("YYYY-MM-DD");
        endTime = moment()
          .endOf("month")
          .subtract(3, "months")
          .format("YYYY-MM-DD");
        break;
      default:
        startTime = moment()
          .startOf("month")
          .format("YYYY-MM-DD");
        endTime = moment().format("YYYY-MM-DD");
    }
    const result = await XHR.post(window.admin + API.getRecords, {
      companyid: window.sessionStorage.getItem("companyid"),
      beginDate: startTime,
      endDate: endTime,
      userids: window.Person.userid,
      abnormity: "abnormity"
    });

    const dataResult = [];

    JSON.parse(result).data.forEach((ev, i) => {
      dataResult.push({
        dateDay: ev.date.slice(0, 10),
        week: ev.week,
        goState: ev.gotoWorkStatus,
        goTime: ev.upWork ? ev.upWork : "--:--:--",
        backState: ev.getoffWorkStatus,
        backTime: ev.downWork ? ev.downWork : "--:--:--"
      });
    });
    var dataResult1 = dataResult.reverse();
    this.setState({ dataAbnormal: dataResult1 || [] });
  }
  render() {
    const { dataSource, dataAbnormal, monthList, monthIndex, tabIndex, showState, barState, tipState } = this.state;
    const Show = props => {
      if (showState === true) {
        if (dataSource.length > 0) {
          return (
            <div className={styles.detailsList}>
              {dataSource.map((item, index) => (
                <div className={styles.item} key={index}>
                  <div className={styles.displayDate}>
                    <span>{item.dateDay}</span> <span>{item.week}</span>
                  </div>
                  <div className={styles.work}>
                    <div className={styles.gotoWork}>
                      上班:<span className={item.goState === "正常" ? styles.fontColor : styles.redColor}>{item.goState}</span>
                    </div>
                    <div className={styles.punchTime}>{item.goTime}</div>
                  </div>
                  <div className={styles.work}>
                    <div className={styles.gooffWork}>
                      下班:<span className={item.backState === "正常" ? styles.fontColor : styles.redColor}>{item.backState}</span>
                    </div>
                    <div className={styles.punchTime}>{item.backTime}</div>
                  </div>
                </div>
              ))}
            </div>
          );
        } else {
          return (
            <div className={styles.blankBox}>
              <div className={styles.box}>
                <img className={styles.blankImg} src={data} alt="" />
                <div className={styles.font}>暂无考勤记录</div>
              </div>
            </div>
          );
        }
      } else {
        if (dataAbnormal.length > 0) {
          return (
            <div className={styles.detailsList}>
              {dataAbnormal.map((item, index) => (
                <div className={styles.item} key={index}>
                  <div className={styles.displayDate}>
                    <span>{item.dateDay}</span> <span>{item.week}</span>
                  </div>
                  <div className={styles.work}>
                    <div className={styles.gotoWork}>
                      上班:<span className={item.goState === "正常" ? styles.fontColor : styles.redColor}>{item.goState}</span>
                    </div>
                    <div className={styles.punchTime}>{item.goTime}</div>
                  </div>
                  <div className={styles.work}>
                    <div className={styles.gooffWork}>
                      下班:<span className={item.backState === "正常" ? styles.fontColor : styles.redColor}>{item.backState}</span>
                    </div>
                    <div className={styles.punchTime}>{item.backTime}</div>
                  </div>
                </div>
              ))}
            </div>
          );
        } else {
          return (
            <div className={styles.blankBox}>
              <div className={styles.box}>
                <img className={styles.blankImg} src={data} alt="" />
                <div className={styles.font}>暂无考勤记录</div>
              </div>
            </div>
          );
        }
      }
    };
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.header}>
            <div className={styles.information}>
              <div className={styles.phone}>
                {window.Person.name}
                <span className={styles.phoneClass}>{window.Person.phone}</span>
              </div>
              <div className={styles.department}>{window.Person.section ? window.Person.section : "其他"}</div>
            </div>
            <div className={styles.tabBox}>
              <div onClick={ev => this.showAll(ev)} className={tabIndex === 0 ? styles.currentTab : styles.tab}>
                全部
              </div>
              <div onClick={ev => this.showAbnormal(ev)} className={tabIndex === 1 ? styles.currentTab : styles.tab}>
                异常
              </div>
            </div>
            <div className={styles.month}>
              {monthList.map((item, index) => (
                <div
                  onClick={tabIndex === 0 ? ev => this.getRecords(index) : ev => this.getAbnormal(index)}
                  key={index}
                  className={monthIndex === index ? styles.currentMonth : styles.noMonth}
                >
                  {item}月
                </div>
              ))}
            </div>
          </div>
          <Show />
        </div>
        <BottomBar visible={barState} parent={this} />
        <Toast isShow={tipState} text="资料修改完成" />
      </div>
    );
  }
}
export default PersonalInformation;
