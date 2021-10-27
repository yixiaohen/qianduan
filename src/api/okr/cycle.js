import request from '@/utils/request';

export function InsertCycle(data) {
  return request({
    url: '/OKR_Cycle/InsertCycle',
    method: 'post',
    data
  });
}

export function SelectInCycle(data) {
  return request({
    url: '/OKR_Cycle/SelectInCycle',
    method: 'get',
    params: data
  });
}

export function DeleteCycle(data) {
  return request({
    url: '/OKR_Cycle/DeleteCycle',
    method: 'post',
    data
  });
}

export function UpdateCycle(data) {
  return request({
    url: '/OKR_Cycle/UpdateCycle',
    method: 'post',
    data
  });
}

export function SelectCycle(data) {
  return request({
    url: '/OKR_Cycle/SelectCycle',
    method: 'get',
    params: data
  });
}
