import request from '@/utils/request';

export function SelectScore() {
  return request({
    url: '/reviewstatic/SelectScore',
    method: 'post'
  });
}
// 统计分析等级制绘图
export function SelectPDCAGradeCount() {
  return request({
    url: '/Score/SelectPDCAGradeCount',
    method: 'post'
  });
}
// 统计分析分数制绘图
export function GetAlgoPieCharts() {
  return request({
    url: '/CatalogCfg/GetAlgoPieCharts',
    method: 'post'
  });
}

export function DeptPassRate(data) {
  return request({
    url: '/Score/DeptPassRate',
    method: 'post',
    data
  });
}

export function SelectDeptPassRate(data) {
  return request({
    url: '/Score/SelectDeptPassRate',
    method: 'post',
    data
  });
}
