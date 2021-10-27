import request from '@/utils/request';

export function SelectExpert() {
  return request({
    url: '/ButtonType/SelectButtonType',
    method: 'post'
  });
}

export function InsertButtonType(data) {
  return request({
    url: '/ButtonType/InsertButtonType',
    method: 'post',
    data
  });
}

export function UpdateButtonType(data) {
  return request({
    url: '/ButtonType/UpdateButtonType',
    method: 'post',
    data
  });
}

export function DeleteExpert(data) {
  return request({
    url: '/ButtonType/DeleteExpert',
    method: 'post',
    data
  });
}
