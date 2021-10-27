import request from '@/utils/request';

export function SelectFileByExecuteID(data) {
  return request({
    url: '/KM_ExecuteFile/SelectFileByExecuteID',
    method: 'post',
    data
  });
}

