import request from '@/utils/request';

export function SelectFile(data) {
  return request({
    url: '/OKR_File/SelectFile',
    method: 'get',
    params: data
  });
}
