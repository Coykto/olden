/**
 * Item Selection Modal - UI for choosing items to equip
 */

import { buildUrl, t } from './utils.js';
import { EquipmentManager } from './equipment-manager.js';
import { ItemSetManager } from './item-set-manager.js';

export const ItemSelectionModal = {
    allItems: [],
    currentSlot: null,
    currentSlotType: null,
    showScrolls: false,  // Hide scrolls by default in accessory slot

    // Map UI slot types (from data-slot-type) to API slot types
    slotTypeMap: {
        'unique': 'unique',
        'head': 'head',
        'back': 'back',
        'armor': 'armor',
        'weapon': 'weapon',
        'shield': 'shield',
        'belt': 'belt',
        'boots': 'boots',
        'ring': 'ring',
        'accessory': 'accessory'
    },

    // Rarity colors
    rarityColors: {
        'common': '#ffffff',
        'uncommon': '#1eff00',
        'rare': '#0070dd',
        'epic': '#a335ee',
        'legendary': '#ff8000',
        'relic': '#e6cc80'
    },

    async open(slotId, slotType) {
        this.currentSlot = slotId;
        this.currentSlotType = slotType;

        // Map UI slot type to API slot type
        const apiSlotType = this.slotTypeMap[slotType] || slotType;

        // Fetch items from API
        try {
            const response = await fetch(buildUrl(`/api/items/available/?slot=${apiSlotType}`));
            if (!response.ok) throw new Error('Failed to fetch items');
            const data = await response.json();
            // Cache descriptions and set names for search (computed once for performance)
            this.allItems = (data.items || []).map(item => {
                const setData = item.item_set ? ItemSetManager.getSetForItem(item.id) : null;
                return {
                    ...item,
                    _cachedDescription: (EquipmentManager.formatItemDescription(item) || '').toLowerCase(),
                    _cachedSetName: setData ? setData.name.toLowerCase() : ''
                };
            });
            this.render();
        } catch (error) {
            console.error('Error fetching items:', error);
            // Show error state
            const container = document.getElementById('skill-modal-container');
            container.innerHTML = `
                <div class="modal-overlay" onclick="window.ItemSelectionModal.close()">
                    <div class="skill-modal" onclick="event.stopPropagation()">
                        <div class="modal-header">
                            <h2>${t('ui', 'select_item', 'Select Item')}</h2>
                            <p style="color: #ff6666;">${t('ui', 'error_loading_items', 'Error loading items. Please try again.')}</p>
                        </div>
                    </div>
                </div>
            `;
        }
    },

    // Check if an item is a scroll
    isScroll(item) {
        return item.id && item.id.toLowerCase().includes('scroll');
    },

    // Rarity sort order (lower = higher priority)
    rarityOrder: {
        'legendary': 0,
        'epic': 1,
        'rare': 2,
        'uncommon': 3,
        'common': 4
    },

    // Get filtered items based on search and scroll toggle, sorted by rarity
    getFilteredItems(searchText = '') {
        const search = searchText.toLowerCase();
        const filtered = this.allItems.filter(item => {
            // Filter by scroll toggle (only for accessory slot)
            if (this.currentSlotType === 'accessory' && !this.showScrolls && this.isScroll(item)) {
                return false;
            }
            // Filter by search text (name, description, or set name)
            if (search) {
                return item.name.toLowerCase().includes(search) ||
                       (item._cachedDescription && item._cachedDescription.includes(search)) ||
                       (item._cachedSetName && item._cachedSetName.includes(search));
            }
            return true;
        });

        // Sort by rarity: Legendary > Epic > Rare > Uncommon > Common
        return filtered.sort((a, b) => {
            const orderA = this.rarityOrder[a.rarity] ?? 99;
            const orderB = this.rarityOrder[b.rarity] ?? 99;
            return orderA - orderB;
        });
    },

    toggleScrolls() {
        this.showScrolls = !this.showScrolls;
        // Re-render with current search text
        const searchInput = document.querySelector('.skill-search');
        const searchText = searchInput ? searchInput.value : '';
        this.updateItemList(searchText);
        // Update checkbox state
        const checkbox = document.getElementById('show-scrolls-toggle');
        if (checkbox) checkbox.checked = this.showScrolls;
    },

    updateItemList(searchText = '') {
        const filtered = this.getFilteredItems(searchText);
        document.getElementById('item-list').innerHTML =
            filtered.map(item => this.renderItemOption(item)).join('');
    },

    render() {
        const container = document.getElementById('skill-modal-container');
        const isAccessory = this.currentSlotType === 'accessory';
        const scrollToggleHtml = isAccessory ? `
            <label class="scroll-toggle">
                <input type="checkbox" id="show-scrolls-toggle"
                       ${this.showScrolls ? 'checked' : ''}
                       onchange="window.ItemSelectionModal.toggleScrolls()">
                Show scrolls
            </label>
        ` : '';

        container.innerHTML = `
            <div class="modal-overlay" onclick="window.ItemSelectionModal.close()">
                <div class="skill-modal" onclick="event.stopPropagation()">
                    <div class="modal-header">
                        <h2>${t('ui', 'select_item', 'Select Item')} - ${window.i18n?.slotNames?.[this.currentSlotType] || this.currentSlotType}</h2>
                        <div class="modal-controls">
                            <input type="text"
                                   class="skill-search"
                                   placeholder="${t('ui', 'search_items_placeholder', 'Search items...')}"
                                   oninput="window.ItemSelectionModal.filter(this.value)">
                            ${scrollToggleHtml}
                        </div>
                    </div>
                    <div class="skill-list" id="item-list">
                        ${this.getFilteredItems().map(item => this.renderItemOption(item)).join('')}
                    </div>
                </div>
            </div>
        `;
    },

    renderItemOption(item) {
        const rarityColor = this.rarityColors[item.rarity] || '#ffffff';
        // Always calculate description dynamically using EquipmentManager
        const displayText = EquipmentManager.formatItemDescription(item) ||
                           (item.bonuses || []).join(', ') ||
                           'No description';

        // Check if item belongs to a set
        let setHTML = '';
        if (item.item_set) {
            const setData = ItemSetManager.getSetForItem(item.id);
            if (setData) {
                const equippedCount = ItemSetManager.getEquippedSetItemCount(item.item_set);
                const totalItems = setData.items.length;
                setHTML = `
                    <div class="item-set-badge" title="${setData.name}">
                        <span class="set-name">${setData.name}</span>
                        <span class="set-count">(${equippedCount}/${totalItems})</span>
                    </div>
                `;
            }
        }

        return `
            <div class="skill-option" data-item-id="${item.id}"
                 onclick="window.ItemSelectionModal.select('${item.id}')">
                <div class="skill-icon-wrapper">
                    <img src="/media/gamedata/items/${item.icon}.webp" class="skill-icon" alt="${item.name}">
                </div>
                <div class="skill-info">
                    <div class="skill-name-row">
                        <span class="skill-name" style="color: ${rarityColor};">${item.name.toUpperCase()}</span>
                        ${setHTML}
                    </div>
                    <div class="skill-desc" style="color: ${rarityColor}; opacity: 0.7; font-size: 0.8rem; margin-bottom: 5px;">
                        ${window.i18n?.rarityLabels?.[item.rarity] || item.rarity.charAt(0).toUpperCase() + item.rarity.slice(1)}
                    </div>
                    <div class="skill-desc">${displayText}</div>
                </div>
            </div>
        `;
    },

    filter(searchText) {
        this.updateItemList(searchText);
    },

    select(itemId) {
        const item = this.allItems.find(i => i.id === itemId);
        if (item) {
            // Use EquipmentManager to equip the item
            EquipmentManager.equipItem(this.currentSlot, item);
        }
        this.close();
    },

    close() {
        document.getElementById('skill-modal-container').innerHTML = '';
    }
};

// Expose to window for inline onclick handlers
window.ItemSelectionModal = ItemSelectionModal;
