const COLORS = {
    reset: '\x1b[0m',
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    brightBlack: '\x1b[90m',
    brightRed: '\x1b[91m',
    brightGreen: '\x1b[92m',
    brightYellow: '\x1b[93m',
    brightBlue: '\x1b[94m',
    brightMagenta: '\x1b[95m',
    brightCyan: '\x1b[96m',
    brightWhite: '\x1b[97m'
};

export class Logger {
    constructor(name) {
        this.name = name;
    }

    log(color, message) {
        const colorCode = COLORS[color] || COLORS.reset;
        console.log(`${colorCode}[${this.name}] ${message}${COLORS.reset}`);
    }

    info(message) {
        this.log('brightBlue', message);
    }

    success(message) {
        this.log('brightGreen', message);
    }

    warn(message) {
        this.log('brightYellow', message);
    }

    error(message) {
        this.log('brightRed', message);
    }

    debug(message) {
        this.log('brightMagenta', message);
    }
}