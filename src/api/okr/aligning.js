import request from '@/utils/request';

export function SelectAlignObject(params) {
  return request({
    url: '/OKR_Aligning/SelectAlignObject',
    method: 'get',
    params
  });
}

export function InsertAligning(data) {
  return request({
    url: '/OKR_Aligning/InsertAligning',
    method: 'post',
    data
  });
}

export function MyAlign(params) {
  return request({
    url: '/OKR_Aligning/MyAlign',
    method: 'get',
    params
  });
}
