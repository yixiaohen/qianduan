import request from '@/utils/request';

// 查询所有日志
export function GetAll(data) {
  return request({
    url: '/I_Log/GetAll',
    method: 'post',
    data
  });
}

// 日志增删改接口
export function ExecuteNonQuery(data) {
  return request({
    url: '/I_Log/ExecuteNonQuery',
    method: 'post',
    data
  });
}
