import React, { PureComponent } from 'react';
import { Form, Input, Card, Row, Col, Button, InputNumber, TreeSelect, Select } from 'antd';
import { connect } from 'dva';
import Panel from '../../../components/Panel';
import styles from '../../../layouts/Sword.less';
import func from '../../../utils/Func';
import { DEPT_INIT, DEPT_SUBMIT, DEPT_DETAIL, DEPT_CLEAR_DETAIL } from '../../../actions/organization';

const FormItem = Form.Item;
const { TextArea } = Input;

@connect(({ organization, loading }) => ({
  organization,
  submitting: loading.effects['organization/submit'],
}))
@Form.create()
class OrganizationAdd extends PureComponent {
  componentWillMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;
    if (func.notEmpty(id)) {
      dispatch(DEPT_DETAIL(id));
    } else {
      dispatch(DEPT_CLEAR_DETAIL());
    }
    dispatch(DEPT_INIT());
  }

  handleSubmit = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch(DEPT_SUBMIT(values));
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      organization: {
        detail,
        init: { tree, category },
      },
      submitting,
    } = this.props;

    console.log(category)

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
      <Button type="primary" onClick={this.handleSubmit} loading={submitting}>
        提交
      </Button>
    );

    let _tree = tree.map(item=>{
      delete item.children
      return item
    })

    return (
      <Panel title="新增" back="/system/organization" action={action}>
        <Form style={{ marginTop: 8 }}>
          <Card title="基本信息" className={styles.card} bordered={false}>
            <Row gutter={24}>
              <Col span={10}>
                <FormItem {...formItemLayout} label="组织简称">
                  {getFieldDecorator('deptName', {
                    rules: [
                      {
                        required: true,
                        message: '请输入组织简称',
                      },
                    ],
                  })(<Input placeholder="请输入组织简称" />)}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem {...formItemLayout} label="上级组织">
                  {getFieldDecorator('parentId', {
                    initialValue: detail.id,
                  })(
                    <TreeSelect
                      disabled={func.notEmpty(detail.id)}
                      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                      treeData={_tree}
                      allowClear
                      showSearch
                      treeNodeFilterProp="title"
                      placeholder="请选择上级组织"
                    />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={10}>
                <FormItem {...formItemLayout} className={styles.inputItem} label="组织类型">
                  {getFieldDecorator('deptCategory', {
                    rules: [
                      {
                        required: true,
                        message: '请选择组织类型',
                      },
                    ],
                  })(
                    <Select placeholder="请选择组织类型">
                      {category.map(d => (
                        <Select.Option key={d.dictKey} value={d.dictKey}>
                          {d.dictValue}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
          </Card>
          <Card title="其他信息" className={styles.card} bordered={false}>
            <Row gutter={24}>
              <Col span={20}>
                <FormItem {...formAllItemLayout} className={styles.inputItem} label="组织排序">
                  {getFieldDecorator('sort', {
                    rules: [
                      {
                        required: true,
                        message: '请输入组织排序',
                      },
                    ],
                    initialValue: detail.nextSort,
                  })(<InputNumber placeholder="请输入组织排序" />)}
                </FormItem>
              </Col>
              <Col span={20}>
                <FormItem {...formAllItemLayout} label="组织备注">
                  {getFieldDecorator('remark')(<TextArea rows={4} placeholder="请输入组织备注" />)}
                </FormItem>
              </Col>
            </Row>
          </Card>
        </Form>
      </Panel>
    );
  }
}

export default OrganizationAdd;
