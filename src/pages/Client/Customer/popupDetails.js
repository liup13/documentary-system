import React, { PureComponent } from 'react';
import { Form, Input, Card, Row,Modal, Col, Button, Icon , Select, message, Tabs, Cascader, Radio,Timeline,Tooltip} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import styles from '../../Order/components/edit.less';
import {
  productTreelist,
  updateReminds,
} from '../../../services/newServices/order';
import {getDetail,updateData,clientOrder,clientOperationRecord,createOrder} from '../../../services/order/customer';
import TabTrends from '@/pages/Client/Customer/components/tabTrends';
import OrderListNew from './components/OrderListNew';
import Ownership from './components/Ownership';
import CustomerDetail from '@/pages/Client/Customer/components/detail';

import func from '@/utils/Func';
import FormTitle from '../../../components/FormTitle';
import { CITY } from '../../../utils/city';
import { ORDERSOURCE, ORDERTYPE } from '../../Order/components/data';
import { salesmanList } from '../../../services/newServices/sales';
import Panel from '../../../components/Panel';

const { TabPane } = Tabs;
const FormItem = Form.Item;
const { TextArea } = Input;

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
      repeatLoading:false,
      payPanyId:null,
      productTypeId:null,
      productId:null,
      detailsId:null,
      orderListLength:0,
      orderVisible:false,
      productList:[],
      salesmanList:[],
    };
  }

  componentWillMount() {

    const { globalParameters } = this.props;
    const propData = globalParameters.detailData;
    // 获取详情数据
    this.setState({
      detailsId:propData.detail.id,
    },()=>{
      this.getEditDetails();
    });

    this.getTreeList();
    this.getSalesmanList();

    // let _this = this;
    // setTimeout(()=>{
    //   _this.getEditDetails();
    // },4000)
  }

  changeDetails = (id) => {
    // 获取详情数据
    this.setState({
      detailsId:id,
    },()=>{
      this.getEditDetails();
    });
  }

  getTreeList = () => {
    productTreelist().then(res=>{
      console.log(res.data,"productTreelist")
      this.setState({productList:res.data})
    })
  }

  // 获取业务员数据
  getSalesmanList = () => {
    salesmanList({size:100,current:1}).then(res=>{
      this.setState({
        salesmanList:res.data
      })
    })
  }

  getEditDetails = () => {
    const params={
      id:this.state.detailsId
    }
    getDetail(params).then(res=>{
      this.setState({
        detail:res.data
      })
      this.getList(res.data)
    })
  }

  getList = (detail) =>{
    const params={
      clientPhone:detail.clientPhone,
      size:10,
      current:1,
      clientId: detail.id,
      associateOrderId: detail.associateOrderId,
    }
    clientOrder(params).then(res=>{
      const data = res.data;
      this.setState({
        orderDetail:data.records,
        orderPagination:{
          total:data.total,
          current:data.current,
          pageSize:data.size,
        },
        orderListLength:data.total
      })
    })

    //查询归属总条数
    clientOperationRecord({
      clientId:detail.id,
      deptId:detail.deptId,
      tenantId:detail.tenantId,
      type:0,
      size:1,
      current:1
    }).then(res=>{
      const data = res.data;
      this.setState({
        clientOperationRecordLength:data.total
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
    const { detail,selectedOptions} = this.state;
    form.validateFieldsAndScroll((err, values) => {
      values.id = detail.id;
      values.clientAddress = `${selectedOptions}${values.clientAddress}`;
      values.nextFollowTime = func.format(values.nextFollowTime);
      delete values.updateTime;
      delete values.salesman;
      if (!err) {
          updateData(values).then(res=>{
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

  addOrder = () =>{
    const { detail } = this.state;
    console.log(detail)
    const _this=this;
    Modal.confirm({
      title: '提醒',
      content: "确定将要创建此客户的订单？",
      okText: '确定',
      okType: 'primary',
      cancelText: '取消',
      onOk() {
        // const params={
        //   clientPhone: detail.clientPhone,
        //   clientName: detail.clientName,
        //   clientAddress: detail.clientAddress,
        // }
        // createOrder(params).then(res=>{
        //   if(res.code === 200){
        //     message.success(res.msg);
        //   }else {
        //     message.error(res.msg);
        //   }
        // })

        _this.setState({
          orderVisible:true
        })


      },
      onCancel() {},
    });
  };

  handleCancelOrder = () => {
    this.setState({
      orderVisible:false
    })
  }

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
      form: { getFieldDecorator }
    } = this.props;

    const {
      data,
      loading,
      orderDetail,
      orderPagination,
      detail,
      edit,
      orderListLength,
      clientOperationRecordLength,
      primary,
      primary1,
      orderVisible,
      productList,
      salesmanList
    } = this.state;

    const formAllItemLayout = {
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 20,
      },
    };

    return (
      <>
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
                    {/* <Button  icon="folder">归档</Button> */}
                  </div>
                  <CustomerDetail detail={detail} edit={edit} getFieldDecorator={getFieldDecorator} className={styles.editList} style={{ padding: '20px' }}/>
                </Col>
                <Col span={16} style={{ padding: 0 }} className={styles.rightContent}>
                  <Row className={styles.titleBtn}>
                    <Col span={16}>
                      <Button icon="plus" onClick={()=>{
                        this.addOrder()
                      }}>订单</Button>
                      <Button icon="plus" onClick={()=>{message.info('开发中')}}>产品</Button>
                      <Button icon="plus" onClick={()=>{message.info('开发中')}}>联系人</Button>
                      <Button icon="plus" onClick={()=>{message.info('开发中')}}>工单</Button>
                    </Col>
                    {/*<Col span={8}>*/}
                    {/*  <div>*/}
                    {/*    {detail.voiceStatus === "1" ? (*/}
                    {/*      <Tooltip title="激活自动提醒开关">*/}
                    {/*        <Button icon="bell" onClick={()=>this.voiceSubmit(0)} style={{ float:"right",border:'0',boxShadow:'none'}}></Button>*/}
                    {/*      </Tooltip>*/}
                    {/*    ) :(*/}
                    {/*      <Button style={{ float:"right",border:'0',boxShadow:'none'}} onClick={()=>this.voiceSubmit(1)}>*/}
                    {/*        <Tooltip title="激活自动提醒开关">*/}
                    {/*          <img src={bellShut} style={{float:"right"}} />*/}
                    {/*        </Tooltip>*/}
                    {/*      </Button>*/}
                    {/*    )}*/}
                    {/*  </div>*/}
                    {/*</Col>*/}
                  </Row>
                  <div className={styles.tabContent} style={{marginRight:20,paddingTop:14}}>
                    <Tabs defaultActiveKey="1" onChange={this.callback}>
                      <TabPane tab="客户动态" key="1">
                        {detail.id?(
                          <TabTrends
                            detail={detail}
                            getEditDetails={this.getEditDetails}
                          />
                        ):''}
                      </TabPane>
                      <TabPane tab={`订单(${orderListLength})`} key="2">
                        <OrderListNew
                          detail={detail}
                          orderDetail={orderDetail}
                          orderPagination={orderPagination}
                          changeDetails={this.changeDetails}
                        />
                      </TabPane>
                      <TabPane tab={`维护(0)`} key="3">
                        {/*<OrderListNew*/}
                        {/*  detail={detail}*/}
                        {/*  orderDetail={orderDetail}*/}
                        {/*  changeDetails={this.changeDetails}*/}
                        {/*/>*/}
                      </TabPane>
                      <TabPane tab={`联系人(0)`} key="4">
                        {/*<OrderListNew*/}
                        {/*  detail={detail}*/}
                        {/*  orderDetail={orderDetail}*/}
                        {/*  changeDetails={this.changeDetails}*/}
                        {/*/>*/}
                      </TabPane>
                      <TabPane tab={`工单(0)`} key="5">
                        {/*<OrderListNew*/}
                        {/*detail={detail}*/}
                        {/*orderDetail={orderDetail}*/}
                        {/*changeDetails={this.changeDetails}*/}
                        {/*/>*/}
                      </TabPane>
                      <TabPane tab={`归属(${clientOperationRecordLength})`} key="6">
                        <Ownership detail={detail}/>
                      </TabPane>
                      <TabPane tab={`日志`} key="7">
                        {/*<OrderListNew*/}
                        {/*detail={detail}*/}
                        {/*orderDetail={orderDetail}*/}
                        {/*changeDetails={this.changeDetails}*/}
                        {/*/>*/}
                      </TabPane>
                    </Tabs>
                  </div>
                </Col>
              </Row>
            </Card>
          </Form>
        </Modal>

        <Modal
          title="创建订单"
          visible={orderVisible}
          width={1290}
          onCancel={this.handleCancelOrder}
          bodyStyle={{paddingTop:0}}
          maskClosable={false}
          footer={[
            <Button key="back">
              取消
            </Button>,
            <Button key="submit" type="primary">
              确定
            </Button>,
          ]}
          style={{
            top:40
          }}
        >
          <Form style={{ marginTop: 8 }}>
            <div></div>
            <Card className={styles.card} bordered={false}>
              <Row gutter={24}>
                <Col span={12}>
                  <FormTitle
                    title="基础信息"
                  />
                  <FormItem {...formAllItemLayout} label="客户姓名">
                    {getFieldDecorator('userName', {
                      initialValue: detail.clientName,
                      rules: [
                        {
                          required: true,
                          message: '请输入客户姓名',
                        },
                      ],
                    })(<Input placeholder="请输入客户姓名" />)}
                  </FormItem>
                  <FormItem {...formAllItemLayout} label="手机号">
                    {getFieldDecorator('userPhone', {
                      initialValue: detail.clientPhone,
                      rules: [
                        { required: true, validator: this.validatePhone },
                      ],
                    })(<Input disabled placeholder="请输入手机号" />)}
                  </FormItem>
                  <FormItem {...formAllItemLayout} label="备用手机号">
                    {getFieldDecorator('backPhone', {
                      rules: [
                        {
                          len: 11,
                          message: '请输入正确的手机号格式',
                        },
                      ],
                    })(<Input placeholder="请输入备用手机号" />)}
                  </FormItem>
                  <FormItem {...formAllItemLayout} label="微信号">
                    {getFieldDecorator('wechatId')(<Input placeholder="请输入微信号" />)}
                  </FormItem>
                  <FormItem {...formAllItemLayout} label="所在地区">
                    {getFieldDecorator('region', {
                      // initialValue: {['zhejiang', 'hangzhou', 'xihu']},
                      initialValue: [detail.province, detail.city, detail.area],
                      rules: [
                        {
                          required: true,
                          message: '请选择所在地区',
                        },
                      ],
                    })(
                      <Cascader
                        // defaultValue={['zhejiang', 'hangzhou', 'xihu']}
                        options={CITY}
                        onChange={this.onChange}
                      />
                    )}
                  </FormItem>
                  <FormItem {...formAllItemLayout} label="收货地址">
                    {getFieldDecorator('userAddress', {
                      initialValue: detail.clientAddress,
                      rules: [
                        {
                          required: true,
                          message: '请输入收货地址',
                        },
                      ],
                    })(<Input placeholder="请输入收货地址" />)}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormTitle
                    title="订单信息"
                  />
                  <FormItem {...formAllItemLayout} label="订单来源">
                    {getFieldDecorator('orderSource', {
                      rules: [
                        {
                          required: true,
                          message: '请选择订单来源',
                        },
                      ],
                    })(
                      <Select placeholder={"请选择订单来源"}>
                        {ORDERSOURCE.map(item=>{
                          if(item.key != null){
                            return (<Option value={item.key}>{item.name}</Option>)
                          }
                        })}
                      </Select>
                    )}
                  </FormItem>
                  <FormItem {...formAllItemLayout} label="订单类型">
                    {getFieldDecorator('orderType', {
                      rules: [
                        {
                          required: true,
                          message: '请选择订单类型',
                        },
                      ],
                    })(
                      <Select placeholder={"请选择订单类型"}>
                        {ORDERTYPE.map(item=>{
                          return (<Option value={item.key}>{item.name}</Option>)
                        })}
                      </Select>
                    )}
                  </FormItem>


                  <FormItem {...formAllItemLayout} label="产品分类">
                    {getFieldDecorator('productType', {
                      initialValue: null,
                      rules: [
                        {
                          required: true,
                          message: '请选择产品分类',
                        },
                      ],
                    })(
                      <Cascader
                        options={productList}
                        fieldNames={{ label: 'value'}}
                        onChange={(value, selectedOptions)=>{
                          console.log(value, selectedOptions,"产品分类改变")
                          this.setState({
                            payPanyId:selectedOptions[0].id,
                            productTypeId:selectedOptions[1].id,
                            productId :selectedOptions[2].id,
                          })
                          const { form } = this.props;
                          console.log(form,"1")
                          console.log(form.getFieldsValue,"2");
                          const region = form.getFieldsValue();
                          console.log(region,"3");
                          // if(!region.payamount || region.payamount === "" || region.payamount === null){
                          form.setFieldsValue({
                            payAmount:selectedOptions[2].payamount
                          })
                          // }
                        }}
                      ></Cascader>
                    )}
                  </FormItem>

                  <FormItem {...formAllItemLayout} label="产品金额">
                    {getFieldDecorator('payAmount',{
                      rules: [
                        { required: true, validator: this.valinsPayChange },
                      ],
                    })(<Input placeholder="请输入产品金额" />)}
                  </FormItem>

                  {/* <FormItem {...formAllItemLayout} label="产品型号">
                  {getFieldDecorator('productName')(<Input placeholder="请输入产品型号" />)}
                </FormItem> */}
                  <FormItem {...formAllItemLayout} label="SN">
                    {getFieldDecorator('productCoding')(<Input placeholder="请输入SN" />)}
                  </FormItem>

                  <FormTitle
                    title="销售信息"
                  />

                  <FormItem {...formAllItemLayout} label="归属销售">
                    {getFieldDecorator('salesman', {
                      initialValue: null,
                      rules: [
                        {
                          required: true,
                          message: '请选择归属销售',
                        },
                      ],
                    })(
                      <Select placeholder={"请选择归属销售"}>
                        {salesmanList.map(item=>{
                          return (<Option value={item.userAccount}>{item.userName}</Option>)
                        })}
                      </Select>
                    )}
                  </FormItem>

                  <FormItem {...formAllItemLayout} label="备注信息">
                    {getFieldDecorator('orderNote')(
                      <TextArea rows={4} />
                    )}
                  </FormItem>
                </Col>
              </Row>

            </Card>
          </Form>
        </Modal>
      </>

    );
  }
}

export default OrdersEdit;
