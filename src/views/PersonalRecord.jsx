//员工考勤记录（普通管理员）
import React, { Component } from 'react';
import Toast from '../components/Toast';
import DayPicker from 'react-day-picker';
import Picker from 'react-mobile-picker';
import moment from 'moment';

import styles from '../styles/PersonalRecord.css';

import XHR from '../utils/request';
import API from '../api/index';

import data from '../asset/statePrompt/data.png';
import top from '../asset/manager/triangle-top.png';
import down from '../asset/manager/downBlue.png'
import spread from '../asset/manager/spread.png'
import search from '../asset/manager/search.png';


const NoData =({parent,selectDate,departmentName,maskState}) =>{
    return (
        <div className={styles.blankBox}>
             <div className={styles.box}>
                <img className={styles.blankImg} src={data} alt='' />
                <div className={styles.font}>暂无考勤记录</div>
             </div>
             <div className={styles.footer}>
                <div className={styles.brief}>
                    <div className={styles.selectBox} onClick={ev => parent.showMask(ev)}><span>{selectDate}</span>/<span>{window.Person.name}</span></div>
                    <img onClick={maskState === 1?ev => parent.hideMask(ev):ev => parent.showMask(ev)} className={styles.top} src={maskState === 1?down:top} alt="" />
                </div>
                <div onClick={ev => parent.export(ev)} className={maskState === 1?styles.exportProhibit:styles.exportData}>导出数据</div>
             </div>
        </div>
    )
}
const MaskAttendance = ({ list, parent, tabIndex, divisionIndx, optionGroups, valueGroups, Value, dateIndex,optionTeams,valueTeams}) => {   //部门列表组件
    if (tabIndex === 1) {
        return (
            <div className={styles.departmentBox}>
                {
                    list.map((item, index) =>
                        <div onClick={ev => parent.clickTerm(index)} className={divisionIndx === index ? styles.selectTerm : styles.term} key={index}>{item.name}</div>
                    )
                }
                <div className={styles.clearBoth}></div>
            </div>
        );
    } else {
        if (dateIndex === 0) {
            return (
                <div className={styles.maskDate}>
                    <DayPicker onDayClick={ev =>parent.preClockInRemind(ev)} />
                </div>
            )
        } else if (dateIndex === 1) {
            return (
                <div>
                    <Picker
                        optionGroups={optionGroups}
                        valueGroups={valueGroups}
                        onChange={parent.handleChange}
                    />
                </div>
            )
        } else {
            return (
                <div>
                    <Picker
                        optionGroups={optionTeams}
                        valueGroups={valueTeams}
                        onChange={parent.selectChange}
                    />
                </div>
            )
        }    
    }
}
class PersonalRecord extends Component {
    constructor() {
        super();
        this.state = {
            tipState1:false,
            tipState:false,        //提示状态
            secondTime:(new Date()).getTime(),
            Value: '',
            date: new Date(),
            nameId:window.Person.userid,                   //用户Id
            maskDate: false,             //默认不显示日历
            currentIndex: 0,             //日月年展示模块索引
            tabIndex: 0,                 //选择tab的索引
            startTime: moment().format('YYYY-MM-DD'),     //开始时间(传参)
            endTime: moment().format('YYYY-MM-DD'),       //结束时间(传参)
            record: [],                  //展示打卡记录
            abnormalRecord:[],           //异常打卡记录
            personData:[],                //个人打卡数据
            maskToggle: 0,                //默认不展示mask
            selectDate: moment().format('YYYY-MM-DD'),   //日历选择
            selectMonth:moment().format("YYYY-MM"),                //月份选择
            selectYear:moment().format("YYYY"),                 //年份选择
            valueGroups: {                //月组件
                data: moment().format('YYYY-MM')
            },
            optionGroups: {
                data: []
            },
            valueYears:{                 //年组件
                data:moment().format('YYYY')
            },
            optionYears:{
                data:[]
            }

        }
    }
    componentDidMount() {
        document.querySelector('title').innerText = window.Person.name;
        this.selectState();
    }
    componentWillUnmount(){
        var Result = {
            tipState1:this.state.tipState1,
            tipState:this.state.tipState,   
            secondTime:this.state.secondTime,
            Value:this.state.Value,
            date:this.state.date,
            nameId:this.state.nameId,
            maskDate:this.state.maskDate,
            currentIndex:this.state.currentIndex,
            tabIndex:this.state.tabIndex,
            startTime:this.state.startTime,
            endTime:this.state.endTime,
            record:this.state.record,
            abnormalRecord:this.state.abnormalRecord,
            personData:this.state.personData,
            maskToggle:this.state.maskToggle,
            selectDate:this.state.selectDate,
            selectMonth:this.state.selectMonth,
            selectYear:this.state.selectYear,
            optionGroups:{data:this.state.optionGroups.data},
            optionYears:{data:this.state.optionYears.data},
            valueGroups:{data:this.state.valueGroups.data},
            valueYears:{data:this.state.valueYears.data},
        };
        window.sessionStorage.setItem('personResult',JSON.stringify(Result));
    }

    selectState() {
        var test=JSON.parse(window.sessionStorage.getItem('personResult'));
        if(test){
            this.setState({
                tipState1:test.tipState1,
                tipState:test.tipState,   
                secondTime:test.secondTime,
                Value:test.Value,
                date:test.date,
                nameId:test.nameId,
                maskDate:test.maskDate,
                currentIndex:test.currentIndex,
                tabIndex:test.tabIndex,
                startTime:test.startTime,
                endTime:test.endTime,
                record:test.record,
                abnormalRecord:test.abnormalRecord,
                personData:test.personData,
                maskToggle:test.maskToggle,
                selectDate:test.selectDate,
                selectMonth:test.selectMonth,
                selectYear:test.selectYear,
                optionGroups:{data:test.optionGroups.data},
                optionYears:{data:test.optionYears.data},
                valueGroups:{data:test.valueGroups.data},
                valueYears:{data:test.valueYears.data},
            })
        }else{
            this.setState({
                tipState1:false,
                tipState:false,        //提示状态
                secondTime:(new Date()).getTime(),
                Value: '',
                date: new Date(),
                nameId:window.Person.userid,                   //用户Id
                maskDate: false,             //默认不显示日历
                currentIndex: 0,             //日月年展示模块索引
                tabIndex: 0,                 //选择tab的索引
                startTime: moment().format('YYYY-MM-DD'),     //开始时间(传参)
                endTime: moment().format('YYYY-MM-DD'),       //结束时间(传参)
                record: [],                  //展示打卡记录
                abnormalRecord:[],           //异常打卡记录
                personData:[],                //个人打卡数据
                maskToggle: 0,                //默认不展示mask
                selectDate: moment().format('YYYY-MM-DD'),   //日历选择
                selectMonth:moment().format("YYYY-MM"),                //月份选择
                selectYear:moment().format("YYYY"),                 //年份选择
                valueGroups: {                //月组件
                    data: moment().format('YYYY-MM')
                },
                optionGroups: {
                    data: []
                },
                valueYears:{                 //年组件
                    data:moment().format('YYYY')
                },
                optionYears:{
                    data:[]
                }
           })
           this.getPersonRecords(this.state.selectDate,this.state.selectDate,window.Person.userid);
        }
    }
    getYear() {                           //获取年份
        var myDate = new Date();
        var startYear = myDate.getFullYear()-2;//起始年份
        var endYear = myDate.getFullYear() + 1;//结束年份
        var list = []
        for (var i = startYear; i < endYear; i++) {
            list.push(i.toString());
        }
        this.setState({
            optionYears: {
                data:list
            }
        })
      
    }
    getMonth() {                          //获取年+月份
        var myDate = new Date();
        var startYear = myDate.getFullYear() - 2;//起始年份
        var endYear = myDate.getFullYear() + 1;//结束年份
        var list = []
        for (var i = startYear; i < endYear; i++) {
            list.push(i.toString());
        }
        var Months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
        var result = [];
        list.forEach(ev =>
            Months.forEach(el => {
                result.push(ev + '-' + el )
            })
        )
        var r = []
        result.forEach(e =>{
            if(this.state.secondTime>new Date(e).getTime()){
                r.push(e)
            }
        })
        this.setState({
            optionGroups: {
                data: r
            }
        })
    }
    search() {                     //跳转至搜索页面
        this.props.history.push('/search');
    }
    export() {                       //跳转至导出页面
        if(this.state.maskToggle === 0){
            if(this.state.currentIndex === 0) {     //导出日
                window.Data = {
                    time:this.state.selectDate,
                    userids:this.state.nameId
                }
                this.props.history.push('/personExport');
            }else if(this.state.currentIndex === 1) { //导出月           
                    window.Data = {
                        time:this.state.selectMonth,
                        userids:this.state.nameId
                    }
                    this.props.history.push('/personExport'); 
            }else{                                  //导出年
                    window.Data = {
                        time:this.state.selectYear,
                        userids:this.state.nameId
                    }
                    this.props.history.push('/personExport'); 
            }
        }else{
            return false
        }
    }
    selectTime(i) {                  //设置日月年展示模块索引值
        this.setState({ currentIndex: i });
        if (i === 0) {               //日
            this.setState({selectDate:this.state.selectDate})
            if(this.state.tabIndex === 0) {   //全部
                this.getPersonRecords(this.state.selectDate,this.state.selectDate,window.Person.userid);
            }else{                            //异常
                this.getPersonRecords(this.state.startTime,this.state.endTime,window.Person.userid,'abnormity');
            }
        } else if (i === 1) {        //月
            this.setState({selectMonth:this.state.selectMonth});
            if(this.state.tabIndex === 0) {   //全部
                this.getPersonRecords(this.state.valueGroups.data + '-1',moment(this.state.valueGroups.data).endOf('month').format('YYYY-MM-DD'),window.Person.userid);
                this.getMonth();
            }else{                            //异常
                this.getPersonRecords(this.state.valueGroups.data + '-1',moment(this.state.valueGroups.data).endOf('month').format('YYYY-MM-DD'),window.Person.userid,'abnormity');
                this.getMonth();
            }     
        }else{                      //年
            this.setState({selectYear:this.state.selectYear});
            if(this.state.tabIndex === 0){    //全部
                if((new Date()).getFullYear() == this.state.valueYears.data ){
                    this.getPersonRecords(this.state.valueYears.data +'-01-01',moment().format("YYYY-MM-DD"),window.Person.userid);
                }else{
                    this.getPersonRecords(this.state.valueYears.data +'-01-01',this.state.valueYears.data + '-12-31',window.Person.userid);
                }
                this.getYear();
            }else{                           //异常
                if((new Date()).getFullYear() == this.state.valueYears.data ){
                    this.getPersonRecords(this.state.valueYears.data +'-01-01',moment().format("YYYY-MM-DD"),window.Person.userid,'abnormity');
                }else{
                    this.getPersonRecords(this.state.valueYears.data +'-01-01',this.state.valueYears.data + '-12-31',window.Person.userid,'abnormity');
                }     
                this.getYear(); 
            }  
        }
    }
    handleDayClick(day) {
        var d = new Date(day);
        var dateTime = this.addZero(d.getFullYear()) + '-' + this.addZero((d.getMonth() + 1)) + '-' + this.addZero(d.getDate());
        if(this.state.secondTime >= (new Date(dateTime)).getTime()){
           this.setState({selectDate:dateTime});
        }else{
            this.setState({tipState:true})
            setTimeout(()=>{
                this.setState({tipState:false})
            },1500)
        }
    }
    preClockInRemind(day) {         //日历选择
        setTimeout(()=>this.handleDayClick(day), 0);
    }
    handleChange = (name, value) => { //月日期选择
        this.setState({ valueGroups: { data: value } });
    }
    selectChange = (name,value) => {  //年日期选择
        this.setState({ valueYears: { data: value } });
    }
    addZero(s) {                     //时间格式转化
        return s < 10 ? '0' + s: s;
    }
    showMask() {                     //显示mask  
        this.setState({ maskToggle: 1 })
    }
    hideMask() {                     //隐藏mask
        this.setState({ maskToggle: 0 });
    }
    showAll() {                      //展示所有
        this.setState({ showState: 0 ,tabIndex: 0 });
        if(this.state.currentIndex === 0){                  //日
            this.getPersonRecords(this.state.selectDate,this.state.selectDate,window.Person.userid);
        }else if(this.state.currentIndex === 1) {           //月
            this.getPersonRecords(this.state.valueGroups.data + '-1',moment(this.state.valueGroups.data).endOf('month').format('YYYY-MM-DD'),window.Person.userid)
        }else{                                              //年
            if((new Date()).getFullYear() == this.state.valueYears.data ){
                this.getPersonRecords(this.state.valueYears.data +'-01-01',moment().format("YYYY-MM-DD"),window.Person.userid);
            }else{
                this.getPersonRecords(this.state.valueYears.data +'-01-01',this.state.valueYears.data + '-12-31',window.Person.userid);
            }
        }
    }
    showAbnormal() {                 //展示异常
        this.setState({ showState: 1,tabIndex: 1  });
        if(this.state.currentIndex === 0) {                 //日
            this.getPersonRecords(this.state.selectDate,this.state.selectDate,window.Person.userid,'abnormity');
        }else if(this.state.currentIndex === 1){            //月
            this.getPersonRecords(this.state.valueGroups.data + '-1',moment(this.state.valueGroups.data).endOf('month').format('YYYY-MM-DD'),window.Person.userid,'abnormity')
        }else{                                              //年
            if((new Date()).getFullYear() == this.state.valueYears.data ){
                this.getPersonRecords(this.state.valueYears.data +'-01-01',moment().format("YYYY-MM-DD"),window.Person.userid,'abnormity');
            }else{
                this.getPersonRecords(this.state.valueYears.data +'-01-01',this.state.valueYears.data + '-12-31',window.Person.userid,'abnormity');
            }           
        }
        
    }
    determineDepartment() {    //确认选择
        if(this.state.currentIndex === 0) {      //日子
            if(this.state.tabIndex === 0){       //全部
                this.getPersonRecords(this.state.selectDate,this.state.selectDate,window.Person.userid);
                this.hideMask();
            }else{                               //异常
                this.getPersonRecords(this.state.selectDate,this.state.selectDate,window.Person.userid,'abnormity');
                this.hideMask();
            } 
        }else if(this.state.currentIndex === 1) { //月期
            if(this.state.secondTime >=(new Date(this.state.valueGroups.data).getTime())) {
                this.setState({selectMonth:this.state.valueGroups.data})
                if(this.state.tabIndex === 0){       //全部
                    this.getPersonRecords(this.state.valueGroups.data + '-1',moment(this.state.valueGroups.data).endOf('month').format('YYYY-MM-DD'),window.Person.userid);
                    this.hideMask();
                }else{                               //异常
                    this.getPersonRecords(this.state.valueGroups.data + '-1',moment(this.state.valueGroups.data).endOf('month').format('YYYY-MM-DD'),window.Person.userid,'abnormity');
                    this.hideMask();
                } 
            }else{
                this.setState({tipState1:true})
                setTimeout(()=>{
                    this.setState({tipState1:false})
                },1500)
            }
        }else{                                    //年份
            this.setState({selectYear:this.state.valueYears.data})
            if(this.state.tabIndex === 0){       //全部
                if((new Date()).getFullYear() == this.state.valueYears.data ){
                    this.getPersonRecords(this.state.valueYears.data +'-01-01',moment().format("YYYY-MM-DD"),window.Person.userid);
                }else{
                    this.getPersonRecords(this.state.valueYears.data +'-01-01',this.state.valueYears.data + '-12-31',window.Person.userid);
                }
                this.hideMask();
            }else{   
                if((new Date()).getFullYear() == this.state.valueYears.data ){
                    this.getPersonRecords(this.state.valueYears.data +'-01-01',moment().format("YYYY-MM-DD"),window.Person.userid,'abnormity');
                }else{
                    this.getPersonRecords(this.state.valueYears.data +'-01-01',this.state.valueYears.data + '-12-31',window.Person.userid,'abnormity');
                }                            //异常
                this.hideMask();
            } 
        }
    }
    async getPersonRecords(startTime,endTime,userId,abnormity) {            //获取个人打卡记录
        const result = await XHR.post(window.admin+ API.getRecords,{
            companyid:window.sessionStorage.getItem("companyid"),
            beginDate:startTime,    
            endDate:endTime,
            userids:userId,
            abnormity:abnormity
            
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
        this.setState({personData:dataResult1 || []});
    }
    render() {
        const { currentIndex,tabIndex, section, departmentIndex, toggleIndex, maskToggle, optionGroups, valueGroups,selectYear,selectDate,valueYears,optionYears,abnormalRecord,personData,selectMonth,tipState,tipState1} = this.state;
        const timeSlot = ['日', '月', '年'];
        const DateChange = props => {              //日期显示内容
            if (currentIndex === 0) {              //日
                    if(personData.length>0) {          //有数据
                        return (
                            <div className={styles.detailsList}>
                                {
                                    personData.map((item, index) =>
                                        <div className={styles.item} key={index}>
                                            <div className={styles.name}>{item.userName}</div>
                                            <div className={styles.work}>
                                                <div className={styles.gotoWork}>上班: <span className={item.goState === '正常' ? styles.fontColor: styles.redColor}>{item.goState}</span></div>
                                                <div className={styles.punchTime}>{item.goTime}</div>
                                            </div>
                                            <div className={styles.work}>
                                                <div className={styles.gooffWork}>下班: <span className={ item.backState === '正常' ? styles.fontColor: styles.redColor}>{item.backState}</span></div>
                                                <div className={styles.punchTime}>{item.backTime}</div>
                                            </div>
                                        </div>
                                    )
                                }
                                 <div className={styles.footer}>
                                    <div className={styles.brief}>
                                        <div className={styles.selectBox} onClick={ev => this.showMask(ev)}><span>{selectDate}</span>/<span>{window.Person.name}</span></div>
                                        <img onClick={maskToggle === 1?ev => this.hideMask(ev):ev => this.showMask(ev)} className={styles.top} src={maskToggle === 1?down:top} alt="" />
                                    </div>
                                    <div onClick={ev => this.export(ev)} className={maskToggle === 1?styles.exportProhibit:styles.exportData}>导出数据</div>
                                </div>
                            </div>
                        );
                    }else{
                        return(
                            <NoData parent={this} selectDate={selectDate} departmentName={window.Person.name} maskState={maskToggle}/>
                        )
                    }
                    
            } else if (currentIndex === 1) {     //月期显示内                                //展示个人
                    if(personData.length>0) {
                        return (
                            <div className={styles.detailsList}>
                            {
                                personData.map((item,index) =>
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
                             <div className={styles.footer}>
                                <div className={styles.brief}>
                                    <div className={styles.selectBox} onClick={ev => this.showMask(ev)}><span>{selectMonth}</span>/<span>{window.Person.name}</span></div>
                                    <img onClick={maskToggle === 1?ev => this.hideMask(ev):ev => this.showMask(ev)} className={styles.top} src={maskToggle === 1?down:top} alt="" />
                                </div>
                                <div onClick={ev => this.export(ev)} className={maskToggle === 1?styles.exportProhibit:styles.exportData}>导出数据</div>
                            </div>
                        </div>   
                        )
                    }else{
                        return(
                            <NoData parent={this} selectDate={selectMonth} departmentName={window.Person.name} maskState={maskToggle}/>
                        )
                    }
            } else {                                   //年
                    if(personData.length>0) {          //有数据
                        return (
                            <div className={styles.detailsList}>
                            {
                                personData.map((item,index) =>
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
                             <div className={styles.footer}>
                                <div className={styles.brief}>
                                    <div className={styles.selectBox} onClick={ev => this.showMask(ev)}><span>{selectYear}</span>/<span>{window.Person.name}</span></div>
                                    <img onClick={maskToggle === 1?ev => this.hideMask(ev):ev => this.showMask(ev)} className={styles.top} src={maskToggle === 1?down:top} alt="" />
                                </div>
                                <div onClick={ev => this.export(ev)} className={maskToggle === 1?styles.exportProhibit:styles.exportData}>导出数据</div>
                            </div>
                        </div>   
                        )
                    }else{                  
                        return(
                            <NoData parent={this} selectDate={selectYear} departmentName={window.Person.name} maskState={maskToggle}/>
                        )
                    }
                }
        }
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.title}>
                        <div onClick={ev => this.showAll(ev)} className={tabIndex === 0 ? styles.currentTab : styles.tab}>全部</div>
                        <div onClick={ev => this.showAbnormal(ev)} className={tabIndex === 1 ? styles.currentTab : styles.tab}>异常</div>
                    </div>
                    {/* <img onClick={ev => this.search(ev)} className={styles.searchImg} src={search} alt="" /> */}
                </div>
                <div className={styles.timetable}>
                    {
                        timeSlot.map((item, index) => <div onClick={ev => this.selectTime(index)} key={index} className={currentIndex === index ? styles.currentMonth : styles.noMonth}>{item}</div>)
                    }
                </div>
                <DateChange></DateChange>
                <div className={maskToggle === 0 ? styles.hideMask : styles.mask}>
                    <div className={styles.makeHide} onClick={ev=>this.hideMask(ev)}></div>
                    <div className={styles.maskBox}>
                        <div className={styles.operation}>
                            <img onClick={ev => this.hideMask(ev)} className={styles.spread} src={spread} alt="" />
                        </div>
                        <div className={styles.determine} onClick={ev => this.determineDepartment(ev)}>确定</div>
                        <div>
                            <MaskAttendance
                                parent={this}
                                tabIndex={toggleIndex}
                                list={section}
                                divisionIndx={departmentIndex}
                                optionGroups={optionGroups}
                                valueGroups={valueGroups}
                                Value={this.state.date}
                                dateIndex={currentIndex}
                                optionTeams={optionYears}
                                valueTeams={valueYears}
                            />
                        </div>
                    </div>
                </div>
                <Toast isShow={tipState} text="请勿选择当日之后日期"/>
                <Toast isShow={tipState1} text="请勿选择当月之后日期"/>
            </div>
        )
    }
}
export default PersonalRecord;