import React, { PureComponent } from 'react';
import { Form, Input, Card, Row, Col, Button, TreeSelect, Select, DatePicker, message, Cascader, Radio } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';

import Panel from '../../../components/Panel';
import FormTitle from '../../../components/FormTitle';
import styles from '../../../layouts/Sword.less';
import { USER_INIT, USER_CHANGE_INIT, USER_SUBMIT } from '../../../actions/user';
import func from '../../../utils/Func';
import { tenantMode } from '../../../defaultSettings';
import {GENDER,ORDERTYPE,ORDERSOURCE} from './data.js'
import { CITY } from '../../../utils/city';
import { getCookie } from '../../../utils/support';
import { createData, getRegion } from '../../../services/newServices/order'
import { getList as getSalesmanLists } from '../../../services/newServices/sales';
import { 
  LOGISTICSCOMPANY,
  paymentCompany,
  productType,
  productID,
  amountOfMoney
} from './data.js';

const FormItem = Form.Item;
const { TextArea } = Input;


@connect(({ user, loading }) => ({
  user,
  submitting: loading.effects['user/submit'],
}))
@Form.create()
class OrdersAdd extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      salesmanList:[],
      loading:false,
      cityparam:{},
      productList:{},
      selectedOptions:[]
    };
  }


  componentWillMount() {
    this.getSalesmanList();
    this.assemblingData();
  }

  assemblingData = () => {
    let TheSecondLevel = productType.map(item=>{
      return {
        ...item,
        key:`${item.key}_2`,
        children:productID
      }
    })
    let TheFirstLevel = paymentCompany.map(item=>{
      return {
        ...item,
        key:`${item.key}_1`,
        children:TheSecondLevel
      }
    })
    this.setState({productList:TheFirstLevel})
  }

  // 获取业务员数据
  getSalesmanList = () => {
    getSalesmanLists({size:100,current:1}).then(res=>{
      this.setState({
        salesmanList:res.data.records
      })
    })
  }

  handleSubmit = e => {
    e.preventDefault();
    const { form } = this.props;
    const { cityparam, selectedOptions } = this.state;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.deptId = getCookie("dept_id");
        values = {...values,...cityparam};
        if(values.productType && values.productType != ""){
          console.log(values.productType[2])
          console.log(values.productType[2].split("-"))
          values.payAmount = values.productType[2].split("-")[1];
          values.productName = values.productType[2];
          values.productType = `${values.productType[0]}/${values.productType[1]}`;
        }
        values.userAddress = `${selectedOptions}${values.userAddress}`;
        
        // values.ouOrderNo = "12313243546546546"
        createData(values).then(res=>{
          if(res.code === 200){
            message.success(res.msg);
            router.push('/order/allOrders');
          }
        })
      }
    });
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

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    const {
      salesmanList,
      loading,
      productList
    } = this.state;

    const formItemLayout = {
      labelCol: {
        span: 8,
      },
      wrapperCol: {
        span: 16,
      },
    };

    const formAllItemLayout = {
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 20,
      },
    };

    const action = (
      <Button type="primary" onClick={this.handleSubmit} loading={loading}>
        提交
      </Button>
    );

    return (
      <Panel title="新增" back="/order/AllOrders" action={action}>
        <Form style={{ marginTop: 8 }}>

          <Card title="创建客户" className={styles.card} bordered={false}>
            <Row gutter={24}>
              <Col span={12}>
                <FormTitle
                  title="基础信息"
                />
                <FormItem {...formAllItemLayout} label="客户姓名">
                  {getFieldDecorator('userName', {
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
                    rules: [
                      {
                        required: true,
                        message: '请输入手机号',
                      },
                      {
                        len: 11,
                        message: '请输入正确的手机号',
                      },
                    ],
                  })(<Input placeholder="请输入手机号" />)}
                </FormItem>
                {/* <FormItem {...formAllItemLayout} label="手机号2">
                  {getFieldDecorator('account')(<Input placeholder="请输入手机号2" />)}
                </FormItem> */}
                <FormItem {...formAllItemLayout} label="所在地区">
                  {getFieldDecorator('region', {
                      // initialValue: {['zhejiang', 'hangzhou', 'xihu']},
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
                    rules: [
                      {
                        required: true,
                        message: '请输入收货地址',
                      },
                    ],
                  })(<Input placeholder="请输入收货地址" />)}
                </FormItem>
                {/* <FormItem {...formAllItemLayout} label="订单号">
                  {getFieldDecorator('outOrderNo', {
                    rules: [
                      {
                        required: true,
                        message: '请输入订单号',
                      },
                    ],
                  })(<Input placeholder="请输入订单号" />)}
                </FormItem> */}

                
                {/* <FormItem {...formAllItemLayout} label="性别">
                  {getFieldDecorator('gender', {
                      initialValue: null,
                    })(
                    <Radio.Group>
                      {GENDER.map(item=>{
                        return (
                          <Radio key={item.key} value={item.key}>{item.name}</Radio>
                        )
                      })}
                    </Radio.Group>
                  )}
                </FormItem>
                <FormItem {...formAllItemLayout} label="生日">
                  {getFieldDecorator('account')(
                    <DatePicker
                    disabledDate={this.disabledDate}
                    showToday={false}
                    />
                  )}
                </FormItem>
                <FormItem {...formAllItemLayout} label="微信号">
                  {getFieldDecorator('account')(<Input placeholder="请输入手机号2" />)}
                </FormItem>
                <FormItem {...formAllItemLayout} label="邮箱">
                  {getFieldDecorator('account')(<Input placeholder="请输入手机号2" />)}
                </FormItem>
                <FormItem {...formAllItemLayout} label="QQ">
                  {getFieldDecorator('account')(<Input placeholder="请输入手机号2" />)}
                </FormItem> */}
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
                      return (<Option value={item.key}>{item.name}</Option>)
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
                      // rules: [
                      //   {
                      //     required: true,
                      //     message: '请选择产品分类',
                      //   },
                      // ],
                    })(
                      <Cascader 
                        options={productList}
                        fieldNames={{ label: 'name', value: 'name'}}
                        onChange={(value, selectedOptions)=>{
                          console.log("123")
                        }}
                      ></Cascader>
                  )}
                </FormItem>

                {/* <FormItem {...formAllItemLayout} label="产品型号">
                  {getFieldDecorator('productName')(<Input placeholder="请输入产品型号" />)}
                </FormItem> */}
                <FormItem {...formAllItemLayout} label="SN码">
                  {getFieldDecorator('productCoding')(<Input placeholder="请输入SN码" />)}
                </FormItem>

                <FormTitle
                  title="销售信息"
                />

                <FormItem {...formAllItemLayout} label="归属销售">
                  {getFieldDecorator('salesman', {
                      initialValue: null,
                    })(
                    <Select placeholder={"请选择归属销售"}>
                    {salesmanList.map(item=>{
                      return (<Option value={item.userName}>{item.userName}</Option>)
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
      </Panel>
    );
  }
}

export default OrdersAdd;
