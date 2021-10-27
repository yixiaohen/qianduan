import axios from 'axios';
import { Notification } from 'element-ui';
import store from '@/store';
import { getToken } from '@/utils/auth';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css'; // progress bar style
// create an axios instance
const service = axios.create({
  baseURL: '/api',
  withCredentials: false,
  timeout: 100000
});

const reqList = [];
const cancelArr = [];

/**
 * 中断请求的方法
 * reqList 存放request
 * cancelArr 控制打断该request的函数
 * url 当前发起的请求
 * data 参数
 * intercept 1拦截无论参数是否相同；2 任何时候都不拦截
 */
const stopRepeatRequest = function(url, { data, params, intercept, method }) {
  if (reqList.length > 1) {
    if (intercept !== 2) {
      if (intercept === 1) {
        for (let i = reqList.length - 2; i >= 0; i--) {
          /* 因为响应成功里的url是完成的api路径,请求里的url不是完整体的api路径 */
          if (reqList[i].url === `/api${url}`) {
            cancelArr[i]();
            cancelArr.splice(i, 1);
            reqList.splice(i, 1);
          }
        }
      } else {
        const last = reqList.length - 1;
        for (let i = reqList.length - 2; i >= 0; i--) {
          // 因为响应成功里的url是完成的api路径,请求里的url不是完整体的api路径
          if (reqList[i].url === `/api${url}` && reqList[i].data === JSON.stringify(data) && method === 'post') {
            console.log('post', reqList[i].url);
            cancelArr[last]();
            cancelArr.pop();
            reqList.pop();
            break;
          } else if (reqList[i].url === `/api${url}` && reqList[i].params === JSON.stringify(params) && method === 'get') {
            console.log('get', reqList[i].url);
            cancelArr[last]();
            cancelArr.pop();
            reqList.pop();
          }
        }
      }
    }
  }
};
/**
 * 清空成功响应成功的request，或者出错的request
 * reqList 存放api
 * url 相应从成功的api
 */
const clearRequest = function({ url, data }) {
  for (let i = reqList.length - 1; i >= 0; i--) {
    if (reqList[i].url === url && reqList[i].data === data) {
      reqList.splice(i, 1);
      cancelArr.splice(i, 1);
      break; // 每个request只清除自己，所以 break
    }
  }
};

service.interceptors.request.use(
  config => {
    NProgress.start();
    if (store.getters.token) {
      config.headers['Authorization'] = getToken();
    }
    config['cancelToken'] = new axios.CancelToken(c => {
      cancelArr.push(c);
    });
    let url = config.url.startsWith('/') ? '' : '/';
    url += config.url;
    reqList.push({
      url: `/api${url}`,
      data: JSON.stringify(config.data),
      params: config.params,
      method: config.method
    });

    stopRepeatRequest(url, config);
    return config;
  },
  error => {
    console.log('error', error);
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  response => {
    NProgress.done();
    // 增加延迟，相同请求不得在短时间内重复发送
    setTimeout(() => {
      clearRequest(response.config);
    }, 1000);
    const res = response.data;
    /* 204注册码错误时 */
    // res.code = 401;
    if (res.code === 401) {
      Notification({
        title: '发生错误，请重新登陆',
        dangerouslyUseHTMLString: true,
        message: res.msg || res.code,
        type: 'error'
      });
      this.$router.push(`/login`);
      return;
    }
    if (res.code !== 200 && res.code !== 204) {
      Notification({
        title: '发生错误',
        dangerouslyUseHTMLString: true,
        message: res.msg || `状态值不是200 ${res.code}`,
        type: 'error'
      });
      return Promise.reject(new Error(res.msg || 'Error'));
    } else {
      return res;
    }
  },
  error => {
    console.log('res401', error);

    NProgress.done();
    if (axios.isCancel(error)) {
      console.log('打断请求成功', error);
    }
    return Promise.reject(error);
  }
);
export default service;
