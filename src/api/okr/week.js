import request from '@/utils/request';

export function InsertWeekly(data) {
  return request({
    url: 'OKR_Weekly/InsertWeekly',
    method: 'post',
    data
  });
}

export function SelectWeekly(data) {
  return request({
    url: 'OKR_Weekly/SelectWeekly',
    method: 'get',
    params: data
  });
}

