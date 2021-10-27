import request from '@/utils/request';

export function SelectResort(data) {
  return request({
    url: 'Resort/SelectResortByParentID',
    method: 'post',
    data
  });
}

export function InsertResort(data) {
  return request({
    url: 'Resort/InsertResort',
    method: 'post',
    data
  });
}

export function UpdateResort(data) {
  return request({
    url: 'Resort/UpdateResort',
    method: 'post',
    data
  });
}

export function DeleteResort(data) {
  return request({
    url: 'Resort/DeleteResort',
    method: 'post',
    data
  });
}

// 考评办法的附件查询
export function SelectResortFile(data) {
  return request({
    url: 'Resort/SelectResortFile',
    method: 'get',
    params: data
  });
}
