import request from '@/utils/request';
// 指标监测
// 添加指标
export function InsertIndex(data) {
  return request({
    url: 'I_Index/InsertIndex',
    method: 'post',
    data
  });
}
// 查询全部指标
export function SelectIndex(data) {
  return request({
    url: 'I_Index/SelectIndex',
    method: 'get',
    params: data
  });
}
// 修改指标
export function UpdateIndex(data) {
  return request({
    url: 'I_Index/UpdateIndex',
    method: 'post',
    data
  });
}
// 删除指标
export function DeleteIndex(data) {
  return request({
    url: 'I_Index/DeleteIndex',
    method: 'post',
    data
  });
}
// 根据指标ID查询指标和指标参数
export function SelectIndexPara(data) {
  return request({
    url: 'I_Index/SelectIndexPara',
    method: 'get',
    params: data
  });
}
// 查询所有指标和指标参数
export function SelectIndexPara1(data) {
  return request({
    url: 'I_Index/SelectIndexPara1',
    method: 'get',
    params: data
  });
}
// 指标监测指标公式导航树
export function SelectIndexs(data) {
  return request({
    url: 'I_Index/SelectIndexs',
    method: 'post',
    data
  });
}
// 通过Id查询一条指标
export function Get(data) {
  return request({
    url: 'I_Index/Get',
    method: 'post',
    data
  });
}
