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
import {createData,getRegion} from '../../../services/newServices/order'

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
      PRODUCTCLASSIFICATION:[
        {
          name:"测试销售",
          id:"1"
        }
      ],
      loading:false,
      cityparam:{}
    };
  }


  componentWillMount() {
  }

  handleSubmit = e => {
    e.preventDefault();
    const { form } = this.props;
    const { cityparam } = this.state;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.deptId = getCookie("dept_id");
        values = {...values,...cityparam};
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
    this.setState({
      cityparam:{
        province:value[0],
        city:value[1],
        area:value[2],
      }
    })
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    const {
      PRODUCTCLASSIFICATION,
      loading
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
                  {getFieldDecorator('productName', {
                      initialValue: null,
                    })(
                      <Input placeholder="请输入产品分类" />
                  //   <Select placeholder={"请选择产品分类"}>
                  //   {PRODUCTCLASSIFICATION.map(item=>{
                  //     return (<Option value={item.id}>{item.name}</Option>)
                  //   })}
                  // </Select>
                  )}
                </FormItem>
                <FormItem {...formAllItemLayout} label="产品型号">
                  {getFieldDecorator('productModel')(<Input placeholder="请输入产品型号" />)}
                </FormItem>
                <FormItem {...formAllItemLayout} label="序列号SN">
                  {getFieldDecorator('deviceSerialNumber')(<Input placeholder="请输入序列号SN" />)}
                </FormItem>

                <FormTitle
                  title="销售信息"
                />

                <FormItem {...formAllItemLayout} label="归属销售">
                  {getFieldDecorator('salesman', {
                      initialValue: null,
                    })(
                    <Select placeholder={"请选择归属销售"}>
                    {PRODUCTCLASSIFICATION.map(item=>{
                      return (<Option value={item.name}>{item.name}</Option>)
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
