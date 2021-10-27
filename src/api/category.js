// http://192.168.0.9:8085/swagger/ui/index#!/CategorySearch/CategorySearch_SelectCategory
import request from '@/utils/request';

export function SelectCategory(data) {
  return request({
    url: '/CategorySearch/SelectCategory',
    method: 'post',
    data
  });
}
