import request from '@/utils/request';

// 扣分原因
export function InsertPenalties(data) {
  return request({
    url: '/Penalties/InsertPenalties',
    method: 'post',
    data
  });
}

export function DeletePenalties(data) {
  return request({
    url: '/Penalties/DeletePenalties',
    method: 'post',
    data
  });
}

export function UpdatePenalties(data) {
  return request({
    url: '/Penalties/UpdatePenalties',
    method: 'post',
    data
  });
}

export function SelectPenalties(data) {
  return request({
    url: '/Penalties/SelectPenalties',
    method: 'post',
    data
  });
}

export function SelectPenaltiesByCatalogID(data) {
  return request({
    url: '/Penalties/SelectPenaltiesByCatalogID',
    method: 'post',
    data
  });
}

export function InsertPenaltiesOnCatalog(data) {
  return request({
    url: '/Penalties/InsertPenaltiesOnCatalog',
    method: 'post',
    data
  });
}

export function DeletePenaltiesOnCatalog(data) {
  return request({
    url: '/Penalties/DeletePenaltiesOnCatalog',
    method: 'post',
    data
  });
}

export function InsertPeorCa(data) {
  return request(
    {
      url: '/Penalties/InsertPeorCa',
      method: 'post',
      data
    }
  );
}

export function SelectAllPenaltiesByCatalogID(data) {
  return request({
    url: '/Penalties/SelectAllPenaltiesByCatalogID',
    method: 'post',
    data
  });
}
