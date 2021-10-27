import request from '@/utils/request';
// 指标监测
// 报表
// 分时间范围查询结果报表
export function GetValidDateReports(data) {
  return request({
    url: 'I_Report/GetValidDateReports',
    method: 'post',
    data
  });
}
// 额外参数增删改接口
export function ExecuteNonQuery(data) {
  return request({
    url: 'I_Report/ExecuteNonQuery',
    method: 'post',
    data
  });
}

// 查询所有结果报表
export function Gets(data) {
  return request({
    url: 'I_Report/Gets',
    method: 'post',
    data
  });
}
// 通过Id查询一条结果报表
export function Get(data) {
  return request({
    url: 'I_Report/Get',
    method: 'post',
    data
  });
}
