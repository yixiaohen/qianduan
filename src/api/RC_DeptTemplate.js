// 科室基本情况

import service from '@/utils/request';

export function InsertDeptTemplate(data) {
  return service({
    url: '/RC_DeptTemplate/InsertDeptTemplate',
    method: 'post',
    data
  });
}

export function SelectDeptTemplate(data) {
  return service({
    url: '/RC_DeptTemplate/SelectDeptTemplate',
    method: 'post',
    data
  });
}

export function SelectDeptTemplateDetail(data) {
  return service({
    url: '/RC_DeptTemplate/SelectDeptTemplateDetail',
    method: 'post',
    data
  });
}

export function UpdateDeptTemplate(data) {
  return service({
    url: '/RC_DeptTemplate/UpdateDeptTemplate',
    method: 'post',
    data
  });
}

export function DeleteDeptTemplate(data) {
  return service({
    url: '/RC_DeptTemplate/DeleteDeptTemplate',
    method: 'post',
    data
  });
}

export function SelectDeptCatalog(data) {
  return service({
    url: 'RC_DeptTemplate/SelectDeptCatalog',
    method: 'post',
    data
  });
}

export function SelectMyDeptInfo(data) {
  return service({
    url: 'RC_DeptTemplate/SelectMyDeptInfo',
    method: 'post',
    data
  });
}
