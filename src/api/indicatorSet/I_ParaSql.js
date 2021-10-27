import request from '@/utils/request';
// 指标监测
// 指标参数的sql语句操作

// 新增参数取值
export function InsertParaSql(data) {
  return request({
    url: 'I_ParaSql/InsertParaSql',
    method: 'post',
    data
  });
}

// 修改参数取值
export function UpdateParaSql(data) {
  return request({
    url: 'I_ParaSql/UpdateParaSql',
    method: 'post',
    data
  });
}

// 参数取值序号移动
export function ParaSqlMove(data) {
  return request({
    url: 'I_ParaSql/ParaSqlMove',
    method: 'post',
    data
  });
}
// 根据para_id删除参数取值
export function DeleteParaSqlBypid(data) {
  return request({
    url: 'I_ParaSql/DeleteParaSqlBypid',
    method: 'post',
    data
  });
}

// 删除参数取值
export function DeleteParaSql(data) {
  return request({
    url: 'I_ParaSql/DeleteParaSql',
    method: 'post',
    data
  });
}

// 根据参数ID查询相关参数取值
export function SelectParaSql(data) {
  return request({
    url: 'I_ParaSql/SelectParaSql',
    method: 'get',
    params: data
  });
}

// 根据ID查询参数取值
export function SelectParaSqlID(data) {
  return request({
    url: 'I_ParaSql/SelectParaSqlID',
    method: 'get',
    params: data
  });
}

// 返回行数
export function SelectExecuteScalar(data) {
  return request({
    url: 'I_ParaSql/SelectExecuteScalar',
    method: 'get',
    params: data
  });
}

// 返回DataTable
export function SelectExecuteDatatable(data) {
  return request({
    url: 'I_ParaSql/SelectExecuteDatatable',
    method: 'get',
    params: data
  });
}
