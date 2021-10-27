import request from '@/utils/request';

export function SelectExpert(data) {
  return request({
    url: '/Expert/SelectExpert',
    method: 'post',
    data
  });
}

export function SelectChildrenExpert(data) {
  return request({
    url: '/Expert/SelectChildrenExpert',
    method: 'post',
    data
  });
}

export function InsertExpert(data) {
  return request({
    url: '/Expert/InsertExpert',
    method: 'post',
    data
  });
}

export function UpdateExpert(data) {
  return request({
    url: '/Expert/UpdateExpert',
    method: 'post',
    data
  });
}

export function DeleteExpert(data) {
  return request({
    url: '/Expert/DeleteExpert',
    method: 'post',
    data
  });
}

