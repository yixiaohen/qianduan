import request from '@/utils/request';

// 评审标准
export function SelectCatalog(data) {
  return request({
    url: '/Catalog/SelectCatalog',
    method: 'post',
    data
  });
}

export function InsertCatalog(data) {
  return request({
    url: '/Catalog/InsertCatalog',
    method: 'post',
    data
  });
}

export function UpdateCatalog(data) {
  return request({
    url: '/Catalog/UpdateCatalog',
    method: 'post',
    data
  });
}

export function DeleteCatalog(data) {
  return request({
    url: '/Catalog/DeleteCatalog',
    method: 'post',
    data
  });
}

export function SelectCatalogAuthorizationUser(data) {
  return request({
    url: '/Catalog/SelectCatalogAuthorizationUser',
    method: 'post',
    data
  });
}

// 这个接口和上面的SelectCatalogAuthorizationUser一样，只不过在制度管理归档那时候，取消了权限，可以任何人都查看到所有的目录
export function SelectCatalogAuthorizationUserByRules(data) {
  return request({
    url: '/Catalog/SelectCatalogAuthorizationUserByRules',
    method: 'post',
    data
  });
}

export function GetSumscore(data) {
  return request({
    url: '/Catalog/GetSumscore',
    method: 'post',
    data
  });
}

export function GetCatalogFirst(data) {
  return request({
    url: '/Catalog/GetCatalogFirst',
    method: 'post',
    data
  });
}

export function GetcatalogSecond(data) {
  return request({
    url: '/Catalog/GetcatalogSecond',
    method: 'get',
    params: data,
    intercept: 1
  });
}

export function SelectZP(data) {
  return request({
    url: '/Catalog/SelectZP',
    method: 'post',
    data
  });
}

export function SelectArticleByArticleID(data) {
  return request({
    url: '/Article/SelectArticleByArticleID',
    method: 'post',
    data
  });
}

export function CatalogSearch(data) {
  return request({
    url: 'Catalog/CatalogSearch',
    method: 'post',
    data
  });
}

export function SelectMyCatalogTree(data) {
  return request({
    url: '/Catalog/SelectMyCatalogTree',
    method: 'post',
    data
  });
}

export function GetRepVersion(data) {
  return request({
    url: '/Catalog/GetRepVersion',
    method: 'get',
    params: data
  });
}

export function UpdateRepVersion(data) {
  return request({
    url: '/Catalog/UpdateRepVersion',
    method: 'post',
    data
  });
}
