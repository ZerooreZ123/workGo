//员工考勤记录（普通管理员）
import React, { Component } from 'react';
import Toast from '../components/Toast';
import Picker from 'react-mobile-picker';
import DayPicker from 'react-day-picker';
import moment from 'moment';

import styles from '../styles/AttendanceData.css';

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
                    <div className={styles.selectBox} onClick={ev => parent.showMask(ev)}><span>{selectDate}</span>/<span>{departmentName}</span></div>
                    <img onClick={maskState === 1?ev => parent.hideMask(ev):ev => parent.showMask(ev)} className={styles.top} src={maskState === 1?down:top} alt="" />
                </div>
                <div onClick={ev => parent.export(ev)} className={maskState === 1?styles.exportProhibit:styles.exportData}>导出数据</div>
             </div>
        </div>
    )
}

const NoRecord =({parent,selectDate,departmentName,maskState1}) =>{
    return (
        <div className={styles.blankBox}>
             <div className={styles.box}>
                <img className={styles.blankImg} src={data} alt='' />
                <div className={styles.font}>暂无考勤记录</div>
             </div>
             <div className={styles.footer}>
                <div className={styles.brief}>
                    <div className={styles.selectBox} onClick={ev => parent.showMask1(ev)}><span>{selectDate}</span>/<span>{departmentName}</span></div>
                    <img onClick={maskState1 === 1?ev => parent.hideMask1(ev):ev => parent.showMask1(ev)} className={styles.top} src={maskState1 === 1?down:top} alt="" />
                </div>
                <div onClick={ev => parent.export(ev)} className={maskState1 === 1?styles.exportProhibit:styles.exportData}>导出数据</div>
             </div>
        </div>
    )
}

const MaskPerson = ({parent, optionGroups, valueGroups,dateIndex,optionTeams,valueTeams}) => { 
    if (dateIndex === 1) {
        return (
            <div>
                <Picker
                    optionGroups={optionGroups}
                    valueGroups={valueGroups}
                    onChange={parent.handleChange}
                />
            </div>
        )
    } else if(dateIndex === 2) {
        return (
            <div>
                <Picker
                    optionGroups={optionTeams}
                    valueGroups={valueTeams}
                    onChange={parent.selectChange}
                />
            </div>
        )
    }else{
        return null
    }   
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
class AttendanceData extends Component {
    constructor() {
        super();
        this.state = {
            maskToggle1:0,
            tipState1:false,
            tipState:false,        //提示状态
            secondTime:(new Date()).getTime(),
            Value: '',
            date: new Date(),
            section: [],                 //部门列表
            departmentName:'全部',       //默认部门
            departmentIndex: '',         //部门的索引值
            departmentId: '',            //部门Id
            nameId:'',                   //用户Id
            maskDate: false,             //默认不显示日历
            currentIndex: 0,             //日月年展示模块索引
            showState: 0,                //默认展示全部
            tabIndex: 0,                 //选择tab的索引
            startTime: moment().format('YYYY-MM-DD'),     //开始时间(传参)
            endTime: moment().format('YYYY-MM-DD'),       //结束时间(传参)
            record: [],                  //展示打卡记录
            abnormalRecord:[],           //异常打卡记录
            personDetail:false,           //个人打卡记录状态
            personYearDetail:false,       //年个人打卡记录状态
            personData:[],                //个人打卡数据
            dataSource: [],               //月统计打卡记录
            yearSource: [],               //年统计打卡记录
            toggleIndex: 0,              //切换选择时间与部门的索引值
            maskToggle: 0,                //默认不展示mask
            selectDate: moment().format('YYYY-MM-DD'),   //日历选择
            selectMonth:moment().format("YYYY-MM"),      //月份选择
            selectYear:moment().format("YYYY"),          //年份选择
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
        document.querySelector('title').innerText = '员工考勤记录';
        this.getOfficeList();
        this.selectState();
    }
    componentWillUnmount(){
        var Result = {
            maskToggle1:this.state.maskToggle1,
            tipState1:this.state.tipState1,
            tipState:this.state.tipState,   
            secondTime:this.state.secondTime,
            Value:this.state.Value,
            abnormalRecord:this.state.abnormalRecord,
            dataSource:this.state.dataSource,
            date:this.state.date,
            departmentId:this.state.departmentId,
            departmentIndex:this.state.departmentIndex,
            endTime:this.state.endTime,
            maskDate:this.state.maskDate,
            maskToggle:this.state.maskToggle,
            nameId:this.state.nameId,
            optionGroups:{data:this.state.optionGroups.data},
            optionYears:{data:this.state.optionYears.data},
            personData:this.state.personData,
            personDetail:this.state.personDetail,
            personYearDetail:this.state.personYearDetail,
            record:this.state.record,
            section:this.state.section,
            selectDate:this.state.selectDate,
            selectMonth:this.state.selectMonth,
            selectYear:this.state.selectYear,
            showState:this.state.showState,
            startTime:this.state.startTime,
            tabIndex:this.state.tabIndex,
            toggleIndex:this.state.toggleIndex,
            valueGroups:{data:this.state.valueGroups.data},
            valueYears:{data:this.state.valueYears.data},
            yearSource:this.state.yearSource,
            currentIndex:this.state.currentIndex,
            departmentName:this.state.departmentName
        };
        window.sessionStorage.setItem('dataResult',JSON.stringify(Result));
    }
    selectState() {
        var test=JSON.parse(window.sessionStorage.getItem('dataResult'));
        if(test){
            this.setState({
                maskToggle1:test.maskToggle1,
                tipState1:test.tipState1,
                tipState:test.tipState,    
                secondTime:test.secondTime,
                Value:test.Value,
                abnormalRecord:test.abnormalRecord,
                dataSource:test.dataSource,
                date:test.date,
                departmentId:test.departmentId,
                departmentIndex:test.departmentIndex,
                endTime:test.endTime,
                maskDate:test.maskDate,
                maskToggle:+test.maskToggle,
                nameId:test.nameId,
                optionGroups:{data:test.optionGroups.data},
                optionYears:{data:test.optionYears.data},
                personData:test.personData,
                personDetail:test.personDetail,
                personYearDetail:test.personYearDetail,
                record:test.record,
                section:test.section,
                selectDate:test.selectDate,
                selectMonth:test.selectMonth,
                selectYear:test.selectYear,
                showState:+test.showState,
                startTime:test.startTime,
                tabIndex:+test.tabIndex,
                toggleIndex:test.toggleIndex,
                valueGroups:{data:test.valueGroups.data},
                valueYears:{data:test.valueYears.data},
                yearSource:test.yearSource,
                currentIndex:+test.currentIndex,
                departmentName:test.departmentName}) 
        }else{
            this.setState({
                maskToggle1:0,
                tipState1:false,
                tipState:false,        //提示状态
                secondTime:(new Date()).getTime(),
                Value: '',
                date: new Date(),
                section: [],                 //部门列表
                departmentName:'全部',       //默认部门
                departmentIndex: '',         //部门的索引值
                departmentId: '',            //部门Id
                nameId:'',                   //用户Id
                maskDate: false,             //默认不显示日历
                currentIndex: 0,             //日月年展示模块索引
                showState: 0,                //默认展示全部
                tabIndex: 0,                 //选择tab的索引
                startTime: moment().format('YYYY-MM-DD'),     //开始时间(传参)
                endTime: moment().format('YYYY-MM-DD'),       //结束时间(传参)
                record: [],                  //展示打卡记录
                abnormalRecord:[],           //异常打卡记录
                personDetail:false,           //个人打卡记录状态
                personYearDetail:false,
                personData:[],                //个人打卡数据
                dataSource: [],               //月统计打卡记录
                yearSource: [],               //年统计打卡记录
                toggleIndex: 0,              //切换选择时间与部门的索引值
                maskToggle: 0,                //默认不展示mask
                selectDate: moment().format('YYYY-MM-DD'),   //日历选择
                selectMonth:moment().format("YYYY-MM"),      //月份选择
                selectYear:moment().format("YYYY"),          //年份选择
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
           this.getRecords(this.state.startTime,this.state.endTime,this.state.departmentId);
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
    preClockInRemind(day) {
        setTimeout(()=>this.handleDayClick(day), 0);
    }
    getYear() {                           //获取年份
        var myDate = new Date();
        var startYear = myDate.getFullYear()-2;//起始年份
        var endYear = myDate.getFullYear()+1;//结束年份
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
                    section:this.state.departmentName,
                    departmentId:this.state.departmentId
                }
                this.props.history.push('/exportData');
            }else if(this.state.currentIndex === 1) { //导出月
                if( this.state.personDetail === false){
                    window.Data = {
                        time:this.state.selectMonth,
                        section:this.state.departmentName,
                        departmentId:this.state.departmentId,
                    }
                    this.props.history.push('/exportData'); 
                }else{                               //导出个人
                    window.Data = {
                        time:this.state.selectMonth,
                        section:this.state.departmentName,
                        userids:this.state.nameId
                    }
                    this.props.history.push('/exportData'); 
                }
            }else{                                  //导出年
                if(this.state.personYearDetail === false) {
                    window.Data = {
                        time:this.state.selectYear,
                        section:this.state.departmentName,
                        departmentId:this.state.departmentId
                    }
                    this.props.history.push('/exportData'); 
                }else{
                    window.Data = {
                        time:this.state.selectYear,
                        section:this.state.departmentName,
                        userids:this.state.nameId
                    }
                    this.props.history.push('/exportData'); 
                }
            }

        }else{
            return false
        }
    }
    selectTime(i) {                  //设置日月年展示模块索引值
        this.setState({ currentIndex: i });
        if (i === 0) {
            this.setState({selectDate:this.state.selectDate,departmentName:'全部'})
            if(this.state.tabIndex === 0) {
                this.getRecords(this.state.selectDate,this.state.selectDate);
            }else{
                this.Abnormal(this.state.startTime,this.state.endTime);
            }
        } else if (i === 1) {
            this.setState({departmentName:'全部',selectMonth:this.state.selectMonth});
            if(this.state.tabIndex === 0) {
                this.getStatisticalInfo(this.state.valueGroups.data + '-1',moment(this.state.valueGroups.data).endOf('month').format('YYYY-MM-DD'));
                this.getMonth();
                this.setState({personDetail:false});
            }else{
                this.Abnormal(this.state.valueGroups.data + '-1',moment(this.state.valueGroups.data).endOf('month').format('YYYY-MM-DD'));
                this.getMonth();
                this.setState({personDetail:false});
            }     
        }else{
            this.setState({departmentName:'全部',selectYear:this.state.selectYear});
            if(this.state.tabIndex === 0){
                this.getYarnInfomation(this.state.valueYears.data +'-01-01',this.state.valueYears.data + '-12-31');
                this.getYear();
                this.setState({personYearDetail:false})
            }else{
                this.Abnormal(this.state.valueYears.data +'-01-01',this.state.valueYears.data + '-12-31');
                this.getYear();
                this.setState({personYearDetail:false}) 
            }
            
        }
    }
    personalInformation(i) {            //个人打卡记录月
        this.setState({
            personDetail:true,
            departmentName:this.state.dataSource[i].name,
            nameId:this.state.dataSource[i].userid
        });
        this.getPersonRecords(this.state.valueGroups.data + '-1',moment(this.state.valueGroups.data).endOf('month').format('YYYY-MM-DD'),this.state.dataSource[i].userid);
    }
    personAbnormal(i) {                //个人异常打卡记录月
        this.setState({
            personDetail:true,
            departmentName:this.state.dataSource[i].name,
            nameId:this.state.dataSource[i].userid
        });
        this.getPersonRecords(this.state.valueGroups.data + '-1',moment(this.state.valueGroups.data).endOf('month').format('YYYY-MM-DD'),this.state.dataSource[i].userid,"abnormity")
    }
    personYear(i) {                    //个人打卡记录年                
        this.setState({
            personYearDetail:true,
            selectYear:this.state.valueYears.data,
            departmentName:this.state.yearSource[i].name,
            nameId:this.state.yearSource[i].userid
        });
        if((new Date()).getFullYear() == this.state.valueYears.data ){
            this.getPersonRecords(this.state.valueYears.data +'-01-01',moment().format("YYYY-MM-DD"),this.state.yearSource[i].userid);
        }else{
            this.getPersonRecords(this.state.valueYears.data +'-01-01',this.state.valueYears.data + '-12-31',this.state.yearSource[i].userid);
        }
    }
    personAbnormalYear(i) {           //个人异常打卡记录年 
        this.setState({
            personYearDetail:true,
            selectYear:this.state.valueYears.data,
            departmentName:this.state.yearSource[i].name,
            nameId:this.state.yearSource[i].userid
        });
        if((new Date()).getFullYear() == this.state.valueYears.data ){
            this.getPersonRecords(this.state.valueYears.data +'-01-01',moment().format("YYYY-MM-DD"),this.state.yearSource[i].userid,'abnormity');
        }else{
            this.getPersonRecords(this.state.valueYears.data +'-01-01',this.state.valueYears.data + '-12-31',this.state.yearSource[i].userid,'abnormity');
        }
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
    showMask1() {
        this.setState({ maskToggle1: 1 ,toggleIndex: 0 });
    }
    hideMask() {                     //隐藏mask
        this.setState({ maskToggle: 0 });
    }
    hideMask1() {                     //隐藏mask
        this.setState({ maskToggle1: 0 });
    }
    showAll() {                      //展示所有
        this.setState({ showState: 0 ,tabIndex: 0});
        if(this.state.currentIndex === 0){                  //日
            this.getRecords(this.state.selectDate,this.state.selectDate,this.state.departmentId);
        }else if(this.state.currentIndex === 1) {           //月
            if(this.state.personDetail === false) {
                this.getStatisticalInfo(this.state.valueGroups.data + '-1',moment(this.state.valueGroups.data).endOf('month').format('YYYY-MM-DD'),this.state.departmentId)
            }else{
                this.getPersonRecords(this.state.valueGroups.data + '-1',moment(this.state.valueGroups.data).endOf('month').format('YYYY-MM-DD'),this.state.nameId)
            }  
        }else{                                              //年
            if(this.state.personYearDetail === false) {
                this.getYarnInfomation(this.state.valueYears.data +'-01-01',this.state.valueYears.data + '-12-31',this.state.departmentId )
            }else{
                if((new Date()).getFullYear() == this.state.valueYears.data ){
                    this.getPersonRecords(this.state.valueYears.data +'-01-01',moment().format("YYYY-MM-DD"),this.state.nameId);
                }else{
                    this.getPersonRecords(this.state.valueYears.data +'-01-01',this.state.valueYears.data + '-12-31',this.state.nameId);
                }
            }
           
        }
    }
    showAbnormal() {                 //展示异常
        this.setState({ showState: 1,tabIndex: 1 });
        if(this.state.currentIndex === 0) {                 //日
            this.Abnormal(this.state.selectDate,this.state.selectDate,this.state.departmentId);
        }else if(this.state.currentIndex === 1){            //月
            if(this.state.personDetail === false) {
                this.getStatisticalInfo(this.state.valueGroups.data + '-1',moment(this.state.valueGroups.data).endOf('month').format('YYYY-MM-DD'),this.state.departmentId)
            }else{
                this.getPersonRecords(this.state.valueGroups.data + '-1',moment(this.state.valueGroups.data).endOf('month').format('YYYY-MM-DD'),this.state.nameId,'abnormity')
            }
           
        }else{                                              //年
            if(this.state.personYearDetail === false) {
                this.getYarnInfomation(this.state.valueYears.data +'-01-01',this.state.valueYears.data + '-12-31',this.state.departmentId )
            }else{
                if((new Date()).getFullYear() == this.state.valueYears.data ){
                    this.getPersonRecords(this.state.valueYears.data +'-01-01',moment().format("YYYY-MM-DD"),this.state.nameId,'abnormity');
                }else{
                    this.getPersonRecords(this.state.valueYears.data +'-01-01',this.state.valueYears.data + '-12-31',this.state.nameId,'abnormity');
                }
            }
           
        }
        
    }
    choiceTab(i) {                   //组件切换部门与时间索引
        this.setState({ toggleIndex: i ,mask: true});
    }
    choice(i) {                      //选择部门
        this.setState({ 
            departmentIndex: i ,
            departmentName: this.state.section[i].name,
            departmentId: this.state.section[i].id 
       });

    }
    clickTerm(i) {                   //设置部门索引、名字、Id  
        this.setState({ 
            departmentIndex: i ,
            departmentName: this.state.section[i].name,
            departmentId: this.state.section[i].id 
        });
    }
    async getOfficeList() {          //部门列表
        const result = await XHR.post(window.admin + API.getOfficeList, { companyid:window.sessionStorage.getItem("companyid") });
        const dataSource=JSON.parse(result).data || [];
        const sectionList = [];
        dataSource.forEach((item, index) => {
            sectionList.push({
                name: item.name,
                id: item.id
            })
        });
        sectionList.push(
            {
                name:'其他',
                id: 'officeid'
            },
            {
                name:'全部',
                id:''
            }
        )
        this.setState({ section: sectionList });
    }
    makeSure(){                  //个人确认选择
        if(this.state.currentIndex === 1) { //月期
            if(this.state.secondTime >=(new Date(this.state.valueGroups.data).getTime())) {   //判断是否为大于当月
                if(this.state.showState === 0){         //判断是否为全部
                    this.setState({selectMonth:this.state.valueGroups.data})
                    this.getPersonRecords(this.state.valueGroups.data + '-1',moment(this.state.valueGroups.data).endOf('month').format('YYYY-MM-DD'),this.state.nameId);
                    this.hideMask1();
                }else{
                    this.setState({selectMonth:this.state.valueGroups.data})
                    this.getPersonRecords(this.state.valueGroups.data + '-1',moment(this.state.valueGroups.data).endOf('month').format('YYYY-MM-DD'),this.state.nameId,'abnormity');
                    this.hideMask1();
                }
            }else{
                this.setState({tipState1:true})
                setTimeout(()=>{
                    this.setState({tipState1:false})
                },1500)
            }
        }else{                                    //年份
            if(this.state.showState === 0) {          //判断是否为全部
                this.setState({selectYear:this.state.valueYears.data});
                if((new Date()).getFullYear() == this.state.valueYears.data ){
                    this.getPersonRecords(this.state.valueYears.data +'-01-01',moment().format("YYYY-MM-DD"),this.state.nameId);
                }else{
                    this.getPersonRecords(this.state.valueYears.data +'-01-01',this.state.valueYears.data + '-12-31',this.state.nameId);
                }
               
                this.hideMask1();
            }else{
                this.setState({selectYear:this.state.valueYears.data})
                if((new Date()).getFullYear() == this.state.valueYears.data ){
                    this.getPersonRecords(this.state.valueYears.data +'-01-01',moment().format("YYYY-MM-DD"),this.state.nameId,'abnormity');
                }else{
                    this.getPersonRecords(this.state.valueYears.data +'-01-01',this.state.valueYears.data + '-12-31',this.state.nameId,'abnormity');
                }
                this.hideMask1();
            }
        }
    }


    determineDepartment() {    //确认选择
        if(this.state.currentIndex === 0) {      //日子
            if(this.state.tabIndex === 0){       //全部
                this.getRecords(this.state.selectDate,this.state.selectDate,this.state.departmentId);
                this.hideMask();
            }else{                               //异常
                this.Abnormal(this.state.selectDate,this.state.selectDate,this.state.departmentId)
                this.hideMask();
            }
        }else if(this.state.currentIndex === 1) { //月期
            if(this.state.secondTime >=(new Date(this.state.valueGroups.data).getTime())) {
                this.setState({selectMonth:this.state.valueGroups.data})
                this.getStatisticalInfo(this.state.valueGroups.data + '-1',moment(this.state.valueGroups.data).endOf('month').format('YYYY-MM-DD'),this.state.departmentId);
                this.hideMask();
            }else{
                this.setState({tipState1:true})
                setTimeout(()=>{
                    this.setState({tipState1:false})
                },1500)
            }
        }else{                                    //年份
            this.setState({selectYear:this.state.valueYears.data})
            this.getYarnInfomation(this.state.valueYears.data +'-01-01',this.state.valueYears.data + '-12-31',this.state.departmentId );
            this.hideMask();
        }
    }
    async getPersonRecords(startTime,endTime,userId,abnormity) {            //获取个人打卡记录
        const result = await XHR.post(window.admin + API.getRecords,{
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
    async Abnormal(startTime,endTime,officeId) {            //获取异常全部员工某日考勤记录
        const result = await XHR.post(window.admin + API.getRecords, {
            companyid:window.sessionStorage.getItem("companyid"),
            beginDate:startTime,
            endDate:endTime,
            officeid:officeId,
            abnormity:"abnormity"  
        })
        window.time = this.state.startTime;
        const dataResult = [];
        
        JSON.parse(result).data.forEach((ev,i) =>{
            dataResult.push({
                userName:ev.userName,
                goState:ev.gotoWorkStatus,
                goTime:ev.upWork?ev.upWork:'--:--:--',
                backState:ev.getoffWorkStatus,
                backTime:ev.downWork?ev.downWork:'--:--:--'
            })
        })
        this.setState({ abnormalRecord: dataResult || [] } );
    }

    async getRecords(startTime,endTime,officeId) {            //获取全部员工某日考勤记录
        const result = await XHR.post(window.admin + API.getRecords, {
            companyid:window.sessionStorage.getItem("companyid"),
            beginDate:startTime,
            endDate:endTime,
            officeid:officeId
        })
        window.time = this.state.startTime;
        const dataResult = [];
        JSON.parse(result).data.forEach((ev,i) =>{
            dataResult.push({
                userName:ev.userName,
                goState:ev.gotoWorkStatus,
                goTime:ev.upWork?ev.upWork:'--:--:--',
                backState:ev.getoffWorkStatus,
                backTime:ev.downWork?ev.downWork:'--:--:--'
            })
        })
        this.setState({ record: dataResult || [] } );
    }
    async getStatisticalInfo(startTime,endTime,officeId) {     //获取全部员工考勤记录统计
        const result = await XHR.post(window.admin + API.getStatisticalInfo, {
            companyid:window.sessionStorage.getItem("companyid"),
            beginDate: startTime,
            endDate: endTime,
            officeid:officeId
        })
        const data = JSON.parse(result).data || [];
        const list = [];
        data.forEach((ev, index) => {
            list.push({
                userid:ev.userid,
                name: ev.userName,
                already: ev.clockIn,
                total: ev.totalClockIn,
                normal: ev.normal,
                abnormal: ev.anomaly
            })
        })
        this.setState({ dataSource: list });
    }
    async getYarnInfomation(startTime,endTime,officeId) {     //获取某年全部员工考勤记录统计
        const result = await XHR.post(window.admin + API.getStatisticalInfo, {
            companyid:window.sessionStorage.getItem("companyid"),
            beginDate: startTime,
            endDate: endTime,
            officeid:officeId
        })
        const data = JSON.parse(result).data || [];
        const list = [];
        data.forEach((ev, index) => {
            list.push({
                name: ev.userName,
                userid:ev.userid,
                already: ev.clockIn,
                total: ev.totalClockIn,
                normal: ev.normal,
                abnormal: ev.anomaly
            })
        })
        this.setState({ yearSource: list });
    }
    render() {
        const { record, currentIndex,yearSource,dataSource, tabIndex, section, departmentIndex, departmentName, toggleIndex, maskToggle, optionGroups, valueGroups,selectYear,selectDate,valueYears,optionYears,abnormalRecord,personDetail,personData,selectMonth,personYearDetail,tipState,tipState1,maskToggle1} = this.state;
        const timeSlot = ['日', '月', '年'];
        const list = ['时间', '部门']
        const DateChange = props => {              //日期显示内容
            if (currentIndex === 0) {              //日
                if(tabIndex === 0) {              //全部
                    if(record.length>0) {          //有数据
                        return (
                            <div className={styles.detailsList}>
                                {
                                    record.map((item, index) =>
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
                                        <div className={styles.selectBox} onClick={ev => this.showMask(ev)}><span>{selectDate}</span>/<span>{departmentName}</span></div>
                                        <img onClick={maskToggle === 1?ev => this.hideMask(ev):ev => this.showMask(ev)} className={styles.top} src={maskToggle === 1?down:top} alt="" />
                                    </div>
                                    <div onClick={ev => this.export(ev)} className={maskToggle === 1?styles.exportProhibit:styles.exportData}>导出数据</div>
                                </div>
                            </div>
                        );
                    }else{
                        return(
                            <NoData parent={this} selectDate={selectDate} departmentName={departmentName} maskState={maskToggle}/>
                        )
                    }
                    
                }else{                           //异常
                    if(abnormalRecord.length>0) {
                        return (
                            <div className={styles.detailsList}>
                                {
                                    abnormalRecord.map((item, index) =>
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
                                        <div className={styles.selectBox} onClick={ev => this.showMask(ev)}><span>{selectDate}</span>/<span>{departmentName}</span></div>
                                        <img onClick={maskToggle === 1?ev => this.hideMask(ev):ev => this.showMask(ev)} className={styles.top} src={maskToggle === 1?down:top} alt="" />
                                    </div>
                                    <div onClick={ev => this.export(ev)} className={maskToggle === 1?styles.exportProhibit:styles.exportData}>导出数据</div>
                                </div>
                            </div>
                        );
                    }else{
                        return(
                            <NoData parent={this} selectDate={selectDate} departmentName={departmentName} maskState={maskToggle}/>
                        )
                    }
                    
                }
               
            } else if (currentIndex === 1) {           //月期显示内容
                if(personDetail === false) {           //展示统计
                    if(tabIndex === 0) {               //全部
                        if(dataSource.length>0) {
                            return (
                                <div className={styles.detailsList}>
                                    {
                                        dataSource.map((item, index) =>
                                            <div className={styles.item} key={index} onClick={ev => this.personalInformation(index)}>
                                                 <div className={styles.displayDate}><span>{item.dateDay}</span> <span>{item.week}</span></div>
                                                <div className={styles.nameBox}>
                                                    <div className={styles.personName}>{item.name}</div>
                                                    <div className={styles.detail}>详情</div>
                                                </div>
                                                <div className={styles.totalDay}>
                                                    <div className={styles.totalDay}>已打卡: <span>{item.already}天</span> (共需{item.total}天)</div>
                                                </div>
                                                <div className={styles.work}>
                                                    <div className={styles.gooffWork}>正常: <span className={styles.fontColor}>{item.normal}天</span></div>
                                                    <div className={styles.punchTime}>异常：<span className={styles.redColor}>{item.abnormal}天</span></div>
                                                </div>
                                            </div>
                                        )
                                    }
                                     <div className={styles.footer}>
                                        <div className={styles.brief}>
                                            <div className={styles.selectBox} onClick={ev => this.showMask(ev)}><span>{selectMonth}</span>/<span>{departmentName}</span></div>
                                            <img onClick={maskToggle === 1?ev => this.hideMask(ev):ev => this.showMask(ev)} className={styles.top} src={maskToggle === 1?down:top} alt="" />
                                        </div>
                                        <div onClick={ev => this.export(ev)} className={maskToggle === 1?styles.exportProhibit:styles.exportData}>导出数据</div>
                                    </div>
                                </div>
                            )   
                        }else{
                            return(
                                <NoData parent={this} selectDate={selectMonth} departmentName={departmentName} maskState={maskToggle}/>
                            )
                        } 
                    }else{                               //异常
                        if(dataSource.length>0) {
                            return (
                                <div className={styles.detailsList}>
                                    {
                                        dataSource.map((item, index) =>
                                            <div className={styles.item} key={index} onClick={ev => this.personAbnormal(index)}>
                                                 <div className={styles.displayDate}><span>{item.dateDay}</span> <span>{item.week}</span></div>
                                                <div className={styles.nameBox}>
                                                    <div className={styles.personName}>{item.name}</div>
                                                    <div className={styles.detail}>详情</div>
                                                </div>
                                                <div className={styles.totalDay}>
                                                    <div className={styles.totalDay}>已打卡: <span>{item.already}天</span> (共需{item.total}天)</div>
                                                </div>
                                                <div className={styles.work}>
                                                    <div className={styles.gooffWork}>异常:<span className={styles.redColor}>{item.abnormal}天</span></div>
                                                    {/* <div className={styles.punchTime}>异常:<span className={styles.redColor}>{item.abnormal}天</span></div> */}
                                                </div>
                                            </div>
                                        )
                                    }
                                     <div className={styles.footer}>
                                        <div className={styles.brief}>
                                            <div className={styles.selectBox} onClick={ev => this.showMask(ev)}><span>{selectMonth}</span>/<span>{departmentName}</span></div>
                                            <img onClick={maskToggle === 1?ev => this.hideMask(ev):ev => this.showMask(ev)} className={styles.top} src={maskToggle === 1?down:top} alt="" />
                                        </div>
                                        <div onClick={ev => this.export(ev)} className={maskToggle === 1?styles.exportProhibit:styles.exportData}>导出数据</div>
                                    </div>
                                </div>
                            )   
                        }else{
                            return(
                                <NoData parent={this} selectDate={selectMonth} departmentName={departmentName} maskState={maskToggle}/>
                            )
                        } 
                    }       
                }else{                                //展示个人
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
                                    <div className={styles.selectBox} onClick={ev => this.showMask1(ev)}><span>{selectMonth}</span>/<span>{departmentName}</span></div>
                                    <img onClick={maskToggle1 === 1?ev => this.hideMask1(ev):ev => this.showMask1(ev)} className={styles.top} src={maskToggle1 === 1?down:top} alt="" />
                                </div>
                                <div onClick={ev => this.export(ev)} className={maskToggle1 === 1?styles.exportProhibit:styles.exportData}>导出数据</div>
                            </div>
                        </div>   
                        )
                    }else{
                        return(
                            <NoRecord parent={this} selectDate={selectMonth} departmentName={departmentName} maskState={maskToggle1}/>
                        )
                    }
                }
               
            } else {                                   //年
                if(personYearDetail === false){        //统计
                   if(tabIndex === 0) {                //全部
                        if(yearSource.length>0) {
                            return (
                                <div className={styles.detailsList}>
                                    {
                                        yearSource.map((item, index) =>
                                            <div className={styles.item} key={index} onClick={ev => this.personYear(index)}>
                                                <div className={styles.nameBox}>
                                                    <div className={styles.personName}>{item.name}</div>
                                                    <div className={styles.detail}>详情</div>
                                                </div>
                                                <div className={styles.totalDay}>
                                                    <div className={styles.totalDay}>已打卡: <span>{item.already}天</span> (共需{item.total}天)</div>
                                                </div>
                                                <div className={styles.work}>
                                                    <div className={styles.gooffWork}>正常: <span className={styles.fontColor}>{item.normal}天</span></div>
                                                    <div className={styles.punchTime}>异常：<span className={styles.redColor}>{item.abnormal}天</span></div>
                                                </div>
                                            </div>
                                        )
                                    }
                                    <div className={styles.footer}>
                                        <div className={styles.brief}>
                                            <div className={styles.selectBox} onClick={ev => this.showMask(ev)}><span>{selectYear}</span>/<span>{departmentName}</span></div>
                                            <img onClick={maskToggle === 1?ev => this.hideMask(ev):ev => this.showMask(ev)} className={styles.top} src={maskToggle === 1?down:top} alt="" />
                                        </div>
                                        <div onClick={ev => this.export(ev)} className={maskToggle === 1?styles.exportProhibit:styles.exportData}>导出数据</div>
                                    </div>
                                </div>
                            );
                        }else{
                            return(
                                <NoData parent={this} selectDate={selectYear} departmentName={departmentName} maskState={maskToggle}/>
                            )
                        }
                   }else{                   //异常
                        if(yearSource.length>0) {
                            return (
                                <div className={styles.detailsList}>
                                    {
                                        yearSource.map((item, index) =>
                                            <div className={styles.item} key={index} onClick={ev => this.personYear(index)}>
                                                <div className={styles.nameBox}>
                                                    <div className={styles.personName}>{item.name}</div>
                                                    <div className={styles.detail}>详情</div>
                                                </div>
                                                <div className={styles.totalDay}>
                                                    <div className={styles.totalDay}>已打卡: <span>{item.already}天</span> (共需{item.total}天)</div>
                                                </div>
                                                <div className={styles.work}>
                                                    {/* <div className={styles.gooffWork}>正常: <span className={styles.fontColor}>{item.normal}天</span></div> */}
                                                    <div className={styles.gooffWork}>异常：<span className={styles.redColor}>{item.abnormal}天</span></div>
                                                </div>
                                            </div>
                                        )
                                    }
                                    <div className={styles.footer}>
                                        <div className={styles.brief}>
                                            <div className={styles.selectBox} onClick={ev => this.showMask(ev)}><span>{selectYear}</span>/<span>{departmentName}</span></div>
                                            <img onClick={maskToggle === 1?ev => this.hideMask(ev):ev => this.showMask(ev)} className={styles.top} src={maskToggle === 1?down:top} alt="" />
                                        </div>
                                        <div onClick={ev => this.export(ev)} className={maskToggle === 1?styles.exportProhibit:styles.exportData}>导出数据</div>
                                    </div>
                                </div>
                            );
                        }else{
                            return(
                                <NoData parent={this} selectDate={selectYear} departmentName={departmentName} maskState={maskToggle}/>
                            )
                        }
                   }
                }else{               //展示个人
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
                                    <div className={styles.selectBox} onClick={ev => this.showMask1(ev)}><span>{selectYear}</span>/<span>{departmentName}</span></div>
                                    <img onClick={maskToggle1 === 1?ev => this.hideMask1(ev):ev => this.showMask1(ev)} className={styles.top} src={maskToggle1 === 1?down:top} alt="" />
                                </div>
                                <div onClick={ev => this.export(ev)} className={maskToggle1 === 1?styles.exportProhibit:styles.exportData}>导出数据</div>
                            </div>
                        </div>   
                        )
                    }else{                  
                        return(
                            <NoRecord parent={this} selectDate={selectYear} departmentName={departmentName} maskState={maskToggle1}/>
                        )
                    }
                }
               
            }
        }
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.title}>
                        <div onClick={ev => this.showAll(ev)} className={tabIndex === 0 ? styles.currentTab : styles.tab}>全部</div>
                        <div onClick={ev => this.showAbnormal(ev)} className={tabIndex === 1 ? styles.currentTab : styles.tab}>异常</div>
                        {/* <div onClick={ev => this.showNotAbsenteeism(ev)} className={tabIndex === 2 ? styles.currentTab : styles.tab}>全勤</div> */}
                    </div>
                    <img onClick={ev => this.search(ev)} className={styles.searchImg} src={search} alt="" />
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
                        <div className={styles.toggleBox}>
                            {
                                list.map((item, index) => <div key={index} onClick={ev => this.choiceTab(index)} className={toggleIndex === index ? styles.selectTimeTab : styles.timeTab}>{item}</div>)
                            }
                        </div>
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
                <div className={maskToggle1 === 0 ? styles.hideMask : styles.mask}>
                    <div className={styles.makeHide} onClick={ev=>this.hideMask1(ev)}></div>
                    <div className={styles.maskBox}>
                        <div className={styles.operation}>
                            <img onClick={ev => this.hideMask1(ev)} className={styles.spread} src={spread} alt="" />
                        </div>
                        <div className={styles.determine} onClick={ev => this.makeSure(ev)}>确定</div>
                        <div>
                            <MaskPerson
                                parent={this}
                                optionGroups={optionGroups}
                                valueGroups={valueGroups}
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
export default AttendanceData;