import VueCookies from 'vue-cookies';

const TokenKey = 'Token';

export function getToken() {
  return VueCookies.get(TokenKey);
  // return sessionStorage.getItem(TokenKey)
}

export function setToken(token) {
  return VueCookies.set(TokenKey, token, '28800s');
  // return sessionStorage.setItem(TokenKey, token)
}

export function removeToken() {
  return VueCookies.remove(TokenKey);
  // return sessionStorage.removeItem(TokenKey);
}
