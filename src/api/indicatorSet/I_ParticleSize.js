import request from '@/utils/request';
// 指标监测
// 粒度
// 新增粒度
export function InsertPaSize(data) {
  return request({
    url: 'I_ParticleSize/InsertPaSize',
    method: 'post',
    data
  });
}

// 修改粒度
export function UpdatePaSize(data) {
  return request({
    url: 'I_ParticleSize/UpdatePaSize',
    method: 'post',
    data
  });
}

// 删除粒度
export function DeletePaSize(data) {
  return request({
    url: 'I_ParticleSize/DeletePaSize',
    method: 'post',
    data
  });
}

// 查询粒度
export function SelectPaSize(data) {
  return request({
    url: 'I_ParticleSize/SelectPaSize',
    method: 'get',
    params: data
  });
}

// 根据粒度ID查询粒度
export function SelectPaSizeByid(data) {
  return request({
    url: 'I_ParticleSize/SelectPaSizeByid',
    method: 'get',
    params: data
  });
}
