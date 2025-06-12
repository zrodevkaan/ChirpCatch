// ==UserScript==
// @name         ChirpCatch
// @version      1.0.1
// @description  Download any Media from any tweet.
// @namespace    https://twitter.com/*
// @namespace    https://x.com/*
// @match        https://twitter.com/*
// @match        https://x.com/*
// @match        https://pro.twitter.com/*
// @match        https://pro.x.com/*
// @grant        GM.xmlHttpRequest
// @run-at document-start
// ==/UserScript==

let Webpack;

class Patcher {
    constructor() {
        this.patches = new Map();
    }

    patch(obj, methodName, afterFunc) {
        const key = `${obj.constructor.name}:${methodName}`;
        if (!this.patches.has(key)) {
            this.patches.set(key, {obj, methodName, original: obj[methodName]});
        }
        const original = obj[methodName];
        obj[methodName] = function (...args) {
            const result = original.apply(this, args);

            try {
                afterFunc.call(this, result, ...args);
            } catch (error) {
                console.error('Error in after patch:', error);
            }

            return result;
        };
    }

    unpatch(obj, methodName) {
        const key = `${obj.constructor.name}:${methodName}`;
        const patch = this.patches.get(key);
        if (patch) {
            obj[methodName] = patch.original;
            this.patches.delete(key);
        }
    }

    unpatchAll() {
        for (const patch of this.patches.values()) {
            patch.obj[patch.methodName] = patch.original;
        }
        this.patches.clear();
    }
}

class ModuleExplorer {
    constructor(webpackRequire) {
        this.require = webpackRequire;
        this.modules = webpackRequire.c;
    }

    get React() {
        if (this._react) return this._react;

        for (const id in this.modules) {
            if (this.modules[id].exports?.createElement) {
                this._react = this.modules[id].exports;
                break;
            }
        }
        return this._react;
    }

    search(strings) {
        const searchTerms = Array.isArray(strings) ? strings : [strings];
        const results = [];
        for (const [id, mod] of Object.entries(this.require.m)) {
            try {
                const content = mod.toString().toLowerCase();
                if (searchTerms.some(term => content.includes(term.toLowerCase()))) {
                    results.push({id, mod, exports: this.modules[id]?.exports});
                }
            } catch (e) {
            }
        }
        return results;
    }
}

// From BetterDiscord Utils source.
function findInTree(tree, searchFilter, {walkable = null, ignore = []}) {
    if (typeof searchFilter === "string") {
        if (tree?.hasOwnProperty(searchFilter)) return tree[searchFilter];
    } else if (searchFilter(tree)) {
        return tree;
    }

    if (typeof tree !== "object" || tree == null) return undefined;

    let tempReturn;
    if (tree instanceof Array) {
        for (const value of tree) {
            tempReturn = findInTree(value, searchFilter, {walkable, ignore});
            if (typeof tempReturn != "undefined") return tempReturn;
        }
    } else {
        const toWalk = walkable == null ? Object.keys(tree) : walkable;
        for (const key of toWalk) {
            if (typeof (tree[key]) == "undefined" || ignore.includes(key)) continue;
            tempReturn = findInTree(tree[key], searchFilter, {walkable, ignore});
            if (typeof tempReturn != "undefined") return tempReturn;
        }
    }
    return tempReturn;
}

function returnRelevantData(media) {
    switch (media.type) {
        case 'video':
            return media.video_info.variants[media.video_info.variants.length - 1].url; // Highest Quality Video
        case 'photo':
            return media.media_url_https // Static Image
    }
}

const patcher = new Patcher();

function waitForReact() {
    return new Promise((resolve) => {
        if (typeof Webpack?.React !== 'undefined') {
            resolve();
            return;
        }

        const checkInterval = setInterval(() => {
            if (typeof Webpack?.React !== 'undefined') {
                clearInterval(checkInterval);
                resolve();
            }
        }, 100);
    });
}

(async function () {
    'use strict';
    const window = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;

    (window.webpackChunk_twitter_responsive_web ??= []).push([{some: () => true}, {}, r => {
        Webpack = new ModuleExplorer(r)
        r.d = (target, exports) => {
            for (const key in exports) {
                if (!Reflect.has(exports, key)) continue;

                Object.defineProperty(target, key, {
                    get() {
                        return exports[key]()
                    },
                    set(v) {
                        exports[key] = () => v;
                    },
                    enumerable: true,
                    configurable: true
                });
            }
        };

        window.Webpack = Webpack;
    }]);

    await waitForReact();

    const downloadIcon = Webpack.React.createElement('svg', {
        width: '12',
        height: '12',
        viewBox: '0 0 12 12',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: '2',
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    }, [
        Webpack.React.createElement('path', {
            key: 'arrow',
            d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4'
        }),
        Webpack.React.createElement('polyline', {
            key: 'line',
            points: '7,10 12,15 17,10'
        }),
        Webpack.React.createElement('line', {
            key: 'stem',
            x1: '12',
            y1: '15',
            x2: '12',
            y2: '3'
        })
    ])

    /*patcher.patch(window.Webpack.search('/search-advanced"===')[0].exports, 'Q', (origin, arg1, arg2) => {
        // const icons = Object.values(Webpack.modules).find(x => x.exports?.IconBarChartHorizontalStroke).exports
        const newData = {
            ...origin[1],
            label: 'ChirpCatch',
            renderIcon: () => downloadIcon,
            path: null,
        }
        origin.push(newData)
        console.log(origin)
    })*/ /* Damn patch hell. */

    patcher.patch(Webpack.search(`["hrefAttrs","onLayout",`)[0].exports.Z, 'render', (original, arg1, arg2) => {
        if (arg1.testID === "tweet") {
            const dataStart = arg1.children[0][1].props.children
            const data = findInTree(dataStart, x => x?.color || x?.tweet || x?.entities, {walkable: ['props', 'children', 'entities', 'media', 'tweet']});
            const medias = data.entities.media

            const mediaButtons = medias?.map((media, index) => {
                const tweetData = returnRelevantData(media)

                return Webpack.React.createElement('button', {
                    key: index,
                    title: `Download ${media.type} ${index + 1}`,
                    style: {
                        borderColor: 'hsl(var(--border))',
                        borderWidth: '2px',
                        borderStyle: 'solid',
                        borderRadius: '10px',
                        padding: '4px 8px',
                        color: 'rgb(113, 118, 123)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'transparent'
                    },
                    onClick: () => {
                        open(tweetData, '_blank');
                    }
                }, downloadIcon)
            })

            if (mediaButtons) {
                const buttonContainer = Webpack.React.createElement('div', {
                    style: {
                        display: 'flex',
                        gap: '8px',
                        alignItems: 'center',
                        padding: '10px',
                        justifyContent: 'center'
                    }
                }, ...mediaButtons)

                dataStart.push(buttonContainer)
            }
        }
    });

    //setTimeout(() => {patcher.patch(Webpack.search('videoComponent')[0].exports.default,'render', (a,b,c) => console.log(a,b,c))}, 1000)
})()