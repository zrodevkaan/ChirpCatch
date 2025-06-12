/**
 * Search for a value in a nested object tree
 * From BetterDiscord Utils source
 * @param {*} tree - The object tree to search in
 * @param {string|Function} searchFilter - String property name or function to test
 * @param {Object} options - Search options
 * @param {Array} options.walkable - Properties to walk through
 * @param {Array} options.ignore - Properties to ignore
 * @returns {*} Found value or undefined
 */
export function findInTree(tree, searchFilter, {walkable = null, ignore = []} = {}) {
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

export function returnRelevantData(media) {
    switch (media.type) {
        case 'video':
            // Return highest quality video variant
            return media.video_info.variants[media.video_info.variants.length - 1].url;
        case 'photo':
            // Return static image URL
            return media.media_url_https;
        default:
            return null;
    }
}