import service from '@/utils/request';

export function InsertCommittee(data) {
  return service({
    url: '/RC_Committee/InsertCommittee',
    method: 'post',
    data
  });
}

export function SelectCommittee(data) {
  return service({
    url: '/RC_Committee/SelectCommittee',
    method: 'post',
    data
  });
}

export function SelectCommitteeDetailByID(data) {
  return service({
    url: '/RC_Committee/SelectCommitteeDetailByID',
    method: 'post',
    data
  });
}

export function DeleteCommittee(data) {
  return service({
    url: '/RC_Committee/DeleteCommittee',
    method: 'post',
    data
  });
}

export function UpdateCommittee(data) {
  return service({
    url: '/RC_Committee/UpdateCommittee',
    method: 'post',
    data
  });
}

export function InsertMeeting(data) {
  return service({
    url: '/RC_Committee/InsertMeeting',
    method: 'post',
    data
  });
}

export function UpdateMeeting(data) {
  return service({
    url: '/RC_Committee/UpdateMeeting',
    method: 'post',
    data
  });
}

export function SelectMeeting(data) {
  return service({
    url: '/RC_Committee/SelectMeeting',
    method: 'post',
    data
  });
}
export function DeleteMeeting(data) {
  return service({
    url: '/RC_Committee/DeleteMeeting',
    method: 'post',
    data
  });
}

export function SelectMeetingDetailByID(data) {
  return service({
    url: '/RC_Committee/SelectMeetingDetailByID',
    method: 'post',
    data
  });
}
