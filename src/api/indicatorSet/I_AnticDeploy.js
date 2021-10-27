import request from '@/utils/request';
// 指标监测
// 预警
// 查询预警
export function SelectAnticDeploy(data) {
  return request({
    url: 'I_AnticDeploy/SelectAnticDeploy',
    method: 'get',
    params: data
  });
}

// 预警信息状态率
export function AnticStateRadio(data) {
  return request({
    url: 'I_AnticDeploy/AnticStateRadio',
    method: 'get',
    params: data
  });
}

// 查询预警状态
export function SelectAnticState(data) {
  return request({
    url: 'I_AnticDeploy/SelectAnticState',
    method: 'get',
    params: data
  });
}
