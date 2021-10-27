import service from '@/utils/request';

export function InsertPaper(data) {
  return service({
    url: '/KS_Paper/InsertPaper',
    method: 'post',
    data
  });
}

export function SelectPaper(data) {
  return service({
    url: '/KS_Paper/SelectPaper',
    method: 'post',
    data
  });
}

export function DeletePaper(data) {
  return service({
    url: '/KS_Paper/DeletePaper',
    method: 'post',
    data
  });
}

export function UpdateUser(data) {
  return service({
    url: '/KS_Paper/UpdateUser',
    method: 'post',
    data
  });
}

export function SelectPaperDetailById(data) {
  return service({
    url: '/KS_Paper/SelectPaperDetailById',
    method: 'post',
    data
  });
}

export function InsertTask(data) {
  return service({
    url: '/KS_Task/InsertTask',
    method: 'post',
    data
  });
}

export function UpdateTask(data) {
  return service({
    url: '/KS_Task/UpdateTask',
    method: 'post',
    data
  });
}

// api/KS_Task/DeleteTask
export function DeleteTask(data) {
  return service({
    url: '/KS_Task/DeleteTask',
    method: 'post',
    data
  });
}

export function SelectTask(data) {
  return service({
    url: '/KS_Task/SelectTask',
    method: 'post',
    data
  });
}

export function InsertRetakeTask(data) {
  return service({
    url: '/KS_Task/InsertRetakeTask',
    method: 'post',
    data
  });
}

// 查询补考名单  KS_Resit/SelectResit
// 参数：pageIndex:页码<br/>pageSize:条数<br/>taskID:任务ID
export function SelectResit(data) {
  return service({
    url: '/KS_Resit/SelectResit',
    method: 'post',
    data
  });
}

// 导入补考名单 KS_Resit/ReadExcel（传文件和TaskID,不要用表单提交方式）
export function ReadExcel(data) {
  return service({
    url: '/KS_Resit/ReadExcel',
    method: 'post',
    data
  });
}

// 删除补考名单  KS_Resit/DeleteResit
// 参数：ResitIDArray:补考ID（int数组）
export function DeleteResit(data) {
  return service({
    url: '/KS_Resit/DeleteResit',
    method: 'post',
    data
  });
}
