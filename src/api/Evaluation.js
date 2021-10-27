import request from '@/utils/request';

export function SelectEvaluation(data) {
  return request({
    url: 'Evaluation/SelectEvaluation',
    method: 'get',
    params: data
  });
}

export function InsertUpdateEvaluationProblem(data) {
  return request({
    url: 'Evaluation/InsertUpdateEvaluationProblem',
    method: 'post',
    data
  });
}

export function UpdateLock(data) {
  return request({
    url: 'Evaluation/UpdateLock',
    method: 'post',
    data
  });
}

export function UpdateRevoke(data) {
  return request({
    url: 'Evaluation/UpdateRevoke',
    method: 'post',
    data
  });
}

export function SelectEvaluationRecord(data) {
  return request({
    url: 'Evaluation/SelectEvaluationRecord',
    method: 'post',
    data
  });
}

export function SelectCatalogByCatalogID(data) {
  return request({
    url: 'Catalog/SelectCatalogByCatalogID ',
    method: 'post',
    data
  });
}

export function DeleteEvaluationRecord(data) {
  return request({
    url: 'Evaluation/DeleteEvaluationRecord',
    method: 'post',
    data
  });
}
