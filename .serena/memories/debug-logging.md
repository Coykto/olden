# Debug Logging System

## Overview
The codebase uses a global `Debug` utility for conditional logging. Debug output is **disabled by default** to keep the browser console clean during normal use.

## Enabling/Disabling
In the browser console:
```javascript
Debug.enabled = true;   // Enable debug output
Debug.enabled = false;  // Disable debug output (default)
```

## Debug Utility Definition
Located in `/hero_builder/templates/hero_builder/base.html`:
```javascript
window.Debug = {
    enabled: false,
    log: function(...args) {
        if (this.enabled) console.log(...args);
    },
    warn: function(...args) {
        if (this.enabled) console.warn(...args);
    },
    info: function(...args) {
        if (this.enabled) console.info(...args);
    },
    error: function(...args) {
        // Errors always print
        console.error(...args);
    }
};
```

## Usage Patterns

### In inline scripts (e.g., _scripts.html)
```javascript
Debug.log('[SpellBookManager] Loading spells');
Debug.warn('[ArmyManager] Description fallback');
```

### In standalone JS files (e.g., description-runtime.js)
Check for availability since Debug is defined in base.html:
```javascript
if (typeof Debug !== 'undefined') Debug.warn('Fallback message');
```

## Components Using Debug

- `ItemSetManager` - Item set loading
- `SpellBookManager` - Spell loading, equipping, upgrading
- `ArmyManager` - Army initialization, unit loading
- `EquipmentManager` - Description resolution fallbacks
- `DescriptionRuntime` - Function resolution fallbacks

## Key Points

1. **Debug messages are silent by default** - No console noise during normal use
2. **`console.error` still works normally** - Actual errors always print
3. **Component prefixes** - All messages include `[ComponentName]` for filtering
4. **Easy to toggle** - Just `Debug.enabled = true` in browser console

## When to Use

- Use `Debug.log()` for informational messages (loaded X items, performing action)
- Use `Debug.warn()` for expected fallback conditions (function not found, using template)
- Use `console.error()` for actual errors that need attention
