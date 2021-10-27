import request from '@/utils/request';

// 职位管理
export function InsertPosition(data) {
  return request({
    url: '/Position/InsertPosition',
    method: 'post',
    data
  });
}

export function DeletePosition(data) {
  return request({
    url: '/Position/DeletePosition',
    method: 'post',
    data
  });
}

export function UpdatePosition(data) {
  return request({
    url: '/Position/UpdatePosition',
    method: 'post',
    data
  });
}

export function SelectPosition(data) {
  return request({
    url: '/Position/SelectPosition',
    method: 'post',
    data
  });
}
