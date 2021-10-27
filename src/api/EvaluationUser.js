import request from '@/utils/request';

export function SelectEvaluationUser(data) {
  return request({
    url: 'EvaluationUser/SelectEvaluationUser',
    method: 'post',
    data
  });
}

export function SelectDeptorUser(data) {
  return request({
    url: 'EvaluationUser/SelectDeptorUser',
    method: 'post',
    data
  });
}

export function UpdatetEvaluationUser(data) {
  return request({
    url: 'EvaluationUser/UpdatetEvaluationUser',
    method: 'post',
    data
  });
}

export function IncrementSave(data) {
  return request({
    url: 'EvaluationUser/IncrementSave',
    method: 'post',
    data
  });
}

export function InsertGroupID(data) {
  return request({
    url: 'EvaluationUser/InsertGroupID',
    method: 'post',
    data
  });
}


export function SelectGroupList(data) {
  return request({
    url: 'EvaluationUser/SelectGroupList',
    method: 'post',
    data
  });
}

export function SelectEvaluationUserRoleCount(data) {
  return request({
    url: 'User/SelectEvaluationUserRoleCount',
    method: 'post',
    data
  });
}
