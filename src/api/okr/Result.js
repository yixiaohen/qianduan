import request from '@/utils/request';

export function SelectResult(data) {
  return request({
    url: '/OKR_Result/SelectResult',
    method: 'get',
    params: data
  });
}

export function InsertResult(data) {
  return request({
    url: '/OKR_Result/InsertResult',
    method: 'post',
    data
  });
}

export function UpdateResult(data) {
  return request({
    url: '/OKR_Result/UpdateResult',
    method: 'post',
    data
  });
}

export function DeleteResult(data) {
  return request({
    url: '/OKR_Result/DeleteResult',
    method: 'post',
    data
  });
}

export function SelectResultObject(data) {
  return request({
    url: '/OKR_Result/SelectResultObject',
    method: 'post',
    data
  });
}

export function SelectResultPer(data) { /* 查询成果，含任务 */
  return request({
    url: '/OKR_Result/SelectResultPer',
    method: 'get',
    params: data
  });
}


export function GetResultWeek(data) { /* 查询成果，含任务 */
  return request({
    url: '/OKR_Result/GetResultWeek',
    method: 'get',
    params: data
  });
}
