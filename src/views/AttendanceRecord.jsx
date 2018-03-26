import React,{Component} from 'react';
import moment from 'moment';

import styles from '../styles/AttendanceRecord.css';

import XHR from '../utils/request';
import API from '../api/index';

import data from '../asset/statePrompt/data.png';

class AttendanceRecord extends Component{
    constructor() {
        super();
        this.state={
            dataSource:[],              //全部
            dataAbnormal:[],            //异常
            showState:true,             //默认展示全部
            tabIndex:0,                 //选择tab的索引
            monthList:[],               //月份展示
            monthIndex:0,               //选择月份索引
        }
    }
    componentDidMount() {
        document.querySelector('title').innerText = '考勤记录';
        this.getRecords();
        this.showMonth();
        this.showAll(0);
    }
    showMonth() {                    //展示当前及前三月
        var nowMonth = moment().format("M");
        var previous = moment().subtract(1, "months").format("M");
        var penult = moment().subtract(2, "months").format("M");
        var last = moment().subtract(3, "months").format("M");
        var list =[nowMonth,previous,penult,last];
        this.setState({monthList:list});
    }
    showAll(i) {                      //展示所有
        this.setState({showState:true,tabIndex:0,monthIndex:0});
        this.getRecords(i);
    }
    showAbnormal(i) {                 //展示异常
        this.setState({showState:false,tabIndex:1,monthIndex:0});
        this.getAbnormal(i);
    }
    async getRecords(i) {            //切换月份展示记录
        this.setState({monthIndex:i});
        var startTime = '';
        var endTime = '';
        switch(i){                   //动态传参
            case 1:
                startTime = moment().startOf('month').subtract(1, "months").format("YYYY-MM-DD");
                endTime = moment().endOf('month').subtract(1, "months").format("YYYY-MM-DD");
                break;
            case 2:
                startTime = moment().startOf('month').subtract(2, "months").format("YYYY-MM-DD");
                endTime = moment().endOf('month').subtract(2, "months").format("YYYY-MM-DD");
                break;
            case 3:
                startTime = moment().startOf('month').subtract(3, "months").format("YYYY-MM-DD");
                endTime = moment().endOf('month').subtract(3, "months").format("YYYY-MM-DD"); 
                break;
            default:
                startTime = moment().startOf('month').format("YYYY-MM-DD");
                endTime = moment().format("YYYY-MM-DD"); 
        }
        const result = await XHR.post(window.admin + API.getRecords,{
            companyid:this.props.match.params.companyid,
            beginDate:startTime,    
            endDate:endTime,
            userids:this.props.match.params.loginName    
        })
        const dataResult = [];
        
        JSON.parse(result).data.forEach((ev,i) =>{
            dataResult.push({
                dateDay:ev.date.slice(0,10),
                week:ev.week,
                goState:ev.gotoWorkStatus,
                goTime:ev.upWork?ev.upWork:'--:--:--',
                backState:ev.getoffWorkStatus,
                backTime:ev.downWork?ev.downWork:'--:--:--'
            })
        })
        var dataResult1 = dataResult.reverse();
        this.setState({dataSource:dataResult1 || []});
    }
    async getAbnormal(i) {            //获取异常打卡记录
        this.setState({monthIndex:i});
        var startTime = '';
        var endTime = '';
        switch(i){                    //动态传参
            case 1:
                startTime = moment().startOf('month').subtract(1, "months").format("YYYY-MM-DD");
                endTime = moment().endOf('month').subtract(1, "months").format("YYYY-MM-DD");
                break;
            case 2:
                startTime = moment().startOf('month').subtract(2, "months").format("YYYY-MM-DD");
                endTime = moment().endOf('month').subtract(2, "months").format("YYYY-MM-DD");
                break;
            case 3:
                startTime = moment().startOf('month').subtract(3, "months").format("YYYY-MM-DD");
                endTime = moment().endOf('month').subtract(3, "months").format("YYYY-MM-DD");
                break;
            default:
                startTime = moment().startOf('month').format("YYYY-MM-DD");
                endTime = moment().format("YYYY-MM-DD");     
                     
        }
        const result = await XHR.post(window.admin + API.getRecords,{
            companyid:this.props.match.params.companyid,
            beginDate:startTime, 
            endDate:endTime,
            userids:this.props.match.params.loginName,
            abnormity:"abnormity"    
        })
        
        const dataResult = [];
        
        JSON.parse(result).data.forEach((ev,i) =>{
            dataResult.push({
                dateDay:ev.date.slice(0,10),
                week:ev.week,
                goState:ev.gotoWorkStatus,
                goTime:ev.upWork?ev.upWork:'--:--:--',
                backState:ev.getoffWorkStatus,
                backTime:ev.downWork?ev.downWork:'--:--:--'
            })
        })
        var dataResult1 = dataResult.reverse();
        
        this.setState({dataAbnormal:dataResult1 || []});

    }
    render() {
        const {dataSource,dataAbnormal,showState,tabIndex,monthList,monthIndex} = this.state;
        const Show = props =>{
            if(showState === true) {
                if(dataSource.length >0){
                    return (
                        <div className={styles.detailsList}>
                        {
                            dataSource.map((item,index) =>
                                <div className={styles.item} key={index}>
                                    <div className={styles.displayDate}><span>{item.dateDay}</span> <span>{item.week}</span></div>
                                    <div className={styles.work}>
                                        <div className={styles.gotoWork}>上班:<span className={item.goState === '正常' ? styles.fontColor: styles.redColor}>{item.goState}</span></div>
                                        <div className={styles.punchTime}>{item.goTime}</div>
                                    </div>
                                    <div className={styles.work}>
                                        <div className={styles.gooffWork}>下班:<span className={ item.backState === '正常' ? styles.fontColor: styles.redColor}>{item.backState}</span></div>
                                        <div className={styles.punchTime}>{item.backTime}</div>
                                    </div>
                                </div>
                            )
                        }
                    </div>   
                    )
                }else{
                    return (
                        <div className={styles.blankBox}>
                             <div className={styles.box}>
                                <img className={styles.blankImg} src={data} alt='' />
                                <div className={styles.font}>暂无考勤记录</div>
                             </div>
                        </div>
                    )
                }
            }else{
                if(dataAbnormal.length>0) {
                    return (
                        <div className={styles.detailsList}>
                        {
                            dataAbnormal.map((item,index) =>
                                <div className={styles.item} key={index}>
                                    <div className={styles.displayDate}><span>{item.dateDay}</span> <span>{item.week}</span></div>
                                    <div className={styles.work}>
                                        <div className={styles.gotoWork}>上班:<span className={item.goState === '正常' ? styles.fontColor: styles.redColor}>{item.goState}</span></div>
                                        <div className={styles.punchTime}>{item.goTime}</div>
                                    </div>
                                    <div className={styles.work}>
                                        <div className={styles.gooffWork}>下班:<span className={ item.backState === '正常' ? styles.fontColor: styles.redColor}>{item.backState}</span></div>
                                        <div className={styles.punchTime}>{item.backTime}</div>
                                    </div>
                                </div>
                            )
                        }
                        </div>   
                    )
                }else{
                    return (
                        <div className={styles.blankBox}>
                             <div className={styles.box}>
                                <img className={styles.blankImg} src={data} alt='' />
                                <div className={styles.font}>暂无考勤记录</div>
                             </div>
                        </div>
                    )
                }
               
            }
        }
        return(
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.title}>
                        <div onClick={ev =>this.showAll(0)} className={tabIndex === 0 ? styles.currentTab:styles.tab}>全部</div>
                        <div onClick={ev =>this.showAbnormal(0)} className={tabIndex === 1 ? styles.currentTab:styles.tab}>异常</div>
                    </div>    
                </div>
                <div className={styles.month}>
                   {
                       monthList.map((item,index) =><div key={index} onClick={ tabIndex === 0?ev =>this.getRecords(index):ev =>this.getAbnormal(index)} className={monthIndex === index ? styles.currentMonth:styles.noMonth}>{item}月</div>)
                   } 
                </div>
                <Show></Show>          
            </div>
        )
    }
}
export default AttendanceRecord;