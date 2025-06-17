import {initWebpack, __webpack__, webpackInstance} from './webpack/require'

import {Logger} from "./api/logger";
import {Patcher} from "./api/patcher";
import {downloadIcon} from "./components/svgs";

const ChirpCatchLog = new Logger('ChirpCatch');
const GlobalPatcher = new Patcher('GlobalPatcher');

const createButtonContainer = (children) => {
    return webpackInstance.React.createElement("div", {
        style: {
            position: "absolute",
            display: "flex",
            gap: "4px",
            background: 'black',
            borderRadius: '4px',
            left: 10,
            top: 10
        }
    }, children);
}

const createButton = (onClick, icon, backgroundColor = "black") => {
    return webpackInstance.React.createElement("div", {
        style: {
            backgroundColor,
            border: `1px solid hsl(var(--border))`,
            borderColor: "hsl(var(--border))",
            borderRadius: '4px',
            padding: 4,
            cursor: 'pointer',
        },
        onClick,
    }, icon);
}

(async () => {
    ChirpCatchLog.info('Injecting Webpack');
    await initWebpack();
    ChirpCatchLog.success('Injected Webpack');

    unsafeWindow['capi'] = webpackInstance; // Exposed for future pr/development. Feel free :)

    const VideoComponentMaybe = await webpackInstance.waitForSearch('.controls.isPosterShown))')
    const ImageComponent = await webpackInstance.waitForSearch("Image.style.resizeMode")

    const ViewComponent = await webpackInstance.search('["hrefAttrs"')

    GlobalPatcher.patch(ViewComponent[0].exports.Z, 'render', (res, data) => {
        if (data.role === "main") {
            //return [res, Settings({res})];
        }
        return res;
    })

    GlobalPatcher.patch(VideoComponentMaybe[0].exports, 'Z', (res, data) => {
        const list = data.playerState.tracks?.[0]?.variants;
        const videoUrl = list?.[list?.length - 1].src;

        const downloadButton = createButton(
            (e) => {
                e.stopPropagation();
                e.preventDefault();
                window.open(videoUrl, '_blank');
            },
            downloadIcon()
        );

        /*const copyButton = createButton(
            (e) => {
                e.stopPropagation();
                e.preventDefault();
                copyToClipboard(videoUrl);
            },
            copyIcon(),
        );*/

        return [res, createButtonContainer([downloadButton, /*copyButton*/])];
    })

    GlobalPatcher.patch(ImageComponent[0].exports.Z, 'render', (res, data) => {
        if (data.source.includes('profile_images') || data.source.includes('amplify_video_thumb')) return res
        // user pfps use this component and pre video loads.

        const downloadButton = createButton(
            (e) => {
                e.stopPropagation();
                e.preventDefault();
                window.open(data.source, '_blank');
            },
            downloadIcon()
        );

        /*const copyButton = createButton(
            (e) => {
                e.stopPropagation();
                e.preventDefault();
                copyToClipboard(data.source);
            },
            copyIcon(),
        );*/

        return [res, createButtonContainer([downloadButton, /*copyButton*/])]; // Add back when settings exist.
    })
})()