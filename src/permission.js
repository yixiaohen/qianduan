import router from './router';
import store from './store';
import { Message } from 'element-ui';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css'; // progress bar style
import { getToken } from '@/utils/auth'; // get token from cookie

NProgress.configure({ showSpinner: false }); // NProgress Configuration

const whiteList = ['/login']; // no redirect whitelist

function getPageTitle(pageTitle) {
  let title = '天智';
  if (store.state.app.iniPara.title) {
    title += store.state.app.iniPara.title;
  } else {
    title += '智慧医院综合质量监管平台';
  }
  if (pageTitle) {
    return `${title} - ${pageTitle}`;
  }
  return `${title}`;
}

router.beforeEach(async(to, from, next) => {
  NProgress.start();

  document.title = getPageTitle(to.meta.title);

  const hasToken = getToken();
  if (hasToken) {
    if (to.path === '/login') {
      next({ path: '/' });
      NProgress.done();
    } else {
      if (store.getters.userID) {
        next();
      } else {
        try {
          const data = await store.dispatch('user/getInfo', to.path.substr(to.path.lastIndexOf('/') + 1));
          const res = await store.dispatch('permission/generateRoutes', data.Menus);
          router.addRoutes(res);
          await store.dispatch('app/getIni');
          next({ ...to, replace: true });
        } catch (error) {
          await store.dispatch('user/resetToken');
          Message.error(error || 'Has Error');
          next('/login');
          NProgress.done();
        }
      }
    }
    if (to.path !== '/error/404') await store.dispatch('user/setMenuCur', to.path);
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      await store.dispatch('app/getIni');
      next();
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next('/login');
      NProgress.done();
    }
  }
});

router.afterEach((to) => {
  // finish progress bar
  NProgress.done();
});
