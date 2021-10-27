import request from '@/utils/request';

// 查询预警配置
export function SelectAnticDeploy(data) {
  return request({
    url: '/I_AnticDeploy/SelectAnticDeploy',
    method: 'get',
    params: data
  });
}

// 添加预警配置
export function InsertAnticDeploy(data) {
  return request({
    url: '/I_AnticDeploy/InsertAnticDeploy',
    method: 'post',
    data
  });
}

// 修改预警配置
export function UpdateAnticDeploy(data) {
  return request({
    url: '/I_AnticDeploy/UpdateAnticDeploy',
    method: 'post',
    data
  });
}
// 删除预警配置
export function DeleteAnticDeploy(data) {
  return request({
    url: '/I_AnticDeploy/DeleteAnticDeploy',
    method: 'post',
    data
  });
}
// 查询预警组别
export function SelectAnticGroup(data) {
  return request({
    url: '/I_AnticDeploy/SelectAnticGroup',
    method: 'get',
    params: data
  });
}

// 添加预警组别
export function InsertAnticGroup(data) {
  return request({
    url: '/I_AnticDeploy/InsertAnticGroup',
    method: 'post',
    data
  });
}

// 修改预警组别
export function UpdateAnticGroup(data) {
  return request({
    url: '/I_AnticDeploy/UpdateAnticGroup',
    method: 'post',
    data
  });
}

// 删除预警组别
export function DeleteAnticGroup(data) {
  return request({
    url: '/I_AnticDeploy/DeleteAnticGroup',
    method: 'post',
    data
  });
}

