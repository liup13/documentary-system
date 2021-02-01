/**
 * Created by Lenovo on 2020/9/8.
 */
 import { stringify } from 'qs';
import request from '../../utils/request';
 import func from '../../utils/Func';


// ============ 授权配置 ===============
export async function getList(params) {
  return request(`/api/logistics/authorization/list`, {
    method: 'POST',
    body: params,
  });
}

export async function getAddList(params) {
  return request('/api/logistics/authorization/save', {
    method: 'POST',
    body: params,
  });
}

export async function getSubmit(params) {
  return request('/api/logistics/authorization/update', {
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

export async function getUrl(params) {
  return request(`/api/logistics/authorization/`+params,{
    method: 'POST',
  });
}
export async function getSuthorizationStatus(params) {
  return request('/api/logistics/authorization/updateItemInfoStatus', {
    method: 'POST',
    body: params,
  });
}


// ============ 打印模板 ===============
export async function getSurfacesingleList(params) {
  return request(`/api/logistics/surfacesingle/list`, {
    method: 'POST',
    body: params,
  });
}
export async function getSurfacesingleSave(params) {
  return request('/api/logistics/surfacesingle/save', {
    method: 'POST',
    body: params,
  });
}
export async function getlogisticsTemplate(params) {
  return request('/api/logistics_template/template/list', {
    method: 'POST',
    body: params || {},
  });
}
export async function getSurfacesingleRemove(params) {
  return request('/api/logistics/surfacesingle/remove', {
    method: 'POST',
    body: func.toFormData(params),
  });
}
export async function getSurfacesingleSubmit(params) {
  return request('/api/logistics/surfacesingle/update', {
    method: 'POST',
    body: params,
  });
}
export async function getSurfacesingleStatus(params) {
  return request('/api/logistics/surfacesingle/updateSurfaceSingleStatus', {
    method: 'POST',
    body: params,
  });
}
// 打印模板刷新
export async function refreshStatus(params) {
  return request(`/api/logistics/surfacesingle/refreshStatus/${params}`, {
    method: 'GET',
  });
}


// ============ 寄件配置 ===============
export async function getDeliveryList(params) {
  return request(`/api/logistics/delivery/list`,{
    method: 'POST',
    body: params,
  });
}
export async function getDeliverySave(params) {
  return request('/api/logistics/delivery/save', {
    method: 'POST',
    body: params,
  });
}
export async function getDeliverySubmit(params) {
  return request('/api/logistics/delivery/update', {
    method: 'POST',
    body: params,
  });
}
export async function getDeliveryRemove(params) {
  return request('/api/logistics/delivery/remove', {
    method: 'POST',
    body: func.toFormData(params),
  });
}
export async function getDeliveryStatus(params) {
  return request('/api/logistics/delivery/updateDeliveryStatus', {
    method: 'POST',
    body: params,
  });
}



// ============ 物品信息 ===============
export async function getGoodsList(params) {
  return request(`/api/logistics/iteminformation/list`, {
    method: 'POST',
    body: params,
  });
}
export async function getGoodsSave(params) {
  return request('/api/logistics/iteminformation/save', {
    method: 'POST',
    body: params,
  });
}
export async function getGoodsSubmit(params) {
  return request('/api/logistics/iteminformation/update', {
    method: 'POST',
    body: params,
  });
}
export async function getGoodsRemove(params) {
  return request('/api/logistics/iteminformation/remove', {
    method: 'POST',
    body: func.toFormData(params),
  });
}
export async function getIteminformationStatus(params) {
  return request('/api/logistics/iteminformation/updateItemInfoStatus', {
    method: 'POST',
    body: params,
  });
}

// ============ 附加信息 ===============
export async function getAdditionalList(params) {
  return request(`/api/logistics/additionalinformation/list`, {
    method: 'POST',
    body: params,
  });
}
export async function getAdditionalSave(params) {
  return request('/api/logistics/additionalinformation/save', {
    method: 'POST',
    body: params,
  });
}
export async function getAdditionalSubmit(params) {
  return request('/api/logistics/additionalinformation/update', {
    method: 'POST',
    body: params,
  });
}
export async function getAdditionalRemove(params) {
  return request('/api/logistics/additionalinformation/remove', {
    method: 'POST',
    body: func.toFormData(params),
  });
}

export async function getAdditionalinformationStatus(params) {
  return request('/api/logistics/additionalinformation/updateAdditionInfoStatus', {
    method: 'POST',
    body: params,
  });
}



