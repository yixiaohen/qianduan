import service from '@/utils/request';
import request from '@/utils/request';

export function InsertTopic(data) {
  return service({
    url: '/KS_Topic/InsertTopic',
    method: 'post',
    data
  });
}

export function SelectTopic(data) {
  return service({
    url: '/KS_Topic/SelectTopic',
    method: 'post',
    data
  });
}

export function DeleteTopic(data) {
  return service({
    url: '/KS_Topic/DeleteTopic',
    method: 'get',
    params: data
  });
}

export function UpdateTopic(data) {
  return service({
    url: '/KS_Topic/UpdateTopic',
    method: 'post',
    data
  });
}

export function SelectTopicDetailByTopicID(data) {
  return service({
    url: '/KS_Topic/SelectTopicDetailByTopicID',
    method: 'post',
    data
  });
}

export function SelectAllTopicDetail(data) {
  return service({
    url: '/KS_Topic/SelectAllTopicDetail',
    method: 'post',
    data
  });
}

export function InputTxt(data) {
  return service({
    url: '/KS_Topic/InputTxt',
    method: 'post',
    data
  });
}
// 查询全部试题分类接口
export function SelectTopicGenre(params) {
  return request({
    url: '/KS_TopicGenre/SelectTopicGenre',
    method: 'get',
    params
  });
}
// 新增及修改试题分类接口
export function InsertUpdateTopicGenre(data) {
  return request({
    url: '/KS_TopicGenre/InsertUpdateTopicGenre',
    method: 'post',
    data
  });
}

// 新增及修改试题分类接口
export function DeleteTopicGenre(data) {
  return request({
    url: '/KS_TopicGenre/DeleteTopicGenre',
    method: 'post',
    data
  });
}

// 导出试题接口
export function ExportTopic(data) {
  return request({
    url: '/KS_Topic/ExportTopic',
    method: 'post',
    data
  });
}
