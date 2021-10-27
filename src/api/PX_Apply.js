import service from '@/utils/request';

export function InsertApply(data) {
  return service({
    url: '/PX_Apply/InsertApply',
    method: 'post',
    data
  });
}

export function SelectApply(data) {
  return service({
    url: '/PX_Apply/SelectApply',
    method: 'post',
    data
  });
}

export function SelectApplyByPlanID(data) {
  return service({
    url: '/PX_Apply/SelectApplyByPlanID',
    method: 'post',
    data
  });
}

export function TrainSign(data) {
  return service({
    url: '/PX_Apply/TrainSign',
    method: 'post',
    data
  });
}

export function SelectSignStatusList(data) {
  return service({
    url: '/PX_Apply/SelectSignStatusList',
    method: 'post',
    data
  });
}

export function CancelApplyState(data) {
  return service({
    url: '/PX_Apply/CancelApplyState',
    method: 'post',
    data
  });
}

export function OpenApplyState(data) {
  return service({
    url: '/PX_Apply/OpenApplyState',
    method: 'post',
    data
  });
}

export function UpdateLookState(data) {
  return service({
    url: '/PX_Apply/UpdateLookState',
    method: 'post',
    data
  });
}

export function UpdateApplyState(data) {
  return service({
    url: '/PX_Apply/UpdateApplyState',
    method: 'post',
    data
  });
}
