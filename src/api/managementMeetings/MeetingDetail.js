import request from '@/utils/request';

export function InsertMeetingDetail(data) {
  return request({
    url: '/MeetingDetail/InsertMeetingDetail',
    method: 'post',
    data
  });
}

export function UpdateMeetingJoin(data) {
  return request({
    url: '/MeetingDetail/UpdateMeetingJoin',
    method: 'post',
    data
  });
}

export function GetJoinMeList(params) {
  return request({
    url: '/MeetingDetail/GetJoinMeList',
    method: 'get',
    params
  });
}

export function GetJoinByMeetingID(params) {
  return request({
    url: '/MeetingDetail/GetJoinByMeetingID',
    method: 'get',
    params
  });
}
