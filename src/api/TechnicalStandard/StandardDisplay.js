import request from '@/utils/request';

export function SelectDirectorys(data) {
  return request({
    url: '/JS_Directory/SelectDirectorys',
    method: 'post',
    data
  });
}

export function SelectStandardList(data) {
  return request({
    url: '/JS_Standard/SelectStandardList',
    method: 'post',
    data
  });
}
