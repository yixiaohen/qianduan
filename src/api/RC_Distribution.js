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
