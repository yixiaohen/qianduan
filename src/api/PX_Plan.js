import service from '@/utils/request';
import service2 from '@/utils/requestAsync';

export function InsertPlan(data) {
  return service({
    url: '/PX_Plan/InsertPlan',
    method: 'post',
    data
  });
}

export function SelectPlan(data) {
  return service({
    url: '/PX_Plan/SelectPlan',
    method: 'post',
    data
  });
}

export function SelectPlanDetailByPlanID(data) {
  return service({
    url: '/PX_Plan/SelectPlanDetailByPlanID',
    method: 'post',
    data
  });
}

export function DeletePlan(data) {
  return service({
    url: '/PX_Plan/DeletePlan',
    method: 'post',
    data
  });
}

export function UpdatePlan(data) {
  return service({
    url: '/PX_Plan/UpdatePlan',
    method: 'post',
    data
  });
}

// 每5秒调用接口，更新用户附件观看时长
export function UpdateTargetTimeByUserId(data) {
  return service2({
    url: '/PX_Plan/UpdateTargetTimeByUserId',
    method: 'post',
    data
  });
}
