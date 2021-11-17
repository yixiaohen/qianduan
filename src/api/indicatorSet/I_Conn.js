import request from '@/utils/request';

// 添加数据源
export function InsertConn(data) {
  return request({
    url: 'I_Conn/InsertConn',
    method: 'post',
    data
  });
}
// 查询所有数据源
export function SelectConn(data) {
  return request({
    url: 'I_Conn/SelectConn',
    method: 'post',
    data
  });
}

// 删除单条数据源列表
export function DeleteConn(data) {
  return request({
    url: 'I_Conn/DeleteConn',
    method: 'post',
    data
  });
}
// 通过Id查询一条数据源配置
export function GetConn(data) {
  return request({
    url: 'I_Conn/Get',
    method: 'post',
    data
  });
}
// 修改数据库源
export function UpdateConn(data) {
  return request({
    url: 'I_Conn/UpdateConn',
    method: 'post',
    data
  });
}

// 测试不同数据库连接
export function TestConnect(data) {
  return request({
    url: 'I_Conn/TestConnect',
    method: 'post',
    data
  });
}
