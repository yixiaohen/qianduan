import request from '@/utils/request';

export function SelectExamineList(params) {
  return request({
    url: '/RC_Examine/SelectExamineList',
    method: 'get',
    params
  });
}

export function InsertExamine(data) {
  return request({
    url: '/RC_Examine/InsertExamine',
    method: 'post',
    data
  });
}
