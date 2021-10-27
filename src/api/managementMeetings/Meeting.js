import request from '@/utils/request';

export function InsertMeeting(data) {
  return request({
    url: '/Meeting/InsertMeeting',
    method: 'post',
    data
  });
}

export function DeMeeting(params) {
  return request({
    url: '/Meeting/DeMeeting',
    method: 'post',
    params
  });
}

export function GetMeetingList(params) {
  return request({
    url: '/Meeting/GetMeetingList',
    method: 'get',
    params
  });
}

export function SelectMeetingFile(params) {
  return request({
    url: '/Meeting/SelectMeetingFile',
    method: 'get',
    params
  });
}
