import request from '@/utils/request';

// 科级指标导航树
export function SelectDeptIndex(data) {
  return request({
    url: '/I_IndexAlloc/SelecDeptIndex',
    method: 'get',
    params: data
  });
}

// 增加指标分配给单个部门
export function InsertIndexAlloc(data) {
  return request({
    url: '/I_IndexAlloc/InsertIndexAlloc',
    method: 'post',
    data
  });
}

// 批量增加指标分配给多个部门
export function InsertBatchIndexAlloc(data) {
  return request({
    url: '/I_IndexAlloc/InsertBatchIndexAlloc',
    method: 'post',
    data
  });
}

// 根据指标ID查询指标分配列表
export function SelectIndexAlloc(data) {
  return request({
    url: '/I_IndexAlloc/SelectIndexAlloc',
    method: 'get',
    params: data
  });
}
// 修改指标分配
export function UpdateIndexAlloc(data) {
  return request({
    url: '/I_IndexAlloc/UpdateIndexAlloc',
    method: 'post',
    data
  });
}


// 删除指标分配
export function DeleteIndexAlloc(data) {
  return request({
    url: '/I_IndexAlloc/DeleteIndexAlloc',
    method: 'post',
    data
  });
}
// 获取年份搜索信息
export function SelectIndexYear(data) {
  return request({
    url: '/I_IndexAlloc/SelectIndexYear',
    method: 'get',
    params: data
  });
}
