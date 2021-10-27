import request from '@/utils/request';

export function UpdateMeetingSiteAudit(data) {
  return request({
    url: '/MeetingSiteAudit/UpdateMeetingSiteAudit',
    method: 'post',
    data
  });
}

export function SelectMeetingSiteAudit(params) {
  return request({
    url: '/MeetingSiteAudit/SelectMeetingSiteAudit',
    method: 'get',
    params
  });
}
