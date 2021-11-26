import request from '@/utils/request';

export function InsertTemplate(data) {
  return request({
    url: 'RC_Template/InsertTemplate',
    method: 'post',
    data
  });
}

export function SelectTemplate(data) {
  return request({
    url: 'RC_Template/SelectTemplate',
    method: 'post',
    data
  });
}

export function UpdateTemplate(data) {
  return request({
    url: 'RC_Template/UpdateTemplate',
    method: 'post',
    data
  });
}

export function SelectTemplateByID(data) {
  return request({
    url: 'RC_Template/SelectTemplateByID',
    method: 'post',
    data
  });
}

export function SelectUseTemp(data) {
  return request({
    url: 'RC_UseTemplate/SelectUseTemp',
    method: 'post',
    data
  });
}

export function SelectUseTempDetail(data) {
  return request({
    url: 'RC_UseTemplate/SelectUseTempDetail',
    method: 'post',
    data
  });
}

export function InsertUseTemp(data) {
  return request({
    url: 'RC_UseTemplate/InsertUseTemp',
    method: 'post',
    data
  });
}

export function UpdateUseTempDetail(data) {
  return request({
    url: 'RC_UseTemplate/UpdateUseTempDetail',
    method: 'post',
    data
  });
}

export function SetOpnions(data) {
  return request({
    url: 'RC_UseTemplate/SetOpnions',
    method: 'post',
    data
  });
}

export function SelectOpinions(data) {
  return request({
    url: 'RC_UseTemplate/SelectOpinions',
    method: 'post',
    data
  });
}

export function SelectUseDept(data) {
  return request({
    url: 'RC_UseTemplate/SelectUseDept',
    method: 'post',
    data
  });
}

export function UpdateTemplateStatus(data) {
  return request({
    url: 'RC_Template/UpdateTemplateStatus',
    method: 'post',
    data
  });
}

export function DeleteTemplate(data) {
  return request({
    url: 'RC_Template/DeleteTemplate',
    method: 'post',
    data
  });
}

export function DeleteUseTemplate(data) {
  return request({
    url: 'RC_UseTemplate/DeleteUseTemplate',
    method: 'post',
    data
  });
}
export function InsertDistribution(data) {
  return request({
    url: 'RC_Distribution/InsertDistribution',
    method: 'post',
    data
  });
}

export function SelectUser(data) {
  return request({
    url: 'User/SelectUser',
    method: 'post',
    data
  });
}

export function InsertUpdateReview(data) {
  return request({
    url: 'RC_UseTemplate/InsertUpdateReview ',
    method: 'post',
    data
  });
}

export function SelectUseTemplate(data) {
  return request({
    url: 'RC_Template/SelectUseTemplate',
    method: 'post',
    data
  });
}

export function SelectUseSituation(data) {
  return request({
    url: 'RC_Statistics/SelectUseSituation',
    method: 'post',
    data
  });
}

export function SelectTemplateType(data) {
  return request({
    url: 'RC_TemplateType/SelectTemplateType',
    method: 'post',
    data
  });
}

export function InsertTemplateType(data) {
  return request({
    url: 'RC_TemplateType/InsertTemplateType',
    method: 'post',
    data
  });
}

export function UpdateTemplateType(data) {
  return request({
    url: 'RC_TemplateType/UpdateTemplateType',
    method: 'post',
    data
  });
}

export function DeleteTemplateType(data) {
  return request({
    url: 'RC_TemplateType/DeleteTemplateType',
    method: 'post',
    data
  });
}

export function ExportUseTemp(data) {
  return request({
    url: 'RC_UseTemplate/ExportUseTemp',
    method: 'post',
    data
  });
}

// 表单另存为功能
export function CopyTemplate(data) {
  return request({
    url: 'RC_Template/CopyTemplate',
    method: 'get',
    params: data
  });
}
