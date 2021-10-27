import request from '@/utils/request';

export function InsertOrUpdateSMS(data) {
  return request({
    url: '/SMS/InsertOrUpdateSMS',
    method: 'post',
    data
  });
}

export function SelectSMS(data) {
  return request({
    url: '/SMS/SelectSMS',
    method: 'post',
    data
  });
}
// 考评配置切换
export function DoStyleSwitchOn(data) {
  return request({
    url: '/CatalogCfg/DoStyleSwitchOn',
    method: 'post',
    data
  });
}

// 考评配置状态查询
export function GetCatalogCfgInfo(data) {
  return request({
    url: '/CatalogCfg/GetCatalogCfgInfo',
    method: 'post',
    data
  });
}
