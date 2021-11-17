import request from '@/utils/request';

// 用户管理
export function login(data) {
  return request({
    url: '/Login/UserLogin',
    method: 'post',
    data
  });
}

export function getRNum() {
  return request({
    url: '/Login/getRNum',
    method: 'post'
  });
}

export function GetSysCode() {
  return request({
    url: '/Login/GetSysCode',
    method: 'post'
  });
}

export function getInfo(data) {
  return request({
    url: '/User/GetUserInfo',
    method: 'post',
    data
  });
}

export function getMenu(data) {
  return request({
    url: '/MenuType/SelectMenuByMenuTypeID',
    method: 'post',
    data
  });
}

export function getMenuType(data) {
  return request({
    url: '/MenuType/SelectMenuType',
    method: 'post',
    data
  });
}

export function SelectUser(data) {
  return request({
    url: '/User/SelectUser',
    method: 'post',
    data
  });
}

export function InsertUser(data) {
  return request({
    url: '/User/InsertUser',
    method: 'post',
    data
  });
}

export function DeleteUser(data) {
  return request({
    url: '/User/DeleteUser',
    method: 'post',
    data
  });
}

export function UpdatePwd(data) {
  return request({
    url: '/User/UpdatePwd',
    method: 'post',
    data
  });
}
export function UpdateUser(data) {
  return request({
    url: '/User/UpdateUser',
    method: 'post',
    data
  });
}

export function InsertUserOnDep(data) {
  return request({
    url: '/User/InsertUserOnDep',
    method: 'post',
    data
  });
}

export function InsertUserOnDeps(data) {
  return request({
    url: '/User/InsertUserOnDeps',
    method: 'post',
    data
  });
}

export function SelectDept(data) {
  return request({
    url: '/User/SelectDept',
    method: 'post',
    data
  });
}

export function SelectDepts(data) {
  return request({
    url: '/User/SelectDepts',
    method: 'post',
    data,
    intercept: 2
  });
}

export function InsertDept(data) {
  return request({
    url: '/User/InsertDept',
    method: 'post',
    data
  });
}

export function UpdateDept(data) {
  return request({
    url: '/User/UpdateDept',
    method: 'post',
    data
  });
}

export function DeleteDept(data) {
  return request({
    url: '/User/DeleteDept',
    method: 'post',
    data
  });
}

export function SelectRole(data) {
  return request({
    url: '/User/SelectRole',
    method: 'post',
    data
  });
}

export function InsertRole(data) {
  return request({
    url: '/User/InsertRole',
    method: 'post',
    data
  });
}

export function UpdateRole(data) {
  return request({
    url: '/User/UpdateRole',
    method: 'post',
    data
  });
}

export function DisableRole(data) {
  return request({
    url: '/User/DisableRole',
    method: 'post',
    data
  });
}

export function InsertRoleOnDept(data) {
  return request({
    url: '/User/InsertRoleOnDept',
    method: 'post',
    data
  });
}

export function InsertRoleOnUser(data) {
  return request({
    url: '/User/InsertRoleOnUser',
    method: 'post',
    data
  });
}

export function SelectMenu(data) {
  return request({
    url: '/User/SelectMenu',
    method: 'post',
    data
  });
}

export function InsertMenu(data) {
  return request({
    url: '/User/InsertMenu',
    method: 'post',
    data
  });
}

export function UpdateMenu(data) {
  return request({
    url: '/User/UpdateMenu',
    method: 'post',
    data
  });
}

export function DeleteMenu(data) {
  return request({
    url: '/User/DeleteMenu',
    method: 'post',
    data
  });
}

export function InsertMenuOnRole(data) {
  return request({
    url: '/User/InsertMenuOnRole',
    method: 'post',
    data
  });
}

export function MenuMove(data) {
  return request({
    url: '/User/MenuMove',
    method: 'post',
    data
  });
}
export function SelectAllMenuType(data) {
  return request({
    url: '/MenuType/SelectAllMenuType',
    method: 'post',
    data
  });
}

export function SelectZGUser(data) {
  return request({
    url: 'User/SelectZGUser',
    method: 'post',
    data
  });
}

export function SelectDeptsByName(data) {
  return request({
    url: 'User/SelectDeptsByName',
    method: 'post',
    data
  });
}

/* 组别管理 */
export function InsertGroup(data) {
  return request({
    url: 'Group/InsertGroup',
    method: 'post',
    data
  });
}

export function DeleteGroup(data) {
  return request({
    url: 'Group/DeleteGroup',
    method: 'post',
    data
  });
}

export function UpdateGroup(data) {
  return request({
    url: 'Group/UpdateGroup',
    method: 'post',
    data
  });
}

export function SelectGroup(data) {
  return request({
    url: 'Group/SelectGroup',
    method: 'post',
    data
  });
}

// 删除角色
export function DeleteRole(data) {
  return request({
    url: 'User/DeleteRole',
    method: 'post',
    data
  });
}
