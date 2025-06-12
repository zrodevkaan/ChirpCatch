import {__webpack__} from "./require";

export class Webpack {
    constructor() {
        this.modules = __webpack__.c
        this.require = __webpack__
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

    async waitForSearch(strings, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const checkInterval = 100;
            let elapsed = 0;

            const check = () => {
                const results = this.search(strings);
                if (results.length > 0) {
                    resolve(results);
                    return;
                }

                elapsed += checkInterval;
                if (elapsed >= timeout) {
                    reject(new Error('Search timeout'));
                    return;
                }

                setTimeout(check, checkInterval);
            };

            check();
        });
    }

    find(filters) {
        const results = [];
        for (const [id, mod] of Object.entries(this.require.m)) {
            try {
                const moduleData = {
                    id,
                    mod,
                    exports: this.modules[id]?.exports,
                    content: mod.toString()
                };

                const matches = Object.entries(filters).every(([key, filter]) => {
                    if (typeof filter === 'function') {
                        return filter(moduleData[key], moduleData);
                    }
                    if (typeof filter === 'string') {
                        return moduleData[key]?.toString().includes(filter);
                    }
                    if (filter instanceof RegExp) {
                        return filter.test(moduleData[key]?.toString());
                    }
                    return moduleData[key] === filter;
                });

                if (matches) {
                    results.push(moduleData);
                }
            } catch (e) {
            }
        }
        return results;
    }
}