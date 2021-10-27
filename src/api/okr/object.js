import request from '@/utils/request';

export function InsertObject(data) {
  return request({
    url: '/OKR_Object/InsertObject',
    method: 'post',
    data
  });
}

export function SelectObject(data) {
  return request({
    url: '/OKR_Object/SelectObject',
    method: 'get',
    params: data
  });
}

export function DeleteObject(data) {
  return request({
    url: '/OKR_Object/DeleteObject',
    method: 'post',
    data
  });
}

export function UpdateObject(data) {
  return request({
    url: '/OKR_Object/UpdateObject',
    method: 'post',
    data
  });
}
