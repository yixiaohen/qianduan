import axios from 'axios';
import { Notification } from 'element-ui';
import store from '@/store';
import { getToken } from '@/utils/auth';
// create an axios instance
const service = axios.create({
  baseURL: '/api',
  withCredentials: false,
  timeout: 100000
});

service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['Authorization'] = getToken();
    }

    return config;
  },
  error => {
    console.log('error', error);
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  response => {
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
    return Promise.reject(error);
  }
);
export default service;
