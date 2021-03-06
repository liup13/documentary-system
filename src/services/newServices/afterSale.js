/**
 * Created by xiewenxin on 2020/09/28.
 */
import { stringify } from 'qs';
import request from '../../utils/request';
import func from '../../utils/Func';

export async function getList(params) {
  return request("/api/agent/salesman/list",{
    method: 'POST',
    body: params,
  });
}

export async function deleteData(params) {
    return request('/api/order/order/remove', {
      method: 'POST',
      body: func.toFormData(params),
    });
}

export async function createData(params) {
    return request('/api/order/order/save', {
      method: 'POST',
      body: params,
    });
  }

  export async function updateData(params) {
    return request('/api/order/order/update', {
      method: 'POST',
      body: params,
    });
  }
