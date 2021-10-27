import request from '@/utils/request';

export function SelectDaily(data) {
  return request({
    url: '/OKR_Daily/SelectDaily',
    method: 'get',
    params: data
  });
}

export function InsertDaily(data) {
  return request({
    url: '/OKR_Daily/InsertDaily',
    method: 'post',
    data
  });
}
