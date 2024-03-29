import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form,
} from 'antd';

import Panel from '../../components/Panel';
import Grid from '../../components/Sword/Grid';
import { setListData } from '../../utils/publicMethod';
import {
  branchList
} from '../../services/branch';

import styles from './index.less';


@connect(({ globalParameters }) => ({
  globalParameters,
}))
@Form.create()
class BranchOffice extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      data:{},
      loading:false,
      params:{
        size:10,
        current:1,
        orderBy:false
      },

      branchList:[],//分公司数据
    };
  }

  // ============ 初始化数据 ===============
  componentWillMount() {
    this.getDataList();
  }


  getDataList = () => {
    const {params} = this.state;
    this.setState({
      loading:true,
    })
    branchList(params).then(res=>{
      console.log(res.data)
      this.setState({
        countSice:res.data.total,
        data:setListData(res.data),
        loading:false,
        selectedRowKeys:[]
      })
    })
  }


  render() {
    const code = 'branchOfficeList';

    const {
      form,
    } = this.props;

    const {
      data,
      loading,
    } = this.state;

    const columns = [
      {
        title: '租户名称',
        dataIndex: 'tenantName',
        key: 'tenantName'
      },
      {
        title: '业务员个数',
        dataIndex: 'currentQuota',
        key: 'currentQuota',
      },
      {
        title: '数据授权',
        dataIndex: 'dataAuthorization',
        key: 'dataAuthorization',
        render: (key,row)=>{
          return (
            <div>
              {
                key === '1' ? "是":"否"
              }
            </div>
          )
        }
      },
      {
        title: '账户余额',
        dataIndex: 'remainingMoney',
        key: 'remainingMoney',
      }
    ];

    return (
      <Panel>
        <div className={styles.ordersTabs}>
          <Grid
            code={code}
            form={form}
            loading={loading}
            data={data}
            columns={columns}
            scroll={{ x: 1000 }}
            counterElection={false}
            multipleChoice={true}

            // multipleChoice={true}
          />
        </div>

      </Panel>
    );
  }
}
export default BranchOffice;
