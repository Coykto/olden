/**
 * Description Runtime - Support functions for transpiled description functions
 *
 * Provides:
 * - Value formatters for different return types
 * - Path-based property accessor
 */

// @ts-nocheck
/* eslint-disable */

const DescriptionRuntime = {
  /**
   * Wrapper function for description functions.
   * Previously did memoization, now just passes through directly.
   * @param {Function} fn - The function to wrap
   * @returns {Function} The same function (no caching)
   */
  memoize(fn) {
    // No memoization - just return the function as-is
    // Caching was causing issues with stale hero stats
    return fn;
  },

  /**
   * Get a value from an object by path.
   * Supports dot notation and bracket notation: "config.bonuses[0].parameters[1]"
   * @param {any} obj - The object to traverse
   * @param {string} path - The path to the value
   * @returns {any} The value at the path, or null if not found
   */
  get(obj, path) {
    if (obj == null || !path) return null;

    // Split path by . and [] notation
    const parts = path.replace(/\[(\d+)\]/g, '.$1').split('.');

    let current = obj;
    for (const part of parts) {
      if (current == null) return null;
      current = current[part];
    }

    return current ?? null;
  },

  // ===== Formatters =====

  /**
   * Format as modifier integer (+X or -X)
   */
  formatModInt(value) {
    const num = Math.round(Number(value) || 0);
    return num >= 0 ? `+${num}` : `${num}`;
  },

  /**
   * Format as modifier percent - values are multipliers (3.0 = 300%)
   * Returns just the number - templates already include % sign
   */
  formatModPercentNumeric(value) {
    let num = Number(value) || 0;
    // Values are multipliers: 3.0 = 300%, 0.15 = 15%
    num = num * 100;
    num = Math.round(num);
    return String(num);
  },

  /**
   * Format as modifier float percent with one decimal
   * Returns just the number - templates already include % sign
   */
  formatModFloatPercentF1(value) {
    let num = Number(value) || 0;
    // Values are multipliers: 3.0 = 300%, 0.15 = 15%
    num = num * 100;
    return num.toFixed(1);
  },

  /**
   * Format as plain string
   */
  formatString(value) {
    if (value == null) return '';
    return String(value);
  },

  /**
   * Format as integer
   */
  formatInt(value) {
    return String(Math.round(Number(value) || 0));
  },

  /**
   * Format as float
   */
  formatFloat(value) {
    const num = Number(value) || 0;
    // Remove trailing zeros
    return num.toString();
  },

  /**
   * Format as percentage (without +/-)
   */
  formatPercent(value) {
    let num = Number(value) || 0;
    // Values are multipliers: 3.0 = 300%, 0.15 = 15%
    num = num * 100;
    return `${Math.round(num)}%`;
  },

  /**
   * Format as modifier percent (with +/-)
   */
  formatModPercent(value) {
    let num = Number(value) || 0;
    // Values are multipliers: 3.0 = 300%, 0.15 = 15%
    num = num * 100;
    num = Math.round(num);
    return num >= 0 ? `+${num}%` : `${num}%`;
  },

  /**
   * Format description by replacing placeholders with computed values.
   * @param {string} template - Template string with {0}, {1}, etc. placeholders
   * @param {Array<string>} argFunctions - Function names from Lang/args/*.json (supports | fallback syntax)
   * @param {Object} ctx - Context object for the description functions
   * @returns {string} Formatted description
   */
  formatDescription(template, argFunctions, ctx) {
    if (!template) return '';

    // Helper to convert newlines to HTML line breaks
    const convertNewlines = (text) => text
      .replace(/\\u000A/g, '<br>')
      .replace(/\n/g, '<br>');

    if (!argFunctions || argFunctions.length === 0) return convertNewlines(template);

    // Match all placeholders {N}
    const result = template.replace(/\{(\d+)\}/g, (placeholder, index, offset) => {
      const funcSpec = argFunctions[parseInt(index, 10)];
      if (!funcSpec) {
        console.error(`[DescriptionRuntime] Placeholder ${placeholder}: No function specified in description_args array (index ${index})`);
        return placeholder;
      }

      // Check what character precedes the placeholder to handle double-sign issue
      // Only dedupe signs when preceded by space (mathematical context like "+ {0}")
      const charBefore = offset > 0 ? template.charAt(offset - 1) : '';
      const charBeforeThat = offset > 1 ? template.charAt(offset - 2) : '';
      const isStandaloneSign = (charBefore === '+' || charBefore === '-' || charBefore === '–') &&
                              (charBeforeThat === '' || /[\s(,]/.test(charBeforeThat));

      // Support fallback syntax: "primaryFunc|fallbackFunc"
      const funcNames = funcSpec.split('|');

      for (const funcName of funcNames) {
        const trimmedName = funcName.trim();
        if (!trimmedName) continue;

        const func = typeof DescriptionFunctions !== 'undefined' ? DescriptionFunctions[trimmedName] : null;
        if (!func) {
          // Only warn for fallbacks, error for last option
          if (funcNames.indexOf(funcName) < funcNames.length - 1) {
            if (typeof Debug !== 'undefined') Debug.warn(`[DescriptionRuntime] Placeholder ${placeholder}: Function "${trimmedName}" not found, trying fallback...`);
          }
          continue;
        }

        try {
          let result = func(ctx);
          if (result != null) {
            result = String(result);
            const resultSign = result.charAt(0);

            // Handle double-sign issue in two cases:
            // 1. Standalone sign: template has " +{0}" and result is "+N" -> strip result's +
            // 2. Compound word: template has "tier-{0}" and result is "+N" -> strip result's +
            if (result.length > 0 && (resultSign === '+' || resultSign === '-' || resultSign === '–')) {
              // Case 1: Standalone mathematical sign (e.g., "+{0} Defence")
              if (isStandaloneSign) {
                if ((charBefore === '+' && resultSign === '+') ||
                    ((charBefore === '-' || charBefore === '–') && (resultSign === '-' || resultSign === '–'))) {
                  return result.substring(1);
                }
              }
              // Case 2: Hyphen as part of compound word (e.g., "tier-{0}")
              // Strip the + from result since hyphen already serves as separator
              else if ((charBefore === '-' || charBefore === '–' || charBefore === '‑') && resultSign === '+') {
                return result.substring(1);
              }
            }
            return result;
          }
          // Result is null, try fallback
          if (typeof Debug !== 'undefined') Debug.warn(`[DescriptionRuntime] Placeholder ${placeholder}: Function "${trimmedName}" returned null, trying fallback...`);
        } catch (e) {
          console.error(`[DescriptionRuntime] Placeholder ${placeholder}: Error in "${trimmedName}": ${e.message}`);
          // Try fallback on error
        }
      }

      // All functions failed
      const triedFuncs = funcNames.map(f => `"${f.trim()}"`).join(', ');
      console.error(`[DescriptionRuntime] Placeholder ${placeholder}: All functions failed. Tried: ${triedFuncs}. Context keys: ${ctx ? Object.keys(ctx).join(', ') : 'null'}`);
      return placeholder;
    });

    return convertNewlines(result);
  }
};

// Export for use in browser and Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DescriptionRuntime };
}

// Expose to window for ES6 modules
if (typeof window !== 'undefined') {
  window.DescriptionRuntime = DescriptionRuntime;
}
