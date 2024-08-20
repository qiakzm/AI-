import Cookies from 'js-cookie';

const cookies = new Cookies();

const setCookie = (name, value, options) => {
  return Cookies.set(name, value, options);
};

const getCookie = (name) => {
  return cookies.get(name);
};

const removeCookie = (name) => {
  return Cookies.remove(name);
};

export { setCookie, getCookie, removeCookie };
