import request from '@/utils/request';

export function SelectCatalog(data) {
  return request({
    url: '/Catalog/SelectCatalog',
    method: 'post',
    data,
    intercept: 1
  });
}
