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
  Tabs,
  Empty
} from 'antd';
import Panel from '../../../components/Panel';

import Label from './label';
import Grade from './grade';

const FormItem = Form.Item;
const { TextArea } = Input;
const { TabPane } = Tabs;
// const GRADE = [
//   {name:"一级",key:1},
//   {name:"二级",key:2},
// ]
const topTabPane = [
  {name:"维护标签",key:'1'},
  {name:"客户等级",key:'2'},
]


@Form.create()
class BaseView extends Component {

  
  constructor(props) {
    super(props);
    // this.myRef = React.createRef();
    this.state = {
      TabsKey:"7"
    };
  }

  

  componentDidMount() {
    
  }


  onChangeTabsKey = (key) => {
    this.setState({
      TabsKey:key
    })
  }
  
  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    const { TabsKey } = this.state;

    
    return (
    //   <Panel>
        <Form style={{ marginTop: 8 }} hideRequiredMark>
          <div style={{background:"#ffffff"}}>
            <Tabs defaultActiveKey={TabsKey} onChange={this.onChangeTabsKey}>
              {
                topTabPane.map(item=>{
                  return (
                    <TabPane tab={item.name} key={item.key}>
                      {
                        item.key === "1" ? (
                            <Label/>
                            
                        ) :""
                      }
                      {
                        item.key === "2" ? (
                            <Grade/>
                        ) :""
                      }
                    </TabPane>
                  )
                })
              }
            </Tabs>
          </div>
          
        </Form>
    //   </Panel>
    );
  }
}

export default BaseView;
