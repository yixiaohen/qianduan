import request from '@/utils/request';

export function InsertNorm(data) {
  return request({
    url: '/RC_Norm/InsertNorm',
    method: 'post',
    data
  });
}

export function DeleteNorm(data) {
  return request({
    url: '/RC_Norm/DeleteNorm',
    method: 'post',
    data
  });
}

export function UpdateNorm(data) {
  return request({
    url: '/RC_Norm/UpdateNorm',
    method: 'post',
    data
  });
}

export function SelectNorm(data) {
  return request({
    url: '/RC_Norm/SelectNorm',
    method: 'post',
    data
  });
}
