import request from '@/utils/request';

export function InsertForm(data) {
  return request({
    url: 'RC_Form/InsertForm',
    method: 'post',
    data
  });
}

export function SelectFormTemplate(data) {
  return request({
    url: 'RC_Form/SelectFormTemplate',
    method: 'post',
    data
  });
}

export function SelectForm(params) {
  return request({
    url: 'RC_Form/SelectForm',
    method: 'get',
    params
  });
}

export function InsertFormTemplate(data) {
  return request({
    url: 'RC_Form/InsertFormTemplate',
    method: 'post',
    data
  });
}

export function UpdateFormTemplate(data) {
  return request({
    url: 'RC_Form/UpdateFormTemplate',
    method: 'post',
    data
  });
}

export function UpdateForm(data) {
  return request({
    url: 'RC_Form/UpdateForm',
    method: 'post',
    data
  });
}

export function DeleteFormTemplate(data) {
  return request({
    url: 'RC_Form/DeleteFormTemplate',
    method: 'post',
    data
  });
}

export function DeleteForm(data) {
  return request({
    url: 'RC_Form/DeleteForm',
    method: 'post',
    data
  });
}

export function SelectFormDetailByID(data) {
  return request({
    url: 'RC_Form/SelectFormDetailByID',
    method: 'post',
    data
  });
}

export function SelectFormTemplateDetailByID(data) {
  return request({
    url: 'RC_Form/SelectFormTemplateDetailByID',
    method: 'post',
    data
  });
}
