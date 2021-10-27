import { constantRoutes } from '@/router';
import Layout from '@/layout';

/**
 * 递归创建动态路由
 * @param {Array} menus 后台返回的用户拥有的菜单权限集合
 */
export function recursionRouter(menus) {
  const dynamicRouters = [];
  menus.forEach((menu, index) => {
    const router = {
      meta: {}
    };
    if (menu.ParentID === 0) {
      router.path = `/${menu.MenuPath}`;
      router.component = Layout;
      router.alwaysShow = true;
      router.meta.title = menu.MemuTitle;
      router.redirect = `/${menu.Component}`;
      router.meta.icon = menu.MenuIcon;
      router.meta.MenuID = menu.MenuID;
      router.meta.ParentID = menu.ParentID;
    } else {
      router.path = menu.MenuPath;
      router.component = () => import(`@/views/${menu.Component}`);
      router.name = menu.MenuName;
      router.meta.title = menu.MemuTitle;
      router.meta.icon = menu.MenuIcon;
      router.meta.MenuID = menu.MenuID;
      router.meta.ParentID = menu.ParentID;
      // router.redirect = `/${menu.Component}`
    }

    // 有子路由
    if (menu.Children && menu.Children.length > 0) {
      router.children = recursionRouter(menu.Children);
    }
    dynamicRouters.push(router);
  });
  return dynamicRouters;
}

const state = {
  routes: [], // 完整路由链( 动态路由加上首页右上角几个)
  addRoutes: [], // 动态路由链 （左边导航菜单上所有路由）
  menus: [] // 左边导航菜单
};

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes;
    state.routes = constantRoutes.concat(routes);
  },
  SET_MENUS: (state, menus) => {
    state.menus = menus;
  }
};

const actions = {
  generateRoutes({ commit }, menus) {
    return new Promise(resolve => {
      const errorRouter = { path: '*', redirect: '/error/404', hidden: true };
      const asyncRoutes = recursionRouter(menus).concat(errorRouter);
      commit('SET_ROUTES', asyncRoutes);
      commit('SET_MENUS', menus);
      resolve(asyncRoutes);
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
