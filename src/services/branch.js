import { stringify } from 'qs';
import func from '../utils/Func';
import request from '../utils/request';

//公司下拉框列表接口
export async function branchTree(params) {
  return request('/api/branch/branchTree', {
    method: 'POST',
    body: params,
  });
}

//分公司列表
export async function branchList(params) {
  return request('/api/branch/branchList', {
    method: 'POST',
    body: params,
  });
}

//分公司订单列表
export async function orderList(params) {
  return request('/api/branch/orderList', {
    method: 'POST',
    body: params,
  });
}

//分公司订单业务员
export async function branchSalesman(params) {
  console.log(params)
  return request('/api/branch/branchSalesman', {
    method: 'POST',
    body: params,
  });
}
//訂單詳情
export async function orderdetail(params) {
  return request('/api/branch/orderdetail', {
    method: 'POST',
    body: params,
  });
}

//首次打印
export async function printRequest(params) {
  return request('/api/branch/printRequest', {
    method: 'POST',
    body: params,
  });
}
//本地打印
export async function getOriginalDataJson(params) {
  return request('/api/branch/getOriginalDataJson', {
    method: 'POST',
    body: params,
  });
}

export async function updateData(params) {
  return request('/api/branch/update', {
    method: 'POST',
    body: params,
  });
}

export async function returngoods(params) {
  return request('/api/branch/returngoods', {
    method: 'POST',
    body: params,
  });
}

// /branch/branchSalesman
