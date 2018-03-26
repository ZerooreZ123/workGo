//员工资料
import React,{Component} from 'react';
import styles from '../styles/EmployeeInformation.css';

import XHR from '../utils/request';
import API from '../api/index';
import Toast from '../components/Toast';

import search from '../asset/manager/search3.png';
import forward from '../asset/manager/go.png';
import upBlue from '../asset/manager/triangle-top.png';
import downBlue from '../asset/manager/downBlue.png';
import spread from '../asset/manager/spread.png';

const Direction = ({checked,parent}) => {
    if (checked === true) {
      return <img  onClick={ev=>parent.hideMask()} className={styles.top} src={downBlue} alt=""/>;
    } else {
      return <img  onClick={ev=>parent.showMask()} className={styles.top} src={upBlue} alt=""/>;
    }
}
const SearchList =({visible,parent,allPerson}) =>{
    if(visible){
       return (
        <div className={styles.content}>
            <div className={styles.personnel}>
                {
                    allPerson.map((item,index) =>
                    <div onClick={ev =>parent.searchPersonalInformation(index)} className={styles.single} key={index}>
                        <div className={styles.information}>
                            <div className={styles.name}>{item.name}</div>
                            <div className={styles.phone}>{item.phone}</div>
                        </div>
                        <img className={styles.forward} src={forward} alt=""/>
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
class EmployeeInformation extends Component{
    constructor() {
        super();
        window.Person = {};
        this.state={
            tipState1:false,
            departmentStaff:[],         //部门及所属员工列表
            departmentPart:[],          //部门人员列表
            section:[],                 //部门列表
            departmentName:'全部',       //默认部门
            departmentIndex:'',         //部门的索引值
            departmentId:'',            //部门Id
            mask:false,                 //默认不显示部门
            exhibition:0,               //展示人员 0全部部门人员  1部门人员
            inputValue:'',              //输入框文字
            searchState:false,          //搜索状态
            searchDate:[],              //搜索数据
            iconState1:false,           //图标状态
            iconState2:false             //图标状态
        }
    }
    componentDidMount() {
        document.querySelector('title').innerText = '员工资料';
        this.getOfficeList();
        this.getOfficeUserList();
    }
    hideMask() {
        this.setState({ mask: false });
    }
    showMask() {
        this.setState({ mask: true,iconState1:true });
    }
    jumpSearch() {
        this.props.history.push('/search')
    }
    personalInformation(id) {
        this.state.departmentStaff.forEach((ev,n) =>{
            ev.staff.forEach((e,N) =>{
               if(e.id === id) {
                   window.Person = {
                       phone:e.phone,
                       name:e.name,
                       userid:e.id,
                       section:e.officeName || '其他',
                       loginN:e.loginName,
                       barState:true
                   }
               }
            })
        })
        this.props.history.push('/personalInformation')
    }
    searchPersonalInformation(i) {
        window.Person = {
            userid:this.state.searchDate[i].userid,
            phone:this.state.searchDate[i].phone,
            name:this.state.searchDate[i].name,
            section:this.state.searchDate[i].officeName,
            loginN:this.state.searchDate[i].loginName
        }
        this.props.history.push('/personalInformation')
    }
    goPersonalInformation(i) {
        window.Person = {
            userid:this.state.departmentPart[i].userid,
            phone:this.state.departmentPart[i].phone,
            name:this.state.departmentPart[i].name,
            section:this.state.departmentPart[i].officeName,
            loginN:this.state.departmentPart[i].loginName,
        }
        this.props.history.push('/personalInformation')
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
                        userid:item.id || '',
                        loginName:item.loginName || ''
                    })
                }
            })
            if(!ev.target.value) {
                this.setState({searchState:false});
            }
        })
        this.setState({searchDate:dataResult});
    }
    makeSearch() {           //搜索
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
    clickTerm(i) {                              //设置部门索引、名字、Id  
        this.setState({departmentIndex:i,departmentName:this.state.section[i].name,departmentId:this.state.section[i].id})
    }
    async getOfficeList() {                     //获取部门列表
        const result = await XHR.post(window.admin + API.getOfficeList,{companyid:window.sessionStorage.getItem('companyid')});
        const dataSource=JSON.parse(result).data || [];
        const sectionList = [];
        dataSource.forEach((item,index) =>{
            sectionList.push({
                name:item.name,
                id:item.id
            })
        });
        sectionList.push({
            name:'其他',
            id:'officeid'
        },{
            name:'全部',
            id:''
        })
        this.setState({section:sectionList});   
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
    async determineDepartment() {             //确认选定部门
        this.hideMask();
        if(this.state.departmentId){
            const result = await XHR.post(window.admin + API.getOfficeUserList,{
                companyid:window.sessionStorage.getItem('companyid'),
                officeid:this.state.departmentId    
            });
            const dataSource = JSON.parse(result).data || [];
            const userList = [];
            dataSource.map((item,index) =>
                userList.push({
                    name:item.name || '',
                    phone:item.phone || '',
                    officeName:item.officeName || '',
                    userid:item.id || '',
                    loginName:item.loginName || ''
                })
            )
            this.setState({iconState1:false,departmentPart:userList,exhibition:1});
        }else{
            this.getOfficeUserList();
            this.setState({ exhibition:0});
        }
    }
    render() {
        const {departmentStaff,section,departmentIndex, departmentName,exhibition,departmentPart,inputValue,searchState,searchDate,iconState1,iconState2,tipState1} = this.state;
        const Content = props =>{              //展示员工
            if(exhibition === 0) {             //全部
            return (
                <div className={styles.content}>
                    {
                        departmentStaff.map((item,index) =>
                        <div className={styles.dataList} key={index}>
                            <div className={styles.item}>
                                <div className={styles.department}>{item.department}</div>
                                <div className={styles.personnel}>
                                {
                                    item.staff.map((item,index) =>
                                    <div onClick={ev =>this.personalInformation(item.id)} className={styles.single} key={index}>
                                        <div className={styles.information}>
                                            <div className={styles.name}>{item.name}</div>
                                            <div className={styles.phone}>{item.phone}</div>
                                        </div>
                                        <img className={styles.forward} src={forward} alt=""/>
                                    </div>
                                )
                                }
                                </div>
                            </div>
                        </div>
                        ) 
                    }
                </div>
              )
            }else{                            //部门
                return(
                    <div className={styles.content}>
                        <div className={styles.department}>{this.state.departmentName}</div>
                        <div className={styles.personnel}>
                            {
                                departmentPart.map((item,index) =>
                                <div onClick={ev =>this.goPersonalInformation(index)} className={styles.single} key={index}>
                                    <div className={styles.information}>
                                        <div className={styles.name}>{item.name}</div>
                                        <div className={styles.phone}>{item.phone}</div>
                                    </div>
                                    <img className={styles.forward} src={forward} alt=""/>
                                </div>
                            )
                            }
                        </div>
                    </div>
                )
            }
        }
        const Mask = props => {               //部门列表
            if (this.state.mask) {
                return (
                    <div className={styles.mask}>
                        <div className={styles.makeHide} onClick={ev=>this.hideMask(ev)}></div>
                        <div className={styles.maskBox}>
                            <div className={styles.operation}>
                                <img  onClick={ev =>this.hideMask(ev)} className={styles.spread} src={spread} alt=""/>
                            </div>
                            <div className={styles.determine} onClick={ev =>this.determineDepartment(ev)}>确定</div>
                            <div className={styles.departmentBox}>
                                {
                                    section.map((item,index) =>
                                        <div onClick={ev =>this.clickTerm(index)} className={departmentIndex === index?styles.selectTerm:styles.term} key={index}>{item.name}</div>
                                    )
                                }
                                <div className={styles.clearBoth}></div>
                            </div>
                            <div className={styles.footer}>{departmentName}<Direction checked={this.state.mask} parent={this}/></div>
                        </div>
                    </div>
                );
            } else {
              return null;
            }
        }
        return(
            <div className={styles.container}>
                <div className={styles.header}>
                   <div className={styles.searchBox}>
                        <img className={styles.search}src={search} alt=""/>
                        <input className={styles.inputBox} onChange={ev =>this.getInputValue(ev)} type="text" placeholder="搜索姓名或手机号" value={inputValue}  />
                    </div>
                    <div onClick={ev=>this.makeSearch(ev)} className={styles.searchText}>搜索</div>
                </div>
                <div className={searchState === false? styles.showContent:styles.hideContent}>
                    <Content></Content>
                    <div className={styles.footer} onClick={ev =>this.showMask(ev)}>{departmentName}<Direction checked={this.state.mask} parent={this}/></div>
                    <Mask></Mask>
                </div>
                <SearchList visible={searchState} parent={this} allPerson={searchDate}/>
                <Toast isShow={tipState1} text="暂无此员工"/>
            </div>
        )
    }
}

export default  EmployeeInformation;