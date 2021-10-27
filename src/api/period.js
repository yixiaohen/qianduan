import request from '@/utils/request';

// 职位管理
export function InsertPeriod(data) {
  return request({
    url: '/Period/InsertPeriod',
    method: 'post',
    data
  });
}

export function DeletePeriod(data) {
  return request({
    url: '/Period/DeletePeriod',
    method: 'post',
    data
  });
}

export function UpdatePeriod(data) {
  return request({
    url: '/Period/UpdatePeriod',
    method: 'post',
    data
  });
}

export function SelectPeriod(data) {
  return request({
    url: '/Period/SelectPeriod',
    method: 'post',
    data
  });
}

