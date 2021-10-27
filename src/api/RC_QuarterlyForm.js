import request from '@/utils/request';

export function InsertQuarterlyForm(data) {
  return request({
    url: 'RC_QuarterlyForm/InsertQuarterlyForm',
    method: 'post',
    data
  });
}

export function SelectQuarterlyForm(data) {
  return request({
    url: 'RC_QuarterlyForm/SelectQuarterlyForm ',
    method: 'post',
    data
  });
}

export function SelectQuarterlyFormDetail(data) {
  return request({
    url: 'RC_QuarterlyForm/SelectQuarterlyFormDetail',
    method: 'post',
    data
  });
}

export function InsertQuarterlyFormDetail(data) {
  return request({
    url: 'RC_QuarterlyForm/InsertQuarterlyFormDetail',
    method: 'post',
    data
  });
}

export function DeleteQuarterlyForm(data) {
  return request({
    url: 'RC_QuarterlyForm/DeleteQuarterlyForm',
    method: 'post',
    data
  });
}

export function UpdateQuarterlyForm(data) {
  return request({
    url: 'RC_QuarterlyForm/UpdateQuarterlyForm',
    method: 'post',
    data
  });
}

export function SelectDeptorUser(data) {
  return request({
    url: 'RC_QuarterlyForm/SelectDeptorUser',
    method: 'post',
    data
  });
}

export function InsertQuarterlyFormAllocation(data) {
  return request({
    url: 'RC_QuarterlyForm/InsertQuarterlyFormAllocation ',
    method: 'post',
    data
  });
}

export function SelectQuarterlyFormAllocationDetail(data) {
  return request({
    url: 'RC_QuarterlyForm/SelectQuarterlyFormAllocationDetail',
    method: 'post',
    data
  });
}

export function SelectQuarterlyFormAllocation(data) {
  return request({
    url: 'RC_QuarterlyForm/SelectQuarterlyFormAllocation',
    method: 'post',
    data
  });
}

export function SelectQuarterlyFormDetailByCheck(data) {
  return request({
    url: 'RC_QuarterlyForm/SelectQuarterlyFormDetailByCheck',
    method: 'post',
    data
  });
}

export function InsertQuarterlyFormCheck(data) {
  return request({
    url: 'RC_QuarterlyForm/InsertQuarterlyFormCheck',
    method: 'post',
    data
  });
}

export function InsertQuarterlyFormMessage(data) {
  return request({
    url: 'RC_QuarterlyForm/InsertQuarterlyFormMessage',
    method: 'post',
    data
  });
}

