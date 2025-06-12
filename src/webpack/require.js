import {Webpack} from "./index";

export let __webpack__;

export async function initWebpack() {
    return new Promise((resolve) => {
        (unsafeWindow.webpackChunk_twitter_responsive_web ??= []).push([{some: () => true}, {}, r => {
            //const yes = new Webpack(r);
            //unsafeWindow['api'] = yes;
            __webpack__ = r;

            r.d = (target, exports) => { // thanks doggy :)
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

            resolve(r)
            //resolve(yes);
        }]);
    });
}