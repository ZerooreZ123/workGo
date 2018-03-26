//员工个人资料修改
import React,{Component} from 'react';
import styles from '../styles/EditProfile.css';

import XHR from '../utils/request';
import API from '../api/index';

import upBlue from '../asset/manager/triangle-top.png';
import downBlue from '../asset/manager/downBlue.png';


const Direction = (props) => {
    if (props.checked === true) {
      return <img  className={styles.top} src={downBlue} alt=""/>;
    } else {
      return <img  className={styles.top} src={upBlue} alt=""/>;
    }
}

class EditProfile extends Component{
    constructor() {
        super();
        this.state={
            section:[],                 //部门列表
            departmentName:window.Person.section,   //默认部门
            departmentIndex:'',         //部门的索引值
            departmentId:'',            //部门Id
            mask:false,                 //默认不显示部门
            valueName:window.Person.name           //用户姓名
        }
    }
    componentDidMount() {
        document.querySelector('title').innerText = '修改资料';
        this.getOfficeList();
    }
    showDepartment() {
        this.setState({mask:true});
    }
    hideDepartment() {
        this.setState({mask:false});
    }
    editName(ev) {
        this.setState({valueName: ev.target.value});
      }
    clickTerm(i) {                              //设置部门索引、名字、Id  
        this.setState({
            departmentIndex:i,
            departmentName:this.state.section[i].name,
            departmentId:this.state.section[i].id
        });
    }
    async getOfficeList() {                     //获取部门列表
        const result = await XHR.post(window.admin + API.getOfficeList,{companyid:window.sessionStorage.getItem('companyid')});
        const sectionList = [];
        JSON.parse(result).data.forEach((item,index) =>{
            sectionList.push({
                name:item.name,
                id:item.id
            })
        });
        this.setState({section:sectionList}); 
    }
    async determineDepartment() {             //更新用户资料
        if(this.state.departmentId){
            const result = await XHR.post(window.admin + API.update,{
                loginName:window.Person.loginN,
                officeid:this.state.departmentId,
                userName:this.state.valueName,
                oneselfLoginName:window.sessionStorage.getItem('loginName')
            });
            if(JSON.parse(result).success === 'T') {
                window.sessionStorage.setItem('editState',true)
                window.history.go(-1);
            }else{
                alert(JSON.parse(result).msg);
            }
        }else{
            return null;
        }
        this.hideDepartment();
    }
    render() {
        const {section,departmentName,departmentIndex} = this.state;
        const Exhibition = props => {
            if (this.state.mask) {
                return (
                    <div className={styles.mask}>
                        <div className={styles.maskBox}>
                            <div className={styles.departmentBox}>
                                {
                                    section.map((item,index) =>
                                        <div onClick={ev =>this.clickTerm(index)} className={departmentIndex === index?styles.selectTerm:styles.term} key={index}>{item.name}</div>
                                    )
                                }
                                <div className={styles.clearBoth}></div>
                            </div>
                        </div>
                    </div>
                );
            } else {
              return null;
            }
        }
        return(
            <div className={styles.container}>
                <div className={styles.content}>
                    <div className={styles.information}>
                        <input className={styles.name} type="text" onChange={ev =>this.editName(ev)} value={this.state.valueName} />
                        <div className={this.state.departmentId?styles.blueDepartment:styles.department}>{departmentName?departmentName:'其他'}</div>
                    </div>
                </div>
                <div className={styles.bottomBar}>
                    <div onClick={ev =>this.showDepartment(ev)} className={styles.add}>选择部门<Direction checked={true}/></div>
                    <div onClick={ev =>this.determineDepartment(ev)} className={styles.editor}>确定</div>
                </div>
                
                <Exhibition></Exhibition>
            </div>
        )
    }

}

export default EditProfile;