import React,{Component} from 'react';
import Switch from 'rc-switch';
import styles from '../styles/CardReminding.css';

import XHR from '../utils/request';
import API from '../api/index';

import blueTop from '../asset/manager/triangle-top.png';
import grayDown from '../asset/ico/icon.png';

const Icon = ({direction})  => {
    if (direction === true) {
      return <img className={styles.icon} src={blueTop} alt=""/>;
    } else {
      return <img className={styles.icon} src={grayDown} alt=""/>;
    }
}

const TimeList =({parent,visible,up})  => {
    const list = ['3','5','10','20','30'];
    if (visible) {
        return (
            <div className={styles.mask} onClick={ev =>parent.hideTimeList(ev)}>
                <div className={styles.maskBox}>
                    <div className={styles.timeSlot}>
                    {
                        list.map((item,index) =><div className={ up === item?styles.selectSingle:styles.single} key={index} onClick={ev =>parent.selectTime(index)}>前{item}分钟</div>)
                    }
                    </div>
                </div>
            </div>
        );
    } else {
      return null;
    }
}

const TimeSlot = ({parent,visible,down})  => {
    const list = ['3','5','10','20','30'];
    if (visible) {
        return (
            <div className={styles.maskCopy} onClick={ev =>parent.hideTimeSlot(ev)}>
                <div className={styles.maskBox}>
                    <div className={styles.timeDuan}>
                    {
                        list.map((item,index) =><div className={down === item?styles.selectSingle:styles.single} key={index} onClick={ev =>parent.choiceTime(index)}>后{item}分钟</div>)
                    }
                    </div>
                </div>
            </div>
        );
    } else {
      return null;
    }
}

class CardReminding extends Component {
    constructor() {
        super();
        this.state={
            timeIndex:'',           //上时间表列表
            iconTop:false,          //上图片状态
            iconDown:false,         //下图片状态
            timeList:false,
            timeSlot:false,
            upTime:'',              //上时间
            downTime:'',            //下时间
            upSwitch:'',            //上状态
            downSwitch:'',          //下状态
            dataSource:{}
        }
    }
    componentDidMount() {
        document.querySelector('title').innerText = '打卡提醒';
        this.getUserRemind();
    }
    showTimeList() {                       //显示1
        this.setState({timeList:true,iconTop:true});
    }
    hideTimeList() {                       //隐藏1
        this.setState({timeList:false,iconTop:false});
    }
    showTimeSlot(){                        //显示2
        this.setState({timeSlot:true,iconDown:true})
    }
    hideTimeSlot(){                        //隐藏2
        this.setState({timeSlot:false,iconDown:false})
    }
    selectTime(i) {                       //选择分钟数NO.1
        const list = ['3','5','10','20','30'];
        this.setState({upTime:list[i]});
        this.hideTimeList();
        this.preClockInRemind();
    }
    choiceTime(i) {                       //选择分钟数NO.2
        const list = ['3','5','10','20','30'];
        this.setState({downTime:list[i]});
        this.hideTimeSlot();
        this.preClockInRemind();
    }
    toggleSwitch() {                     //Switch切换1
        if(this.state.upSwitch === '0') {
            this.setState({upSwitch:'1'})
        }else{
            this.setState({upSwitch:'0'}) 
        }
        this.preClockInRemind();
    }
    changeSwitch() {                     //Switch切换2
        if(this.state.downSwitch === '0') {
            this.setState({downSwitch:'1'})
        }else{
            this.setState({downSwitch:'0'}) 
        }
        this.preClockInRemind();
    }
    async getUserRemind() {              //初始化提醒设置
        const result = await XHR.post(window.admin + API.getUserRemind,{loginName:window.sessionStorage.getItem('loginName')});
        if(JSON.parse(result).data) {
            this.setState({
                upTime:JSON.parse(result).data.upTime,
                downTime:JSON.parse(result).data.downTime,
                upSwitch:JSON.parse(result).data.upSwitch,
                downSwitch:JSON.parse(result).data.downSwitch,
                dataSource:JSON.parse(result).data
            }); 
        }else{
            this.setState({upTime:'5',downTime:'5',upSwitch:'1',downSwitch:'1',dataSource:{}});
        }
    }
    preClockInRemind() {
        setTimeout(()=>this.clockInRemind(), 0);
    }
    async clockInRemind() {              //设置提醒设置
        const result = await XHR.post(window.admin + API.clockInRemind,{
            loginName:window.sessionStorage.getItem('loginName'),
            upTime:this.state.upTime,
            upSwitch:this.state.upSwitch,
            downTime:this.state.downTime,
            downSwitch:this.state.downSwitch,
            id:this.state.dataSource.id
        });
    }
    render() {
        const {upTime,upSwitch,downTime,downSwitch,timeList,timeSlot,iconDown,iconTop} = this.state;
        return(
            <div className={styles.container}>
                <div className={styles.content}>
                    <div className={styles.item}>
                        <div>
                            <div className={styles.work}>上班打卡提醒</div>
                            <div onClick={ev =>this.showTimeList(ev)} className={ iconTop === true ? styles.blueRemind:styles.workRemind}>上班前{upTime}分钟打卡提醒
                               <Icon direction={iconTop}></Icon>
                            </div>
                        </div>
                        <Switch onChange={ev =>this.toggleSwitch(ev)} checked={upSwitch === '0' ? true:false}></Switch>
                    </div>
                    <div className={styles.itemOne}>
                        <div>
                            <div className={styles.work}>下班打卡提醒</div>
                            <div onClick={ev =>this.showTimeSlot(ev)} className={ iconDown === true ? styles.blueRemind:styles.workRemind}>下班后{downTime}分钟打卡提醒
                               <Icon direction={iconDown}></Icon>
                            </div>
                        </div>
                        <Switch onChange={ev =>this.changeSwitch(ev)} checked={downSwitch === '0' ? true:false}></Switch>
                    </div>
                    <TimeList parent={this} visible={timeList} up={upTime}></TimeList>
                    <TimeSlot parent={this} visible={timeSlot} down={downTime}></TimeSlot>
                </div>
            </div>
        )
    }
}

export default CardReminding;