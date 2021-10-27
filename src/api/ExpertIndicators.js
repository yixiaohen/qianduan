import request from '@/utils/request';

export function SelectExpertIndicators(data) {
  return request({
    url: '/ExpertIndicators/SelectExpertIndicators',
    method: 'post',
    data
  });
}

export function InsertExpertIndicators(data) {
  return request({
    url: '/ExpertIndicators/InsertExpertIndicators',
    method: 'post',
    data
  });
}

export function UpdateExpertIndicators(data) {
  return request({
    url: '/ExpertIndicators/UpdateExpertIndicators',
    method: 'post',
    data
  });
}

export function DeleteExpert(data) {
  return request({
    url: '/ExpertIndicators/DeleteExpert',
    method: 'post',
    data
  });
}
