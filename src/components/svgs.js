import {webpackInstance} from "../webpack/require";

export const downloadIcon = () => {
    return webpackInstance.React.createElement('div', {title: 'Download'}, webpackInstance.React.createElement('svg', {
        width: '16',
        height: '16',
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: '2',
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    }, [
        webpackInstance.React.createElement('path', {
            key: 'arrow',
            d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4'
        }),
        webpackInstance.React.createElement('polyline', {
            key: 'line',
            points: '7,10 12,15 17,10'
        }),
        webpackInstance.React.createElement('line', {
            key: 'stem',
            x1: '12',
            y1: '15',
            x2: '12',
            y2: '3'
        })
    ]))
}

export const copyIcon = () => {
    return webpackInstance.React.createElement('div', {title: 'Copy Link'}, webpackInstance.React.createElement('svg', {
        width: '16',
        height: '16',
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: '2',
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    }, [
        webpackInstance.React.createElement('rect', {
            key: 'rect1',
            x: '9',
            y: '9',
            width: '13',
            height: '13',
            rx: '2',
            ry: '2'
        }),
        webpackInstance.React.createElement('path', {
            key: 'path1',
            d: 'M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1'
        })
    ]))
}