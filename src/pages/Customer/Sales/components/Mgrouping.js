import React, { PureComponent } from 'react';
import {
  Modal,
  Checkbox,
  Form,
  Input,
  Button,
  message,
  Radio,
  Table
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import { getCookie } from '../../../../utils/support';
import { getSalesmangroup,getSalesmangroupSubmit,getDeleteGroup } from '../../../../services/newServices/sales';

const FormItem = Form.Item;
const { TextArea } = Input;


@connect(({ globalParameters}) => ({
  globalParameters,
}))
@Form.create()
class Logistics extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      // 添加分组弹窗
      groupAddVisible:false,
      data:[],
      params:{
        size:10,
        current:1
      },
    };
  }


  componentWillMount() {
    const { globalParameters } = this.props;
    this.getDataList()
  }

  getDataList = () => {
    const {params} = this.state;
    getSalesmangroup(params).then(res=>{
      this.setState({
        data:res.data.records
      })
    })
  }

  handleChange = value => {
    console.log("1111")
  };

  // ======添加分组弹窗==========

  groupAdd = () =>{
    this.setState({
      groupAddVisible:true,
    })
  }

  // ======关闭弹窗==========

  handleCancelGroupAdd = () =>{
    this.setState({
      groupAddVisible:false,
    })
  }

  // ======确认==========

  handleSubmit = e => {
    e.preventDefault();
    const {  form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      console.log(values);
      values.deptId = getCookie("dept_id");
      if (!err) {
        const params = {
          ...values,
        };
        console.log(params)
        getSalesmangroupSubmit(params).then(res=>{
          if(res.code === 200){
            message.success('提交成功');
            this.setState({
              groupAddVisible:false,
            })
            this.getDataList()
          }else {
            message.error(res.msg);
          }
        })
      }
    });
  };

  handleSubmitDelete = (id) =>{
    console.log(id)
    const refresh = this.getDataList;
    Modal.confirm({
      title: '删除确认',
      content: '确定删除该条记录?',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        getDeleteGroup(id.id).then(resp => {
          if (resp.success) {
            message.success(resp.msg);
            refresh()
          } else {
            message.error(resp.msg || '删除失败');
          }
        });
      },
      onCancel() {},
    });

  }

  render() {
    const {
      form: { getFieldDecorator },
      handleGroupingVisible,
      handleCancelGrouping,
    } = this.props;

    const {data,groupAddVisible} = this.state;

    const formAllItemLayout = {
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 20,
      },
    };

    const columns=[
      {
        title: '',
        dataIndex: 'id',
        width: 50,
        render: (res,rows,index) => {
          return(
            index+1
          )
        },
      },{
        title: '分组名称',
        dataIndex: 'groupName',
        width: 200,
      },{
        title: '操作',
        key: 'operation',
        fixed: 'right',
        width: 150,
        render: (res,row) => {
          return(
            <div>
              <a onClick={()=>this.handleSubmitDelete(row)}>删除</a>
            </div>
          )
        },
      },
    ]

    // confirmTag
    return (
      <div>
        <Modal
          title="分组列表"
          visible={handleGroupingVisible}
          width={550}
          onCancel={handleCancelGrouping}
          maskClosable={false}
          footer={null}
        >
          {
            data.length >= 1 ? "" :(
              <div style={{height:'50px'}}>
                <Button style={{float: "right"}} type="primary" onClick={this.groupAdd}>
                  添加
                </Button>
              </div>
            )
          }

          <Table rowKey={(record, index) => `${index}`} dataSource={data} columns={columns} />
        </Modal>
        <Modal
          title="添加分组"
          visible={groupAddVisible}
          width={550}
          onCancel={this.handleCancelGroupAdd}
          maskClosable={false}
          footer={[
            <Button key="back" onClick={this.handleCancelGroupAdd}>
              取消
            </Button>,
            <Button type="primary" key="primary" onClick={this.handleSubmit}>
              确认
            </Button>,
          ]}
        >
          <Form style={{ marginTop: 8 }}>
            <FormItem {...formAllItemLayout} label="分组名称">
              {getFieldDecorator('groupName', {
                rules: [
                  {
                    required: true,
                    message: '请输入分组名称',
                  },
                ],
              })(<Input placeholder="请输入分组名称" />)}
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default Logistics;
