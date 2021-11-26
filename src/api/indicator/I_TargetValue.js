import request from '@/utils/request';

// 查询指标的目标值
export function SelectIValue(data) {
  return request({
    url: '/I_TargetValue/SelectIValue',
    method: 'get',
    params: data
  });
}
export function Get_i_data_ListByCycle(data) {
  return request({
    url: '/I_ObjValue/Get_i_data_ListByCycle',
    method: 'get',
    params: data
  });
}

// // 指标统计科室指标之和
// export function SelectIValue1(data) {
//   return request({
//     url: '/I_TargetValue/SelectIValue1',
//     method: 'get',
//     params: data
//   });
// }
//
// // 图表展示所选年与前一年的数据以及目标值
// export function SelectBIVaule1(data) {
//   return request({
//     url: '/I_TargetValue/SelectBIVaule1',
//     method: 'get',
//     params: data
//   });
// }
