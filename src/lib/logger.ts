/**
 * Conditional logger that only outputs in development mode.
 * In production, logs are silenced to avoid exposing sensitive information.
 */

const isDev = process.env.NODE_ENV === 'development';

export const logger = {
    log: (...args: unknown[]) => {
        if (isDev) console.log('[DEV]', ...args);
    },
    warn: (...args: unknown[]) => {
        if (isDev) console.warn('[DEV]', ...args);
    },
    error: (...args: unknown[]) => {
        // Errors are always logged (important for debugging)
        console.error(...args);
    },
    info: (...args: unknown[]) => {
        if (isDev) console.info('[DEV]', ...args);
    },
    debug: (...args: unknown[]) => {
        if (isDev) console.debug('[DEV]', ...args);
    },
};

export default logger;
