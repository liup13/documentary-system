import React, { PureComponent } from 'react';
import { Form, Input, Card, Row, Col, Button, DatePicker, message, Radio, Select } from 'antd';
import { connect } from 'dva';
import moment from 'moment'
import Panel from '../../../components/Panel';
import styles from '../../../layouts/Sword.less';
import func from '../../../utils/Func';
import { getCookie } from '../../../utils/support';
import { getSurfacesingleSubmit,getlogisticsTemplate } from '../../../services/newServices/logistics';
import router from 'umi/router';
import { EXPRESS100DATA,TEMPID } from './data';

const FormItem = Form.Item;
const { Option } = Select;

@connect(({ globalParameters }) => ({
  globalParameters,
}))
@Form.create()
class FaceSheetEdit extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      data:{},
      templates:[]
    };
  }

  componentWillMount() {
    const { globalParameters } = this.props;

    this.getlogisticsTemplate();
    // 获取详情数据
    this.setState({
      data:globalParameters.detailData
    })
  }
// ============ 修改提交 ===============

  handleSubmit = e => {
    e.preventDefault();
    const {  form } = this.props;
    const {data} = this.state;
    form.validateFieldsAndScroll((err, values) => {
      values.deptId = getCookie("dept_id");
      if (!err) {
        const params = {
          ...values,
          id:data.id,
        };
        getSurfacesingleSubmit(params).then(res=>{
          if(res.code === 200){
            message.success(res.msg);
            router.push('/logistics/faceSheet');
          }
        })
      }
    });
  };

  // 获取模板信息
  getlogisticsTemplate(){
    getlogisticsTemplate().then(res=>{
      if(res.code === 200){
        this.setState({
          templates:res.data.records
        });
      }else {
        message.error(res.msg);
      }
    })
  };
  onChange = value => {
    let text = ""
    for(let i=0; i< EXPRESS100DATA.length; i++){
      if(value === EXPRESS100DATA[i].num){
        text = EXPRESS100DATA[i].name
      }
    }
    const {data,templates} = this.state;
    for(let j=0; j< templates.length; j++){
      if(text === templates[j].templateName){
        text = templates[j].templateId
      }
    }
    const datas = Object.assign({}, data, {
      tempid: text

    })
    this.setState({
      data:datas
    },()=>{

    });
  };

  widthChange = (rule, value, callback) => {
    let reg=/^[1-9]\d*$/;
    if(value != "" && value != null){
      if(!reg.test(value) || value.length > 3){
        callback('请输入长度小于等于3位数的正整数');
      }else{
        return callback();
      }
    }else {
      return callback();
    }
  };

  heightChange = (rule, value, callback) => {
    let reg=/^[1-9]\d*$/;
    if(value != "" && value != null){
      if(!reg.test(value) || value.length > 3){
        callback('请输入长度小于等于3位数的正整数');
      }else{
        return callback();
      }
    }else {
      return callback();
    }
  };


  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const {data,templates} = this.state;
    const formItemLayout = {
      labelCol: {
        span: 8,
      },
      wrapperCol: {
        span: 16,
      },
    };

    const action = (
      <Button type="primary" onClick={this.handleSubmit}>
        提交
      </Button>
    );

    return (
      <Panel title="修改" back="/logistics/faceSheet" action={action}>
        <Form style={{ marginTop: 8 }}>
          <Card title="基本信息" className={styles.card} bordered={false}>
            <Row gutter={24}>
              <Col span={10}>
                <FormItem {...formItemLayout} label="快递公司编码：">
                  {getFieldDecorator('kuaidicom', {
                    initialValue: data.kuaidicom,
                    rules: [
                      {
                        required: true,
                        message: '请选择快递公司编码',
                      },
                    ],
                  })(
                    <Select placeholder="" onSelect={value => this.onChange(value)}>
                      {EXPRESS100DATA.map((item,index)=>{
                        return (<Option key={index} value={item.num}>{item.name}</Option>)
                      })}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem {...formItemLayout} label="模板ID：">
                  {getFieldDecorator('tempid', {
                    rules: [
                      {
                        required: true,
                        message: '请输入模板ID',
                      },
                    ],
                    initialValue: data.tempid,
                  })(
                    <Select placeholder="">
                      {templates.map((item,index) =>{
                        return (<Option key={index || 0} value={item.templateId}>{item.templateName}</Option>)
                      })}
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={10}>
                <FormItem {...formItemLayout} label="宽：">
                  {getFieldDecorator('width', {
                    rules: [
                      {
                        validator:this.widthChange,
                      },
                    ],
                    initialValue: data.width,
                  })(<Input placeholder="宽" />)}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem {...formItemLayout} label="高：">
                  {getFieldDecorator('height', {
                    rules: [
                      {
                        validator:this.heightChange,
                      },
                    ],
                    initialValue: data.height,
                  })(<Input placeholder="高" />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={10}>
                <FormItem {...formItemLayout} label="打印设备码:">
                  {getFieldDecorator('siid',{
                    initialValue: data.siid,
                  })(<Input placeholder="打印设备码" />)}
                </FormItem>
              </Col>
            </Row>
          </Card>
        </Form>
      </Panel>
    );
  }
}

export default FaceSheetEdit;
