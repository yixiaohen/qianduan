import { getInfo, getMenu, getMenuType, login } from '@/api/user';
import { getToken, removeToken, setToken } from '@/utils/auth';
import { resetRouter } from '@/router';

const state = {
  token: getToken(),
  navi: [], // 顶端导航条 menuType
  naviType: 1, // 前台1，后台0
  naviCur: 1, // 0,1,2当前顶端打开的是哪一个模块
  menuCur: [], // 每个模块当前打开的菜单路由path，用来切换模块的时候知道打开模块中哪个子菜单路由
  hasSys: 1, // 是否具有“进入企业管理后台”的权限
  name: '',
  userID: 0,
  avatar: '',
  UserName: '',
  DeptName: '',
  userInfo: {} // 用户信息
};

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_NAVI: (state, navi) => {
    state.navi = navi;
    navi.forEach(el => {
      if (el.Cur == 1) state.naviCur = el.MenuTypeID;
    });
  },
  SET_NAVI_TYPE: (state, type) => {
    if (type != undefined) state.naviType = type;
  },
  SET_NAVI_BY_ID: (state, navi) => {
    state.naviType = navi.type;
    var a = [];
    navi.data.forEach(item => {
      if (item.MenuTypeID == navi.typeID) item.Cur = 1;
      a.push(item);
    });
    state.navi = a;
  },
  SET_NAVI_CUR: (state, id) => {
    state.navi.map(item => {
      if (item.MenuTypeID == id) item.Cur = 1;
      else item.Cur = 0;
    });
    state.naviCur = id;
  },
  SET_MENU_CUR: (state, path) => {
    if (path == '') state.menuCur = [];
    else {
      let len = state.menuCur.length;
      if (len > state.naviCur) state.menuCur[state.naviCur] = path;
      else {
        while (len++ < state.naviCur) state.menuCur.push('');
        state.menuCur.push(path);
      }
    }
  },
  SET_HAS_SYS: (state, hasSys) => {
    if (hasSys != undefined) state.hasSys = hasSys;
  },
  SET_USER_INFO: (state, userInfo) => {
    state.userInfo = userInfo;
  },
  SET_NAME: (state, name) => {
    state.name = name;
  },
  SET_USERID: (state, userID) => {
    state.userID = userID;
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar;
  },
  SET_USERNAME: (state, UserName) => {
    state.UserName = UserName;
  },
  SET_DEPTNAME: (state, DeptName) => {
    state.DeptName = DeptName;
  }
};

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo;
    return new Promise((resolve, reject) => {
      login({ UserName: username.trim(), UserPwd: password }).then(response => {
        const { data } = response;
        commit('SET_TOKEN', data.Token);
        setToken(data.Token);
        resolve();
      }).catch(error => {
        reject(error);
      });
    });
  },

  // get user info
  getInfo({ commit }, path) {
    return new Promise((resolve, reject) => {
      getInfo({ 'MenuPath': path }).then(response => {
        const { data } = response;
        commit('SET_NAME', data.Userinfo[0].UserName);
        commit('SET_USERNAME', data.Userinfo[0].UserName);
        commit('SET_DEPTNAME', data.Userinfo[0].DeptName);
        commit('SET_USERID', data.Userinfo[0].UserID);
        commit('SET_USER_INFO', data.Userinfo);
        commit('SET_NAVI', data.MenuTypeList);
        commit('SET_NAVI_TYPE', data.MenuPosition);
        commit('SET_HAS_SYS', data.hasSys);
        window.userInfo = data.Userinfo;
        window.roleName = data.Userinfo;
        window.CatalogVersion = data.CatalogVersion;
        window.IsSelectOtherDept = data.IsSelectOtherDept;
        window.SMSStatus = data.SMSStatus;
        resolve(data);
      }).catch(error => {
        reject(error);
      });
    });
  },

  async getNavi({ commit }, id) {
    commit('SET_NAVI_CUR', id);
    const { data } = await getMenu({ 'MenuTypeID': id, 'UserID': window.userInfo[0].UserID });
    return data;
  },

  // top navibar
  async getNaviType({ commit }, { type, typeID }) {
    const { data } = await getMenuType({ 'UserID': window.userInfo[0].UserID, MenuPosition: type });
    commit('SET_NAVI_BY_ID', { data, type, typeID });
    return data;
  },

  setMenuCur({ commit }, path) {
    commit('SET_MENU_CUR', path);
  },

  // user logout
  logout({ commit }) {
    return new Promise((resolve, reject) => {
      commit('SET_TOKEN', '');
      commit('SET_NAVI', []);
      commit('SET_NAVI_CUR', 1);
      commit('SET_MENU_CUR', '');
      commit('SET_USER_INFO', {});
      commit('SET_NAME', '');
      commit('SET_USERID', '');
      commit('SET_USERNAME', '');
      commit('SET_DEPTNAME', '');
      removeToken();
      resetRouter();
      resolve();
    });
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '');
      removeToken();
      resolve();
    });
  }


};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
