import request from '@/utils/request';

// 等级制的数据接口
export function SelectScore() {
  return request({
    url: '/Score/SelectScore',
    method: 'post'
  });
}
// 分数制的数据接口
export function SelectScore2() {
  return request({
    url: '/CatalogCfg/SelectScore',
    method: 'post'
  });
}

export function SelectGradeCount() {
  return request({
    url: '/Score/SelectGradeCount',
    method: 'post'
  });
}

export function SelectCatalogGradeCount() {
  return request({
    url: '/Score/SelectCatalogGradeCount',
    method: 'post'
  });
}

export function SelectGradeAvg() {
  return request({
    url: '/Score/SelectGradeAvg',
    method: 'post'
  });
}

export function SelectCatalogScore() {
  return request({
    url: '/Score/SelectCatalogScore',
    method: 'post'
  });
}

export function SelectCatalogScore2(data) {
  return request({
    url: '/Score/SelectCatalogScore2',
    method: 'post',
    data
  });
}

export function SelectCatalogCode() {
  return request({
    url: '/Score/SelectCatalogCode',
    method: 'post'
  });
}

export function SelectDeptUploadRate(data) {
  return request({
    url: '/Score/SelectDeptUploadRate',
    method: 'post',
    data
  });
}

export function SelectDeptCatalogAuthorizationUser(data) {
  return request({
    url: 'Catalog/SelectDeptCatalogAuthorizationUser',
    method: 'post',
    data
  });
}


export function SelectDeptRateCatalogAuthorizationUser(data) {
  return request({
    url: '/Catalog/SelectDeptRateCatalogAuthorizationUser',
    method: 'post',
    data
  });
}

export function GetStandardRate(data) {
  return request({
    url: '/Score/GetStandardRate',
    method: 'get',
    params: data
  });
}
