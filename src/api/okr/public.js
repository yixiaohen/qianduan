import request from '@/utils/request';

export function SelectUserReportInfo(data) {
  return request({
    url: '/OKR_Common/SelectUserReportInfo',
    method: 'get',
    params: data
  });
}

