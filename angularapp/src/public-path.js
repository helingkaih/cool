import { environment } from 'src/environments/environment';
if (window.__POWERED_BY_QIANKUN__) {
  // eslint-disable-next-line no-undef
  // 必须，服务器开启微应用时会用到,更改请求资源的路径
  if (environment.production) {
    // 服务器上需要再加路径
    __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__ + '/angularapp/';
  } else {
    __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
  }
}