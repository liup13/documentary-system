import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Button,
  Form, message, Modal,
} from 'antd';
import Grid from '../../../../components/Sword/Grid';
import {
  authorizedcompanylist,
} from '../../../../services/authorized';
import moment from 'moment';

@connect(({ globalParameters }) => ({
  globalParameters,
}))
@Form.create()
class AuthorizedCompanyPage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      loading: false,
      selectDataArr: [],
      columns: [
        {
          title: '编号',
          dataIndex: '',
          width: 60,
          render: (res, rows, index) => {
            return (
              index + 1
            );
          },
        },
        {
          title: '公司ID',
          dataIndex: 'tenantId',
          key: 'tenantId',
          width: 160,
        },
        {
          title: '机构名称',
          dataIndex: 'tenantName',
          key: 'tenantName',
        },
        {
          title: '授权租户名称',
          dataIndex: 'authorizationTenantName',
          key: 'authorizationTenantName',
        }
      ],
      params: {
        size: 10,
        current: 1,
      },
      selectedRowKeys:[]
    };
  }

  // ============ 初始化数据 ===============

  componentWillMount() {
    this.getDataList();
  }

  getDataList = () => {
    const { params } = this.state;
    this.setState({
      loading: true,
    });
    authorizedcompanylist(params).then(res => {
      this.setState({
        loading: false,
      });
      let datas = res.data.records.map(item => {
        item.selections = true;
        return item;
      });
      this.setState({
        data: {
          list: datas,
          pagination: {
            current: res.data.current,
            pageSize: res.data.size,
            total: res.data.total,
          },
        },
      });
    });
  };

  onSelectRow = (rows, key) => {
    this.setState({
      selectDataArr: rows,
      selectedRowKeys: key,
    });
  };

  handleResize = index => (e, { size }) => {
    this.setState(({ columns }) => {
      const nextColumns = [...columns];
      nextColumns[index] = {
        ...nextColumns[index],
        width: size.width,
      };
      return { columns: nextColumns };
    });
  };

  handleSubmit = () => {
    const { selectedRowKeys,selectDataArr } = this.state;
    const { handleOkCompany } = this.props;

    if (selectedRowKeys.length != 1) {
      return message.info('请选择一条数据');
    }

    handleOkCompany(selectDataArr[0]);
  };

  render() {
    const {
      form, isVisible, handleCancelCompany,
    } = this.props;

    const {
      data,
      loading,
      selectedRowKeys
    } = this.state;


    const columns = this.state.columns.map((col, index) => ({
      ...col,
      onHeaderCell: column => ({
        width: column.width,
        onResize: this.handleResize(index),
      }),
    }));

    return (
      <Modal
        className={'authorized-product-page'}
        title="授权公司"
        width={960}
        visible={isVisible}
        maskClosable={false}
        footer={[
          <Button key="back" onClick={handleCancelCompany}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={(e) => this.handleSubmit(e)}>
            确定
          </Button>,
        ]}
        onCancel={handleCancelCompany}
      >
        <Grid
          form={form}
          data={data}
          counterElection={false}
          selectedKey={selectedRowKeys}
          onSelectRow={this.onSelectRow}
          loading={loading}
          columns={columns}
          scroll={{ x: 900 }}
        />
      </Modal>
    );
  }
}

export default AuthorizedCompanyPage;
