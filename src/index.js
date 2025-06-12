import {initWebpack, __webpack__} from './webpack/require'
import {Webpack} from "./webpack";

import {Logger} from "./api/logger";
import {Patcher} from "./api/patcher";

const ChirpCatchLog = new Logger('ChirpCatch');
const GlobalPatcher = new Patcher('GlobalPatcher');

(async () => {
    ChirpCatchLog.info('Injecting Webpack');
    await initWebpack();
    ChirpCatchLog.success('Injected Webpack');

    const webpack = new Webpack();

    unsafeWindow['capi'] = webpack;

    const VideoComponentMaybe = await webpack.waitForSearch('.controls.isPosterShown))')
    const ImageComponent = await webpack.waitForSearch("Image.style.resizeMode")

    GlobalPatcher.patch(VideoComponentMaybe[0].exports, 'Z', (res, data) => {
        return [res, webpack.React.createElement("div", {
            style: {
                position: "absolute",
                backgroundColor: "black",
                border: `1 solid hsl(var(--border))`,
                borderColor: "hsl(var(--border))",
                borderRadius: '4px',
                borderWidth: '1px',
                padding: 4,
                left: 10,
                top: 10
            },
            onClick: (e) => {
                e.stopPropagation()
                e.preventDefault()
                const list = data.playerState.tracks[0].variants
                window.open(list[list.length - 1].src, '_blank'); // Highest Quality Video.
            }
        }, webpack.React.createElement('div', {title: 'Download'}, webpack.React.createElement('svg', {
            width: '16',
            height: '16',
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            strokeWidth: '2',
            strokeLinecap: 'round',
            strokeLinejoin: 'round'
        }, [
            webpack.React.createElement('path', {
                key: 'arrow',
                d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4'
            }),
            webpack.React.createElement('polyline', {
                key: 'line',
                points: '7,10 12,15 17,10'
            }),
            webpack.React.createElement('line', {
                key: 'stem',
                x1: '12',
                y1: '15',
                x2: '12',
                y2: '3'
            })
        ])))]
    })

    GlobalPatcher.patch(ImageComponent[0].exports.Z, 'render', (res, data) => {
        if (data.source.includes('profile_images') || data.source.includes('amplify_video_thumb')) return res

        return [res, webpack.React.createElement("div", {
            style: {
                position: "absolute",
                backgroundColor: "black",
                border: `1 solid hsl(var(--border))`,
                borderColor: "hsl(var(--border))",
                borderRadius: '4px',
                borderWidth: '1px',
                padding: 4,
                left: 10,
                top: 10
            },
            onClick: (e) => {
                e.stopPropagation()
                e.preventDefault()
                window.open(data.source, '_blank');
            }
        }, webpack.React.createElement('div', {title: 'Download'}, webpack.React.createElement('svg', {
            width: '16',
            height: '16',
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            strokeWidth: '2',
            strokeLinecap: 'round',
            strokeLinejoin: 'round'
        }, [
            webpack.React.createElement('path', {
                key: 'arrow',
                d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4'
            }),
            webpack.React.createElement('polyline', {
                key: 'line',
                points: '7,10 12,15 17,10'
            }),
            webpack.React.createElement('line', {
                key: 'stem',
                x1: '12',
                y1: '15',
                x2: '12',
                y2: '3'
            })
        ])))]
    })
})();