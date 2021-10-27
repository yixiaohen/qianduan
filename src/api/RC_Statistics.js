import request from '@/utils/request';

export function SelectStatusCount(data) {
  return request({
    url: 'RC_Statistics/SelectStatusCount',
    method: 'post',
    data
  });
}

export function SelectScore(data) {
  return request({
    url: 'RC_Statistics/SelectScore',
    method: 'post',
    data
  });
}

export function SelectDeptTemplateDetail(data) {
  return request({
    url: 'RC_Statistics/SelectDeptTemplateDetail',
    method: 'post',
    data
  });
}

export function SelectUseTempList(data) {
  return request({
    url: 'RC_Statistics/SelectUseTempList',
    method: 'post',
    data
  });
}

export function ExportUseTemp(data) {
  return request({
    url: 'RC_Statistics/ExportUseTemp',
    method: 'post',
    data
  });
}

export function DeptPassRate(data) {
  return request({
    url: 'Score/DeptPassRate',
    method: 'post',
    data
  });
}
