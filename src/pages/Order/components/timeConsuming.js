import React, { PureComponent } from 'react';
import {
  Modal,
  Checkbox,
  Form,
  Input,
  Button,
  message,
  Radio,
  Table, Select, Icon, Tooltip, Upload, Divider,
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import { getToken } from '@/utils/authority';
import { ordertimeinfotask } from '../../../services/newServices/order';

const { Option } = Select;
const FormItem = Form.Item;
const { Dragger } = Upload;
@connect(({ globalParameters}) => ({
  globalParameters,
}))
@Form.create()
class timeConsuming extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      data:[],
      pagination: {},
      params:{
        size:10,
        current:1,
      },
    };
  }


  componentWillMount() {
    const {params}=this.state;
    const {timeConsumingList}=this.props;

    if(timeConsumingList.length > 0){
      params.outOrderNo = timeConsumingList[0].outOrderNo
    }
    this.get0rdertimeinfotask(params)
  }

  get0rdertimeinfotask = (params,key) =>{
    let p=''
    if(key){
      p={...params,[key]:key}
    }else {
      p={...params}
    }
    ordertimeinfotask(p).then(res=>{
      if(res.code === 200){
        this.setState({
          data:{
            list:res.data.records
          },
          pagination:{
            current: res.data.current,
            pageSize: res.data.size,
            total: res.data.total
          }
        })
      }else {
        message.error(res.msg)
      }
    })
  }

  // ============ 查询 ===============
  handleSearch = params => {

  };

  handleTableChange = (pagination,filters, sorter) => {
    console.log(sorter)
    const pager = { ...this.state.pagination };
    this.setState({
      pagination: pager,
    });
    const {params}=this.state;

    console.log(params)

    let columnKey=''
    if(sorter.order){
      params.current = 1
      if(sorter.order === "ascend"){
        params.orderBy = true
      }else {
        params.orderBy = false
      }
      columnKey = sorter.columnKey
    }else {
      params.current = pagination.current;
    }
    this.get0rdertimeinfotask(params,columnKey)
  };


  render() {
    const {
      form: { getFieldDecorator },
      timeConsumingVisible,
      handleCancelTimeConsuming,
      handleDetails
      } = this.props;

    const {
      data,
      pagination
      } = this.state;

    const columns=[
      {
        title: '订单号',
        dataIndex: 'outOrderNo',
        width: 260,
      },
      {
        title: '跟进耗时',
        dataIndex: 'followTimeConsuming',
        width: 200,
        sorter:true,
      },
      {
        title: '跟进时效',
        dataIndex: 'followAgeing',
        width: 200,
        sorter:true,
      },
      {
        title: '激活耗时',
        dataIndex: 'activateTimeConsuming',
        width: 200,
        sorter:true,
      },
      {
        title: '操作',
        key: 'operation',
        fixed: 'right',
        render: (text,row) => {
          return(
            <div>
              <a onClick={()=>handleDetails(row)}>详情</a>
            </div>
          )
        },
      }
    ]

    return (
      <div>
        <Modal
          title="耗时检测"
          visible={timeConsumingVisible}
          width={850}
          onCancel={handleCancelTimeConsuming}
          maskClosable={false}
          footer={[
            <Button key="back" onClick={handleCancelTimeConsuming}>
              取消
            </Button>,
          ]}
        >
          <Table rowKey={(record, index) => `${index}`} dataSource={data.list} pagination={pagination} columns={columns} onChange={this.handleTableChange}/>
        </Modal>
      </div>
    );
  }
}

export default timeConsuming;
