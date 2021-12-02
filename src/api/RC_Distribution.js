import request from '@/utils/request';

export function SelectDistribution(data) {
  return request({
    url: '/RC_Distribution/SelectDistribution',
    method: 'post',
    data
  });
}

export function UpdateDistribution(data) {
  return request({
    url: '/RC_Distribution/UpdateDistribution',
    method: 'post',
    data
  });
}

export function DeleteDistribution(data) {
  return request({
    url: '/RC_Distribution/DeleteDistribution',
    method: 'post',
    data
  });
}
// 表单管理中表单再次分配
export function CopyDistribution(data) {
  return request({
    url: '/RC_Distribution/CopyDistribution',
    method: 'get',
    params: data
  });
}
