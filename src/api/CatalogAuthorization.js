import request from '@/utils/request';

export function SelectCatalogAuthorization(data) {
  return request({
    url: 'CatalogAuthorization/SelectCatalogAuthorization',
    method: 'post',
    data
  });
}

export function UpdatetCatalogAuthorization(data) {
  return request({
    url: 'CatalogAuthorization/UpdatetCatalogAuthorization',
    method: 'post',
    data
  });
}

export function IncrementSave(data) {
  return request({
    url: 'CatalogAuthorization/IncrementSave',
    method: 'post',
    data
  });
}

export function CA_SelectDeptorUser(data) {
  return request({
    url: 'CatalogAuthorization/SelectDeptorUser',
    method: 'post',
    data
  });
}

export function SelectLengthUserid(data) {
  return request({
    url: 'CatalogAuthorization/SelectLengthUserid',
    method: 'get',
    params: data
  });
}
