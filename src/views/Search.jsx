//搜索
import React,{Component} from 'react';
import Toast from '../components/Toast';

import styles from '../styles/Search.css';

import XHR from '../utils/request';
import API from '../api/index';

import cleanUp from '../asset/ico/cleanUp.png';
import cleanButton from '../asset/ico/ClearButton.png';

const SearchList =({visible,parent,allPerson}) =>{
    if(visible){
       return (
        <div className={styles.substance}>
            <div className={styles.personnel}>
                {
                    allPerson.map((item,index) =>
                    <div  onClick={ev =>parent.personalInformation(index)} className={styles.single} key={index}>
                        <div className={styles.information}>
                            <div className={styles.name}>{item.name}</div>
                            <div className={styles.phone}>{item.phone}</div>
                        </div>
                    </div>
                )
                }
            </div>
        </div>    
       )
    }else{
        return null
    }
}

const DeleteImg =({visible,parent}) =>{
    if(visible) {
        return (
            <img onClick={ev =>parent.delete(ev)} className={styles.cleanButton}src={cleanButton} alt=""/> 
        )
    }else{
        return null
    }
}
class Search extends Component {
    constructor() {
        super();
        this.state={
            tipState1:false,
            tipState:false,              //提示状态
            searchDate:'',               //搜索数据
            searchState:false,           //搜索状态
            inputValue:'',               //搜索关键字
            departmentStaff:[],          //部门及对应部门人员
            searchHistory:[]             //搜索历史
        }
    }
    componentDidMount() {
        document.querySelector('title').innerText = '搜索';
        this.getOfficeUserList();
        this.searchHistory();
    }
    componentWillUnmount(){
        window.sessionStorage.setItem('searchName',this.state.searchHistory);
    }
    searchHistory() {
        var test=window.sessionStorage.getItem('searchName');
        function unique(arr){
            　　var newArr = [arr[0]];
           　　 for(var i=1;i<arr.length;i++){
         　　　　if(newArr.indexOf(arr[i]) === -1){
                   　　 newArr.push(arr[i]);
             　　  }
                 }
                 return newArr;
            }
        if(test){
            var arr =test.split(','); 
            this.setState({searchHistory:unique(arr)})
        }else{
            this.setState({searchHistory:[]})
        }
    }
    empty() {
        window.sessionStorage.removeItem("searchName")
        this.setState({searchHistory:[],tipState:true});
        setTimeout(()=>{
            this.setState({tipState:false});
        },2000)
    }
    delete() {
        this.setState({inputValue:'',searchState:false});
    }
    search(ev) {
        if(this.state.searchHistory.indexOf(this.state.inputValue) === -1){
            this.state.searchHistory.push(this.state.inputValue);
        }else{
        }
        const list = this.state.departmentStaff;
        var dataName = [];
        var dataPhone = [];
        list.forEach(el=>{
            el.staff.forEach(item =>{
                dataName.push(item.name);
                dataPhone.push(item.phone)
            })
        }) 
        var dataString = this.state.inputValue+'';
        if(dataName.indexOf(dataString)>=0 || dataPhone.indexOf(dataString)>=0) {

        }else{
            this.setState({tipState1:true});
            setTimeout(()=>{
                this.setState({tipState1:false});
            },2000)
        }



    }
    pushSearch(i) {
        this.setState({inputValue:this.state.searchHistory[i]});
        const list = this.state.departmentStaff;
        const dataResult = [];
        list.forEach(el=>{
            el.staff.forEach(item =>{
                if(this.state.searchHistory[i] && (item.name.match(this.state.searchHistory[i])) || this.state.searchHistory[i] && item.phone.match(this.state.searchHistory[i])){
                    this.setState({searchState:true});
                    dataResult.push({
                        name:item.name || '',
                        phone:item.phone || '',
                        officeName:item.officeName || '',
                        userid:item.id || ''
                    })
                }
            })
            if(!this.state.searchHistory[i]) {
                this.setState({searchState:false});
            }
        })
        this.setState({searchDate:dataResult || []});
    }
    personalInformation(i) {
        window.Person = {
            userid:this.state.searchDate[i].userid,
            name:this.state.searchDate[i].name,
        }
        this.props.history.push('/personalRecord')
    }
    
    getInputValue(ev) {
        this.setState({inputValue:ev.target.value});
        const list = this.state.departmentStaff;
        const dataResult = [];
        list.forEach(el=>{
            el.staff.forEach(item =>{
                if(ev.target.value && (item.name.match(ev.target.value)) || ev.target.value && item.phone.match(ev.target.value)){
                    this.setState({searchState:true});
                    dataResult.push({
                        name:item.name || '',
                        phone:item.phone || '',
                        officeName:item.officeName || '',
                        userid:item.id || ''
                    })
                }
            })
            if(!ev.target.value) {
                this.setState({searchState:false});
            }
        })
        this.setState({searchDate:dataResult || []});
    }
    async getOfficeUserList() {                //获取全部部门及部门人员列表
        const result = await XHR.post(window.admin + API.getOfficeUserList,{companyid:window.sessionStorage.getItem('companyid')});
        const dataSource = JSON.parse(result).data;
        const userList = [];
        for(var i in dataSource) {
            userList.push({
                department:i,
                staff:dataSource[i]
           })
        }
        this.setState({departmentStaff:userList});
    }
    render() {
        const {searchHistory,inputValue,searchState,searchDate,tipState,tipState1} = this.state;
        return (
            <div className={styles.container}>
                <div className={styles.headerBox}>
                    <div className={styles.header}>
                        <div className={styles.searchBox}>
                            <input className={styles.inputBox} onChange={ev =>this.getInputValue(ev)} type="text" placeholder="搜索姓名或手机号" value={inputValue}  />
                            <DeleteImg visible={inputValue} parent={this}/>
                        </div>
                        <div onClick={ev =>this.search(ev)} className={styles.cancel}>搜索</div>
                    </div>
                </div>
                <div className={searchState === false? styles.showContent:styles.hideContent}>
                    <div className={styles.content}>
                        <div>搜索历史</div>
                        <img onClick={ev =>this.empty(ev)} className={styles.recycle} src={cleanUp} alt=""/>
                    </div>
                    <div className={styles.list}>
                        {
                            searchHistory.map((item,index) =><div onClick={ev =>this.pushSearch(index)} key={index}>{item}</div>)
                        }
                    </div>
                </div>
                <SearchList visible={searchState} parent={this} allPerson={searchDate} />
                <Toast isShow={tipState} text="记录清除成功"/>
                <Toast isShow={tipState1} text="暂无此员工"/>
                
            </div>
        )
    }
    
}
export default Search;