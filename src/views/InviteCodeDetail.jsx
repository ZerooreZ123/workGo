import React,{Component} from 'react';

import styles from '../styles/InviteCodeDetail.css';

import XHR from '../utils/request';
import API from '../api/index';
import down from '../asset/userCenter/down_arrow.png';
import up from '../asset/userCenter/down_up.png';
import spread from '../asset/manager/spread.png';

import headPortrait from '../asset/userCenter/headPortrait.png';


const Icon = ({direction})  => {
  if (direction === true) {
    return <img className={styles.down} src={up} alt=""/>;
  } else {
    return <img className={styles.down} src={down} alt=""/>;
  }
}

const Mask = ({visible,parent,List,Index}) => {               //部门列表
  if (visible) {
      return (
          <div className={styles.mask}>
               <div className={styles.makeHide} onClick={ev=>parent.hideMask(ev)}></div>
              <div className={styles.maskBox}>
                  <div className={styles.operation}>
                      <img onClick={ev =>parent.hideMask(ev)} className={styles.spread} src={spread} alt=""/>
                  </div>
                  <div className={styles.determine} onClick={ev =>parent.determineDepartment(ev)}>确定</div>
                  <div className={styles.departmentBox}>
                      {
                          List.map((item,index) =>
                              <div onClick={ev =>parent.clickTerm(index)} className={Index === index?styles.selectTerm:styles.term} key={index}>{item.name}</div>
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

class InviteCodeDetail extends Component {
  constructor() {
    super();
    this.state = {
        iconDirection:false,        //图标方向
        InputText:'',               //输入名字
        InputValue:'',              //输入部门
        departmentId:'',            //部门Id
        departmentIndex:'',         //部门的索引值
        mask:false,                 //遮罩层
        section:[],                 //部门列表
    }
}
componentDidMount() {
    document.querySelector('title').innerText = '填写资料';
    this.getOfficeList();
}
hideMask() {
  this.setState({ mask:false,iconDirection:false});
}
showMask() {
  this.refs.nameInput.blur();
  this.setState({ mask: true,iconDirection:true});
}
getName(ev) {           //获取输入的姓名
  this.setState({InputText:ev.target.value})
}
clickTerm(i) {                              //设置部门索引、名字、Id  
  this.setState({
    departmentIndex:i,
    departmentName:this.state.section[i].name,
    departmentId:this.state.section[i].id
  })
}
determineDepartment(){
  this.hideMask();
  this.setState({InputValue:this.state.departmentName});
}
async register() {
  if(this.state.InputText){
    const result = await XHR.post(window.admin + API.update,{
      loginName:window.sessionStorage.getItem('LoginName'),
      companyid:window.sessionStorage.getItem('comID'),
      phone:window.sessionStorage.getItem("phone"),
      officeid:this.state.departmentId,
      userName:this.state.InputText
    });
    this.props.history.replace('./userCenter/'+ window.sessionStorage.getItem('LoginName') +'/'+ window.sessionStorage.getItem('comID'));   
  }else{
      return null;
  }
}

async getOfficeList() {                     //获取部门列表
  const result = await XHR.post(window.admin + API.getOfficeList,{companyid:window.sessionStorage.getItem('comID')});
  const dataRourse = JSON.parse(result).data || [];
  const sectionList = [];
  dataRourse.forEach((item,index) =>{
      sectionList.push({
          name:item.name,
          id:item.id
      })
  });
  this.setState({section:sectionList || []});   
}
render() {
    const {mask,section,departmentIndex,InputValue,InputText,iconDirection} = this.state;
    return (
      <div className = {styles.container}>
        <div className = {styles.headImage}>
            <img className={styles.informationPhoto} src={headPortrait} alt=""/>
        </div>

        <div className = {InputText?styles.getCode1:styles.getCode}>
          <div className={InputText?styles.showName:styles.hideName}>姓名</div>
          <input ref='nameInput' className={styles.nameShow} onChange={ev =>this.getName(ev)} type="text" placeholder = "姓名" value={InputText}/>
          <div className={styles.must}>必填</div>
        </div>
        <div onClick={ev =>this.showMask(ev)} className = {InputValue?styles.getCode1:styles.getCode}>
          <div className={InputValue?styles.showBumen:styles.hideBumen}>部门</div>
          <div>{InputValue?InputValue:'部门'}</div>
          <Icon direction={iconDirection}/>
        </div>

        <div className={styles.next}>
          <div onClick={ev =>this.register(ev)} className = { InputText ? styles.nextCan:styles.nextStep}>完成</div>
        </div>
        <Mask visible={mask} parent={this} List={section} Index={departmentIndex} />
      </div>
    );
  }
}
export default InviteCodeDetail;