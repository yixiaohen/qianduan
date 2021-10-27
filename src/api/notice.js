import request from '@/utils/request';

export function InsertNotice(data) {
  return request({
    url: '/Notice/InsertNotice',
    method: 'post',
    data
  });
}

export function DeleteNotice(data) {
  return request({
    url: '/Notice/DeleteNotice',
    method: 'post',
    data
  });
}

export function UpdateNotice(data) {
  return request({
    url: '/Notice/UpdateNotice',
    method: 'post',
    data
  });
}

export function SelectNotice(data) {
  return request({
    url: '/Notice/SelectNotice',
    method: 'post',
    data
  });
}

export function SelectWaitCount(data) {
  return request({
    url: '/Notice/SelectWaitCount',
    method: 'post',
    data
  });
}

export function SelectPDCACount() {
  return request({
    url: '/Score/SelectPDCACount',
    method: 'post'
  });
}

export function SelectDeptPDCACount(data) {
  return request({
    url: '/Score/SelectDeptPDCACount',
    method: 'post',
    data
  });
}
