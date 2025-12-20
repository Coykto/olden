# Tooltip System - Implementation Details & Lessons Learned

## Overview

The tooltip system (`/static/js/tooltip.js`) provides hover tooltips with support for:
- Configurable placement with automatic boundary detection
- Gap-free hover using an invisible "bridge" element
- **Nested tooltips** (e.g., unit tooltip → ability tooltip)
- DOM movement to avoid CSS transform issues

## Architecture

### Core Data Structures

```javascript
let activeTooltip = null;      // Currently displayed tooltip (top of stack)
let activeTrigger = null;      // Trigger element for active tooltip
let tooltipStack = [];         // [{tooltip, trigger}, ...] - Stack for nested tooltips
let hoverBridge = null;        // Invisible bridge element between trigger and tooltip
let isHoveringTooltip = false; // Track if mouse is in tooltip area
```

### Key Design Decisions

**1. Moving tooltips to `document.body`**
- WHY: CSS transforms on ancestors break `position: fixed`
- IMPLICATION: Tooltip is no longer a child of trigger
- IMPLICATION: When parent's innerHTML is regenerated, tooltip becomes orphaned in body

**2. Stack-based nesting**
- Parent tooltip at index 0, nested at index 1, etc.
- Stack grows when showing nested tooltips
- Stack shrinks when hiding (pops from top)

**3. Event delegation**
- Uses `document.addEventListener('mouseenter/mouseleave', handler, true)` (capture phase)
- Single handler manages all tooltips via delegation

## The Nested Tooltip Journey

### Initial Problem
Unit tooltips show abilities. We wanted hovering an ability icon to show a nested tooltip with ability details.

### Attempt 1: CSS-only nested tooltips
**Rejected** - User wanted a full JS system for future extensibility.

### Attempt 2: Simple nesting check
```javascript
const isNested = activeTooltip && activeTooltip.contains(trigger);
```
**Problem**: When moving from ability A to ability B (siblings), both are inside parent tooltip, but A's tooltip is moved to body. So `activeTooltip` (A's tooltip, now in body) doesn't contain ability B's trigger.

**Fix**: Check entire stack, not just activeTooltip:
```javascript
let parentStackIndex = -1;
for (let i = tooltipStack.length - 1; i >= 0; i--) {
    if (tooltipStack[i].tooltip.contains(trigger)) {
        parentStackIndex = i;
        break;
    }
}
```

### Attempt 3: Hiding nested tooltip when leaving trigger
**Problem**: Moving from ability icon to parent tooltip area kept nested tooltip visible.

**Root cause**: `isHoveringTooltipArea()` returned true for ANY tooltip in stack, including parent.

**Fix**: Only count same-level or child tooltips:
```javascript
const hoveredIndex = tooltipStack.findIndex(t => t.tooltip === hoveredTooltip);
if (hoveredIndex >= ourIndex) return true;  // Same or child
// Parent (hoveredIndex < ourIndex) doesn't count
```

### Attempt 4: Hiding child tooltips when entering parent area
**Problem**: When moving from ability icon to parent tooltip (not on another ability), nested tooltip should hide.

**First attempt**:
```javascript
if (trigger && !alreadyInStack) {
    showTooltip(trigger, nestedTooltip);
} else {
    // Hide child tooltips
}
```

**Problem**: The `else` branch also ran when trigger WAS in stack (re-hovering same ability), incorrectly hiding its tooltip.

**Fix**: Use `else if (!trigger)`:
```javascript
if (trigger && !alreadyInStack) {
    // New nested trigger
} else if (!trigger) {
    // No trigger - hide children
}
// else: trigger in stack - do nothing
```

## Critical Insights

### 1. Stack index semantics
- Index 0 = root/parent tooltip
- Higher index = nested deeper
- When comparing: `targetIndex >= ourIndex` means "same level or child"
- `targetIndex < ourIndex` means "parent/ancestor"

### 2. DOM movement breaks containment
After `showTooltip()`, the nested tooltip is moved to body. So:
- Parent tooltip still contains the TRIGGER for nested tooltip
- But parent tooltip does NOT contain the nested TOOLTIP itself
- `e.target.closest('.tooltip')` from inside nested trigger finds PARENT, not nested

### 3. Multiple event fires
When mouse moves within an element, multiple mouseenter events fire for sub-elements. Each must be handled correctly:
- First enter on ability image → show nested tooltip
- Re-enter on same ability wrapper → don't hide/re-show (trigger already in stack)

### 4. The "trigger already in stack" edge case
When trigger is already in stack, it means:
- Its tooltip is already showing
- We're re-entering the trigger area (moved within it)
- Should NOT hide the tooltip
- Should NOT try to show it again

## HTML Structure for Nested Tooltips

```html
<!-- Unit slot (trigger for parent tooltip) -->
<div class="unit-slot has-tooltip">
    <img src="unit.png">
    
    <!-- Parent tooltip -->
    <div class="tooltip tooltip-unit">
        <div class="tooltip-title">Crossbowman</div>
        
        <!-- Abilities row with nested triggers -->
        <div class="tooltip-abilities-row">
            <!-- Each ability is a nested trigger -->
            <div class="tooltip-ability-item has-tooltip" data-tooltip-placement="top">
                <img src="ability.png">
                <!-- Nested tooltip -->
                <div class="tooltip">
                    <div class="tooltip-title">Living</div>
                    <div class="tooltip-text">Description...</div>
                </div>
            </div>
        </div>
    </div>
</div>
```

When parent tooltip is shown:
- Parent tooltip moves to `document.body`
- Ability items (nested triggers) move with it (still children of parent)
- When nested tooltip is shown, IT moves to body (becomes sibling of parent)

## Testing Patterns

When testing nested tooltips with Playwright:
1. Hover unit slot → verify parent tooltip appears
2. Hover ability icon → verify nested tooltip appears, parent stays
3. Move to different ability → verify nested switches, parent stays
4. Move to parent area (not ability) → verify nested hides, parent stays
5. Move outside all tooltips → verify all hide

## Cache Busting

During development, bump the version query param in `base.html`:
```html
<script src="{% static 'js/tooltip.js' %}?v=13"></script>
```

## Key Files

| File | Purpose |
|------|---------|
| `/static/js/tooltip.js` | Core tooltip system |
| `/hero_builder/static/hero_builder/css/tooltip.css` | Tooltip styles |
| `/hero_builder/templates/hero_builder/base.html` | Loads tooltip.js with cache bust |
| `/hero_builder/templates/hero_builder/partials/_scripts.html` | Generates tooltip HTML |
