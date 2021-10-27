import Vue from 'vue';
import Router from 'vue-router';
/* Layout */
import Layout from '@/layout';

Vue.use(Router);

/**
 * Note: 子菜单只在路由子菜单时出现。长度>=1
 *
 * hidden: true                   如果设置为真，则项目将不会显示在边栏中（默认为假）
 * alwaysShow: true               如果设定为真，则总是会显示根菜单
 *                                如果不经常显示，当项目有多个子路径，
 *                                它将成为嵌套模式，否则不显示根菜单
 * redirect: noRedirect           如果设置非重定向将不会重定向在面包屑
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    控制页面角色（可以设置多个角色）
    title: 'title'               名称显示在边栏和面包屑（推荐设置）
    icon: 'svg-name'             图标显示在边栏中
    noCache: true                如果设置为真，页面将不会被缓存（默认为假）
    affix: true                  如果设置为“真”，则标记将会在标签视图中附加
    activeMenu: '/example/list'  如果设置路径，侧边栏将突出显示您设置的路径
  }
 */

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/error',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '404',
        component: () => import('@/views/error/404')
      }
    ]
  },
  {
    path: '/SelectCatalog',
    component: () => import('@/views/SelectCatalog/index'),
    hidden: true
  },
  {
    path: '/down',
    component: () => import('@/views/down/index'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    hidden: true,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '首页', icon: 'dashboard', affix: true }
      },
      {
        name: 'Search',
        path: '/search',
        component: () => import('@/views/search/index'),
        hidden: true,
        meta: { title: '分类查询', icon: 'dashboard' }
      },
      {
        name: 'institution',
        path: 'institution',
        component: () => import('@/views/institution/index'),
        hidden: true,
        meta: { title: '制度管理', icon: 'dashboard' }
      },
      {
        name: 'trainSign',
        path: '/example-train/traning/trainSign',
        component: () => import('@/views/ExampleTrain/traning/trainSign'),
        hidden: true,
        meta: { title: '培训签到', icon: 'dashboard' }
      },
      {
        name: 'meetingSign',
        path: '/managementMeetings/meetingSign',
        component: () => import('@/views/managementMeetings/meetingSign'),
        hidden: true,
        meta: { title: '会议签到', icon: 'dashboard' }
      }
    ]
  }
  // 404 page must be placed at the end !!!
];

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    mode: 'hash',
    base: process.env.BASE_URL,
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  });

const router = createRouter();

export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
