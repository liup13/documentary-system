import React, { PureComponent } from 'react';
import { Form, Input, Card, Row,Modal, Col, Button, Icon , Select, message, Tabs, Cascader, Radio,Timeline,Tooltip} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';

import Panel from '../../../components/Panel';
import FormTitle from '../../../components/FormTitle';
import styles from './edit.less';
import { CITY } from '../../../utils/city';
import { getQueryString } from '../../../utils/utils';
import { getCookie } from '../../../utils/support';
import {
  updateData,
  getDetails,
  orderDetail,
  updateReminds,
  productTreelist, 
  subscription,
  deleteLogisticsSuber, 
  localPrinting, 
  logisticsRepeatPrint,
} from '../../../services/newServices/order';
import {ORDERSTATUS,ORDERSOURCE} from './data.js';
import FormDetailsTitle from '../../../components/FormDetailsTitle';
import Survey from './Survey'
import { setListData } from '../../../utils/publicMethod';
import OrderListNew from './OrderListNew';
import {
  LOGISTICSCOMPANY,
} from './data.js';
import bell from '../../../assets/bell.svg'
import bellShut from '../../../assets/bellShut.svg'
import loginchahua from '../../../assets/loginchahua.png';

const FormItem = Form.Item;
const { TextArea } = Input;
const { TabPane } = Tabs;

let backUrl = "";

@connect(({ globalParameters}) => ({
  globalParameters,
}))
@Form.create()
class OrdersEdit extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      detail:{},
      edit:true,
      data:{
        order:'10',
        followUp:'2',
        service0rder:'6',
        product:"9",
        ownership:"3"
      },
      ids:'',
      selectedOptions:"",
      primary:'primary',
      primary1:'',
      productList:[],
      repeatLoading:false,
      payPanyId:null,
      productTypeId:null,
      productId:null,
      detailsId:null
    };
  }

  // componentWillReceiveProps(nexProps,prePorps) {
  //   console.log("12323123",nexProps.match.params.id,this.state.detailsId);
  //   if(nexProps.match.params.id != this.state.detailsId){
  //     // 获取详情数据
  //     this.setState({
  //       detailsId:nexProps.match.params.id,
  //     },()=>{
  //       this.getTreeList();
  //       this.getEditDetails();
  //     });
  //   }
  // }

  componentWillMount() {

    const { globalParameters } = this.props;
    console.log(globalParameters)
    // 获取详情数据
    this.setState({
      detailsId:globalParameters.detailData.id,
    },()=>{
      this.getTreeList();
      this.getEditDetails();
    });
    
    

    if(window.location.hash.indexOf("allOrders") != -1){
      backUrl = "/order/allOrders?type=details"
    }else if(window.location.hash.indexOf("salesmanOrder") != -1){
      backUrl = "/order/salesmanOrder?type=details"
    }else if(window.location.hash.indexOf("warehouseOrder") != -1){
      backUrl = "/order/warehouseOrder?type=details"
    }else if(window.location.hash.indexOf("afterSaleOrder") != -1){
      backUrl = "/order/afterSaleOrder?type=details"
    }else if(window.location.hash.indexOf("executive") != -1){
      backUrl = "/order/executive?type=details"
    }

    
  }

  getTreeList = () => {
    productTreelist().then(res=>{
      console.log(res.data,"productTreelist")
      this.setState({productList:res.data})
    })
  }

  changeDetails = (id) => {
    // 获取详情数据
    this.setState({
      detailsId:id,
    },()=>{
      this.getEditDetails();
    });
  }

  getEditDetails = () => {
    const params={
      id:this.state.detailsId
    }
    getDetails(params).then(res=>{
      this.setState({
        detail:res.data,
        payPanyId:res.data.payPanyId || '0',
        productTypeId:res.data.productTypeId || '0',
        productId:res.data.productId || '0',
      })
      this.getList(res.data)
    })
  }

  getList = (detail) =>{
    console.log(detail)
    const params={
      userAddress:detail.userAddress,
      userPhone:detail.userPhone,
      userName:detail.userName,
      id:detail.id,
      size:100,
      current:1
    }
    orderDetail(params).then(res=>{
      console.log(res)
      const data = res.data.records;
      let list=[];
      for(let i=0; i<data.length; i++){
        if(data[i].id != detail.id){
          list.push(data[i])
        }
      }
      this.setState({
        orderDetail:list,
        orderListLength:list.length
      })
    })
  }

  // 提醒
  handleReminds = () => {
    const { detail } = this.state;
    console.log(detail)
    Modal.confirm({
      title: '提醒',
      content: "确定提示此订单吗？",
      okText: '确定',
      okType: 'primary',
      cancelText: '取消',
      onOk() {
        updateReminds([{
          deptId:detail.deptId,
          id:detail.id,
          outOrderNo:detail.outOrderNo,
          payAmount:Number(detail.payAmount),
          userPhone:detail.userPhone,
          userName:detail.userName,
        }]).then(res=>{
          if(res.code === 200){
            message.success(res.msg);
          }
        })
      },
      onCancel() {},
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    const { form } = this.props;
    const { detail,selectedOptions, payPanyId, productTypeId, productId, } = this.state;
    form.validateFieldsAndScroll((err, values) => {
      //ORDERSTATUS.map(item => {
      //  if(item.name === values.confirmTag){
      //    values.confirmTag = item.key
      //  }
      //})
      ORDERSOURCE.map(item => {
        if(item.name === values.orderSource){
          values.orderSource = item.key
        }
      })
      values.id = detail.id;
      values.userAddress=`${selectedOptions}${values.userAddress}`;
      if(values.productType && values.productType != ""){
        values.productName = values.productType[2];
        values.productType = `${values.productType[0]}/${values.productType[1]}`;
        values.payPanyId = payPanyId;
        values.productTypeId = productTypeId; 
        values.productId = productId;
      }

      if (values.orderNote === ''){
        values.orderNote=null
      }
      if (values.productCoding === ''){
        values.productCoding=null
      }

      if (!err) {
        const _this=this;
        if(values.logisticsCompany != detail.logisticsCompany || values.logisticsNumber != detail.logisticsNumber){
          if (values.logisticsCompany === ''){
            values.logisticsCompany=null
          }
          if (values.logisticsNumber === ''){
            values.logisticsNumber=null
          }
          const params = {
            ...values
          };
          // if(detail.logisticsStatus){
            Modal.confirm({
              title: '提示',
              content: '当前订单物流已经订阅,此次变更会删掉订阅有关信息,确认是否清理物流从新保存',
              okText: '确定',
              okType: 'danger',
              cancelText: '取消',
              keyboard:false,
              async onOk() {
                const _data={
                  id:detail.id,
                  outOrderNo:detail.outOrderNo
                }
                deleteLogisticsSuber(_data).then(resp=>{
                  console.log(resp)
                  updateData(params).then(res=>{
                    if(res.code === 200){
                      message.success(res.msg);
                      _this.setState({
                        edit:true,
                        primary:"primary",
                        primary1:''
                      })
                      _this.getEditDetails()
                    }else {
                      message.error(res.msg);
                    }
                  })
                })
              },
              onCancel() {},
            });
          // }else {
          //   updateData(params).then(res=>{
          //     if(res.code === 200){
          //       message.success(res.msg);
          //       this.setState({
          //         edit:true,
          //         primary:"primary",
          //         primary1:''
          //       })
          //       this.getEditDetails()
          //     }else {
          //       message.error(res.msg);
          //     }
          //   })
          // }
        }else {
          if (values.logisticsCompany === ''){
            values.logisticsCompany=null
          }
          if (values.logisticsNumber === ''){
            values.logisticsNumber=null
          }
          const params = {
            ...values
          };
          updateData(params).then(res=>{
            if(res.code === 200){
              message.success(res.msg);
              this.setState({
                edit:true,
                primary:"primary",
                primary1:''
              })
              this.getEditDetails()
            }else {
              message.error(res.msg);
            }
          })
        }
      }
    });
  };

  voiceSubmit = (key) =>{
    const { detail } = this.state;
    const params={
      voiceStatus:key,
      id :detail.id
    }
    updateData(params).then(res=>{
      if(res.code === 200){
        message.success(res.msg);
        this.setState({
          edit:true,
          primary:"primary",
          primary1:''
        })
        this.getEditDetails()
      }else {
        message.error(res.msg);
      }
    })
  };

  handleChange = value => {
  };

  disabledDate = (current) => {
    // Can not select days before today and today
    return current && current > moment().endOf('day');
  }

  onChange = (value, selectedOptions) => {
    let text = ""
    for(let i=0; i<selectedOptions.length; i++){
      text += selectedOptions[i].label
    }
    this.setState({
      cityparam:{
        province:value[0],
        city:value[1],
        area:value[2],
      },
      selectedOptions:text
    })
  };

  RadioChange = e => {
    this.setState({
      value: e.target.value,
    });
  };

  clickEdit = () => {
    this.setState({
      edit:false,
      primary:'',
      primary1:'primary'
    })
  };

  // 复打
  repeat = () => {
    const {detail}=this.state;
    // 当前时间戳
    const timestamp = (new Date()).getTime();
    const timeInterval = 24 * 60 * 60 * 1000 * 2;
    const time = timestamp - (new Date(detail.taskCreateTime)).getTime();
    this.setState({
      repeatLoading:true
    });
    const  tips=[];
    if(!detail.taskId){
      tips.push(detail.userName)
      Modal.confirm({
        title: '提示',
        content: detail.userName+"客户没有首次打印记录,不能进行重复打印!",
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk() {},
        onCancel() {},
      });
    }else if( time > timeInterval){
      tips.push(detail.userName)
      Modal.confirm({
        title: '提示',
        content: detail.userName+"客户的订单 距离首次时间超过2天 禁止打印！",
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk() {},
        onCancel() {},
      });
    }
    if(tips.length > 0 ){
      return false;
    }

    if(detail.logisticsPrintType === "1" || detail.logisticsPrintType === "2"){
      // 本地打印
      localPrinting({
        id:detail.id,
        logisticsPrintType:detail.logisticsPrintType
      }).then(res=>{
        this.setState({
          repeatLoading:false
        });
        if(res.code === 200){
          sessionStorage.setItem('imgBase64', res.data)
          window.open(`#/order/allOrders/img`);
        }else{
          message.error(res.msg);
        }
      })
    }else{
      let param = [];
      param.push(detail.taskId)
      logisticsRepeatPrint(param).then(res=>{
        this.setState({
          repeatLoading:false
        });
        if(res.code === 200){
          message.success(res.msg);
        }
      })
    }
  };

  getText = (key, type) => {
    let text = ""
    type.map(item=>{
      if(item.key === key){
        text = item.name
      }
    })
    return text
  }

  validatePhone = (rule, value, callback) => {
    if (!(/^1[3456789]\d{9}$/.test(value))) {
      callback(new Error('请输入正确的手机号格式'));
    }else{
      callback();
    }
  }

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    const {
      data,
      loading,
      orderDetail,
      detail,
      edit,
      orderListLength,
      primary,
      primary1,
      productList
    } = this.state;

    const formAllItemLayout = {
      labelCol: {
        span: 8,
      },
      wrapperCol: {
        span: 16,
      },
    };

    return (
        <Modal
        title="详情"
          visible={this.props.detailsVisible}
          width={1290}
          onCancel={this.props.handleCancelDetails}
          footer={null}
          bodyStyle={{paddingTop:0}}
          maskClosable={false}
          style={{
            top:40
          }}
        >
        <Form style={{ marginTop: 8 }}>
          <Card bordered={false} className={styles.editContent}>
            <Row gutter={24} style={{ margin: 0 }}>
              <Col span={8} style={{ padding: 0 }} className={styles.leftContent}>
                <div className={styles.titleBtn}>
                  <Button type={primary} onClick={this.handleSubmit}>保存</Button>
                  <Button type={primary1} icon="edit" onClick={this.clickEdit}>编辑</Button>
                  {/* <Button  icon="delete">删除</Button> */}
                  <Button
                    icon="bell"
                    onClick={this.handleReminds}
                  >提醒</Button>
                  <Button icon="copy" onClick={this.repeat}>复打</Button>
                  {/* <Button  icon="folder">归档</Button> */}
                </div>
                <div className={styles.editList} style={{ padding: '20px' }}>
                  <FormDetailsTitle title="订单信息" style={{ margin:'0'}} />
                  <Form span={24}>
                    <FormItem {...formAllItemLayout} label="客户姓名">
                      {getFieldDecorator('userName', {
                        rules: [
                          {
                            message: '请输入客户姓名',
                          },
                        ],
                        initialValue: detail.userName,
                      })(<Input disabled={detail.confirmTag === '0' || detail.confirmTag === '1' || detail.confirmTag === '2' ? edit : true} placeholder="请输入客户姓名" />)}
                    </FormItem>
                    <FormItem {...formAllItemLayout} label="手机号">
                      {getFieldDecorator('userPhone', {
                        rules: [
                          { required: true, validator: this.validatePhone },
                        ],
                        initialValue: detail.userPhone,
                      })(<Input disabled={detail.confirmTag === '0' || detail.confirmTag === '1' || detail.confirmTag === '2' ? edit : true} placeholder="" />)}
                    </FormItem>
                    <FormItem {...formAllItemLayout} label="备用手机号">
                      {getFieldDecorator('backPhone', {
                        initialValue: detail.backPhone,
                      })(<Input disabled={detail.backPhone ? true : edit} placeholder="" />)}
                    </FormItem>

                    <FormItem {...formAllItemLayout} label="所在地区">
                      {getFieldDecorator('region', {
                        initialValue: [detail.province, detail.city, detail.area],
                      })(
                        <Cascader
                          // defaultValue={[detail.province, detail.city, detail.area]}
                          options={CITY}
                          disabled={(detail.confirmTag === 0 || detail.confirmTag === '0' || detail.confirmTag === 1 || detail.confirmTag === '1'|| detail.confirmTag === 2 || detail.confirmTag === '2') ? edit : true}
                          onChange={this.onChange}
                        />
                      )}
                    </FormItem>
                    <FormItem {...formAllItemLayout} label="收货地址">
                      {getFieldDecorator('userAddress', {
                        rules: [
                          {
                            message: '请输入收货地址',
                          },
                        ],
                        initialValue: detail.userAddress,
                      })(<Input title={detail.userAddress} disabled={(detail.confirmTag === 0 || detail.confirmTag === '0' || detail.confirmTag === 1 || detail.confirmTag === '1'|| detail.confirmTag === 2 || detail.confirmTag === '2') ? edit : true} placeholder="请输入收货地址" />)}
                    </FormItem>
                    {/*                  <FormItem {...formAllItemLayout} label="客戶状态">
                    {getFieldDecorator('userAddress', {
                      rules: [
                        {
                          message: '',
                        },
                      ],
                      initialValue: detail.userAddress,
                    })(<Input disabled={edit} placeholder="" />)}
                  </FormItem>*/}
                    {/*                  <FormItem {...formAllItemLayout} label="订单状态">
                    {getFieldDecorator('confirmTag', {
                      rules: [
                        {
                          message: '',
                        },
                      ],
                      initialValue: this.getText(detail.confirmTag,ORDERSTATUS),
                    })(<Input disabled={edit} placeholder="" />)}
                  </FormItem>*/}
                    <FormItem {...formAllItemLayout} label="订单金额">
                      {getFieldDecorator('payAmount', {
                        initialValue: detail.payAmount,
                      })(<Input disabled placeholder="" />)}
                    </FormItem>
                    <FormItem {...formAllItemLayout} label="订单来源">
                      {getFieldDecorator('orderSource', {
                        initialValue: this.getText(parseInt(detail.orderSource),ORDERSOURCE),
                      })(<Input disabled placeholder="" />)}
                    </FormItem>
                    <FormItem {...formAllItemLayout} label="订单归属">
                      {getFieldDecorator('salesman', {
                        rules: [
                          {
                            message: '',
                          },
                        ],
                        initialValue: detail.salesman,
                      })(<Input disabled placeholder="" />)}
                    </FormItem>
                    <FormItem {...formAllItemLayout} label="SN">
                      {getFieldDecorator('productCoding', {
                        initialValue: detail.productCoding,
                      })(<Input disabled={edit} placeholder="" />)}
                    </FormItem>
                    <FormItem {...formAllItemLayout} label="产品类型">
                      {getFieldDecorator('productType', {
                        initialValue: detail.productType?[...detail.productType.split("/"),detail.productName]:null, 
                      })(
                        <Cascader
                          disabled={edit}
                          options={productList}
                          fieldNames={{ label: 'value'}}
                          onChange={(value, selectedOptions)=>{
                            const { form } = this.props;

                            this.setState({
                              payPanyId:selectedOptions[0].id,
                              productTypeId:selectedOptions[1].id,
                              productId :selectedOptions[2].id,
                            })

                            form.setFieldsValue({
                              payAmount:selectedOptions[2].payamount
                            })
                            // }
                          }}
                        />
                      )}
                    </FormItem>

                    <FormItem {...formAllItemLayout} label="物流公司">
                      {getFieldDecorator('logisticsCompany', {
                        initialValue: detail.logisticsCompany,
                      })(
                        <Select
                          style={{height:45,float:"right"}}
                          disabled={(detail.confirmTag === 0 || detail.confirmTag === '0' || detail.confirmTag === 1 || detail.confirmTag === '1'|| detail.confirmTag === 2 || detail.confirmTag === '2'|| detail.confirmTag === 3 || detail.confirmTag === '3') ? edit : true}
                          placeholder={"请选择物流公司"}>
                          {Object.keys(LOGISTICSCOMPANY).map(key=>{
                            return (<Option value={LOGISTICSCOMPANY[key]}>{LOGISTICSCOMPANY[key]}</Option>)
                          })}
                        </Select>
                      )}
                    </FormItem>
                    <FormItem {...formAllItemLayout} label="物流单号" className={styles.salesman}>
                      {getFieldDecorator('logisticsNumber', {
                        initialValue: detail.logisticsNumber,
                      })(<Input
                        disabled={(detail.confirmTag === 0 || detail.confirmTag === '0' || detail.confirmTag === 1 || detail.confirmTag === '1'|| detail.confirmTag === 2 || detail.confirmTag === '2'|| detail.confirmTag === 3 || detail.confirmTag === '3') ? edit : true}
                        placeholder="请输入物流单号" />)}
                    </FormItem>
                    {/*<FormItem {...formAllItemLayout} label="开启提醒"  className={styles.salesman}>*/}
                      {/*{getFieldDecorator('voiceStatus', {*/}
                        {/*initialValue: parseInt(detail.voiceStatus),*/}
                      {/*})(<Radio.Group  onChange={this.RadioChange} value={this.state.value}>*/}
                        {/*<Radio disabled={edit} value={1}>是</Radio>*/}
                        {/*<Radio disabled={edit} value={0}>否</Radio>*/}
                      {/*</Radio.Group>)}*/}
                    {/*</FormItem>*/}

                    <FormDetailsTitle title="其他信息" />
                    <FormItem {...formAllItemLayout} label="微信号">
                      {getFieldDecorator('wechatId', {
                        initialValue: detail.wechatId,
                      })(<Input disabled={detail.wechatId ? true : edit} placeholder="" />)}
                    </FormItem>
                    <FormItem {...formAllItemLayout} label="备注">
                      {getFieldDecorator('orderNote', {
                        initialValue: detail.orderNote,
                      })(<TextArea rows={4} disabled={edit} placeholder="请输入备注信息" />)}
                    </FormItem>
                  </Form>
                </div>
              </Col>
              <Col span={16} style={{ padding: 0 }} className={styles.rightContent}>
                <div className={styles.titleBtn}>
                  {detail.voiceStatus === "1" ? (
                    <Tooltip title="激活自动提醒开关">
                      <Button icon="bell" onClick={()=>this.voiceSubmit(0)} style={{ float:"right",border:'0',boxShadow:'none'}}></Button>
                    </Tooltip>
                  ) :(
                    <Button style={{ float:"right",border:'0',boxShadow:'none'}} onClick={()=>this.voiceSubmit(1)}>
                      <Tooltip title="激活自动提醒开关">
                        <img src={bellShut} style={{float:"right"}} />
                      </Tooltip>
                    </Button>
                  )}

                  {/* <Button icon="plus">工单</Button>
                  <Button  icon="plus">产品</Button>
                  <Button  icon="plus">地址</Button> */}
                </div>
                <div className={styles.tabContent} style={{marginRight:20,paddingTop:14}}>
                  <Tabs defaultActiveKey="1" onChange={this.callback}>
                    <TabPane tab="概况" key="1">
                      <Survey
                        detail={detail}
                        getEditDetails={this.getEditDetails}
                      />
                    </TabPane>
                    <TabPane tab={`重复订单(${orderListLength})`} key="2">
                      <OrderListNew
                        detail={detail}
                        orderDetail={orderDetail}
                        changeDetails={this.changeDetails}
                      />
                    </TabPane>
                    {/* <TabPane tab={`跟进(${data.followUp})`} key="3">
                      <FollowUp />
                    </TabPane> */}
                    {/* <TabPane tab={`服务(${data.service0rder})`} key="4">
                      服务工单()
                    </TabPane>
                    <TabPane tab={`产品(${data.product})`} key="5">
                      产品记录()
                    </TabPane>
                    <TabPane tab={`归属(${data.ownership})`} key="6">
                      归属记录
                    </TabPane>
                    <TabPane tab="操作" key="7">
                      操作日志()
                    </TabPane> */}
                  </Tabs>
                </div>
              </Col>
            </Row>
          </Card>
        </Form>
        </Modal>
    );
  }
}

export default OrdersEdit;
