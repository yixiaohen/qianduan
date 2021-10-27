import request from '@/utils/request';

export function SelectHandleReport(data) {
  return request({
    url: '/AE_Report/SelectHandleReport',
    method: 'post',
    data
  });
}
export function SelectReportByID(data) {
  return request({
    url: '/AE_Report/SelectReportByID',
    method: 'post',
    data
  });
}
export function DeleteReport(data) {
  return request({
    url: '/AE_Report/DeleteReport',
    method: 'post',
    data
  });
}
export function UpdateFirstCentralizeDepartmentID(data) {
  return request({
    url: '/AE_Report/UpdateFirstCentralizeDepartmentID',
    method: 'post',
    data
  });
}
export function UpdateSecondCentralizeDepartmentID(data) {
  return request({
    url: '/AE_Report/UpdateSecondCentralizeDepartmentID',
    method: 'post',
    data
  });
}
export function UpdateStatus(data) {
  return request({
    url: '/AE_Report/UpdateStatus',
    method: 'post',
    data
  });
}
export function SelectFeedbackList(data) {
  return request({
    url: '/AE_Report/SelectFeedbackList',
    method: 'post',
    data
  });
}
