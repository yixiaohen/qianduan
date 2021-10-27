import request from '@/utils/request';

export function SelectUseDept(data) {
  return request({
    url: '/RC_View/SelectUseDept',
    method: 'post',
    data
  });
}

export function GetRC_ResultView(data) {
  return request({
    url: '/RC_View/GetRC_ResultView',
    method: 'post',
    data
  });
}

export function SelectUseDeptTemplate(data) {
  return request({
    url: '/RC_View/SelectUseDeptTemplate',
    method: 'post',
    data
  });
}
