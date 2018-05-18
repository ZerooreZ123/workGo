import React, { Component } from "react";
import styles from "../styles/AnnouncementDetails.css";

import XHR from "../utils/request";
import API from "../api/index";

class AnnouncementDetails extends Component {
  constructor() {
    super();
    this.state = {
      startDate: "",
      endDate: "",
      dataSource: {},
      imgBox: []
    };
  }
  componentDidMount() {
    document.querySelector("title").innerText = "公告详情";
    this.noticeDetails();
  }
  async noticeDetails() {
    const result = await XHR.post(window.admin + API.noticeDetails, { id: window.sessionStorage.getItem("listId") });
    this.setState({
      dataSource: JSON.parse(result).data,
      startDate: JSON.parse(result).data.startDate.slice(0, 10),
      endDate: JSON.parse(result).data.endDate.slice(0, 10)
    });
    if (JSON.parse(result).data.image) {
      const ret = JSON.parse(result)
        .data.image.slice(1)
        .split("|");
      this.setState({ imgBox: ret });
    }
  }
  render() {
    const { dataSource, imgBox, startDate, endDate } = this.state;
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.caption}>{dataSource.title}</div>
          <div className={styles.text}>{dataSource.content}</div>
          <div className={styles.photoBox}>{imgBox.map((item, index) => <img key={index} src={window.imgServer + item} alt="" />)}</div>
          <div className={styles.timeShow}>
            <span>{startDate}</span>至<span>{endDate}</span>
          </div>
        </div>
      </div>
    );
  }
}

export default AnnouncementDetails;
