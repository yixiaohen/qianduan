import request from '@/utils/request';
// 指标监测
// 添加数据源
export function InsertDataBase(data) {
  return request({
    url: 'I_DataBase/InsertDataBase',
    method: 'post',
    data
  });
}

// 查询数据源列表
export function SelectDataBase(data) {
  return request({
    url: 'I_DataBase/SelectDataBase',
    method: 'get',
    params: data
  });
}

// 查询单条数据源
export function SelectDataBaseByID(data) {
  return request({
    url: 'I_DataBase/SelectDataBaseByID',
    method: 'get',
    params: data
  });
}

// 删除单条数据源列表
export function DeleteDataBase(data) {
  return request({
    url: 'I_DataBase/DeleteDataBase',
    method: 'post',
    data
  });
}

// 编辑数据源列表
export function UpdateDataBase(data) {
  return request({
    url: 'I_DataBase/UpdateDataBase',
    method: 'post',
    data
  });
}
