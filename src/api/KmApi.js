import request from '@/utils/request';

// KM_CheckList
export function insertCheckList(data) {
  return request({
    url: '/KM_CheckList/insertCheckList',
    method: 'post',
    data
  });
}

export function UpdateCheckList(data) {
  return request({
    url: '/KM_CheckList/UpdateCheckList',
    method: 'post',
    data
  });
}

export function DeleteCheckList(data) {
  return request({
    url: '/KM_CheckList/DeleteCheckList',
    method: 'post',
    data
  });
}

export function SelectCheckList(data) {
  return request({
    url: '/KM_CheckList/SelectCheckList',
    method: 'post',
    data
  });
}

export function SelectCatalogByParentID(data) {
  return request({
    url: '/KM_CheckList/SelectCatalogByParentID',
    method: 'post',
    data
  });
}

export function SelectAllArticleGroup() {
  return request({
    url: '/KM_CheckList/SelectAllArticleGroup',
    method: 'post'
  });
}

export function InsertArticle(data) {
  return request({
    url: '/KM_CheckList/InsertArticle',
    method: 'post',
    data
  });
}

// KM_Directory
export function SelectDirectory(data) {
  return request({
    url: '/KM_Directory/SelectDirectory',
    method: 'post',
    data
  });
}

export function SelectDirectorys(data) {
  return request({
    url: '/KM_Directory/SelectDirectorys',
    method: 'post',
    data
  });
}

// export function SelectCheckListByDirectoryID(data) {
//   return request({
//     url: '/KM_Directory/SelectCheckListByDirectoryID',
//     method: 'post',
//     data
//   })
// }

export function SelectCheckListByDirectoryID(data) {
  return request({
    url: '/KM_CheckList/SelectCheckListByDirectoryID',
    method: 'post',
    data
  });
}


export function InsertDirectory(data) {
  return request({
    url: '/KM_Directory/InsertDirectory',
    method: 'post',
    data
  });
}

export function DeleteCddetail(data) {
  return request({
    url: '/KM_Cddetail/DeleteCddetail',
    method: 'post',
    data
  });
}

export function InsertCLToDirectory(data) {
  return request({
    url: '/KM_Directory/InsertCLToDirectory',
    method: 'post',
    data
  });
}

export function DeleteDirectory(data) {
  return request({
    url: '/KM_Directory/DeleteDirectory',
    method: 'post',
    data
  });
}

export function UpdateDirectory(data) {
  return request({
    url: '/KM_Directory/UpdateDirectory',
    method: 'post',
    data
  });
}

export function DeleteCLToDirectory(data) {
  return request({
    url: '/KM_Directory/DeleteCLToDirectory',
    method: 'post',
    data
  });
}

export function SelectCddetail(data) {
  return request({
    url: '/KM_Cddetail/SelectCddetail',
    method: 'post',
    data
  });
}

export function InsertCddetail(data) {
  return request({
    url: '/KM_Cddetail/InsertCddetail',
    method: 'post',
    data
  });
}

export function SelectVerifyDetail(data) {
  return request({
    url: '/KM_QualitySupervision/SelectVerifyDetail',
    method: 'post',
    data
  });
}

export function SelectKMProcess(data) {
  return request({
    url: '/KM_QualitySupervision/SelectKMProcess',
    method: 'post',
    data
  });
}

export function SelectQualitySupervisionList(data) {
  return request({
    url: '/KM_QualitySupervision/SelectQualitySupervisionList',
    method: 'post',
    data
  });
}

export function SelectExecuteList(data) {
  return request({
    url: '/KM_Execute/SelectExecuteList',
    method: 'post',
    data
  });
}

export function InsertExecute(data) {
  return request({
    url: '/KM_Execute/InsertExecute',
    method: 'post',
    data
  });
}

export function InsertVerity(data) {
  return request({
    url: '/KM_Verity/InsertVerity',
    method: 'post',
    data
  });
}

export function UpdateVerity(data) {
  return request({
    url: '/KM_Verity/UpdateVerity',
    method: 'post',
    data
  });
}

export function SelectVerity(data) {
  return request({
    url: '/KM_Verity/SelectVerity',
    method: 'post',
    data
  });
}

export function SelectVerifyList(data) {
  return request({
    url: '/KM_Verity/SelectVerifyList',
    method: 'post',
    data
  });
}

