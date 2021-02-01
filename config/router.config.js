export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', name: 'login', component: './Login/Login' },
      { path: '/user/register/:id', name: 'register', component: './Login/Register' },
      {
        path: '/user/register-result',
        name: 'register.result',
        component: './Login/RegisterResult',
      },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    routes: [
      // dashboard
      {
        path: '/',
        redirect: '/dashboard/workplace',
      },
      {
        path: '/result',
        routes: [
          // result
          { path: '/result/success', component: './Result/Success' },
          { path: '/result/fail', component: './Result/Error' },
        ],
      },
      {
        path: '/exception',
        routes: [
          // exception
          { path: '/exception/403', name: 'not-permission', component: './Exception/403' },
          { path: '/exception/404', name: 'not-find', component: './Exception/404' },
          { path: '/exception/500', name: 'server-error', component: './Exception/500' },
          {
            path: '/exception/trigger',
            name: 'trigger',
            component: './Exception/TriggerException',
          },
        ],
      },
      {
        path: '/account',
        routes: [
          {
            path: '/account/center',
            component: './Account/Center/Center',
            routes: [
              { path: '/account/center', component: './Account/Center/Articles' },
              { path: '/account/center/applications', component: './Account/Center/Applications' },
              { path: '/account/center/projects', component: './Account/Center/Projects' },
            ],
          },
          {
            path: '/account/settings',
            //component: './Account/Settings/Info',
            routes: [
              { path: '/account/settings', component: './Account/Settings/BaseView' },
              { path: '/account/settings/password', component: './Account/Settings/PasswordView' },
              //{ path: '/account/settings/security', component: './Account/Settings/SecurityView' },
              //{ path: '/account/settings/binding', component: './Account/Settings/BindingView' },
              {
                path: '/account/settings/notification',
                component: './Account/Settings/NotificationView',
              },
            ],
          },
        ],
      },
      //  editor
      {
        name: 'editor',
        icon: 'highlight',
        path: '/editor',
        routes: [
          {
            path: '/editor/flow',
            name: 'flow',
            component: './Editor/GGEditor/Flow',
          },
          {
            path: '/editor/mind',
            name: 'mind',
            component: './Editor/GGEditor/Mind',
          },
          {
            path: '/editor/koni',
            name: 'koni',
            component: './Editor/GGEditor/Koni',
          },
        ],
      },
      {
        path: '/dashboard',
        routes: [
          { path: '/dashboard/analysis', component: './Dashboard/Analysis' },
          { path: '/dashboard/monitor', component: './Dashboard/Monitor' },
          { path: '/dashboard/workplace', component: './Dashboard/Workplace' },
        ],
      },
      {
        path: '/desk',
        routes: [
          {
            path: '/desk/notice',
            routes: [
              { path: '/desk/notice', component: './Desk/Notice/Notice' },
              { path: '/desk/notice/add', component: './Desk/Notice/NoticeAdd' },
              { path: '/desk/notice/edit/:id', component: './Desk/Notice/NoticeEdit' },
              { path: '/desk/notice/view/:id', component: './Desk/Notice/NoticeView' },
            ],
          },
        ],
      },
      {
        path: '/work',
        routes: [
          {
            path: '/work/start',
            routes: [
              { path: '/work/start', component: './Work/WorkStart' },
            ],
          },
          {
            path: '/work/claim',
            routes: [
              { path: '/work/claim', component: './Work/WorkClaim' },
            ],
          },
          {
            path: '/work/todo',
            routes: [
              { path: '/work/todo', component: './Work/WorkTodo' },
            ],
          },
          {
            path: '/work/send',
            routes: [
              { path: '/work/send', component: './Work/WorkSend' },
            ],
          },
          {
            path: '/work/done',
            routes: [
              { path: '/work/done', component: './Work/WorkDone' },
            ],
          },
          {
            path: '/work/process',
            routes: [
              {
                path: '/work/process/leave/form/:processDefinitionId',
                component: './Work/Process/Leave/LeaveStart',
              },
              {
                path: '/work/process/leave/handle/:taskId/:processInstanceId/:businessId',
                component: './Work/Process/Leave/LeaveHandle',
              },
              {
                path: '/work/process/leave/detail/:processInstanceId/:businessId',
                component: './Work/Process/Leave/LeaveDetail',
              },
            ],
          },
        ],
      },
      {
        path: '/report',
        routes: [
          {
            path: '/report/reportlist',
            routes: [{ path: '/report/reportlist', component: './Report/Report' }],
          },
        ],
      },
      {
        path: '/base',
        routes: [
          {
            path: '/base/region',
            routes: [
              { path: '/base/region', component: './Base/Region/Region' },
            ],
          },
        ],
      },
      {
        path: '/authority',
        routes: [
          {
            path: '/authority/role',
            routes: [
              { path: '/authority/role', component: './Authority/Role/Role' },
              { path: '/authority/role/add', component: './Authority/Role/RoleAdd' },
              { path: '/authority/role/add/:id', component: './Authority/Role/RoleAdd' },
              { path: '/authority/role/edit/:id', component: './Authority/Role/RoleEdit' },
              { path: '/authority/role/view/:id', component: './Authority/Role/RoleView' },
            ],
          },
          {
            path: '/authority/datascope',
            routes: [
              { path: '/authority/datascope', component: './Authority/DataScope/DataScope' },
            ],
          },
          {
            path: '/authority/apiscope',
            routes: [
              { path: '/authority/apiscope', component: './Authority/ApiScope/ApiScope' },
            ],
          },
        ],
      },
      {
        path: '/system',
        routes: [
          {
            path: '/system/user',
            routes: [
              { path: '/system/user', component: './System/User/User' },
              { path: '/system/user/add', component: './System/User/UserAdd' },
              { path: '/system/user/add/:id', component: './System/User/UserAdd' },
              { path: '/system/user/edit/:id', component: './System/User/UserEdit' },
              { path: '/system/user/view/:id', component: './System/User/UserView' },
            ],
          },
          {
            path: '/system/basic',
            routes: [
              { path: '/system/basic', component: './System/basicSettings/BaseView' },
            ],
          },
          // Basic settings
          {
            path: '/system/dict',
            routes: [
              { path: '/system/dict', component: './System/Dict/Dict' },
              { path: '/system/dict/add', component: './System/Dict/DictAdd' },
              { path: '/system/dict/add/:id', component: './System/Dict/DictAdd' },
              { path: '/system/dict/edit/:id', component: './System/Dict/DictEdit' },
              { path: '/system/dict/view/:id', component: './System/Dict/DictView' },
              { path: '/system/dict/sub/:parentId', component: './System/Dict/DictSub' },
            ],
          },
          {
            path: '/system/dictbiz',
            routes: [
              { path: '/system/dictbiz', component: './System/DictBiz/DictBiz' },
              { path: '/system/dictbiz/add', component: './System/DictBiz/DictBizAdd' },
              { path: '/system/dictbiz/add/:id', component: './System/DictBiz/DictBizAdd' },
              { path: '/system/dictbiz/edit/:id', component: './System/DictBiz/DictBizEdit' },
              { path: '/system/dictbiz/view/:id', component: './System/DictBiz/DictBizView' },
              { path: '/system/dictbiz/sub/:parentId', component: './System/DictBiz/DictBizSub' },
            ],
          },
          {
            path: '/system/dept',
            routes: [
              { path: '/system/dept', component: './System/Dept/Dept' },
              { path: '/system/dept/add', component: './System/Dept/DeptAdd' },
              { path: '/system/dept/add/:id', component: './System/Dept/DeptAdd' },
              { path: '/system/dept/edit/:id', component: './System/Dept/DeptEdit' },
              { path: '/system/dept/view/:id', component: './System/Dept/DeptView' },
            ],
          },
          {
            path: '/system/organization',
            routes: [
              { path: '/system/organization', component: './System/Organization/Organization' },
              { path: '/system/organization/add', component: './System/Organization/OrganizationAdd' },
              { path: '/system/organization/add/:id', component: './System/Organization/OrganizationAdd' },
              { path: '/system/organization/edit/:id', component: './System/Organization/OrganizationEdit' },
              { path: '/system/organization/view/:id', component: './System/Organization/OrganizationView' },
            ],
          },
          {
            path: '/system/post',
            routes: [
              { path: '/system/post', component: './System/Post/Post' },
              { path: '/system/post/add', component: './System/Post/PostAdd' },
              { path: '/system/post/add/:id', component: './System/Post/PostAdd' },
              { path: '/system/post/edit/:id', component: './System/Post/PostEdit' },
              { path: '/system/post/view/:id', component: './System/Post/PostView' },
            ],
          },
          {
            path: '/system/menu',
            routes: [
              { path: '/system/menu', component: './System/Menu/Menu' },
              { path: '/system/menu/add', component: './System/Menu/MenuAdd' },
              { path: '/system/menu/add/:id', component: './System/Menu/MenuAdd' },
              { path: '/system/menu/edit/:id', component: './System/Menu/MenuEdit' },
              { path: '/system/menu/view/:id', component: './System/Menu/MenuView' },
            ],
          },
          {
            path: '/system/topmenu',
            routes: [
              { path: '/system/topmenu', component: './System/TopMenu/TopMenu' },
              { path: '/system/topmenu/add', component: './System/TopMenu/TopMenuAdd' },
              { path: '/system/topmenu/add/:id', component: './System/TopMenu/TopMenuAdd' },
              { path: '/system/topmenu/edit/:id', component: './System/TopMenu/TopMenuEdit' },
              { path: '/system/topmenu/view/:id', component: './System/TopMenu/TopMenuView' },
            ],
          },
          {
            path: '/system/param',
            routes: [
              { path: '/system/param', component: './System/Param/Param' },
              { path: '/system/param/add', component: './System/Param/ParamAdd' },
              { path: '/system/param/edit/:id', component: './System/Param/ParamEdit' },
              { path: '/system/param/view/:id', component: './System/Param/ParamView' },
            ],
          },
          {
            path: '/system/tenant',
            routes: [
              { path: '/system/tenant', component: './System/Tenant/Tenant' },
              { path: '/system/tenant/add', component: './System/Tenant/TenantAdd' },
              { path: '/system/tenant/edit/:id', component: './System/Tenant/TenantEdit' },
              { path: '/system/tenant/view/:id', component: './System/Tenant/TenantView' },
            ],
          },
          {
            path: '/system/client',
            routes: [
              { path: '/system/client', component: './System/Client/Client' },
              { path: '/system/client/add', component: './System/Client/ClientAdd' },
              { path: '/system/client/edit/:id', component: './System/Client/ClientEdit' },
              { path: '/system/client/view/:id', component: './System/Client/ClientView' },
            ],
          },
          {
            path: '/system/smsrecharge',
            routes: [
              { path: '/system/smsrecharge', component: './System/Recharge/index' },
            ],
          },
          {
            path: '/system/registrationList',
            routes: [
              { path: '/system/registrationList', component: './System/registrationList/index' },
            ],
          },
          {
            path: '/system/timedTasks',
            routes: [
              { path: '/system/timedTasks', component: './System/timedTasks/index' },
              { path: '/system/timedTasks/add', component: './System/timedTasks/add' },
              { path: '/system/timedTasks/update', component: './System/timedTasks/update' },
            ],
          },
          {
            path: '/system/labelManagement',
            routes: [
              { path: '/system/labelManagement', component: './System/labelManagement/index' },
            ],
          },
        ],
      },
      {
        path: '/monitor',
        routes: [
          {
            path: '/monitor/log',
            routes: [
              {
                path: '/monitor/log/usual',
                routes: [
                  { path: '/monitor/log/usual', component: './Monitor/Log/LogUsual' },
                  { path: '/monitor/log/usual/view/:id', component: './Monitor/Log/LogUsualView' },
                ],
              },
              {
                path: '/monitor/log/api',
                routes: [
                  { path: '/monitor/log/api', component: './Monitor/Log/LogApi' },
                  { path: '/monitor/log/api/view/:id', component: './Monitor/Log/LogApiView' },
                ],
              },
              {
                path: '/monitor/log/error',
                routes: [
                  { path: '/monitor/log/error', component: './Monitor/Log/LogError' },
                  { path: '/monitor/log/error/view/:id', component: './Monitor/Log/LogErrorView' },
                ],
              },
            ],
          },
        ],
      },
      {
        path: '/tool',
        routes: [
          {
            path: '/tool/code',
            routes: [
              { path: '/tool/code', component: './System/Code/Code' },
              { path: '/tool/code/add', component: './System/Code/CodeAdd' },
              { path: '/tool/code/add/:id', component: './System/Code/CodeAdd' },
              { path: '/tool/code/edit/:id', component: './System/Code/CodeEdit' },
              { path: '/tool/code/view/:id', component: './System/Code/CodeView' },
            ],
          },
          {
            path: '/tool/datasource',
            routes: [
              { path: '/tool/datasource', component: './System/DataSource/DataSource' },
              { path: '/tool/datasource/add', component: './System/DataSource/DataSourceAdd' },
              { path: '/tool/datasource/add/:id', component: './System/DataSource/DataSourceAdd' },
              {
                path: '/tool/datasource/edit/:id',
                component: './System/DataSource/DataSourceEdit',
              },
              {
                path: '/tool/datasource/view/:id',
                component: './System/DataSource/DataSourceView',
              },
            ],
          },
        ],
      },
      {
        path: '/flow',
        routes: [
          {
            path: '/flow/model',
            routes: [
              { path: '/flow/model', component: './Flow/FlowModel' },
            ],
          },
          {
            path: '/flow/deploy',
            routes: [
              { path: '/flow/deploy', component: './Flow/FlowDeploy' },
            ],
          },
          {
            path: '/flow/manager',
            routes: [
              { path: '/flow/manager', component: './Flow/FlowManager' },
            ],
          },
          {
            path: '/flow/follow',
            routes: [
              { path: '/flow/follow', component: './Flow/FlowFollow' },
            ],
          },
        ],
      },
      {
        path: '/resource',
        routes: [
          {
            path: '/resource/oss',
            routes: [
              { path: '/resource/oss', component: './Resource/Oss/Oss' },
              { path: '/resource/oss/add', component: './Resource/Oss/OssAdd' },
              { path: '/resource/oss/edit/:id', component: './Resource/Oss/OssEdit' },
              { path: '/resource/oss/view/:id', component: './Resource/Oss/OssView' },
            ],
          },
          {
            path: '/resource/sms',
            routes: [
              { path: '/resource/sms', component: './Resource/Sms/Sms' },
              // { path: '/resource/sms/list', component: './Resource/Sms/Sms' },
              { path: '/resource/sms/add', component: './Resource/Sms/SmsAdd' },
              { path: '/resource/sms/edit/:id', component: './Resource/Sms/SmsEdit' },
              { path: '/resource/sms/view/:id', component: './Resource/Sms/SmsView' },
            ],
          },
          {
            path: '/resource/attach',
            routes: [
              { path: '/resource/attach', component: './Resource/Attach/Attach' },
              // { path: '/resource/attach/list', component: './Resource/Attach/Attach' },
            ],
          },
        ],
      },
      {
        path: '/sale',
        routes: [
          {
            path: '/sale/afterSale',
            routes: [
              { path: '/sale/afterSale', component: './Sales/AfterSale/list' },
              // { path: '/sale/afterSale/list', component: './Sales/AfterSale/list' },
              { path: '/sale/afterSale/add', component: './Sales/AfterSale/add' },
            ],
          },
          {
            path: '/tool/code',
            routes: [
              { path: '/tool/code', component: './System/Code/Code' },
              // { path: '/tool/code/list', component: './System/Code/Code' },
              { path: '/tool/code/add', component: './System/Code/CodeAdd' },
              { path: '/tool/code/add/:id', component: './System/Code/CodeAdd' },
              { path: '/tool/code/edit/:id', component: './System/Code/CodeEdit' },
              { path: '/tool/code/view/:id', component: './System/Code/CodeView' },
            ],
          },
        ],
      },
      {
        path: '/order',
        routes: [
          {
            path: '/order/allOrders',
            routes: [
              { path: '/order/allOrders', component: './Order/AllOrders/index' },
              // { path: '/order/allOrders/list', component: './Order/AllOrders/index' },
              { path: '/order/allOrders/add', component: './Order/components/add' },
              { path: '/order/allOrders/edit/:id', component: './Order/components/edit' },
              { path: '/order/allOrders/logisticsConfiguration', component: './Order/components/logisticsConfiguration' },
              { path: '/order/allOrders/img', component: './Order/components/img' },
            ],
          },
          {
            path: '/order/executive',
            routes: [
              { path: '/order/executive', component: './Order/Executive/index' },
              // { path: '/order/executive/list', component: './Order/Executive/index' },
              { path: '/order/executive/add', component: './Order/components/add' },
              { path: '/order/executive/edit/:id', component: './Order/components/edit' },
              { path: '/order/executive/logisticsConfiguration', component: './Order/components/logisticsConfiguration' },
            ],
          },
          {
            path: '/order/salesmanOrder',  //业务员订单
            routes: [
              { path: '/order/salesmanOrder', component: './Order/SalesmanOrder/index' },
              // { path: '/order/salesmanOrder/list', component: './Order/SalesmanOrder/index' },
              { path: '/order/salesmanOrder/add', component: './Order/components/add' },
              { path: '/order/salesmanOrder/edit/:id', component: './Order/components/edit' },
              { path: '/order/salesmanOrder/logisticsConfiguration', component: './Order/components/logisticsConfiguration' },
            ],
          },
          {
            path: '/order/warehouseOrder',  //仓库订单
            routes: [
              { path: '/order/warehouseOrder', component: './Order/WarehouseOrder/index' },
              // { path: '/order/warehouseOrder/list', component: './Order/WarehouseOrder/index' },
              { path: '/order/warehouseOrder/add', component: './Order/components/add' },
              { path: '/order/warehouseOrder/edit/:id', component: './Order/components/edit' },
              { path: '/order/warehouseOrder/logisticsConfiguration', component: './Order/components/logisticsConfiguration' },
            ],
          },
          {
            path: '/order/afterSaleOrder',  //售后订单
            routes: [
              { path: '/order/afterSaleOrder', component: './Order/AfterSaleOrder/index' },
              { path: '/order/afterSaleOrder/add', component: './Order/components/add' },
              { path: '/order/afterSaleOrder/edit/:id', component: './Order/components/edit' },
              { path: '/order/afterSaleOrder/logisticsConfiguration', component: './Order/components/logisticsConfiguration' },
            ],
          },
          {
            path: '/order/smsrecord',
            routes: [
              { path: '/order/smsrecord', component: './Order/SMSrecord/index' },
            ],
          },
        ],
      },
      {
        path: '/orders',
        routes: [
          {
            path: '/orders/orderList/:id',
            routes: [
              { path: '/orders/orderList/:id', component: './Order/OrderList/index' },
              { path: '/orders/orderList/add', component: './Order/OrderList/add' },
              { path: '/orders/orderList/edit/:id', component: './Order/OrderList/edit' },
              { path: '/orders/orderList/logisticsConfiguration', component: './Order/components/logisticsConfiguration' },
              { path: '/orders/orderList/img', component: './Order/OrderList/img' },
            ],
          },
        ],
      },
      {
        path: '/logistics',
        routes: [
          {
            path: '/logistics/authority',
            routes: [
              { path: '/logistics/authority', component: './Logistics/Authority/index' },
              { path: '/logistics/authority/add', component: './Logistics/Authority/add' },
              { path: '/logistics/authority/edit', component: './Logistics/Authority/edit' },
            ],
          },
          {
            path: '/logistics/faceSheet',
            routes: [
              { path: '/logistics/faceSheet', component: './Logistics/FaceSheet/index' },
              { path: '/logistics/faceSheet/add', component: './Logistics/FaceSheet/add' },
              { path: '/logistics/faceSheet/edit', component: './Logistics/FaceSheet/edit' },
            ],
          },
          {
            path: '/logistics/sender',
            routes: [
              { path: '/logistics/sender', component: './Logistics/Sender/index' },
              { path: '/logistics/sender/add', component: './Logistics/Sender/add' },
              { path: '/logistics/sender/edit', component: './Logistics/Sender/edit' },
            ],
          },
          {
            path: '/logistics/goods',
            routes: [
              { path: '/logistics/goods', component: './Logistics/Goods/index' },
              { path: '/logistics/goods/add', component: './Logistics/Goods/add' },
               { path: '/logistics/goods/edit', component: './Logistics/Goods/edit' },
            ],
          },
          {
            path: '/logistics/additional',
            routes: [
              { path: '/logistics/additional', component: './Logistics/Additional/index' },
              { path: '/logistics/additional/add', component: './Logistics/Additional/add' },
              { path: '/logistics/additional/edit', component: './Logistics/Additional/edit' },
            ],
          },
        
        ],
      },
      {
        path: '/customer',
        routes: [
          {
            path: '/customer/sales',
            routes: [
              { path: '/customer/sales', component: './Customer/Sales/index' },
              { path: '/customer/sales/add', component: './Customer/Sales/add' },
              { path: '/customer/sales/edit', component: './Customer/Sales/edit' },
            ],
          },
          {
            path: '/customer/afterSale',
            routes: [
              { path: '/customer/afterSale', component: './Customer/AfterSale/index' },
              { path: '/customer/afterSale/add', component: './Customer/AfterSale/add' },
              { path: '/customer/afterSale/edit', component: './Customer/AfterSale/edit' },
            ],
          },
        ],
      },{
        path: '/product',
        routes: [
          {
            path: '/product/payBrand',
            routes: [
              { path: '/product/payBrand', component: './Product/PayBrand/index' },
            ],
          },{
            path: '/product/productType',
            routes: [
              { path: '/product/productType', component: './Product/ProductType/index' },
            ],
          },{
            path: '/product/productManagement',
            routes: [
              { path: '/product/productManagement', component: './Product/ProductManagement/index' },
            ],
          },
        ],
      },
    ],
  },
];
