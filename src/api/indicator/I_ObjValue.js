import request from '@/utils/request';
// 目标值管理

// 添加指标目标值
export function InsertObjValue(data) {
  return request({
    url: '/I_ObjValue/InsertObjValue',
    method: 'post',
    data
  });
}
// 查询指标目标值
export function SelectObjValue(data) {
  return request({
    url: '/I_ObjValue/SelectObjValue',
    method: 'get',
    params: data
  });
}
// 修改指标目标值
export function UpdateObjValue(data) {
  return request({
    url: '/I_ObjValue/UpdateObjValue',
    method: 'post',
    data
  });
}
// 目标值图表
export function Get_i_data_ListByCycle(data) {
  return request({
    url: '/I_ObjValue/Get_i_data_ListByCycle',
    method: 'get',
    params: data
  });
}
