import React, { Component } from 'react';
import { formatMessage } from 'umi/locale';
import {
  Form,
  Input,
  Upload,
  Button,
  message,
  Icon,
  Card,
  Radio,
  Row,
  Col,
  Select,
} from 'antd';
import { getUserInfo, updateInfo } from '../../../../services/user';
import { getToken } from '../../../../utils/authority';

import styles from './index.less';

const FormItem = Form.Item;
const { TextArea } = Input;
// const GRADE = [
//   {name:"一级",key:1},
//   {name:"二级",key:2},
// ]
@Form.create()
class BaseView extends Component {
  state = {
    userId: '',
    avatar: '',
    loading: false,
  };

  componentDidMount() {
    this.setBaseInfo();
  }

  setBaseInfo = () => {
    const { form } = this.props;
    getUserInfo().then(resp => {
      if (resp.success) {
        const userInfo = resp.data;
        Object.keys(form.getFieldsValue()).forEach(key => {
          const obj = {};
          obj[key] = userInfo[key];
          form.setFieldsValue(obj);
        });
        this.setState({ userId: userInfo.id, avatar: userInfo.avatar });
      } else {
        message.error(resp.msg || '获取数据失败');
      }
    });
  };

  beforeUpload = file => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      this.setState({ loading: false, avatar: info.file.response.data.link });
    }
  };

  handleSubmit = e => {
    e.preventDefault();
    const { form } = this.props;
    const { userId, avatar } = this.state;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const params = {
          id: userId,
          ...values,
          avatar,
        };
        updateInfo(params).then(resp => {
          if (resp.success) {
            message.success(resp.msg);
          } else {
            message.error(resp.msg || '提交失败');
          }
        });
      }
    });
  };

  // 验证整数
  checkInteger = (rule, value, callback) => {
    var re = /^[0-9]+$/ ;
    if (re.test(value)) {
      return callback();
    }
    callback('请输入正整数!');
  }

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    const { avatar, loading } = this.state;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 12 },
      },
    };

    const uploadProp = {
      action: '/api/blade-resource/oss/endpoint/put-file',
      headers: {
        'Blade-Auth': getToken(),
      },
    };

    const uploadButton = (
      <div>
        <Icon type={loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">上传头像</div>
      </div>
    );
    

    return (
        <div className={styles.basicConfiguration}>
          <Row gutter={24}>
              <Col span={12}>
              
              <FormItem {...formItemLayout} label={'有效期天数'}>
                {getFieldDecorator('periodValidity', {
                  rules: [{ validator: this.checkInteger }],
                })(
                  <Input />
                )}
              </FormItem>
              <FormItem {...formItemLayout} label={'系统告警'}>
                  {getFieldDecorator('alarmStatus')(
                    <Radio.Group>
                      <Radio key={1} value={1}>启用</Radio>
                      <Radio key={0} value={0}>禁用</Radio>
                    </Radio.Group>
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label={'二维码开关'}>
                  {getFieldDecorator('qrcodeStatus')(
                    <Radio.Group>
                      <Radio key={1} value={1}>启用</Radio>
                      <Radio key={0} value={0}>禁用</Radio>
                    </Radio.Group>
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label={'物流查询'}>
                  {getFieldDecorator('logisticsStatus')(
                    <Radio.Group>
                      <Radio key={1} value={1}>启用</Radio>
                      <Radio key={0} value={0}>禁用</Radio>
                    </Radio.Group>
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label={'提醒类型'}>
                  {getFieldDecorator('smsStatus')(
                    <Radio.Group>
                      <Radio key={0} value={0}>关闭</Radio>
                      <Radio key={1} value={1}>短信</Radio>
                      <Radio key={2} value={2}>短信+语音</Radio>
                    </Radio.Group>
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label={'发货提醒'}>
                  {getFieldDecorator('shipmentRemindStatus')(
                    <Radio.Group>
                      <Radio key={1} value={1}>启用</Radio>
                      <Radio key={0} value={0}>禁用</Radio>
                    </Radio.Group>
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label={'本地打印'}>
                  {getFieldDecorator('localPrintStatus')(
                    <Radio.Group>
                      <Radio key={1} value={1}>是</Radio>
                      <Radio key={0} value={0}>否</Radio>
                    </Radio.Group>
                  )}
                </FormItem>
                <FormItem style={{display:"none"}}>
                  {getFieldDecorator('id')(
                    <Input />
                  )}
                </FormItem>
              </Col>

              {/* ------------------------------------------ */}

              <Col span={12} style={{marginTop:151}}>
              <FormItem style={{display:"none"}}>
                  {getFieldDecorator('id')(
                    <Input />
                  )}
                </FormItem>
              </Col>
          </Row>
        </div>
    );
  }
}

export default BaseView;
