import React, { PureComponent } from 'react';
import { Modal, Checkbox, Form, Input, Icon , Row, Col, Button, DatePicker, message } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';

import { tenantMode, clientId, clientSecret } from '../../../defaultSettings';
import { getCookie } from '../../../utils/support';
import { getList,getVCode,exportOrder,getPhone } from '../../../services/newServices/order'
import { exportData,currentTime } from './data.js';
import { getToken } from '../../../utils/authority';
import { Base64 } from 'js-base64';
import { ORDERSOURCE } from './data';
import styles from './index.less';
import axios from 'axios'
import { getDataInfo } from '../../../services/order/customer';
import { setListData } from '../../../utils/publicMethod';

const FormItem = Form.Item;
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const CheckboxGroup = Checkbox.Group;

@connect(({ globalParameters}) => ({
  globalParameters,
}))
@Form.create()
class Export extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      loading:false,
      // 导出
      exportFileVisible:false,
      params:{},
      rangeList:[
        {"value":"今日",code:1},
        {"value":"昨日",code:2},
        {"value":"本周",code:3},
        {"value":"本月",code:4},
        {"value":"自定义",code:5},
      ],
      seleteTimeRange:1,
      exportDataList:exportData(),
      isIndeterminate:true,
      checkedList:[],
      downloadExcelParam:{

      },
      checked:false,
      createTime:'',
      endTime:'',
      retransmission:true,
      timer:0,
      smsType:true,
      phone:'',
      verificationCode:''
    };
  }

  componentWillMount() {
    const { globalParameters,exportVisible,queryUrlKey } = this.props;
    const { exportDataList } = this.state;
    if(globalParameters.detailData.createTime){
      this.setState({
        seleteTimeRange:5,
        downloadExcelParam:{
          createTime:moment(globalParameters.detailData.createTime).format('YYYY-MM-DD')+" 00:00:00",
          endTime:moment(globalParameters.detailData.endTime).format('YYYY-MM-DD')+" 23:59:59"
        }
      })
    }

    let list=''
    if(queryUrlKey === 'allPool'){
      list = exportDataList.filter(item => {
        return item.code != 'salesman'
      })
    }else {
      list = exportDataList
    }

    // 获取详情数据
    this.setState({
      params:globalParameters.detailData,
      exportVisible:exportVisible,
      exportDataList:list
    })
  }

  verification = (value) =>{
    if(value === null || value === undefined || value === "" || value === NaN || JSON.stringify(value) === "{}" || JSON.stringify(value) === "[]"){
      return true
    }
    return false
  }

  getDataList = () => {
    const {params,downloadExcelParam} = this.state;
    const { queryUrlKey } = this.props;
    let param={
      ...params,
      ...downloadExcelParam
    }
    for(let key in param){
      param[key] = param[key] === undefined ? null : param[key]
    }
    getDataInfo(queryUrlKey,param).then(res=>{
      console.log(res)
      if(res.data.records.length > 0){
        this.setState({
          exportFileVisible:true,
          retransmission: false
        })
      }else {
        message.error('当前条件下暂无可导出的数据,请修改查询条件');
      }

    })
  }


  // 下一步
  dataExport = () => {
    const {downloadExcelParam,checkedList,exportDataList,seleteTimeRange}=this.state;
    const oneMonth =31*24*3600*1000;
    // if(seleteTimeRange === 1 ){
    //   downloadExcelParam.createTime=moment().format('YYYY-MM-DD')+" 00:00:00";
    //   downloadExcelParam.endTime=moment().format('YYYY-MM-DD')+" 23:59:59";
    // }
    // if(this.verification(downloadExcelParam.createTime)){
    //   message.error('请选择导出时间范围');
    //   return false;
    // }else if(this.verification(downloadExcelParam.endTime)){
    //   message.error('请选择导出时间范围');
    //   return false;
    // }else if((new Date(downloadExcelParam.endTime).getTime()-new Date(downloadExcelParam.createTime).getTime()) > oneMonth){
    //   message.error('导出时间范围不可超过31天');
    //   return false;
    // }else if(this.verification(checkedList)){
    //   message.error('请选择导出字段');
    //   return false;
    // }

    if(this.verification(checkedList)){
      message.error('请选择导出字段');
      return false;
    }
    let fileds = "";
    for(let i=0; i<exportDataList.length; i++){
      if(exportDataList[i].checked){
        fileds+= i === 0 ? exportDataList[i].code+"," : exportDataList[i].code+","
      }
    }
    downloadExcelParam.fileds = fileds.substring(0,fileds.length - 1);
    this.setState({
      downloadExcelParam
    })
    // 验证当前条件下是否有数据
    // this.getDataList()

    this.setState({
      exportFileVisible:true,
      retransmission: false
    })
    getPhone().then(res=>{
      this.setState({
        phone:res.data
      })
    })

  };

  handleCancel = () =>{
    this.setState({
      seleteTimeRange:1
    })
    this.props.handleCancelExport()
  }

  // 获取验证码
  getVerificationCode = () =>{
    const tenantId=getCookie("tenantId") || null;
    const userName=getCookie("userName") || null;

    getVCode(userName,tenantId,2).then(res=>{
      //   console.log(res)
      if(res.code=== 200){
        this.setState({
          smsType:false,
          retransmission: true,
          timer:60
        })
        this.setTimer();
      }else {
        message.error(res.msg);
      }
    })
  }

  setTimer(){
    setTimeout(()=>{
      const {timer,retransmission}= this.state
      if(timer === 0){
        this.setState({
          retransmission: false,
        })
      }else{
        this.setState({
          timer: this.state.timer - 1,
        })
        this.setTimer();
      }
    },1000)
  }

  handleCancelExportFile = () =>{
    const {downloadExcelParam,seleteTimeRange}=this.state;
    //downloadExcelParam.createTime='';
    //downloadExcelParam.endTime='';
    this.setState({
      exportFileVisible:false,
      timer:0,
      seleteTimeRange:seleteTimeRange,
      verificationCode:'',
      downloadExcelParam
    })
  }

  // 导出
  exportFilePopup =(cellBack) =>{
    // 验证是否获取短信验证码
    const {smsType,downloadExcelParam,params,verificationCode}=this.state;
    const  {queryUrlKey}=this.props;
    if(smsType){
      message.error('导出数据需要短信验证，请先获取短信验证码！');
      return false;
    }
    if(verificationCode.length < 6){
      message.error('验证码不能小于6位数');
      return false;
    }
    if(verificationCode.length > 6){
      message.error('验证码不能大于6位数');
      return false;
    }

    let type=''
    if(queryUrlKey === 'list'){
      type = '0'
    }else {
      type = '1'
    }

    let param={
      ...params,
      code:verificationCode,
      exportType:type,
      fileds:downloadExcelParam.fileds,
      startTime:params.createTime
    }
    delete param.createTime;

    if(!param.clientLevel){
      param.clientLevel = null
    }
    if(!param.clientName){
      param.clientName = null
    }
    if(!param.clientPhone){
      param.clientPhone = null
    }
    if(!param.clientStatus){
      param.clientStatus = null
    }
    if(!param.createUser){
      param.createUser = null
    }
    if(!param.endTime){
      param.endTime = null
    }
    if(!param.followTime){
      param.followTime = null
    }
    if(!param.salesman){
      param.salesman = null
    }
    if(!param.startTime){
      param.startTime = null
    }

    // param.deptId = getCookie("dept_id");
    axios({
      method: "post",
      url:`/api/client_info/clientinfo/exportClient`,
      data:param,
      headers: {
        "content-type": "application/json; charset=utf-8",
        "Authorization": `Basic ${Base64.encode(`${clientId}:${clientSecret}`)}`,
        "Blade-Auth": getToken(),
        "token": getToken(),
      },
      // 设置responseType对象格式为blob
      responseType: "blob"
    }).then(res => {
      console.log(res)
      if(!res.data.code){
        let data = res.data;
        let fileReader = new FileReader();
        fileReader.readAsText(data, 'utf-8');
        fileReader.onload = function() {
          try {
            let jsonData = JSON.parse(this.result);  // 说明是普通对象数据，后台转换失败
            message.error(jsonData.data);
          }catch(err){
            cellBack(res)
          }
        };
      }else {
        message.error(res.data.msg || "导出失败");
      }
    })
  }

  // 下载方法
  downLoadBlobFile = (res) =>{
    var elink = document.createElement('a');
    elink.download = currentTime()+'.xlsx';
    elink.style.display = 'none';
    var blob = new Blob([res.data]);
    elink.href = URL.createObjectURL(blob);
    document.body.appendChild(elink);
    elink.click();
    document.body.removeChild(elink);
    this.setState({
      exportFileVisible:false,
      exportVisible:false,
      timer:0,
      verificationCode:''
    })
    this.props.handleCancelExport()

  }

  codeChange =(e) =>{
    this.setState({
      verificationCode:e.target.value
    })
  }


  handleChange = (item,index) => {
    const {exportDataList}=this.state;
    let list=[...exportDataList]
    list[index].checked=!list[index].checked;
    let checkedL=list[index].checked? list[index] : [];
    let checkedList=[]
    checkedList.push(checkedL)
    console.log(checkedList)
    this.setState({
      exportDataList:list,
      checkedList:checkedList
    })
  };

  handleCheckAllChange = e => {
    console.log(e.target.checked)
    const {exportDataList}=this.state;

    for(let i=0; i<exportDataList.length; i++){
      exportDataList[i].checked =e.target.checked ? true : false
    }
    this.setState({
      isIndeterminate:false,
      checked:e.target.checked ? true : false,
      checkedList: e.target.checked ? exportDataList : [],
    })
  };

  changeTimeRange = (item) => {
    console.log(item.code)
    const {exportDataList,params}=this.state;
    console.log(params)
    this.setState({
      seleteTimeRange:item.code
    })
    const downloadExcelParam={};
    // 本日
    if(item.code === 1){
      downloadExcelParam.createTime = moment().format('YYYY-MM-DD')+" 00:00:00";
      downloadExcelParam.endTime = moment().format('YYYY-MM-DD')+" 23:59:59";
      this.setState({
        downloadExcelParam:downloadExcelParam
      })
    }else if(item.code === 2){
      // 昨日
      downloadExcelParam.createTime = moment(new Date()-24*60*60*1000).format('YYYY-MM-DD')+" 00:00:00";
      downloadExcelParam.endTime = moment(new Date()-24*60*60*1000).format('YYYY-MM-DD')+" 23:59:59";
      this.setState({
        downloadExcelParam:downloadExcelParam
      })
    }else if(item.code === 3){
      // 本周
      downloadExcelParam.createTime = moment().startOf('week').format('YYYY-MM-DD') +" 00:00:00";
      downloadExcelParam.endTime = moment().endOf('week').format('YYYY-MM-DD')+" 23:59:59";
      this.setState({
        downloadExcelParam:downloadExcelParam
      })
    }else if(item.code === 4){
      // 本月
      downloadExcelParam.createTime = moment().startOf('month').format('YYYY-MM-DD') +" 00:00:00";
      downloadExcelParam.endTime = moment().endOf('month').format('YYYY-MM-DD') +" 00:00:00";
      this.setState({
        downloadExcelParam:downloadExcelParam
      })
    }else if(item.code === 5){
      downloadExcelParam.createTime = params.createTime;
      downloadExcelParam.endTime = params.endTime;
      if(!params.createTime){
        params.createTime=""
      }
      if(!params.endTime){
        params.endTime=""
      }
      this.setState({
        downloadExcelParam:downloadExcelParam,
        ...params
      })
    }
  };

  onOk = (value) => {
    const downloadExcelParam={};
    downloadExcelParam.createTime = moment(value[0]).format('YYYY-MM-DD HH:mm:ss');
    downloadExcelParam.endTime = moment(value[1]).format('YYYY-MM-DD HH:mm:ss');
    this.setState({
      downloadExcelParam:downloadExcelParam
    })
  }

  render() {
    const {
      form: { getFieldDecorator },
      handleCancelExport,
    } = this.props;

    const {
      rangeList,
      seleteTimeRange,
      exportDataList,
      exportFileVisible,
      exportVisible,
      timer,
      phone,
      retransmission,
      isIndeterminate,
      verificationCode,
      params,
      checkedList
    } = this.state;


    return (
      <>
        <Modal
          title="数据导出"
          visible={exportVisible}
          maskClosable={false}
          width={760}
          onCancel={()=>this.handleCancel()}
          maskClosable={false}
          footer={[
            <Button key="back" onClick={()=>this.handleCancel()}>
              取消
            </Button>,
            <Button type="primary" onClick={()=>this.dataExport()}>
              下一步
            </Button>,
          ]}
        >
          <div style={{padding:"0 30px"}}>
{/*
            <Row gutter={24} style={{marginBottom:20}}>
              <Col span={4}>导出范围：</Col>
              <Col span={20}>
                {rangeList.map((item,index)=>{
                  return (<span key={index} onClick={()=>this.changeTimeRange(item)} className={(index === 0 && seleteTimeRange === item.code) ? `${styles.range_item} ${styles.range_left_btn} ${styles.range_selete}` :
                    ((index+1) === rangeList.length && seleteTimeRange === item.code) ? `${styles.range_item} ${styles.range_right_btn} ${styles.range_selete}` :
                      (seleteTimeRange === item.code) ? `${styles.range_item} ${styles.range_selete}` :
                        index === 0 ? `${styles.range_item} ${styles.range_left_btn}` :
                          (index+1) === rangeList.length ? `${styles.range_item} ${styles.range_right_btn}` :
                            `${styles.range_item}`} >{item.value}</span>)
                })}
                {
                  seleteTimeRange === 5 ?
                    (<RangePicker style={{marginTop:20}}
                                  showTime={{
                                    hideDisabledOptions: true,
                                  }}
                                  defaultValue={
                                    params.createTime ?
                                      [moment(params.createTime, 'YYYY-MM-DD HH:mm:ss'), moment(params.endTime, 'YYYY-MM-DD HH:mm:ss')]
                                      :""}
                                  format="YYYY-MM-DD HH:mm:ss"
                                  onOk={this.onOk}
                    />)
                    :""
                }
              </Col>
            </Row>
*/}
            <Row gutter={24}>
              <Col span={4}>导出字段：</Col>
              <Col span={20}>
                <Checkbox indeterminate={isIndeterminate} onChange={this.handleCheckAllChange}>全部选择</Checkbox>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={4}></Col>
              <Col span={20}>
                {
                  exportDataList.map((item,index) => {
                    return (
                      <div className={styles.export_fields_item}>
                        <Checkbox
                          checked={item.checked}
                          onChange={()=>this.handleChange(item,index)}
                        >
                          {item.value}
                        </Checkbox>
                      </div>)
                  })}

              </Col>
            </Row>
          </div>
        </Modal>

        <Modal
          title="安全验证"
          visible={exportFileVisible}
          width={360}
          onCancel={this.handleCancelExportFile}
          maskClosable={false}
          footer={[
            <Button key="back" onClick={this.handleCancelExportFile}>
              取消
            </Button>,
            <Button type="primary" onClick={()=>this.exportFilePopup(this.downLoadBlobFile)}>
              导出
            </Button>,
          ]}
        >
          <Input style={{marginBottom:20}}
                 value={phone}
                 disabled
                 prefix={<Icon type="phone" style={{ color: 'rgba(0,0,0,.25)'}} />}
          />
          <Input style={{width:'160px',marginRight:10}}
                 placeholder='验证码'
                 value={verificationCode}
                 onChange={(e)=>this.codeChange(e)}
                 prefix={<Icon type="safety-certificate" style={{ color: 'rgba(0,0,0,.25)' }} />}
          />
          <Button style={{float:'right'}} disabled={retransmission} onClick={()=>this.getVerificationCode()}>获取验证码
            {
              timer !== 0 ?
                (<span>({timer}s)</span>)
                :""
            }</Button>
        </Modal>
      </>
    );
  }
}

export default Export;
