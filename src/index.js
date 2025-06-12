import {initWebpack, __webpack__} from './webpack/require'
import {findInTree, returnRelevantData} from "./api/util";
import {Webpack} from "./webpack";

import {Logger} from "./api/logger";
import {Patcher} from "./api/patcher";

const ChirpCatchLog = new Logger('ChirpCatch');
const GlobalPatcher = new Patcher('GlobalPatcher');

const MediaDownloadButtons = ({medias, webpack}) => {
    if (!medias || medias.length === 0) return null;

    const mediaButtons = medias.map((media, index) => {
        const tweetData = returnRelevantData(media);

        return webpack.React.createElement('button', {
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
                    // TODO: Implement *actual* downloading.
                    // TODO: Currently it just opens in another window.
                    open(tweetData, '_blank');
                }
            }, webpack.React.createElement('svg', {
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
            ])
        )
            ;
    });

    return webpack.React.createElement('div', {
        key: 'balls',
        style: {
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
            padding: '10px',
            justifyContent: 'center'
        }
    }, ...mediaButtons);
};

(async () => {
    ChirpCatchLog.info('Injecting Webpack');
    await initWebpack();
    ChirpCatchLog.success('Injected Webpack');

    const webpack = new Webpack();

    unsafeWindow['capi'] = webpack;

    const TweetComponent = await webpack.waitForSearch(`["hrefAttrs","onLayout",`)

    GlobalPatcher.patch(TweetComponent[0].exports.Z, 'render', (original, arg1, arg2) => {
        if (arg1.testID === "tweet") {
            const dataStart = arg1.children[0][1].props.children;
            const data = findInTree(dataStart, x => x?.color || x?.tweet || x?.entities, {walkable: ['props', 'children', 'entities', 'media', 'tweet']});
            const medias = data.entities.media || [];
            const extendedMedia = data.extended_entities?.media || [];
            const allMedias = [...medias, ...extendedMedia];

            if (dataStart.find(x => x?.key === "balls")) return;

            const buttonContainer = MediaDownloadButtons({
                medias: allMedias,
                webpack
            });

            if (buttonContainer) {
                dataStart.push(buttonContainer);
            }
        }
    });
})();