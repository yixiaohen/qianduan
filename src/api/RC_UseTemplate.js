import request from '@/utils/request';

export function InsertUseTempDraft(data) {
  return request({
    url: '/RC_UseTemplate/InsertUseTempDraft',
    method: 'post',
    data
  });
}

export function SelectUseTempDraft(data) {
  return request({
    url: '/RC_UseTemplate/SelectUseTempDraft',
    method: 'post',
    data
  });
}

export function SelectUseTempDraftDetail(data) {
  return request({
    url: '/RC_UseTemplate/SelectUseTempDraftDetail',
    method: 'post',
    data
  });
}

export function UpdateUseTempDraftDetail(data) {
  return request({
    url: '/RC_UseTemplate/UpdateUseTempDraftDetail',
    method: 'post',
    data
  });
}


export function DeleteUseTemplateDraft(data) {
  return request({
    url: '/RC_UseTemplate/DeleteUseTemplateDraft',
    method: 'post',
    data
  });
}

export function DeleteUseTemplate(data) {
  return request({
    url: '/RC_UseTemplate/DeleteUseTemplate',
    method: 'post',
    data
  });
}

// 表单复用按钮接口
export function ReuseTemplate(data) {
  return request({
    url: '/RC_UseTemplate/ReuseTemplate',
    method: 'get',
    params: data
  });
}
