import React, { PureComponent  } from 'react';
import { connect } from 'dva';
import {
  Button,
  Form,
  Table,
  Radio
} from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';
import router from 'umi/router';
import { getList } from '../../../../services/newServices/logistics';


@connect(({ logisticsParameters }) => ({
  logisticsParameters,
}))
@Form.create()
class AuthorityList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data:{},
      loading:false,
      params:{
        size:10,
        current:1
      },
      authorizationId:''
    };
  }
  // ============ 初始化数据 ===============

  componentWillMount() {
    const { LogisticsConfigList } = this.props;
    this.setState({
      authorizationId:LogisticsConfigList.id,
    })
    this.getDataList()
  }

  getDataList = () => {
    const {params} = this.state;
    this.setState({
      loading:true
    })
    getList(params).then(res=>{
      this.setState({
        loading:false
      })
      this.setState({
        data:{
          list:res.data.records,
          pagination:{
            current: res.data.current,
            pageSize: res.data.size,
            total: res.data.total
          }
        }
      })
    })
  }

  onChange = (rows) => {
    this.setState({
      authorizationId: rows.id,
    });
    const { dispatch } = this.props;
    dispatch({
      type: `logisticsParameters/setListId`,
      payload: rows,
    });
  };


  render() {
    const {
      form,
    } = this.props;

    const {data,authorizationId,loading} = this.state;


    const columns = [
      {
        title: '',
        dataIndex: 'id',
        width: 200,
        render: (res,rows) => {
          return(
            <Radio checked={res===authorizationId?true:false} onChange={() =>this.onChange(rows)} value={res}></Radio>
          )
        },
      },
      {
        title: '授权ID',
        dataIndex: 'partnerId',
        width: 200,
      },
      {
        title: '授权key',
        dataIndex: 'partnerKey',
        width: 250,
      },
      {
        title: '快递员名称',
        dataIndex: 'checkMan',
        width: 250,
      },
      {
        title: '当地网点名称',
        dataIndex: 'net',
        width: 350,
      },
    ];
    const rowSelection = {
        type: "radio",
      getCheckboxProps: record => ({
        defaultChecked:record.id === authorizationId
        // return{
        //   defaultChecked: record.id === 28,
        // }
      }),
    };
    return (
      <div>
        <Table loading={loading} rowKey={(record, index) => `${index}`} dataSource={data.list} columns={columns} />
      </div>

    );
  }
}
export default AuthorityList;
