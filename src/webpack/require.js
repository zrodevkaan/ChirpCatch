import { Webpack } from "./index";

export let __webpack__;

let _webpackInstance;

export const webpackInstance = new Proxy({}, {
    get(target, prop) {
        if (!_webpackInstance) {
            throw new Error('Webpack instance not initialized. Call initWebpack() first.');
        }
        return _webpackInstance[prop];
    },
    set(target, prop, value) {
        if (!_webpackInstance) {
            throw new Error('Webpack instance not initialized. Call initWebpack() first.');
        }
        _webpackInstance[prop] = value;
        return true;
    }
});

export async function initWebpack() {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      const wp = unsafeWindow.webpackChunk_twitter_responsive_web;
      if (wp) {
        let webpackRequire
        wp.push([[Symbol("Arven")], {}, (e) => {
          webpackRequire = e;
          return e;
        }]);
        
        clearInterval(interval);

        __webpack__ = webpackRequire;
        webpackRequire.d = (target, exports) => {
          for (const key in exports) {
            if (!Reflect.has(exports, key)) continue;
            Object.defineProperty(target, key, {
              get() {
                return exports[key]();
              },
              set(v) {
                exports[key] = () => v;
              },
              enumerable: true,
              configurable: true
            });
          }
        };
        _webpackInstance = new Webpack();
        resolve(webpackRequire);
      }
    }, 10);
  });
}