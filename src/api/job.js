import request from '@/utils/request';

// 职称管理
export function InsertPosition(data) {
  return request({
    url: '/Job/InsertPosition',
    method: 'post',
    data
  });
}

export function DeletePosition(data) {
  return request({
    url: '/Job/DeletePosition',
    method: 'post',
    data
  });
}

export function UpdatePosition(data) {
  return request({
    url: '/Job/UpdatePosition',
    method: 'post',
    data
  });
}

export function SelectJob(data) {
  return request({
    url: '/Job/SelectPosition',
    method: 'post',
    data
  });
}
