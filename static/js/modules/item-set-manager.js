/**
 * Item Set Manager - Handles item set tracking and bonuses
 */

import { heroBuild } from './state.js';
import { buildUrl, Debug } from './utils.js';
import { EquipmentManager } from './equipment-manager.js';

export const ItemSetManager = {
    // Cached item sets data from API
    itemSets: [],  // Array of {id, name, items, bonuses, raw_data}
    itemToSetMap: {},  // Map of item_id -> set data for quick lookup

    async init() {
        try {
            const response = await fetch(buildUrl('/api/item-sets/'));
            const data = await response.json();
            this.itemSets = data.item_sets || [];

            // Build item -> set lookup map
            this.itemToSetMap = {};
            for (const set of this.itemSets) {
                for (const itemId of set.items) {
                    this.itemToSetMap[itemId] = set;
                }
            }

            Debug.log(`[ItemSetManager] Loaded ${this.itemSets.length} item sets`);
        } catch (error) {
            console.error('[ItemSetManager] Failed to load item sets:', error);
        }
    },

    /**
     * Get the set that an item belongs to, if any.
     * @param {string} itemId - The item's id_key
     * @returns {object|null} Set data or null
     */
    getSetForItem(itemId) {
        return this.itemToSetMap[itemId] || null;
    },

    /**
     * Count unique equipped items from a specific set.
     * Two copies of the same item count as 1.
     * @param {string} setId - The set's id_key
     * @returns {number} Number of unique items equipped from this set
     */
    getEquippedSetItemCount(setId) {
        const equippedItemIds = new Set();
        for (const slotData of Object.values(heroBuild.equipment.slots)) {
            if (slotData && slotData.item_set === setId) {
                equippedItemIds.add(slotData.id);  // Set ensures uniqueness
            }
        }
        return equippedItemIds.size;
    },

    /**
     * Get all items from a set and their equipped status.
     * @param {string} setId - The set's id_key
     * @returns {Array} Array of {itemId, equipped: boolean}
     */
    getSetItemsStatus(setId) {
        const set = this.itemSets.find(s => s.id === setId);
        if (!set) return [];

        const equippedIds = new Set();
        for (const slotData of Object.values(heroBuild.equipment.slots)) {
            if (slotData && slotData.item_set === setId) {
                equippedIds.add(slotData.id);
            }
        }

        return set.items.map(itemId => ({
            itemId,
            equipped: equippedIds.has(itemId)
        }));
    },

    /**
     * Format a set bonus description using the transpiler system.
     * @param {object} setData - The full set data object
     * @param {object} bonus - The specific bonus object
     * @returns {string} Formatted description
     */
    formatBonusDescription(setData, bonus) {
        if (!bonus.description_template) return '';

        // Create context for CurrentItemSet
        const ctx = {
            currentItemSet: {
                id: setData.id,
                config: setData.raw_data
            },
            currentHero: {
                heroStat: EquipmentManager.getEffectiveHeroStats()
            }
        };

        try {
            return window.DescriptionRuntime.formatDescription(
                bonus.description_template,
                bonus.description_args || [],
                ctx
            );
        } catch (e) {
            console.error('[ItemSetManager] Error formatting bonus:', e);
            return bonus.description_template;
        }
    },

    /**
     * Get active set bonuses (those with enough items equipped).
     * @param {string} setId - The set's id_key
     * @returns {Array} Array of active bonus objects
     */
    getActiveSetBonuses(setId) {
        const set = this.itemSets.find(s => s.id === setId);
        if (!set) return [];

        const equippedCount = this.getEquippedSetItemCount(setId);
        return set.bonuses.filter(bonus => equippedCount >= bonus.requiredItemsAmount);
    },

    /**
     * Calculate total hero stat bonuses from all active set bonuses.
     * @returns {object} Map of stat_name -> total bonus value
     */
    getActiveSetStatBonuses() {
        const bonuses = {};

        for (const set of this.itemSets) {
            const equippedCount = this.getEquippedSetItemCount(set.id);
            if (equippedCount === 0) continue;

            for (const bonus of set.bonuses) {
                if (equippedCount < bonus.requiredItemsAmount) continue;

                // Process hero bonuses
                for (const heroBonus of (bonus.heroBonuses || [])) {
                    if (heroBonus.type === 'heroStat') {
                        const [statName, value] = heroBonus.parameters;
                        const numValue = parseFloat(value) || 0;
                        bonuses[statName] = (bonuses[statName] || 0) + numValue;
                    }
                }
            }
        }

        return bonuses;
    }
};

// Expose to window for cross-module access (will be removed once all modules are ES6)
window.ItemSetManager = ItemSetManager;
