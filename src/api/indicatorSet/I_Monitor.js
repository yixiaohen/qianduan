import request from '@/utils/request';
import requestAsync from '@/utils/requestAsync';

// 添加监测组别 ,不需要等待
export function InsertMonGroup2(data) {
  return requestAsync({
    url: 'I_Monitor/InsertMonGroup',
    method: 'post',
    data
  });
  // 添加监测组别
}
export function InsertMonGroup(data) {
  return request({
    url: 'I_Monitor/InsertMonGroup',
    method: 'post',
    data
  });
}

// 查询监测组别
export function SelectMonGroup(data) {
  return request({
    url: 'I_Monitor/SelectMonGroup',
    method: 'get',
    params: data
  });
}

// 删除单个监测组别
export function DeleteMonGroup(data) {
  return request({
    url: 'I_Monitor/DeleteMonGroup',
    method: 'post',
    data
  });
}
// 添加指标监测组别关系
export function InsertMonGroupList(data) {
  return request({
    url: 'I_Monitor/InsertMonGroupList',
    method: 'post',
    data
  });
}
// 修改指标监测组别关系
export function UpdateMonGroupList(data) {
  return request({
    url: 'I_Monitor/UpdateMonGroupList',
    method: 'post',
    data
  });
}
// 通过指标id查询监测组别分类
export function SelectMonGroupList2(data) {
  return request({
    url: 'I_Monitor/SelectMonGroupList2',
    method: 'get',
    params: data
  });
}

// 查询监测列表数据、基本监测返回list,无分页
export function BaseMonitor(data) {
  return request({
    url: 'I_Monitor/BaseMonitor',
    method: 'get',
    params: data
  });
}
// 查询单条监测数据
export function GetDataDetail(data) {
  return request({
    url: 'I_Monitor/GetDataDetail',
    method: 'get',
    params: data
  });
}

// 查询监测列表数据、基本监测返回list,有分页
export function GetmonthRatio(data) {
  return request({
    url: 'I_Monitor/GetmonthRatio',
    method: 'get',
    params: data
  });
}
