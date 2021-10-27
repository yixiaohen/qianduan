import request from '@/utils/request';
// 指标监测
// 指标参数操作

// 新增参数
export function InsertPara(data) {
  return request({
    url: 'I_Para/InsertPara',
    method: 'post',
    data
  });
}
// 修改参数
export function UpdatePara(data) {
  return request({
    url: 'I_Para/UpdatePara',
    method: 'post',
    data
  });
}
// 根据指标ID删除参数
export function DeleteParaByIndexID(data) {
  return request({
    url: 'I_Para/DeleteParaByIndexID',
    method: 'post',
    data
  });
}
// 根据参数ID删除参数
export function DeletePara(data) {
  return request({
    url: 'I_Para/DeletePara',
    method: 'post',
    data
  });
}
// 新增参数
export function SelectPara(data) {
  return request({
    url: 'I_Para/SelectPara',
    method: 'get',
    params: data
  });
}
