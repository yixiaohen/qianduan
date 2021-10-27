import request from '@/utils/request';

// 查询周期
export function SelectiCycle(data) {
  return request({
    url: '/I_Cycle/SelectiCycle',
    method: 'get',
    params: data
  });
}
// 添加周期
export function InsertiCycle(data) {
  return request({
    url: '/I_Cycle/InsertiCycle',
    method: 'post',
    data
  });
}
// 删除周期
export function DeleteiCycle(data) {
  return request({
    url: '/I_Cycle/DeleteiCycle',
    method: 'post',
    data
  });
}

