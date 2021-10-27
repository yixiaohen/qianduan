import request from '@/utils/request';

// 查询所有目录
export function SelectDirectorys(params) {
  return request({
    url: '/MeanDirectory/SelectDirectorys',
    method: 'get',
    params
  });
}

// 父级ID查子集
export function SelectDirectory(params) {
  return request({
    url: '/MeanDirectory/SelectDirectory',
    method: 'get',
    params
  });
}


export function InsertDirectory(data) {
  return request({
    url: '/MeanDirectory/InsertDirectory',
    method: 'post',
    data
  });
}

// 修改目录
export function UpdateDirectory(data) {
  return request({
    url: '/MeanDirectory/UpdateDirectory',
    method: 'post',
    data
  });
}

// 删除目录
export function DeleteDirectory(data) {
  return request({
    url: '/MeanDirectory/DeleteDirectory',
    method: 'post',
    data
  });
}



