import request from '@/utils/request';

export function SelectAllMenuName(data) {
  return request({
    url: '/Co/SelectAllMenuName',
    method: 'post',
    data
  });
}

// 参数：pageIndex：页码  pageSize：条数  vcID：表ID
export function SelectCo(data) {
  return request({
    url: '/Co/SelectCo',
    method: 'post',
    data
  });
}

// 参数：vcID:表ID  vcItemID:字段 vcName:字段名 intWidth:宽度
export function UpdateTemplate(data) {
  return request({
    url: '/Co/UpdateTemplate',
    method: 'post',
    data
  });
}

// 参数：vcID：表ID vcItemID:字段 MoveType:1 上移 2下移
export function CoMove(data) {
  return request({
    url: '/Co/CoMove',
    method: 'post',
    data
  });
}
