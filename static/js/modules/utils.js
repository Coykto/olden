/**
 * Utility functions shared across modules
 */

/**
 * Build URL with optional base path prefix.
 * Uses window.buildUrl if available (from Django template), otherwise returns path as-is.
 * @param {string} path - The URL path
 * @returns {string} The complete URL
 */
export function buildUrl(path) {
    if (typeof window !== 'undefined' && typeof window.buildUrl === 'function') {
        return window.buildUrl(path);
    }
    return path;
}

/**
 * Debug logging utility - uses global Debug if available
 */
export const Debug = {
    log(...args) {
        if (typeof window !== 'undefined' && window.Debug) {
            window.Debug.log(...args);
        }
    },
    warn(...args) {
        if (typeof window !== 'undefined' && window.Debug) {
            window.Debug.warn(...args);
        }
    },
    info(...args) {
        if (typeof window !== 'undefined' && window.Debug) {
            window.Debug.info(...args);
        }
    },
    error(...args) {
        console.error(...args);
    }
};

/**
 * Get i18n translation with fallback
 * @param {string} category - The i18n category (e.g., 'ui', 'slotNames')
 * @param {string} key - The translation key
 * @param {string} fallback - Fallback value if translation not found
 * @returns {string} The translated string or fallback
 */
export function t(category, key, fallback) {
    if (typeof window !== 'undefined' && window.i18n && window.i18n[category]) {
        return window.i18n[category][key] || fallback;
    }
    return fallback;
}
