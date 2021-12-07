import request from '@/utils/request';

export function SelectinstType(data) {
  return request({
    url: '/inst/SelectinstType',
    method: 'post',
    data
  });
}

export function UpdateinstType(data) {
  return request({
    url: '/inst/UpdateinstType',
    method: 'post',
    data
  });
}


export function InsertinstType(data) {
  return request({
    url: '/inst/InsertinstType',
    method: 'post',
    data
  });
}

export function DeleteinstType(data) {
  return request({
    url: '/inst/DeleteinstType',
    method: 'post',
    data
  });
}

export function Selectinst(data) {
  return request({
    url: '/inst/Selectinst',
    method: 'post',
    data
  });
}

export function UploadFile(data) {
  return request({
    url: 'inst/UploadFile',
    method: 'post',
    data
  });
}

export function UPdateinst(data) {
  return request({
    url: 'inst/UPdateinst',
    method: 'post',
    data
  });
}
export function SelectDeptorUser(data) {
  return request({
    url: '/EvaluationUser/SelectDeptorUser',
    method: 'post',
    data
  });
}

export function Insertinst(data) {
  return request({
    url: '/inst/Insertinst',
    method: 'post',
    data
  });
}
export function UpdateinstAduitUser(data) {
  return request({
    url: '/inst/UpdateinstAduitUser',
    method: 'post',
    data
  });
}

export function instAudit(data) {
  return request({
    url: '/inst/instAudit',
    method: 'post',
    data
  });
}
export function instMove(data) {
  return request({
    url: '/inst/instMove',
    method: 'post',
    data
  });
}
export function SelectUpUserList(data) {
  return request({
    url: '/inst/SelectUpUserList',
    method: 'post',
    data
  });
}

export function SelectUpDeptList(data) {
  return request({
    url: '/inst/SelectUpDeptList',
    method: 'post',
    data
  });
}

export function Deleteinst(data) {
  return request({
    url: '/inst/Deleteinst',
    method: 'get',
    params: data
  });
}

export function SelectInstHistory(data) {
  return request({
    url: '/inst/SelectInstHistory',
    method: 'post',
    data
  });
}

export function SelectInstDetailByID(data) {
  return request({
    url: '/inst/SelectInstDetailByID',
    method: 'post',
    data
  });
}
