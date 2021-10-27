import request from '@/utils/request';

export function UploadFile(data) {
  return request({
    url: '/Article/UploadFile',
    method: 'post',
    data
  });
}

export function SelectArticle(data) {
  return request({
    url: '/Article/SelectArticle',
    method: 'post',
    data
  });
}

export function ArticleMove_up(data) {
  return request({
    url: '/Article/ArticleMove_up',
    method: 'post',
    data
  });
}

export function ArticleMove_down(data) {
  return request({
    url: '/Article/ArticleMove_down',
    method: 'post',
    data
  });
}

export function InsertArticle(data) {
  return request({
    url: '/Article/InsertArticle',
    method: 'post',
    data
  });
}

export function UpdateArticle(data) {
  return request({
    url: '/Article/UpdateArticle',
    method: 'post',
    data
  });
}

export function DeleteArticle(data) {
  return request({
    url: '/Article/DeleteArticle',
    method: 'post',
    data
  });
}

export function SelectArticleAudit(data) {
  return request({
    url: '/ArticleAudit/SelectArticleAudit',
    method: 'post',
    data
  });
}

export function GetReviewArticleAudit(data) {
  return request({
    url: '/ArticleAudit/GetReviewArticleAudit',
    method: 'post',
    data
  });
}

export function SelectArticleGroup(data) {
  return request({
    url: '/ArticleGroup/SelectArticleGroup',
    method: 'post',
    data
  });
}

export function SelectAllArticleGroup() {
  return request({
    url: '/ArticleGroup/SelectAllArticleGroup',
    method: 'post'
  });
}

export function InsertArticleGroup(data) {
  return request({
    url: '/ArticleGroup/InsertArticleGroup',
    method: 'post',
    data
  });
}

export function UpdateArticleGroup(data) {
  return request({
    url: '/ArticleGroup/UpdateArticleGroup',
    method: 'post',
    data
  });
}

export function DeleteArticleGroup(data) {
  return request({
    url: '/ArticleGroup/DeleteArticleGroup',
    method: 'post',
    data
  });
}

export function SelectMyCatalogAuthorizationUser(data) {
  return request({
    url: '/Catalog/SelectMyCatalogAuthorizationUser',
    method: 'post',
    data
  });
}

export function SelectArticleStep1(data) {
  return request({
    url: '/Article/SelectArticleStep1',
    method: 'post',
    data
  });
}

// 预览文件的接口
export function PreviewFile(data) {
  return request({
    url: '/Article/PreviewFile',
    method: 'post',
    data
  });
}

export function ArticleMove(data) {
  return request({
    url: '/Article/ArticleMove',
    method: 'post',
    data
  });
}

export function SelectArticleDetail(data) {
  return request({
    url: '/Article/SelectArticleDetail',
    method: 'get',
    params: data
  });
}

// 修改上传文件名称
export function UpdateArticleFile(data) {
  return request({
    url: '/Article/UpdateArticleFile',
    method: 'post',
    data
  });
}
