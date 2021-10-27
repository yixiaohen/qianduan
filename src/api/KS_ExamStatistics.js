import request from '@/utils/request';

export function SelectTaskAveScore(data) {
  return request({
    url: '/KS_ExamStatistics/SelectTaskAveScore',
    method: 'post',
    data
  });
}

export function SelectTaskExamStatistics(data) {
  return request({
    url: '/KS_ExamStatistics/SelectTaskExamStatistics',
    method: 'post',
    data
  });
}

export function SelectDeptIDByTaskID(data) {
  return request({
    url: '/KS_ExamStatistics/SelectDeptIDByTaskID',
    method: 'post',
    data
  });
}

export function SelectAllTaskAveScore(data) {
  return request({
    url: '/KS_ExamStatistics/SelectAllTaskAveScore',
    method: 'post',
    data
  });
}

export function SelectAllTaskExamStatistics(data) {
  return request({
    url: '/KS_ExamStatistics/SelectAllTaskExamStatistics',
    method: 'post',
    data
  });
}

export function GetDeptIDByTaskID(data) {
  return request({
    url: '/KS_ExamStatistics/GetDeptIDByTaskID',
    method: 'post',
    data
  });
}

export function GetAllDeptIDByTaskID(data) {
  return request({
    url: '/KS_ExamStatistics/GetAllDeptIDByTaskID',
    method: 'post',
    data
  });
}

export function GetTaskExamDetail(data) {
  return request({
    url: '/KS_ExamStatistics/GetTaskExamDetail',
    method: 'post',
    data
  });
}
