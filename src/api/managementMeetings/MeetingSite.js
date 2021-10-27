import request from '@/utils/request';

export function InsertMeetingSite(data) {
  return request({
    url: '/MeetingSite/InsertMeetingSite',
    method: 'post',
    data
  });
}

export function UpdateMeetingSite(data) {
  return request({
    url: '/MeetingSite/UpdateMeetingSite',
    method: 'post',
    data
  });
}

export function DeleteMeetingSite(data) {
  return request({
    url: '/MeetingSite/DeleteMeetingSite',
    method: 'post',
    data
  });
}

export function SelectMeetingSite(params) {
  return request({
    url: '/MeetingSite/SelectMeetingSite',
    method: 'get',
    params
  });
}
