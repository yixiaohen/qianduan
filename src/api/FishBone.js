import request from '@/utils/request';

export function SelectFishBoneName(data) {
  return request({
    url: '/FishBone/SelectFishBoneName',
    method: 'post',
    data
  });
}

export function SelectFishBone(data) {
  return request({
    url: '/FishBone/SelectFishBone',
    method: 'post',
    data
  });
}

export function InsertFishBoneName(data) {
  return request({
    url: '/FishBone/InsertFishBoneName',
    method: 'post',
    data
  });
}

export function InsertFishBone(data) {
  return request({
    url: '/FishBone/InsertFishBone',
    method: 'post',
    data
  });
}

export function UpdateFishBoneName(data) {
  return request({
    url: '/FishBone/UpdateFishBoneName',
    method: 'post',
    data
  });
}

export function UpdateFishBone(data) {
  return request({
    url: '/FishBone/UpdateFishBone',
    method: 'post',
    data
  });
}

export function DeleteFishBoneName(data) {
  return request({
    url: '/FishBone/DeleteFishBoneName',
    method: 'post',
    data
  });
}

export function DeleteFishBone(data) {
  return request({
    url: '/FishBone/DeleteFishBone',
    method: 'post',
    data
  });
}
