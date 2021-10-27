import request from '@/utils/request';

// 根据目录查询id目录和文件
export function Andmean(params) {
  return request({
    url: '/Mean/DirectoryAndmean',
    method: 'get',
    params
  });
}

// 根据网盘文件名搜索
export function SelectMeanOrDirName(params) {
  return request({
    url: '/Mean/SelectMeanOrDirName',
    method: 'get',
    params
  });
}
// 上传资料到云盘
export function InsertMean(data) {
  return request({
    url: '/Mean/InsertMean',
    method: 'post',
    data
  });
}

// 移动资料
export function UpdateMeanMove(data) {
  return request({
    url: '/Mean/UpdateMeanMove',
    method: 'post',
    data
  });
}

export function DeleteMean(data) {
  return request({
    url: '/Mean/DeleteMean',
    method: 'post',
    data
  });
}

export function SelectMeanByDirectoryID(params) {
  return request({
    url: '/Mean/SelectMeanByDirectoryID',
    method: 'get',
    params
  });
}

export function SelectMean(params) {
  return request({
    url: '/Mean/SelectMean',
    method: 'get',
    params
  });
}

export function SelectMean1(params) {
  return request({
    url: '/Mean/SelectMean1',
    method: 'get',
    params
  });
}

export function SelectMeanFile(params) {
  return request({
    url: 'Mean/SelectMeanFile',
    method: 'get',
    params
  });
}

