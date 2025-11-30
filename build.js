import { build } from 'esbuild';

const USERSCRIPT_HEADER = `// ==UserScript==
// @name         ChirpCatch
// @version      1.0.3
// @description  Download any Media from any tweet.
// @namespace    https://twitter.com/*
// @namespace    https://x.com/*
// @match        https://twitter.com/*
// @match        https://x.com/*
// @match        https://pro.twitter.com/*
// @match        https://pro.x.com/*
// @grant        GM.xmlHttpRequest
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// ==/UserScript==
`;
const OUTPUT_FILE = `./dist/chirpcatch.user.js`;

async function buildUserscript() {
    try {
        await build({
            entryPoints: ['./src/index.js'],
            bundle: true,
            outfile: OUTPUT_FILE,
            format: 'cjs',
            banner: {
                js: USERSCRIPT_HEADER,
            },
            loader: {
                '.js': 'jsx',
                '.jsx': 'jsx',
                '.tsx': 'tsx',
            },
            logLevel: 'info',
            minify: false,
        });

        console.log('succeeded in the build!');
    } catch (e) {
        console.error('Failed? Report this bug!', e);
    }
}

buildUserscript();
