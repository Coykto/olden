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

        // Check if entering a tooltip that's already active (keep it visible)
        const enteredTooltip = e.target.closest('.tooltip');
        if (enteredTooltip && enteredTooltip === activeTooltip) {
            isHoveringTooltip = true;
            return;
        }

        // Check if entering the hover bridge
        if (e.target === hoverBridge) {
            isHoveringTooltip = true;
            return;
        }

        const trigger = e.target.closest('.has-tooltip');
        if (!trigger) return;

        const tooltip = trigger.querySelector('.tooltip');
        if (!tooltip) return;

        isHoveringTooltip = true;
        showTooltip(trigger, tooltip);
    }

    /**
     * Handle mouse leave
     */
    function handleMouseLeave(e) {
        // Ensure target is an Element (not Document, Window, or Text node)
        if (!(e.target instanceof Element)) return;

        // Check if leaving from tooltip
        const leavingTooltip = e.target.closest('.tooltip');
        if (leavingTooltip && leavingTooltip === activeTooltip) {
            // Check if moving to trigger, bridge, or staying in tooltip
            const relatedTarget = e.relatedTarget;
            if (relatedTarget instanceof Element) {
                if (activeTrigger && activeTrigger.contains(relatedTarget)) return;
                if (relatedTarget === hoverBridge) return;
                if (relatedTarget.closest('.tooltip') === activeTooltip) return;
            }
            // Leaving tooltip area - hide it
            hideTooltip(activeTooltip);
            return;
        }

        // Check if leaving from hover bridge
        if (e.target === hoverBridge) {
            const relatedTarget = e.relatedTarget;
            if (relatedTarget instanceof Element) {
                if (relatedTarget.closest('.tooltip') === activeTooltip) return;
                if (activeTrigger && activeTrigger.contains(relatedTarget)) return;
            }
            hideTooltip(activeTooltip);
            return;
        }

        const trigger = e.target.closest('.has-tooltip');
        if (!trigger) return;

        // Get tooltip - check inside trigger first, or use activeTooltip if this is the active trigger
        // (tooltip may have been moved to document.body by showTooltip)
        let tooltip = trigger.querySelector('.tooltip');
        if (!tooltip && trigger === activeTrigger) {
            tooltip = activeTooltip;
        }
        if (!tooltip) return;

        // Check if we're moving to the tooltip or hover bridge
        const relatedTarget = e.relatedTarget;
        if (relatedTarget instanceof Element) {
            if (relatedTarget.closest('.tooltip') === tooltip) return;
            if (relatedTarget === hoverBridge) return;
            if (trigger.contains(relatedTarget)) return;
        }

        // Small delay to allow moving to tooltip
        setTimeout(() => {
            if (activeTooltip === tooltip && !isHoveringTooltipArea(tooltip, trigger)) {
                hideTooltip(tooltip);
            }
        }, 50);
    }

    /**
     * Check if mouse is over tooltip area (tooltip, trigger, or bridge)
     */
    function isHoveringTooltipArea(tooltip, trigger) {
        const hovered = document.querySelectorAll(':hover');
        for (const el of hovered) {
            if (el === tooltip || el.closest('.tooltip') === tooltip) return true;
            if (el === trigger || trigger.contains(el)) return true;
            if (el === hoverBridge) return true;
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
        // Hide any other active tooltip
        if (activeTooltip && activeTooltip !== tooltip) {
            hideTooltip(activeTooltip);
        }

        activeTooltip = tooltip;
        activeTrigger = trigger;

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
    }

    /**
     * Hide tooltip
     */
    function hideTooltip(tooltip) {
        if (!tooltip) return;
        tooltip.style.display = 'none';
        tooltip.removeAttribute('data-actual-placement');
        hoverBridge.style.display = 'none';

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

        if (activeTooltip === tooltip) {
            activeTooltip = null;
            activeTrigger = null;
            isHoveringTooltip = false;
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
        hideActive: hideActiveTooltip
    };
})();
