import request from '@/utils/request';
import requestAsync from '@/utils/requestAsync';

// 查询定时
export function SelectTiming(data) {
  return request({
    url: 'I_Timing/SelectTiming',
    method: 'get',
    params: data
  });
}
// 添加定时
export function InsertTiming(data) {
  return request({
    url: 'I_Timing/InsertTiming',
    method: 'post',
    data
  });
}

// 修改定时
export function UpdateTiming(data) {
  return request({
    url: 'I_Timing/UpdateTiming',
    method: 'post',
    data
  });
}
// 删除定时
export function DeleteTiming(data) {
  return request({
    url: 'I_Timing/DeleteTiming',
    method: 'post',
    data
  });
}

// 手动保存运算结果1 需要等待服务器响应
export function SaveWorkByHandsResult1(data) {
  return request({
    url: 'I_Work_Hands/SaveWorkByHandsResult',
    method: 'post',
    data
  });
}

// 手动保存运算结果2 ，不需要等待服务器响应
export function SaveWorkByHandsResult2(data) {
  return requestAsync({
    url: 'I_Work_Hands/SaveWorkByHandsResult',
    method: 'post',
    data
  });
}
