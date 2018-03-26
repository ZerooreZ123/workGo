//部门（人事部)
import React,{Component} from 'react';
import styles from '../styles/Department.css';

import Toast from '../components/Toast';

import XHR from '../utils/request';
import API from '../api/index';

import go from '../asset/manager/go.png';


class Department extends Component{
    constructor() {
        super();
        this.state={
            departmentStaff:[],
            tipState:false

        }
    }
    componentDidMount() {
        document.querySelector('title').innerText = window.sectionName1;
        this.getOfficeUserList();
    }
    personalInformation(i) {
        window.Person={
            name: this.state.departmentStaff[i].name,
            section:this.state.departmentStaff[i].officeName,
            userid:this.state.departmentStaff[i].id,
            loginN :this.state.departmentStaff[i].loginN,
            barState:false,
            phone:this.state.departmentStaff[i].phone || '',
        };
        console.log(this.state.departmentStaff[i]);
        this.props.history.push('/personalInformation');
    }
    async getOfficeUserList() {                //获取全部部门及部门人员列表
        const result = await XHR.post(window.admin + API.getOfficeUserList,{
            companyid:window.sessionStorage.getItem('companyid'),
            officeid:window.officeId    
        });
        const dataSource = JSON.parse(result).data;
        if(dataSource.length>0){
            const userList = [];
            dataSource.forEach((ev,i) =>{
                userList.push({
                    id:ev.id,
                    name:ev.name,
                    officeName:ev.officeName,
                    loginN:ev.loginName,
                    phone:ev.phone
                })
            })
            this.setState({departmentStaff:userList});
        }else{
            this.setState({departmentStaff:[],tipState:true});
            setTimeout(()=>{
                this.setState({tipState:false})
            },2000)
        }
    }
    render() {
        const {departmentStaff,tipState} = this.state;
        return(
            <div className={styles.container}>
                <div className={styles.content}>
                    {
                        departmentStaff.map((item,index) =>
                            <div onClick={ev =>this.personalInformation(index)} className={styles.item} key={index}>
                                <div className={styles.name}>{item.name}</div>
                                <img className={styles.forward} src={go} alt=""/>
                            </div> 
                        )
                    }
                </div>
                <Toast isShow={tipState} text="暂无数据"/>
            </div>
        )
    }

} 
export default Department