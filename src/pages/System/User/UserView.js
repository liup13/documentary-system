import React, { PureComponent } from 'react';
import { Form, Card, Button, Row, Col } from 'antd';
import router from 'umi/router';
import { connect } from 'dva';
import Panel from '../../../components/Panel';
import { USER_DETAIL } from '../../../actions/user';
import styles from '../../../layouts/Sword.less';
import { tenantMode } from '../../../defaultSettings';

const FormItem = Form.Item;

@connect(({ user }) => ({
  user,
}))
@Form.create()
class UserView extends PureComponent {
  componentWillMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;
    dispatch(USER_DETAIL(id));
  }

  handleEdit = () => {
    const {
      match: {
        params: { id },
      },
    } = this.props;
    router.push(`/system/user/edit/${id}?_K=${Date.parse(new Date())}`);
  };

  render() {
    const {
      user: { detail },
    } = this.props;

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
      <Button type="primary" onClick={this.handleEdit}>
        修改
      </Button>
    );

    return (
      <Panel title="查看" back="/system/user" action={action}>
        <Form style={{ marginTop: 8 }}>
          <Card title="基本信息" className={styles.card} bordered={false}>
            <Row gutter={24}>
              <Col span={20}>
                <FormItem {...formAllItemLayout} label="登录账号">
                  <span>{detail.account}</span>
                </FormItem>
              </Col>
            </Row>
            {tenantMode ? (
              <Row gutter={24}>
                <Col span={20}>
                  <FormItem {...formAllItemLayout} label="所属租户">
                    <span>{detail.tenantId}</span>
                  </FormItem>
                </Col>
              </Row>
            ) : null}
          </Card>
          <Card title="详细信息" className={styles.card} bordered={false}>
            <Row gutter={24}>
              <Col span={10}>
                <FormItem {...formItemLayout} label="用户姓名">
                  <span>{detail.name}</span>
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem {...formItemLayout} label="手机号码">
                  <span>{detail.phone}</span>
                </FormItem>
              </Col>
              {/* <Col span={10}>
                <FormItem {...formItemLayout} label="用户姓名">
                  <span>{detail.realName}</span>
                </FormItem>
              </Col> */}
            </Row>
            <Row gutter={24}>
              {/* <Col span={10}>
                <FormItem {...formItemLayout} label="手机号码">
                  <span>{detail.phone}</span>
                </FormItem>
              </Col> */}
              <Col span={10}>
                <FormItem {...formItemLayout} label="电子邮箱">
                  <span>{detail.email}</span>
                </FormItem>
              </Col>
            </Row>
            {/* <Row gutter={24}>
              <Col span={10}>
                <FormItem {...formItemLayout} label="用户性别">
                  <span>{detail.sexName}</span>
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem {...formItemLayout} label="用户生日">
                  <span>{detail.birthday}</span>
                </FormItem>
              </Col>
            </Row> */}
          </Card>
          <Card title="职责信息" className={styles.card} bordered={false}>
            <Row gutter={24}>
              <Col span={10}>
                <FormItem {...formItemLayout} label="用户编号">
                  <span>{detail.code}</span>
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem {...formItemLayout} label="所属角色">
                  <span>{detail.roleName}</span>
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={10}>
                <FormItem {...formItemLayout} label="所属机构">
                  <span>{detail.organizationName}</span>
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem {...formItemLayout} label="所属公司">
                  <span>{detail.deptName}</span>
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={10}>
                <FormItem {...formItemLayout} label="所属岗位">
                  <span>{detail.postName}</span>
                </FormItem>
              </Col>
            </Row>
          </Card>
        </Form>
      </Panel>
    );
  }
}

export default UserView;
