const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,

  token: state => state.user.token,
  avatar: state => state.user.avatar,
  userID: state => state.user.userID,
  name: state => state.user.name,
  UserName: state => state.user.UserName,
  DeptName: state => state.user.DeptName,
  userInfo: state => state.user.userInfo,
  roles: state => state.user.roles,
  navi: state => state.user.navi,
  naviType: state => state.user.naviType,
  naviCur: state => state.user.naviCur,
  menuCur: state => state.user.menuCur,
  hasSys: state => state.user.hasSys,

  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,

  addRoutes: state => state.permission.addRoutes,
  permission_routes: state => state.permission.routes,
  menus: state => state.permission.menus,

  needTagsView: state => state.settings.tagsView,
  showSettings: state => state.settings.showSettings,

  dialog: state => state.components.dialog,

  iniPara: state => state.app.iniPara
};

export default getters;
