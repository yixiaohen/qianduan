import request from '@/utils/request';

export function test(data) {
  return request({
    url: '/User/test',
    method: 'post',
    data
  });
}
