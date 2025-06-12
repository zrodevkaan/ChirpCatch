/**
 * Patcher class for managing function patches
 * Allows patching and unpatching of object methods
 */
export class Patcher {
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
                const afterResult = afterFunc.call(this, result, ...args);

                if (afterResult !== undefined) {
                    return afterResult;
                }
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