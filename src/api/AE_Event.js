import request from '@/utils/request';

export function InsertOrUpdateEvent(data) {
  return request({
    url: '/AE_Event/InsertOrUpdateEvent',
    method: 'post',
    data
  });
}

export function SelectEvent(data) {
  return request({
    url: '/AE_Event/SelectEvent',
    method: 'post',
    data
  });
}

export function DeleteEvent(data) {
  return request({
    url: '/AE_Event/DeleteEvent',
    method: 'post',
    data
  });
}

export function SelevtEventType(data) {
  return request({
    url: '/AE_EventType/SelevtEventType',
    method: 'post',
    data
  });
}

export function InsertEventType(data) {
  return request({
    url: '/AE_EventType/InsertEventType',
    method: 'post',
    data
  });
}

export function DeleteEventTypes(data) {
  return request({
    url: '/AE_EventType/DeleteEventTypes',
    method: 'post',
    data
  });
}

export function SelectEventList() {
  return request({
    url: '/AE_Event/SelectEventList',
    method: 'post'
  });
}

export function SelectEventTypeByEventID(data) {
  return request({
    url: '/AE_EventType/SelectEventTypeByEventID',
    method: 'post',
    data
  });
}

export function SelectProblem(data) {
  return request({
    url: '/AE_Problem/SelectProblem',
    method: 'post',
    data
  });
}


export function InsertOrUpdateProblem(data) {
  return request({
    url: '/AE_Problem/InsertOrUpdateProblem',
    method: 'post',
    data
  });
}

export function DeleteProblem(data) {
  return request({
    url: '/AE_Problem/DeleteProblem',
    method: 'post',
    data
  });
}


export function SelectProblemByEventTypeID(data) {
  return request({
    url: '/AE_Problem/SelectProblemByEventTypeID',
    method: 'post',
    data
  });
}

export function SelectProblemDetailByID(data) {
  return request({
    url: '/AE_Problem/SelectProblemDetailByID',
    method: 'post',
    data
  });
}


export function SelectReport(data) {
  return request({
    url: '/AE_Report/SelectReport',
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


export function SelectReportByID(data) {
  return request({
    url: '/AE_Report/SelectReportByID',
    method: 'post',
    data
  });
}

export function SelectHandleReport(data) {
  return request({
    url: '/AE_Report/SelectHandleReport',
    method: 'post',
    data
  });
}

export function SelectReview(data) {
  return request({
    url: 'AE_Review/SelectReview',
    method: 'post',
    data
  });
}

export function EventReassign(data) {
  return request({
    url: '/AE_Follow/EventReassign',
    method: 'post',
    data
  });
}

export function EventAssist(data) {
  return request({
    url: '/AE_Follow/EventAssist',
    method: 'post',
    data
  });
}

export function UpdateReviewStatus(data) {
  return request({
    url: '/AE_Review/UpdateReviewStatus',
    method: 'post',
    data
  });
}

export function InsertReviewStep(data) {
  return request({
    url: '/AE_Review/InsertReviewStep',
    method: 'post',
    data
  });
}

export function InsertOpinion(data) {
  return request({
    url: '/AE_Opinion/InsertOpinion',
    method: 'post',
    data
  });
}

export function SelectOpinion(data) {
  return request({
    url: '/AE_Opinion/SelectOpinion',
    method: 'post',
    data
  });
}

// ??????????????????????????????
export function InsertOrUpdateReportqixie(data) {
  return request({
    url: '/AE_Report/InsertOrUpdateReportqixie',
    method: 'post',
    data
  });
}

// ??????????????????????????????
export function InsertOrUpdateReportHuli(data) {
  return request({
    url: '/AE_Report/InsertOrUpdateReportHuli',
    method: 'post',
    data
  });
}

// ???????????????????????????????????????
export function InsertOrUpdateAnQuan(data) {
  return request({
    url: '/AE_Report/InsertOrUpdateAnQuan',
    method: 'post',
    data
  });
}

// ???????????????????????????????????????
export function InsertOrUpdateYaoPin(data) {
  return request({
    url: '/AE_Report/InsertOrUpdateYaoPin',
    method: 'post',
    data
  });
}
// ?????????????????????????????????????????????
export function SelectMedical(data) {
  return request({
    url: '/AE_Report/SelectMedical',
    method: 'get',
    params: data
  });
}


// ?????????????????????????????????
export function InsertOrUpdateReport(data) {
  return request({
    url: '/AE_Report/InsertOrUpdateReport',
    method: 'post',
    data
  });
}
// ??????????????????????????????
export function SelectReportAnQuan(data) {
  return request({
    url: '/AE_Report/SelectReportAnQuan',
    method: 'post',
    data
  });
}

// ??????????????????????????????
export function SelectReportYaoPin(data) {
  return request({
    url: '/AE_Report/SelectReportYaoPin',
    method: 'post',
    data
  });
}

// ??????????????????????????????
export function SelectReportHuli(data) {
  return request({
    url: '/AE_Report/SelectReportHuli',
    method: 'post',
    data
  });
}

// ??????????????????????????????
export function SelectReportqixie(data) {
  return request({
    url: '/AE_Report/SelectReportqixie',
    method: 'post',
    data
  });
}


// ????????????????????????
export function SelectHandleReport1(data) {
  return request({
    url: '/AE_Report/SelectHandleReport1',
    method: 'get',
    params: data
  });
}


// ????????????????????????
export function SelectReportYaoPin1(data) {
  return request({
    url: '/AE_Report/SelectReportYaoPin1',
    method: 'post',
    data
  });
}

// ????????????id??????????????????
export function SelectReportByID1(data) {
  return request({
    url: '/AE_Report/SelectReportByID1',
    method: 'get',
    params: data
  });
}

// ????????????????????????
export function DeleteReport1(data) {
  return request({
    url: '/AE_Report/DeleteReport1',
    method: 'post',
    data
  });
}

// ???????????????
export function SelectReportFile(data) {
  return request({
    url: '/AE_Report/SelectReportFile',
    method: 'get',
    params: data
  });
}


// ???????????????
export function SelectData(data) {
  return request({
    url: '/AE_Report/SelectData',
    method: 'get',
    params: data
  });
}
