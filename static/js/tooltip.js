/**
 * Unified Tooltip System
 *
 * Features:
 * - Configurable placement (top, bottom, left, right)
 * - Automatic boundary detection and flipping
 * - Gap-free hover (invisible bridge between trigger and tooltip)
 * - Consistent show/hide behavior
 *
 * Usage:
 * 1. Add class "has-tooltip" to trigger element
 * 2. Add data-tooltip-placement="top|bottom|left|right" (default: right)
 * 3. Add child element with class "tooltip" containing tooltip content
 *
 * Example:
 * <div class="has-tooltip" data-tooltip-placement="top">
 *   <img src="icon.png">
 *   <div class="tooltip">
 *     <div class="tooltip-title">Title</div>
 *     <div class="tooltip-text">Description</div>
 *   </div>
 * </div>
 */

const Tooltip = (function() {
    'use strict';

    const GAP = 2; // Gap between trigger and tooltip
    const VIEWPORT_MARGIN = 10; // Minimum distance from viewport edge

    let activeTooltip = null;
    let activeTrigger = null; // Reference to the trigger element for the active tooltip
    let hoverBridge = null;
    let isHoveringTooltip = false; // Track if mouse is over active tooltip or its trigger

    // Stack for nested tooltips
    let tooltipStack = []; // [{tooltip, trigger}, ...]

    // Callbacks for tooltip lifecycle events
    let onShowCallback = null;
    let onHideCallback = null;

    /**
     * Initialize tooltip system
     */
    function init() {
        // Create hover bridge element (invisible div that maintains hover between trigger and tooltip)
        hoverBridge = document.createElement('div');
        hoverBridge.className = 'tooltip-hover-bridge';
        hoverBridge.style.cssText = `
            position: fixed;
            pointer-events: auto;
            z-index: 9998;
            display: none;
        `;
        document.body.appendChild(hoverBridge);

        // Use event delegation for hover
        document.addEventListener('mouseenter', handleMouseEnter, true);
        document.addEventListener('mouseleave', handleMouseLeave, true);

        // Handle scroll and resize
        window.addEventListener('scroll', handleScroll, true);
        window.addEventListener('resize', repositionActiveTooltip);
    }

    /**
     * Handle mouse enter on any element
     */
    function handleMouseEnter(e) {
        // Ensure target is an Element (not Document, Window, or Text node)
        if (!(e.target instanceof Element)) return;

        // Check if entering the hover bridge
        if (e.target === hoverBridge) {
            isHoveringTooltip = true;
            return;
        }

        // First check if there's a tooltip trigger at this element
        const trigger = e.target.closest('.has-tooltip');

        // Check if entering a tooltip that's already active
        const enteredTooltip = e.target.closest('.tooltip');

        if (enteredTooltip && isTooltipInStack(enteredTooltip)) {
            isHoveringTooltip = true;
            // If there's a nested trigger inside a stacked tooltip, show its tooltip
            if (trigger && !tooltipStack.some(t => t.trigger === trigger)) {
                // New nested trigger - show its tooltip
                const nestedTooltip = trigger.querySelector(':scope > .tooltip');
                if (nestedTooltip && !isTooltipInStack(nestedTooltip)) {
                    showTooltip(trigger, nestedTooltip);
                }
            } else if (!trigger) {
                // Entered tooltip area with NO trigger - hide child tooltips
                const enteredIndex = tooltipStack.findIndex(t => t.tooltip === enteredTooltip);
                if (enteredIndex >= 0 && enteredIndex < tooltipStack.length - 1) {
                    // There are child tooltips above this one - hide them
                    while (tooltipStack.length > enteredIndex + 1) {
                        const {tooltip: t} = tooltipStack.pop();
                        hideTooltipElement(t);
                    }
                    // Update active tooltip
                    const top = tooltipStack[tooltipStack.length - 1];
                    activeTooltip = top.tooltip;
                    activeTrigger = top.trigger;
                }
            }
            // else: trigger is already in stack - do nothing (keep current nested tooltip visible)
            return;
        }

        if (!trigger) return;

        const tooltip = trigger.querySelector(':scope > .tooltip');
        if (!tooltip) return;

        isHoveringTooltip = true;
        showTooltip(trigger, tooltip);
    }

    /**
     * Check if a tooltip is in our stack
     */
    function isTooltipInStack(tooltip) {
        return tooltipStack.some(t => t.tooltip === tooltip);
    }

    /**
     * Handle mouse leave
     */
    function handleMouseLeave(e) {
        // Ensure target is an Element (not Document, Window, or Text node)
        if (!(e.target instanceof Element)) return;

        const relatedTarget = e.relatedTarget;

        // Check if leaving from a tooltip in the stack
        const leavingTooltip = e.target.closest('.tooltip');
        if (leavingTooltip && isTooltipInStack(leavingTooltip)) {
            if (relatedTarget instanceof Element) {
                // Check if moving to another tooltip in the stack
                const targetTooltip = relatedTarget.closest('.tooltip');
                if (targetTooltip && isTooltipInStack(targetTooltip)) return;
                // Check if moving to a trigger in the stack
                for (const {trigger} of tooltipStack) {
                    if (trigger.contains(relatedTarget)) return;
                }
                // Check if moving to a nested trigger (has-tooltip inside any stacked tooltip)
                const nestedTrigger = relatedTarget.closest('.has-tooltip');
                if (nestedTrigger) {
                    // Check if this trigger is inside any tooltip in our stack
                    for (const {tooltip} of tooltipStack) {
                        if (tooltip.contains(nestedTrigger)) return;
                    }
                }
                if (relatedTarget === hoverBridge) return;
            }
            // Leaving tooltip area - hide this tooltip (and nested ones)
            hideTooltip(leavingTooltip);
            return;
        }

        // Check if leaving from hover bridge
        if (e.target === hoverBridge) {
            if (relatedTarget instanceof Element) {
                const targetTooltip = relatedTarget.closest('.tooltip');
                if (targetTooltip && isTooltipInStack(targetTooltip)) return;
                for (const {trigger} of tooltipStack) {
                    if (trigger.contains(relatedTarget)) return;
                }
            }
            hideAllTooltips();
            return;
        }

        const trigger = e.target.closest('.has-tooltip');
        if (!trigger) return;

        // Find the tooltip for this trigger in the stack
        const stackEntry = tooltipStack.find(t => t.trigger === trigger);
        let tooltip = stackEntry ? stackEntry.tooltip : trigger.querySelector(':scope > .tooltip');
        if (!tooltip) return;

        // Check if we're moving to the tooltip or hover bridge
        if (relatedTarget instanceof Element) {
            if (relatedTarget.closest('.tooltip') === tooltip) return;
            if (relatedTarget === hoverBridge) return;
            if (trigger.contains(relatedTarget)) return;
            // Check if moving to another tooltip in the stack
            const targetTooltip = relatedTarget.closest('.tooltip');
            if (targetTooltip && isTooltipInStack(targetTooltip)) {
                // Only stay visible if moving to the same tooltip or a child (higher index)
                // If moving to a parent tooltip (lower index), we should hide this nested tooltip
                const targetIndex = tooltipStack.findIndex(t => t.tooltip === targetTooltip);
                const ourIndex = tooltipStack.findIndex(t => t.tooltip === tooltip);
                if (targetIndex >= ourIndex) return;
                // Moving to parent - don't return, let it hide
            }
            // Check if moving to a sibling nested trigger inside a parent tooltip
            const nestedTrigger = relatedTarget.closest('.has-tooltip');
            if (nestedTrigger && nestedTrigger !== trigger) {
                for (const {tooltip: stackTooltip} of tooltipStack) {
                    if (stackTooltip.contains(nestedTrigger)) return;
                }
            }
        }
        // Small delay to allow moving to tooltip
        setTimeout(() => {
            if (isTooltipInStack(tooltip) && !isHoveringTooltipArea(tooltip, trigger)) {
                hideTooltip(tooltip);
            }
        }, 50);
    }

    /**
     * Check if mouse is over the tooltip area (this tooltip, its trigger, children, or bridge)
     * Does NOT return true for parent tooltips - only same level or children.
     */
    function isHoveringTooltipArea(tooltip, trigger) {
        const hovered = document.querySelectorAll(':hover');
        const ourIndex = tooltipStack.findIndex(t => t.tooltip === tooltip);

        // If tooltip not in stack, only check direct hover
        if (ourIndex === -1) {
            for (const el of hovered) {
                if (el === tooltip || el.closest('.tooltip') === tooltip) return true;
                if (el === trigger || trigger.contains(el)) return true;
            }
            return false;
        }

        for (const el of hovered) {
            // Check hover bridge
            if (el === hoverBridge) return true;

            // Check if hovering this tooltip or a child tooltip (same or higher index in stack)
            const hoveredTooltip = el.closest('.tooltip');
            if (hoveredTooltip) {
                const hoveredIndex = tooltipStack.findIndex(t => t.tooltip === hoveredTooltip);
                // Only count as hovering if it's our tooltip or a child (higher index)
                if (hoveredIndex >= ourIndex) return true;
            }

            // Check if hovering this trigger or child triggers (in tooltips at same or higher level)
            for (let i = ourIndex; i < tooltipStack.length; i++) {
                const stackTrigger = tooltipStack[i].trigger;
                if (el === stackTrigger || stackTrigger.contains(el)) return true;
            }

            // Check the specific tooltip/trigger (for cases where they're not in stack yet)
            if (el === tooltip || el.closest('.tooltip') === tooltip) return true;
            if (el === trigger || trigger.contains(el)) return true;
        }
        return false;
    }

    /**
     * Handle scroll - only hide tooltip if not hovering over it
     */
    function handleScroll() {
        if (!activeTooltip) return;

        if (isHoveringTooltip) {
            // User is hovering over tooltip area - reposition instead of hiding
            repositionActiveTooltip();
        } else {
            // User scrolled while not hovering - hide tooltip
            hideActiveTooltip();
        }
    }

    /**
     * Show tooltip and position it
     */
    function showTooltip(trigger, tooltip) {
        // Check if this tooltip is already in the stack
        const existingIndex = tooltipStack.findIndex(t => t.tooltip === tooltip);
        if (existingIndex >= 0) return; // Already showing

        // Check if this is a nested tooltip (trigger is inside ANY tooltip in the stack)
        // This handles sibling nested triggers (e.g., moving from ability A to ability B)
        let parentStackIndex = -1;
        for (let i = tooltipStack.length - 1; i >= 0; i--) {
            if (tooltipStack[i].tooltip.contains(trigger)) {
                parentStackIndex = i;
                break;
            }
        }

        if (parentStackIndex === -1 && activeTooltip && activeTooltip !== tooltip) {
            // Not nested - hide all active tooltips
            hideAllTooltips();
        } else if (parentStackIndex >= 0 && parentStackIndex < tooltipStack.length - 1) {
            // Nested, but there are sibling tooltips above the parent - hide them
            // (e.g., moving from ability A to ability B within the same parent tooltip)
            while (tooltipStack.length > parentStackIndex + 1) {
                const {tooltip: t} = tooltipStack.pop();
                hideTooltipElement(t);
            }
            // Update active tooltip to the new top of stack
            if (tooltipStack.length > 0) {
                const top = tooltipStack[tooltipStack.length - 1];
                activeTooltip = top.tooltip;
                activeTrigger = top.trigger;
            }
        }

        // Push to stack
        tooltipStack.push({tooltip, trigger});
        activeTooltip = tooltip;
        activeTrigger = trigger;

        // Nested tooltips get higher z-index
        const baseZIndex = 9999;
        tooltip.style.zIndex = baseZIndex + tooltipStack.length;

        // Move tooltip to body to avoid transform/filter issues from ancestors
        // (CSS transforms break position:fixed by creating a new containing block)
        if (tooltip.parentElement !== document.body) {
            tooltip._originalParent = tooltip.parentElement;
            tooltip._originalNextSibling = tooltip.nextSibling;
            document.body.appendChild(tooltip);
        }

        tooltip.style.display = 'block';
        tooltip.style.visibility = 'hidden'; // Hide while positioning

        // Position the tooltip
        positionTooltip(trigger, tooltip);

        tooltip.style.visibility = 'visible';

        // Invoke onShow callback
        if (onShowCallback) {
            try {
                onShowCallback(tooltip, trigger);
            } catch (e) {
                console.warn('Tooltip onShow callback error:', e);
            }
        }
    }

    /**
     * Hide all tooltips in the stack
     */
    function hideAllTooltips() {
        while (tooltipStack.length > 0) {
            const {tooltip} = tooltipStack.pop();
            hideTooltipElement(tooltip);
        }
        activeTooltip = null;
        activeTrigger = null;
    }

    /**
     * Hide a tooltip element (low-level, just hides the DOM element)
     */
    function hideTooltipElement(tooltip) {
        if (!tooltip) return;

        // Invoke onHide callback BEFORE hiding (so we can access tooltip content)
        if (onHideCallback) {
            try {
                // Find the trigger for this tooltip (it was stored when shown)
                const trigger = tooltip._originalParent || null;
                onHideCallback(tooltip, trigger);
            } catch (e) {
                console.warn('Tooltip onHide callback error:', e);
            }
        }

        tooltip.style.display = 'none';
        tooltip.removeAttribute('data-actual-placement');

        // Restore tooltip to its original position in DOM
        if (tooltip._originalParent) {
            try {
                // Check if parent is still in the DOM
                if (tooltip._originalParent.isConnected) {
                    // Check if sibling is still a valid child of the parent
                    if (tooltip._originalNextSibling &&
                        tooltip._originalNextSibling.parentNode === tooltip._originalParent) {
                        tooltip._originalParent.insertBefore(tooltip, tooltip._originalNextSibling);
                    } else {
                        tooltip._originalParent.appendChild(tooltip);
                    }
                }
                // If parent is not connected, tooltip stays in document.body (which is fine)
            } catch (e) {
                // If restoration fails for any reason, leave tooltip where it is
                console.warn('Tooltip restoration failed:', e);
            }
            delete tooltip._originalParent;
            delete tooltip._originalNextSibling;
        }
    }

    /**
     * Hide tooltip and update stack
     */
    function hideTooltip(tooltip) {
        if (!tooltip) return;

        // Remove from stack
        const index = tooltipStack.findIndex(t => t.tooltip === tooltip);
        if (index >= 0) {
            // Hide all tooltips above this one in the stack (nested ones)
            while (tooltipStack.length > index) {
                const {tooltip: t} = tooltipStack.pop();
                hideTooltipElement(t);
            }
        } else {
            hideTooltipElement(tooltip);
        }

        // Update active tooltip to the top of stack (or null)
        if (tooltipStack.length > 0) {
            const top = tooltipStack[tooltipStack.length - 1];
            activeTooltip = top.tooltip;
            activeTrigger = top.trigger;
        } else {
            activeTooltip = null;
            activeTrigger = null;
            isHoveringTooltip = false;
            hoverBridge.style.display = 'none';
        }
    }

    /**
     * Hide the currently active tooltip
     */
    function hideActiveTooltip() {
        if (activeTooltip) {
            hideTooltip(activeTooltip);
        }
    }

    /**
     * Reposition active tooltip (e.g., on resize)
     */
    function repositionActiveTooltip() {
        if (!activeTooltip || !activeTrigger) return;
        positionTooltip(activeTrigger, activeTooltip);
    }

    /**
     * Position tooltip relative to trigger with boundary detection
     */
    function positionTooltip(trigger, tooltip) {
        const preferredPlacement = trigger.dataset.tooltipPlacement || 'right';
        const triggerRect = trigger.getBoundingClientRect();

        const viewport = {
            width: window.innerWidth,
            height: window.innerHeight
        };

        // First pass: get initial dimensions and calculate position
        tooltip.style.position = 'fixed';
        let tooltipRect = tooltip.getBoundingClientRect();
        let result = calculateBestPosition(preferredPlacement, triggerRect, tooltipRect, viewport);

        // Apply initial position
        tooltip.style.top = `${result.pos.top}px`;
        tooltip.style.left = `${result.pos.left}px`;

        // Second pass: re-measure after positioning (dimensions may change due to text reflow)
        const newTooltipRect = tooltip.getBoundingClientRect();
        if (Math.abs(newTooltipRect.height - tooltipRect.height) > 1 ||
            Math.abs(newTooltipRect.width - tooltipRect.width) > 1) {
            // Dimensions changed significantly, recalculate position
            tooltipRect = newTooltipRect;
            result = calculateBestPosition(preferredPlacement, triggerRect, tooltipRect, viewport);

            // Apply corrected position
            tooltip.style.top = `${result.pos.top}px`;
            tooltip.style.left = `${result.pos.left}px`;
        }

        tooltip.setAttribute('data-actual-placement', result.placement);

        // Position hover bridge
        positionHoverBridge(triggerRect, result.pos, tooltipRect, result.placement);
    }

    /**
     * Calculate the best position for a tooltip
     */
    function calculateBestPosition(preferredPlacement, triggerRect, tooltipRect, viewport) {
        // Calculate positions for each placement
        const positions = {
            top: {
                top: triggerRect.top - tooltipRect.height - GAP,
                left: triggerRect.left + (triggerRect.width - tooltipRect.width) / 2
            },
            bottom: {
                top: triggerRect.bottom + GAP,
                left: triggerRect.left + (triggerRect.width - tooltipRect.width) / 2
            },
            left: {
                top: triggerRect.top + (triggerRect.height - tooltipRect.height) / 2,
                left: triggerRect.left - tooltipRect.width - GAP
            },
            right: {
                top: triggerRect.top + (triggerRect.height - tooltipRect.height) / 2,
                left: triggerRect.right + GAP
            }
        };

        // Determine best placement
        let placement = preferredPlacement;
        let pos = positions[placement];

        // Check if preferred placement fits, if not try opposite
        if (!fitsInViewport(pos, tooltipRect, viewport)) {
            const opposite = getOppositePlacement(placement);
            if (fitsInViewport(positions[opposite], tooltipRect, viewport)) {
                placement = opposite;
                pos = positions[placement];
            } else {
                // Try other placements
                const alternatives = ['right', 'left', 'bottom', 'top'].filter(p => p !== placement && p !== opposite);
                for (const alt of alternatives) {
                    if (fitsInViewport(positions[alt], tooltipRect, viewport)) {
                        placement = alt;
                        pos = positions[placement];
                        break;
                    }
                }
            }
        }

        // Clamp to viewport bounds
        pos = clampToViewport(pos, tooltipRect, viewport);

        return { pos, placement };
    }

    /**
     * Check if position fits in viewport
     */
    function fitsInViewport(pos, tooltipRect, viewport) {
        return (
            pos.top >= VIEWPORT_MARGIN &&
            pos.left >= VIEWPORT_MARGIN &&
            pos.top + tooltipRect.height <= viewport.height - VIEWPORT_MARGIN &&
            pos.left + tooltipRect.width <= viewport.width - VIEWPORT_MARGIN
        );
    }

    /**
     * Get opposite placement
     */
    function getOppositePlacement(placement) {
        const opposites = {
            top: 'bottom',
            bottom: 'top',
            left: 'right',
            right: 'left'
        };
        return opposites[placement];
    }

    /**
     * Clamp position to viewport bounds
     */
    function clampToViewport(pos, tooltipRect, viewport) {
        return {
            top: Math.max(VIEWPORT_MARGIN, Math.min(pos.top, viewport.height - tooltipRect.height - VIEWPORT_MARGIN)),
            left: Math.max(VIEWPORT_MARGIN, Math.min(pos.left, viewport.width - tooltipRect.width - VIEWPORT_MARGIN))
        };
    }

    /**
     * Position invisible hover bridge between trigger and tooltip
     */
    function positionHoverBridge(triggerRect, tooltipPos, tooltipRect, placement) {
        let bridgeStyle = {
            display: 'block'
        };

        switch (placement) {
            case 'right':
                bridgeStyle.top = `${Math.min(triggerRect.top, tooltipPos.top)}px`;
                bridgeStyle.left = `${triggerRect.right}px`;
                bridgeStyle.width = `${GAP}px`;
                bridgeStyle.height = `${Math.max(triggerRect.bottom, tooltipPos.top + tooltipRect.height) - Math.min(triggerRect.top, tooltipPos.top)}px`;
                break;
            case 'left':
                bridgeStyle.top = `${Math.min(triggerRect.top, tooltipPos.top)}px`;
                bridgeStyle.left = `${tooltipPos.left + tooltipRect.width}px`;
                bridgeStyle.width = `${GAP}px`;
                bridgeStyle.height = `${Math.max(triggerRect.bottom, tooltipPos.top + tooltipRect.height) - Math.min(triggerRect.top, tooltipPos.top)}px`;
                break;
            case 'top':
                bridgeStyle.top = `${tooltipPos.top + tooltipRect.height}px`;
                bridgeStyle.left = `${Math.min(triggerRect.left, tooltipPos.left)}px`;
                bridgeStyle.width = `${Math.max(triggerRect.right, tooltipPos.left + tooltipRect.width) - Math.min(triggerRect.left, tooltipPos.left)}px`;
                bridgeStyle.height = `${GAP}px`;
                break;
            case 'bottom':
                bridgeStyle.top = `${triggerRect.bottom}px`;
                bridgeStyle.left = `${Math.min(triggerRect.left, tooltipPos.left)}px`;
                bridgeStyle.width = `${Math.max(triggerRect.right, tooltipPos.left + tooltipRect.width) - Math.min(triggerRect.left, tooltipPos.left)}px`;
                bridgeStyle.height = `${GAP}px`;
                break;
        }

        Object.assign(hoverBridge.style, bridgeStyle);
    }

    /**
     * Manually show a tooltip (for programmatic control)
     */
    function show(triggerElement) {
        const tooltip = triggerElement.querySelector('.tooltip');
        if (tooltip) {
            showTooltip(triggerElement, tooltip);
        }
    }

    /**
     * Manually hide a tooltip
     */
    function hide(triggerElement) {
        const tooltip = triggerElement.querySelector('.tooltip');
        if (tooltip) {
            hideTooltip(tooltip);
        }
    }

    /**
     * Set callback for when a tooltip is shown
     * @param {Function} callback - Function(tooltip, trigger) called after tooltip is shown
     */
    function setOnShow(callback) {
        onShowCallback = callback;
    }

    /**
     * Set callback for when a tooltip is hidden
     * @param {Function} callback - Function(tooltip, trigger) called before tooltip is hidden
     */
    function setOnHide(callback) {
        onHideCallback = callback;
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Public API
    return {
        init,
        show,
        hide,
        hideActive: hideActiveTooltip,
        setOnShow,
        setOnHide
    };
})();
