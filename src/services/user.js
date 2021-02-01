import { stringify } from 'qs';
import md5 from 'js-md5';
import request from '../utils/request';
import { getCaptchaKey } from '../utils/authority';
import func from '../utils/Func';
import { captchaMode } from '../defaultSettings';

// =====================用户===========================

export async function accountLogin(params) {
  const values = params;
  values.grant_type = captchaMode ? 'captcha' : 'password';
  values.scope = 'all';
  values.password = md5(values.password);
  return request('/api/blade-auth/oauth/token', {
    headers: {
      'Tenant-Id': values.tenantId,
      'Captcha-key': getCaptchaKey(),
      'Captcha-code': values.code,
    },
    method: 'POST',
    body: func.toFormData(values),
  });
}

export async function socialLogin(params) {
  const values = params;
  values.grant_type = 'social';
  values.scope = 'all';
  return request('/api/blade-auth/oauth/token', {
    method: 'POST',
    body: func.toFormData(values),
  });
}

export async function registerGuest(form, oauthId) {
  const values = form;
  values.oauthId = oauthId;
  return request('/api/blade-user/register-guest', {
    method: 'POST',
    body: func.toFormData(values),
  });
}

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request('/api/currentUser');
}

export async function list(params) {
  return request(`/api/blade-user/page?${stringify(params)}`);
}

export async function grant(params) {
  return request('/api/blade-user/grant', {
    method: 'POST',
    body: func.toFormData(params),
  });
}

export async function resetPassword(params) {
  return request('/api/blade-user/reset-password', {
    method: 'POST',
    body: func.toFormData(params),
  });
}

export async function remove(params) {
  return request('/api/blade-user/remove', {
    method: 'POST',
    body: func.toFormData(params),
  });
}

export async function submit(params) {
  return request('/api/blade-user/submit', {
    method: 'POST',
    body: params,
  });
}

export async function update(params) {
  return request('/api/blade-user/update', {
    method: 'POST',
    body: params,
  });
}

export async function updateInfo(params) {
  return request('/api/blade-user/update-info', {
    method: 'POST',
    body: params,
  });
}
export async function propertyUpdate(params) {
  return request('/api/merchants_property/property/update', {
    method: 'POST',
    body: params,
  });
}

export async function detail(params) {
  return request(`/api/blade-user/detail?${stringify(params)}`);
}

export async function getUserInfo() {
  return request('/api/blade-user/info');
}

export async function getSalesmanInfo() {
  return request('/api/merchants_property/property/detail');
}

export async function getTenantInfo() {
  return request('/api/blade-system/tenant/tenantInfo');
}

export async function getSMSBalance() {
  return request('/api/blade-user/userMoneyInfo');
}

export async function updatePassword(params) {
  const values = params;
  values.oldPassword = md5(values.oldPassword);
  values.newPassword = md5(values.newPassword);
  values.newPassword1 = md5(values.newPassword1);
  return request('/api/blade-user/update-password', {
    method: 'POST',
    body: func.toFormData(values),
  });
}

export async function getCaptchaImage() {
  return request('/api/blade-auth/oauth/captcha');
}

export async function getCaptchaImageRegister() {
  return request('/api/customer/contactcustomer/captcha');
}

export async function clearCache() {
  return request('/api/blade-auth/oauth/clear-cache');
}


// 注册 - 发送短信
export async function registerSendcode(params) {
  return request('/api/customer/contactcustomer/sendcode', {
    method: 'POST',
    body: params,
  });
}

// 注册
export async function registerUser(params) {
  return request('/api/customer/contactcustomer/save', {
    method: 'POST',
    body: params,
  });
}

// 注册列表
export async function registerList(params) {
  return request('/api/customer/contactcustomer/list', {
    method: 'POST',
    body: params,
  });
}

// 注册数据修改
export async function registerUpdate(params) {
  return request('/api/customer/contactcustomer/update', {
    method: 'POST',
    body: params,
  });
}

// 绑定
export async function binding(params) {
  return request('/api/blade-user/weChatBinding/'+params, {
    method: 'GET',
  });
}

// 解绑
export async function unbundling(userAccount,openId) {
  return request('/api/blade-user/unWeChatBind/'+userAccount+"/"+openId, {
    method: 'GET',
  });
}

// 测试
export async function testOpenid(openId) {
  return request('/api/agent/salesman/sendTest/'+openId, {
    method: 'GET',
  });
}

export async function ordersheetDetail(time) {
  return request('/api/tracking/ordersheet/detail?statisticsTime='+time, {
    method: 'GET',
  });
}


// 查询维护标签
export async function getLabel(params) {
  params.labelType = 0;
  return request('/api/label_base_info/labelbaseinfo/list', {
    method: 'POST',
    body: params,
  });
}

// 新增维护标签
export async function addLabel(params) {
  return request('/api/label_base_info/labelbaseinfo/save', {
    method: 'POST',
    body: params,
  });
}
// 又不更新了生气-----为什么
// 修改维护标签
export async function updateLabel(params) {
  params.labelType = 0;
  return request('/api/label_base_info/labelbaseinfo/update', {
    method: 'POST',
    body: params,
  });
}

// 删除维护标签
export async function removeLabel(params) {
  return request('/api/label_base_info/labelbaseinfo/remove?ids='+params+'&labelType=0', {
    method: 'POST',
  });
}



// 查询客户等级
export async function getGrade(params) {
  params.labelType = 1;
  return request('/api/label_base_info/labelbaseinfo/list', {
    method: 'POST',
    body: params,
  });
}

// 新增客户等级
export async function addGrade(params) {
  return request('/api/label_base_info/labelbaseinfo/save', {
    method: 'POST',
    body: params,
  });
}

// 修改客户等级
export async function updateGrade(params) {
  params.labelType = 1;
  return request('/api/label_base_info/labelbaseinfo/update', {
    method: 'POST',
    body: params,
  });
}

// 删除客户等级
export async function removeGrade(params) {
  return request('/api/label_base_info/labelbaseinfo/remove?ids='+params+'&labelType=1', {
    method: 'POST',
  });
}
