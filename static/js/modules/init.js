/**
 * Initialization - Sets up the hero builder when the page loads
 */

import { SkillManager } from './skill-manager.js';
import { AdvancedClassManager } from './advanced-class-manager.js';
import { ItemSetManager } from './item-set-manager.js';
import { EquipmentManager } from './equipment-manager.js';
import { SpellBookManager } from './spellbook-manager.js';
import { ArmyManager } from './army-manager.js';
import { SkillSelectionModal } from './skill-selection-modal.js';
import { SubskillSelectionModal } from './subskill-selection-modal.js';
import { ItemSelectionModal } from './item-selection-modal.js';

// Auto-focus search bar when any modal opens
function setupModalAutoFocus() {
    const modalContainer = document.getElementById('skill-modal-container');
    if (!modalContainer) return;

    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                const searchInput = modalContainer.querySelector('.skill-search');
                if (searchInput) {
                    setTimeout(() => searchInput.focus(), 50);
                }
                break;
            }
        }
    });

    observer.observe(modalContainer, { childList: true });
}

// Initialize all managers when the DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Setup auto-focus for modal search inputs
    setupModalAutoFocus();
    SkillManager.init();
    AdvancedClassManager.init();
    ItemSetManager.init();  // Load item sets before equipment
    EquipmentManager.init();
    SpellBookManager.init();
    ArmyManager.init();

    // Close modal on Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            SkillSelectionModal.close();
            SubskillSelectionModal.close();
            ItemSelectionModal.close();
            SpellBookManager.closeSpellPicker();
        }
    });
});
