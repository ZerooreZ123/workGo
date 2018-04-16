import React, { Component } from 'react';
import DayPicker from 'react-day-picker';
import Toast from '../components/Toast';
import Alert from '../components/Alert';

import styles from '../styles/ReleaseAnnouncement.css';

import XHR from '../utils/request';
import API from '../api/index';

import X from '../asset/ico/ClearButton.png';
import addphoto from '../asset/ico/photo.png';
import down from '../asset/manager/downBlue.png';

window.tempStorage = {};

class ReleaseAnnouncement extends Component {
    constructor() {
        super();
        this.state = {
            tipState2: false,
            tipState1: false,
            tipState: false,           //tip状态
            secondTime: (new Date()).getTime(),             //秒
            alertState1: false,
            alertState: false,            //alert状态
            // iconState:false,           //图标状态
            chooseDay: '',             //结束选择时间
            selectedDay: '',           //开始选择时间
            mask: false,               //日历开始遮罩
            copyMask: false,
            imgSrcConcat: [],          //拼接字符串
            imgBox:JSON.parse(window.sessionStorage.getItem('img')) || [],                                              //图片盒子
            announcementTitle: window.sessionStorage.getItem('title') || '',
            announcementContent: window.sessionStorage.getItem('content') || ''
        };
    }
    componentDidMount() {
        document.querySelector('title').innerText = '发布公告';
        this.startDate();
        this.isBack = false;
        window.addEventListener("popstate", this.back, false);
    }
    componentWillUnmount() {
        window.removeEventListener('popstate', this.back, false);
    }

    historyAnnouncement() {                    //跳转至历史记录
        window.sessionStorage.setItem('title', this.state.announcementTitle);
        window.sessionStorage.setItem('content', this.state.announcementContent);
        window.sessionStorage.setItem('img', JSON.stringify(this.state.imgBox))
        this.isBack = true;
        this.props.history.push('/historyAnnouncement');
    }
    back = () => {
        if (!this.isBack) {
            window.sessionStorage.removeItem('title', this.state.announcementTitle);
            window.sessionStorage.removeItem('content', this.state.announcementContent);
            window.sessionStorage.removeItem('img', JSON.stringify(this.state.imgBox))
            if (this.state.announcementTitle !== '' || this.state.announcementContent !== '' || this.state.imgBox.length > 0) {
                this.setState({ alertState: true });
                this.props.history.push(null, null, document.URL);
            }
        }
    }
    cancelRelease() {
        if (this.state.announcementTitle !== '' || this.state.announcementContent !== '' || this.state.imgBox.length > 0) {
            this.setState({ alertState: true });
        } else {
            this.isBack = true;
            this.props.history.goBack();
        }
    }
    selectBtn(dataState) {
        if (dataState) {
            window.sessionStorage.setItem('title', this.state.announcementTitle);
            window.sessionStorage.setItem('content', this.state.announcementContent);
            window.sessionStorage.setItem('img', JSON.stringify(this.state.imgBox))
        } else {
            window.sessionStorage.removeItem('title', this.state.announcementTitle);
            window.sessionStorage.removeItem('content', this.state.announcementContent);
            window.sessionStorage.removeItem('img', JSON.stringify(this.state.imgBox))
        }
        this.isBack = true;
        this.props.history.goBack();
    }

    startDate() {
        var date = new Date();
        this.setState({ selectedDay: this.addZero(date.getFullYear()) + '-' + this.addZero(date.getMonth() + 1) + '-' + this.addZero(date.getDate()) });
        this.setState({ chooseDay: this.addZero(date.getFullYear()) + '-' + this.addZero(date.getMonth() + 1) + '-' + this.addZero(date.getDate()) });
    }
    handleDayClick(day) {
        const myDate = new Date(day);
        const R1 = this.addZero(myDate.getFullYear()) + '' + this.addZero(myDate.getMonth() + 1) + '' + this.addZero(myDate.getDate()) + '';
        const R2 = this.addZero(new Date().getFullYear()) + '' + this.addZero(new Date().getMonth() + 1) + '' + this.addZero(new Date().getDate()) + '';
        console.log(R1,R2)
        if (parseInt(R2,10) <= parseInt(R1,10)) {
            this.setState({ selectedDay: this.addZero(myDate.getFullYear()) + '-' + this.addZero(myDate.getMonth() + 1) + '-' + this.addZero(myDate.getDate()) });
            this.setState({ copyMask: false });
            this.hideMask1();
        } else {
            this.setState({ tipState2: true })
            setTimeout(() => {
                this.setState({ tipState2: false })
            }, 1500)
        }
    }
    selectDayClick(day) {
        const myDate = new Date(day);
        const R3 = this.addZero(myDate.getFullYear()) + '' + this.addZero(myDate.getMonth() + 1) + '' + this.addZero(myDate.getDate()) + '';
        const R4 = this.state.selectedDay.replace(/-/g, '');
        console.log(R3,R4);
        if (parseInt(R4,10) <= parseInt(R3,10)) {
            this.setState({ chooseDay: this.addZero(myDate.getFullYear()) + '-' + this.addZero(myDate.getMonth() + 1) + '-' + this.addZero(myDate.getDate()) });
            this.setState({ copyMask: false });
            this.hideMask2();
        } else {
            this.hideMask2();
            this.setState({ tipState: true });
            setTimeout(() => {
                this.setState({ tipState: false })
            }, 2000)
        }
    }
    preClockInRemind(day) {
        setTimeout(() => this.handleDayClick(day), 0);
    }
    selectTime(day) {
        setTimeout(() => this.selectDayClick(day), 0);
    }
    showMask1() {
        this.setState({ mask: true })
    }
    hideMask1() {
        this.setState({ mask: false });
    }
    showMask2() {
        this.setState({ copyMask: true })
    }
    hideMask2() {
        this.setState({ copyMask: false });
    }
    allMask() {
        this.setState({ copyMask: false, mask: false })
    }
    addZero(s) {                     //时间格式转化
        return s < 10 ? '0' + s: s;
    }
    delete(i) {
        this.state.imgBox.splice(i, 1);
        this.state.imgSrcConcat.splice(i, 1);
        this.setState({ imgBox: this.state.imgBox });
        this.setState({ imgSrcConcat: this.state.imgSrcConcat });
    }
    getBase64(callback) {            //获取图片
        var data = this.refs.files.files;
        var file = [];
        for (var i in data) {
            if (data.hasOwnProperty(i)) {
                file.push(data[i])
            }
        }
        file.forEach(el => {
            if (window.FileReader) {
                var fr = new FileReader();
                fr.onloadend = function (e) {
                    var result = e.target.result.split(",");
                    callback(result[1])
                }
                fr.readAsDataURL(el);
            } else {
                alert("NO FileReader!");
            }
        })
    }
    getTitle(ev) {                             //获取标题
        this.setState({ announcementTitle: ev.target.value });
    }
    getContent(ev) {                           //获取内容
        this.setState({ announcementContent: ev.target.value });
    }
    async upload(stringBase64) {               //选择图片
        const result = await XHR.post(window.admin + API.upload, { imgStr: stringBase64 });
        if (JSON.parse(result).success === 'T') {
            const imgSrc = window.server + JSON.parse(result).data.slice(1);
            this.state.imgSrcConcat.push(JSON.parse(result).data)
            this.state.imgBox.push(imgSrc);

            if (this.state.imgBox.length > 9) {

                this.setState({ imgBox: this.state.imgBox.slice(0, 9), imgSrcConcat: this.state.imgSrcConcat.slice(0, 9), tipState1: true });
                setTimeout(() => {
                    this.setState({ tipState1: false })
                }, 2000)
            } else {
                this.setState({ imgBox: this.state.imgBox });
                this.setState({ imgSrcConcat: this.state.imgSrcConcat });
            }
        } else {
            alert(JSON.parse(result).msg)
        }
    }
    async announce() {                         //发布公告
        if (this.state.imgBox.length > 0) {
            const result = await XHR.post(window.admin + API.announce, {
                userid: window.sessionStorage.getItem('id'),
                companyid: window.sessionStorage.getItem('companyid'),
                title: this.state.announcementTitle,
                content: this.state.announcementContent,
                image: this.state.imgSrcConcat.join(''),
                startDate: this.state.selectedDay + " 00:00:00",
                endDate: this.state.chooseDay + " 23:59:59"
            })
            if (JSON.parse(result).success === 'T') {
                window.sessionStorage.setItem('backTip', true)
                this.isBack = true;
                this.props.history.push('/historyAnnouncement')
            } else {
                alert(JSON.parse(result).msg)
            }
        } else {
            const result = await XHR.post(window.admin + API.announce, {
                userid: window.sessionStorage.getItem('id'),
                companyid: window.sessionStorage.getItem('companyid'),
                title: this.state.announcementTitle,
                content: this.state.announcementContent,
                startDate: this.state.selectedDay + " 00:00:00",
                endDate: this.state.chooseDay + " 23:59:59"
            })
            if (JSON.parse(result).success === 'T') {
                // alert("发布成功");
                window.sessionStorage.setItem('backTip', true)
                this.isBack = true;
                this.props.history.push('/historyAnnouncement')
            } else {
                alert(JSON.parse(result).msg)
            }
        }
    }
    render() {
        const { mask, copyMask, imgBox, alertState, tipState, tipState1, tipState2 } = this.state;
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <div onClick={ev => this.cancelRelease(ev)} className={styles.cancel}>取消</div>
                    <div onClick={ev => this.announce(ev)} className={this.state.chooseDay ? styles.release : styles.noRelease}>发布</div>
                </div>
                <div className={styles.content}>
                    <div className={styles.box}>
                        <input className={styles.inputBox} type="text" placeholder="公告标题" onChange={ev => this.getTitle(ev)} value={this.state.announcementTitle} />
                    </div>
                    <textarea className={styles.inputBlock} placeholder="公告内容" onChange={ev => this.getContent(ev)} value={this.state.announcementContent}></textarea>
                    <div className={styles.imgBox}>
                        {
                            imgBox.map((item, index) => (
                                <div className={styles.singleImg} key={index}>
                                    <img className={styles.img} src={item} alt="" />
                                    <img onClick={ev => this.delete(index)} className={styles.x} src={X} alt="" />
                                </div>

                            ))
                        }
                    </div>
                </div>
                <div className={styles.dateBox}>
                    <div className={styles.releaseTime}>公告起止日期:<span onClick={ev => this.showMask1(ev)} className={styles.buttonSlect}>{this.state.selectedDay}</span><img className={styles.icon} src={down} alt="" />-<span onClick={ev => this.showMask2(ev)} className={styles.buttonSlect1}>{this.state.chooseDay}</span><img className={styles.icon} src={down} alt="" /></div>
                </div>
                <div className={styles.footer}>
                    <div onClick={ev => this.historyAnnouncement(ev)} className={styles.history}>历史公告</div>
                    <div className={styles.photoBox}>
                        <img className={styles.addphoto} src={addphoto} alt="" />
                        <input ref="files" onClick={ev => this.allMask(ev)} onChange={ev => this.getBase64(base64 => this.upload(base64))} type="file" className={styles.photoBtn} multiple="multiple" />
                    </div>
                    {/* <div onClick={ev =>this.showMask2(ev)} className={styles.selectDate}>选择起止日期<Icon direction={iconState}/></div> */}
                </div>
                <div className={mask === false ? styles.hideMask : styles.showMask}>
                    <div className={styles.maskHide} onClick={ev => this.hideMask1(ev)}></div>
                    <div className={styles.maskBox}>
                        <DayPicker onDayClick={ev => this.preClockInRemind(ev)} />
                    </div>
                </div>
                <div className={copyMask === false ? styles.hideMask : styles.showMask}>
                    <div className={styles.maskHide} onClick={ev => this.hideMask2(ev)}></div>
                    <div className={styles.maskBox}>
                        <DayPicker onDayClick={ev => this.selectTime(ev)} />
                    </div>
                </div>
                <Alert text='是否保存草稿' onSelect={ev => this.selectBtn(ev)} isShow={alertState} />
                <Toast isShow={tipState} text="结束日期必须在开始日期之后或同一天" />
                <Toast isShow={tipState2} text="请勿选择当日之前日期" />
                <Toast isShow={tipState1} text="只可上传前9张图片哦" />
            </div>
        )
    }
}

export default ReleaseAnnouncement;