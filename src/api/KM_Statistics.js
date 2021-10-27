import service from '@/utils/request';

export function SelectStatistics(data) {
  return service({
    url: 'KM_Statistics/SelectStatistics',
    method: 'post',
    data
  });
}

export function SelectExecuteStatistics(data) {
  return service({
    url: 'KM_Statistics/SelectExecuteStatistics',
    method: 'post',
    data
  });
}

export function SelectVerifyStatistics(data) {
  return service({
    url: 'KM_Statistics/SelectVerifyStatistics',
    method: 'post',
    data
  });
}
