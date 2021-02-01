/**
 * Created by Lenovo on 2020/9/8.
 */
 import { stringify } from 'qs';
import request from '../../utils/request';
 import func from '../../utils/Func';


// ============ 销售管理 ===============
export async function getList(params) {
  return request("/api/agent/salesman/list",{
    method: 'POST',
    body: params,
  });
}

export async function updateStatus(params) {
  return request("/api/agent/salesman/updateStatus",{
    method: 'POST',
    body: params,
  });
}

export async function getAddList(params) {
  return request('/api/agent/salesman/save', {
    method: 'POST',
    body: params,
  });
}

export async function getUpdate(params) {
  return request('/api/agent/salesman/update', {
    method: 'POST',
    body: params,
  });
}


export async function getRemove(params) {
  return request('/api/logistics/authorization/remove', {
    method: 'POST',
    body: func.toFormData(params),
  });
}

// 售后列表
export async function getAfterlists(params) {
  return request('/api/agent/salesman/afterlist', {
    method: 'get',
  });
}

// ============ 修改分组 ===============
export async function getModifyGroup(params) {
  return request('/api/agent/salesman/batchUpdateSalesmanGroup', {
    method: 'POST',
    body: params,
  });
}
// ============ 分组 ===============
export async function getSalesmangroup(params) {
  return request('/api/agent/salesmangroup/list', {
    method: 'POST',
    body: params,
  });
}
// ============ 新增分组 ===============
export async function getSalesmangroupSubmit(params) {
  return request('/api/agent/salesmangroup/save', {
    method: 'POST',
    body: params,
  });
}
// ============ 删除分组 ===============
export async function getDeleteGroup(params) {
  return request(`/api/agent/salesmangroup/deleteGroup/${params}`, {
    method: 'POST',
  });
}
// ============ 公众号绑定 ===============
export async function getWeChatBinding(params) {
  return request(`/api/agent/salesman/weChatBinding/${params}`, {
    method: 'GET',
  });
}
// ============ 公众号解绑 ===============
export async function getUnWeChatBind(params,openId) {
  return request(`/api/agent/salesman/unWeChatBind/${params}/${openId}`, {
    method: 'GET',
  });
}
// ============ 微信测试消息 ===============
export async function getSendTest(params) {
  return request(`/api/agent/salesman/sendTest/${params}`, {
    method: 'GET',
  });
}
// ============ 获取当前系统二维码路由 ===============
export async function getCodeUrl() {
  return request(`/api/agent/salesman/codeUrl`, {
    method: 'GET',
  });
}
