import request from '@/utils/request';

export function InsertTask(data) {
  return request({
    url: '/OKR_Task/InsertTask',
    method: 'post',
    data
  });
}

export function SelectTask(data) {
  return request({
    url: '/OKR_Task/SelectTask',
    method: 'get',
    params: data
  });
}

export function UpdateTask(data) {
  return request({
    url: '/OKR_Task/UpdateTask',
    method: 'post',
    data
  });
}

export function DeleteTask(data) {
  return request({
    url: '/OKR_Task/DeleteTask',
    method: 'post',
    data
  });
}

export function SelectTaskView(data) {
  return request({
    url: '/OKR_Task/SelectTaskView',
    method: 'get',
    params: data
  });
}

export function SelectTaskByID(data) {
  return request({
    url: '/OKR_Task/SelectTaskByID',
    method: 'get',
    params: data
  });
}

export function SelectMyTask(data) {
  return request({
    url: '/OKR_Task/SelectMyTask',
    method: 'get',
    params: data
  });
}

export function GetTaskAll(data) {
  return request({
    url: 'OKR_Task/GetTaskAll',
    method: 'get',
    params: data
  });
}


