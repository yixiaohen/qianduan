import request from '@/utils/request';

export function uploadFile(data) {
  return request({
    url: '/RC_File/UploadFile',
    method: 'post',
    data,
    intercept: 2
  });
}
