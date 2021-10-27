import request from '@/utils/request';

export function SelectRC_Error(data) {
  return request({
    url: 'RC_Error/SelectRC_Error',
    method: 'post',
    data
  });
}

export function InsertRC_Error(data) {
  return request({
    url: 'RC_Error/InsertRC_Error',
    method: 'post',
    data
  });
}

export function UpdateRC_Error(data) {
  return request({
    url: 'RC_Error/UpdateRC_Error',
    method: 'post',
    data
  });
}

export function DeleteResort(data) {
  return request({
    url: 'Resort/DeleteResort',
    method: 'post',
    data
  });
}

export function DeleteError(data) {
  return request({
    url: 'RC_Error/DeleteError',
    method: 'post',
    data
  });
}

export function SelectRC_ErrorType(data) {
  return request({
    url: 'RC_Error/SelectRC_ErrorType',
    method: 'post',
    data
  });
}

export function InsertErrorType(data) {
  return request({
    url: 'RC_Error/InsertErrorType',
    method: 'post',
    data
  });
}

export function UpdateErrorType(data) {
  return request({
    url: 'RC_Error/UpdateErrorType',
    method: 'post',
    data
  });
}

export function DeleteErrorType(data) {
  return request({
    url: 'RC_Error/DeleteErrorType',
    method: 'post',
    data
  });
}
