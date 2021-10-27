import request from '@/utils/request';

InsertEmphasis;
export function SelectEmphasisDay(data) {
  return request({
    url: '/OKR_Emphasis/SelectEmphasisDay',
    method: 'get',
    params: data,
    intercept: 1
  });
}

export function InsertEmphasis(data) {
  return request({
    url: '/OKR_Emphasis/InsertEmphasis',
    method: 'post',
    data
  });
}

export function SelectEmphasisWeekAndMonth(data) {
  return request({
    url: '/OKR_Emphasis/SelectEmphasisWeekAndMonth',
    method: 'get',
    params: data
  });
}

export function UpdateEmphasisState(data) {
  return request({
    url: '/OKR_Emphasis/UpdateEmphasisState',
    method: 'post',
    data
  });
}
