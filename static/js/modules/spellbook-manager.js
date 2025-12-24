/**
 * SpellBook Manager - Manages spell selection, upgrades, and filtering
 */

import { heroBuild } from './state.js';
import { buildUrl, Debug, t } from './utils.js';
import { EquipmentManager } from './equipment-manager.js';

export const SpellBookManager = {
    // State
    availableSpells: [],
    bonusSpells: [],  // Skill-granted spells (not learnable, from API)
    skillGrantedSpells: [],  // Currently active skill-granted spells
    schools: [],
    equippedSpells: new Array(5).fill(null), // 5 initial slots
    currentSlotIndex: null,
    currentSchoolFilter: 'all',  // Filter for picker modal (school)
    currentModalTypeFilter: 'all',  // Filter for picker modal (combat/global)
    currentBookFilter: null,  // Filter for the spell book view (school) - null means all
    currentTypeFilter: null,  // Filter for the spell book view (combat/global) - null means all
    showEquippedInPicker: false,  // Toggle for showing equipped spells in picker modal
    isAddingNewSlot: false,

    // Initialize - fetch spells from API
    async init() {
        try {
            const response = await fetch(buildUrl('/api/spells/available/'));
            const data = await response.json();
            this.availableSpells = data.spells || [];
            this.bonusSpells = data.bonus_spells || [];
            this.schools = data.schools || [];
            Debug.log(`[SpellBookManager] Loaded ${this.availableSpells.length} spells, ${this.bonusSpells.length} bonus spells`);
        } catch (error) {
            console.error('[SpellBookManager] Failed to load spells:', error);
        }

        // Load starting spells from hero card data attribute
        this.loadStartingSpells();

        // Check current skills for skill-granted spells
        this.updateSkillGrantedSpells();

        this.renderSchoolTabs();
        this.rebuildSpellGrid();  // Build the initial grid with just the "+" button
    },

    // Load starting spells from hero card data attribute
    loadStartingSpells() {
        const heroCard = document.querySelector('[data-hero-starting-spells]');
        if (!heroCard) return;

        try {
            const startingSpells = JSON.parse(heroCard.dataset.heroStartingSpells || '[]');
            if (!startingSpells.length) return;

            Debug.log(`[SpellBookManager] Loading ${startingSpells.length} starting spells`);

            // Clear the initial empty slots
            this.equippedSpells = [];

            // Add each starting spell
            startingSpells.forEach(spellData => {
                // The spellData from the template already has all the info we need
                // It matches the structure from api_available_spells
                this.equippedSpells.push({
                    spell: spellData,
                    upgradeLevel: spellData.upgrade_level || 1,
                    isStartingSpell: true  // Mark as starting spell - cannot be removed
                });
                Debug.log(`[SpellBookManager] Added starting spell: ${spellData.name} (${spellData.id})`);
            });
        } catch (error) {
            console.error('[SpellBookManager] Error loading starting spells:', error);
        }
    },

    // Update granted spells based on current hero skills and equipped items
    updateSkillGrantedSpells() {
        const newGrantedSpells = [];
        const addedSpellIds = new Set();

        // Helper to find spell data in both bonus and available spells
        const findSpellData = (spellId) => {
            return this.bonusSpells.find(s => s.id === spellId) ||
                   this.availableSpells.find(s => s.id === spellId);
        };

        // Helper to add a granted spell (avoiding duplicates)
        const addGrantedSpell = (spellId, source, sourceId) => {
            if (addedSpellIds.has(spellId)) return;
            const spellData = findSpellData(spellId);
            if (spellData) {
                addedSpellIds.add(spellId);
                newGrantedSpells.push({
                    spell: spellData,
                    upgradeLevel: 1,
                    isSkillGrantedSpell: true,
                    grantingSource: source,  // 'skill' or 'item'
                    grantingSourceId: sourceId
                });
            }
        };

        // Check skills for heroMagicAddition bonuses
        heroBuild.skills.forEach(skill => {
            if (!skill) return;

            // Check main skill bonuses (from parametersPerLevel)
            if (skill.raw_data) {
                const rawData = skill.raw_data;
                const parametersPerLevel = rawData.parametersPerLevel || [];

                // Get bonuses for current skill level (levels are 1-indexed, array is 0-indexed)
                const levelIndex = (skill.level || 1) - 1;
                const levelParams = parametersPerLevel[levelIndex];
                if (levelParams && levelParams.bonuses) {
                    levelParams.bonuses.forEach(bonus => {
                        if (bonus.type === 'heroMagicAddition' && bonus.parameters && bonus.parameters[0]) {
                            addGrantedSpell(bonus.parameters[0], 'skill', skill.skillId);
                        }
                    });
                }
            }

            // Check subskill bonuses
            const subskillRawDataArray = skill.subskillRawData || [];
            subskillRawDataArray.forEach((subskillRaw, idx) => {
                if (!subskillRaw) return;
                const bonuses = subskillRaw.bonuses || [];
                bonuses.forEach(bonus => {
                    if (bonus.type === 'heroMagicAddition' && bonus.parameters && bonus.parameters[0]) {
                        addGrantedSpell(bonus.parameters[0], 'subskill', skill.subskills[idx]);
                    }
                });
            });
        });

        // Check equipped items for heroMagicAddition bonuses
        Object.values(heroBuild.equipment.slots).forEach(itemData => {
            if (!itemData || !itemData.raw_data) return;

            const bonuses = itemData.raw_data.bonuses || [];
            bonuses.forEach(bonus => {
                if (bonus.type === 'heroMagicAddition' && bonus.parameters && bonus.parameters[0]) {
                    addGrantedSpell(bonus.parameters[0], 'item', itemData.id);
                }
            });
        });

        // Check if anything changed
        const oldIds = this.skillGrantedSpells.map(s => s.spell.id).sort().join(',');
        const newIds = newGrantedSpells.map(s => s.spell.id).sort().join(',');

        if (oldIds !== newIds) {
            Debug.log(`[SpellBookManager] Granted spells updated: ${newGrantedSpells.length} spells`);
            this.skillGrantedSpells = newGrantedSpells;
            this.rebuildSpellGrid();
        }
    },

    // Render school tabs for filtering the spell book (no "All" - toggle to deselect)
    renderSchoolTabs() {
        const container = document.getElementById('spell-school-tabs');
        if (!container) return;

        container.innerHTML = this.schools.map(school => `
            <button class="spell-school-tab" data-school="${school.id}" onclick="window.SpellBookManager.toggleBookSchoolFilter('${school.id}')">
                ${school.name.replace(' Magic', '')}
            </button>
        `).join('');
    },

    // Toggle the spell book school filter (clicking active one turns it off)
    toggleBookSchoolFilter(schoolId) {
        // Toggle: if already active, clear filter; otherwise set it
        this.currentBookFilter = (this.currentBookFilter === schoolId) ? null : schoolId;

        // Update active tab
        document.querySelectorAll('#spell-school-tabs .spell-school-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.school === this.currentBookFilter);
        });

        // Apply all filters
        this.applyAllFilters();
    },

    // Toggle the spell book type filter (clicking active one turns it off)
    toggleBookTypeFilter(type) {
        // Toggle: if already active, clear filter; otherwise set it
        this.currentTypeFilter = (this.currentTypeFilter === type) ? null : type;

        // Update active button
        document.querySelectorAll('.spell-type-filters .spell-type-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.type === this.currentTypeFilter);
        });

        // Apply all filters
        this.applyAllFilters();
    },

    // Apply both school and type filters (null means show all)
    applyAllFilters() {
        document.querySelectorAll('.spell-slot').forEach((slot) => {
            // Skip the add button
            if (slot.classList.contains('spell-slot-add')) {
                slot.classList.remove('filtered-out');
                return;
            }

            // Get the correct spell array and index based on slot type
            const slotIndex = parseInt(slot.dataset.slotIndex, 10);
            const isSkillGranted = slot.classList.contains('skill-granted');
            const spellArray = isSkillGranted ? this.skillGrantedSpells : this.equippedSpells;
            const equipped = spellArray[slotIndex];

            if (!equipped || !equipped.spell) {
                // Empty slots: always show
                slot.classList.remove('filtered-out');
            } else {
                // Check school filter (null means all)
                const matchesSchool = this.currentBookFilter === null ||
                                      equipped.spell.school === this.currentBookFilter;

                // Check type filter (null means all)
                const matchesType = this.currentTypeFilter === null ||
                                   equipped.spell.spell_type === this.currentTypeFilter;

                // Must match BOTH filters
                slot.classList.toggle('filtered-out', !(matchesSchool && matchesType));
            }
        });
    },

    // Open the spell picker modal
    openSpellPicker(slotIndex) {
        this.isAddingNewSlot = false; // We're replacing/filling an existing slot
        this.currentSlotIndex = slotIndex;
        this.renderSpellPicker();
    },

    // Add new spell slot
    addNewSpell() {
        this.isAddingNewSlot = true;
        this.currentSlotIndex = this.equippedSpells.length; // Next available index
        this.renderSpellPicker();
    },

    // Render the modal with spell list
    renderSpellPicker() {
        const container = document.getElementById('skill-modal-container');

        // Sync modal filters from spell book filters (convert null to 'all' for modal)
        this.currentSchoolFilter = this.currentBookFilter || 'all';
        this.currentModalTypeFilter = this.currentTypeFilter || 'all';

        container.innerHTML = `
            <div class="modal-overlay" onclick="window.SpellBookManager.closeSpellPicker()">
                <div class="skill-modal" onclick="event.stopPropagation()">
                    <div class="modal-header">
                        <h2>${t('ui', 'select_spell', 'Select Spell')}</h2>
                        <div class="modal-controls">
                            <input type="text"
                                   id="spell-search-input"
                                   class="skill-search"
                                   placeholder="${t('ui', 'search_spells_placeholder', 'Search spells...')}"
                                   oninput="window.SpellBookManager.filterSpells(this.value)">
                            <label class="scroll-toggle">
                                <input type="checkbox"
                                       id="show-equipped-toggle"
                                       ${this.showEquippedInPicker ? 'checked' : ''}
                                       onchange="window.SpellBookManager.toggleShowEquipped(this.checked)">
                                ${t('ui', 'show_in_book', 'Show in book')}
                            </label>
                        </div>
                    </div>
                    <div class="spell-school-tabs-modal">
                        <button class="spell-school-tab-modal ${this.currentSchoolFilter === 'all' ? 'active' : ''}" data-school="all" onclick="window.SpellBookManager.filterBySchool('all')">${t('ui', 'all', 'All')}</button>
                        ${this.schools.map(school => `
                            <button class="spell-school-tab-modal ${this.currentSchoolFilter === school.id ? 'active' : ''}" data-school="${school.id}" onclick="window.SpellBookManager.filterBySchool('${school.id}')">
                                ${school.name.replace(' Magic', '')}
                            </button>
                        `).join('')}
                    </div>
                    <div class="spell-type-tabs-modal">
                        <button class="spell-type-tab-modal ${this.currentModalTypeFilter === 'all' ? 'active' : ''}" data-type="all" onclick="window.SpellBookManager.filterModalByType('all')">${t('ui', 'all', 'All')}</button>
                        <button class="spell-type-tab-modal ${this.currentModalTypeFilter === 'combat' ? 'active' : ''}" data-type="combat" onclick="window.SpellBookManager.filterModalByType('combat')">${t('ui', 'combat', 'Combat')}</button>
                        <button class="spell-type-tab-modal ${this.currentModalTypeFilter === 'global' ? 'active' : ''}" data-type="global" onclick="window.SpellBookManager.filterModalByType('global')">${t('ui', 'global', 'Global')}</button>
                    </div>
                    <div class="skill-list" id="spell-picker-list">
                        ${this.renderSpellList(this.getFilteredSpells())}
                    </div>
                </div>
            </div>
        `;
    },

    // Check if a spell is already equipped (manually or via skill/item)
    isSpellEquipped(spellId) {
        return this.equippedSpells.some(eq => eq && eq.spell && eq.spell.id === spellId) ||
               this.skillGrantedSpells.some(eq => eq && eq.spell && eq.spell.id === spellId);
    },

    // Render the list of spells
    renderSpellList(spells) {
        if (spells.length === 0) {
            return '<div class="no-results">No spells found</div>';
        }

        return spells.map(spell => {
            const isEquipped = this.isSpellEquipped(spell.id);
            const description = this.formatSpellDescription(spell, 1);
            const clickHandler = isEquipped ? '' : `onclick="window.SpellBookManager.selectSpell('${spell.id}')"`;
            const disabledClass = isEquipped ? ' spell-option-disabled' : '';

            return `
                <div class="skill-option spell-option${disabledClass}" ${clickHandler}>
                    <div class="skill-icon-wrapper spell-icon-round">
                        <img src="/media/gamedata/spells/${spell.icon || spell.id}.webp"
                             class="skill-icon"
                             alt="${spell.id}"
                             onerror="window.SpellBookManager.handleSpellIconError(this, '${spell.icon || spell.id}')">
                        ${isEquipped ? `<div class="spell-equipped-badge">${t('ui', 'in_book_badge', 'In Book')}</div>` : ''}
                    </div>
                    <div class="skill-info">
                        <div class="skill-name">${spell.name || this.formatSpellName(spell.id_key || spell.id)}</div>
                        <div class="skill-meta" style="color: #7ec8e3; font-size: 0.8rem; margin-bottom: 6px;">
                            ${spell.school_display} • ${t('unitTypes', 'tier', 'Tier')} ${spell.level} • ${spell.spell_type === 'global' ? t('ui', 'global_spell', 'Global Spell') : t('ui', 'combat_spell', 'Combat Spell')}
                        </div>
                        <div class="skill-desc spell-description">${description}</div>
                    </div>
                </div>
            `;
        }).join('');
    },

    // Filter by search text
    filterSpells(searchText) {
        document.getElementById('spell-picker-list').innerHTML = this.renderSpellList(this.getFilteredSpells(searchText));
    },

    // Filter by school tab
    filterBySchool(schoolId) {
        this.currentSchoolFilter = schoolId;

        // Update active tab
        document.querySelectorAll('.spell-school-tab-modal').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.school === schoolId);
        });

        // Clear search input when changing school
        const searchInput = document.getElementById('spell-search-input');
        if (searchInput) searchInput.value = '';

        document.getElementById('spell-picker-list').innerHTML = this.renderSpellList(this.getFilteredSpells());
    },

    // Filter by type tab (Combat/Global Map)
    filterModalByType(type) {
        this.currentModalTypeFilter = type;

        // Update active tab
        document.querySelectorAll('.spell-type-tab-modal').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.type === type);
        });

        // Clear search input when changing type
        const searchInput = document.getElementById('spell-search-input');
        if (searchInput) searchInput.value = '';

        document.getElementById('spell-picker-list').innerHTML = this.renderSpellList(this.getFilteredSpells());
    },

    // Get spells filtered by current school, type, and equipped toggle
    getFilteredSpells(searchText = '') {
        let spells = this.availableSpells;

        // Filter by school
        if (this.currentSchoolFilter !== 'all') {
            spells = spells.filter(s => s.school === this.currentSchoolFilter);
        }

        // Filter by type (combat/global)
        if (this.currentModalTypeFilter !== 'all') {
            spells = spells.filter(s => s.spell_type === this.currentModalTypeFilter);
        }

        // Filter by search text
        if (searchText) {
            const search = searchText.toLowerCase();
            spells = spells.filter(spell => {
                const formattedName = this.formatSpellName(spell.id_key || spell.id).toLowerCase();
                return formattedName.includes(search) ||
                       spell.id.toLowerCase().includes(search) ||
                       spell.school_display.toLowerCase().includes(search);
            });
        }

        // Filter out equipped spells if toggle is off
        if (!this.showEquippedInPicker) {
            spells = spells.filter(spell => !this.isSpellEquipped(spell.id));
        }

        return spells;
    },

    // Toggle showing equipped spells in picker
    toggleShowEquipped(checked) {
        this.showEquippedInPicker = checked;
        const searchText = document.getElementById('spell-search-input')?.value || '';
        document.getElementById('spell-picker-list').innerHTML = this.renderSpellList(this.getFilteredSpells(searchText));
    },

    // Select a spell and assign it to the slot
    selectSpell(spellId) {
        const spell = this.availableSpells.find(s => s.id === spellId);
        if (!spell) {
            console.error('[SpellBookManager] Spell not found:', spellId);
            return;
        }

        if (this.isAddingNewSlot) {
            // Create a new slot with the spell
            this.equippedSpells.push({
                spell: spell,
                upgradeLevel: 1
            });
            // Create new slot element in the DOM
            this.createNewSlotElement(this.equippedSpells.length - 1);
        } else {
            // Fill existing empty slot
            this.equippedSpells[this.currentSlotIndex] = {
                spell: spell,
                upgradeLevel: 1  // Start at level 1
            };
            this.updateSlot(this.currentSlotIndex);
        }

        Debug.log(`[SpellBookManager] Equipped ${spell.id}, total slots: ${this.equippedSpells.length}`);

        this.isAddingNewSlot = false;
        this.closeSpellPicker();
    },

    // Helper to format spell name from id_key
    formatSpellName(idKey) {
        // Convert "day_01_magic_blessing" to "Blessing"
        // Remove school prefix and number, capitalize
        const parts = idKey.split('_');
        // Find the meaningful part (usually after "magic")
        const magicIndex = parts.indexOf('magic');
        if (magicIndex >= 0 && magicIndex < parts.length - 1) {
            return parts.slice(magicIndex + 1).map(word =>
                word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ');
        }
        // Fallback: just capitalize all parts
        return parts.map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    },

    // Get fallback icon path for _special variants
    getFallbackIconPath(spellId) {
        // Strip _special suffix to get base spell icon
        if (spellId.endsWith('_special')) {
            return `/media/gamedata/spells/${spellId.replace(/_special$/, '')}.webp`;
        }
        // For other cases, try a generic fallback
        return '/media/gamedata/factions/magic_icon.webp';
    },

    // Handle spell icon load error - try fallback
    handleSpellIconError(img, spellId) {
        const fallbackPath = this.getFallbackIconPath(spellId);
        if (img.src !== fallbackPath && !img.dataset.triedFallback) {
            img.dataset.triedFallback = 'true';
            img.src = fallbackPath;
        }
    },

    // Format spell description using the description pipeline
    formatSpellDescription(spell, upgradeLevel = 1) {
        // Check if description runtime is available
        if (typeof window.DescriptionRuntime === 'undefined' || typeof window.DescriptionFunctions === 'undefined') {
            Debug.warn('[SpellBookManager] Description runtime not available');
            return spell.description_template || 'No description available';
        }

        try {
            // Get effective hero stats
            const effectiveStats = EquipmentManager ? EquipmentManager.getEffectiveHeroStats() : {};

            // Create context for the spell using the same structure as HeroState
            // The transpiled functions expect data like targetMechanics to be directly on currentMagic
            // Use the magicDealer for the current upgrade level (0-indexed)
            const magicDealers = spell.raw_data?.battleMagic?.magicDealers || [];
            const dealerIndex = Math.min(upgradeLevel - 1, magicDealers.length - 1);
            const magicDealer = magicDealers[Math.max(0, dealerIndex)] || {};
            // For world magic spells, get usageLimit from worldMagic settings
            const worldMagicSettings = spell.raw_data?.worldMagic?.magicSettings?.[0] || {};

            const ctx = {
                currentMagic: {
                    id: spell.id_key || spell.id,
                    upgradeLevel: upgradeLevel - 1,  // 0-indexed
                    level: spell.level,
                    school: spell.school,
                    // Spread magicDealer data so targetMechanics is directly accessible
                    ...magicDealer,
                    // Include worldMagic settings (for usageLimit, etc.)
                    ...worldMagicSettings,
                    // Also include the full raw_data for functions that need config
                    config: spell.raw_data || {},
                },
                currentHero: {
                    // Use 'heroStat' as the key - this is what transpiled functions expect
                    heroStat: effectiveStats,
                    stats: effectiveStats,  // Keep for backwards compatibility
                    getSpellPower: (school) => {
                        // Base spell power + school-specific bonuses
                        return effectiveStats.spellPower || 0;
                    }
                }
            };

            // Select the correct description template/args for this upgrade level
            // spell.descriptions is an array where index 0 = level 1, index 1 = level 2, etc.
            const descriptions = spell.descriptions || [];
            const descIndex = Math.min(upgradeLevel - 1, descriptions.length - 1);
            const levelDesc = descriptions[Math.max(0, descIndex)] || {};

            // Use level-specific template/args, falling back to legacy fields
            const template = levelDesc.description_template || spell.description_template || '';
            const args = levelDesc.description_args || spell.description_args || [];

            if (!template) {
                return 'No description available';
            }

            return window.DescriptionRuntime.formatDescription(template, args, ctx);
        } catch (error) {
            Debug.warn('[SpellBookManager] Error formatting spell description:', error);
            return spell.description_template || 'Error loading description';
        }
    },

    // Create a new slot element in the DOM
    createNewSlotElement(index) {
        const grid = document.getElementById('spell-grid');
        const equipped = this.equippedSpells[index];
        const spell = equipped.spell;
        const description = this.formatSpellDescription(spell, equipped.upgradeLevel);
        const maxLevel = spell.max_upgrade_level || 3;
        const currentLevel = equipped.upgradeLevel;

        const slotDiv = document.createElement('div');
        slotDiv.className = 'spell-slot equipped has-tooltip';
        slotDiv.dataset.slotIndex = index;
        slotDiv.dataset.tooltipPlacement = 'left';
        const isStarting = equipped.isStartingSpell;
        slotDiv.innerHTML = `
            <img src="/media/gamedata/spells/${spell.icon || spell.id_key || spell.id}.webp"
                 alt="${spell.id_key || spell.id}"
                 class="spell-icon"
                 onerror="window.SpellBookManager.handleSpellIconError(this, '${spell.icon || spell.id_key || spell.id}')">
            <button class="spell-slot-remove" onclick="event.stopPropagation(); window.SpellBookManager.removeSpell(${index})" ${isStarting ? 'disabled' : ''}>×</button>
            ${isStarting ? `<div class="spell-starting-badge">${t('ui', 'starting_badge', 'Starting')}</div>` : ''}
            <div class="spell-level-badge">${currentLevel}</div>
            <div class="tooltip tooltip-spell">
                <div class="tooltip-title tooltip-title--blue">${spell.name || this.formatSpellName(spell.id_key || spell.id)}</div>
                <div class="tooltip-subtitle">${spell.school_display}</div>
                <div class="tooltip-meta">${spell.spell_type === 'global' ? t('ui', 'global_spell', 'Global Spell') : t('ui', 'combat_spell', 'Combat Spell')}</div>
                <div class="tooltip-meta">${t('unitTypes', 'tier', 'Tier')} ${spell.level}</div>
                <div class="tooltip-highlight tooltip-level">${t('ui', 'level', 'Level')} ${currentLevel}/${maxLevel}</div>
                <div class="tooltip-section">
                    <div class="tooltip-text">${description}</div>
                </div>
                <div class="tooltip-actions">
                    <button class="tooltip-action-btn"
                            onclick="event.stopPropagation(); window.SpellBookManager.upgradeSpell(${index})"
                            ${currentLevel >= maxLevel ? 'disabled' : ''}>
                        ${t('ui', 'upgrade', 'Upgrade')}
                    </button>
                    <button class="tooltip-action-btn"
                            onclick="event.stopPropagation(); window.SpellBookManager.downgradeSpell(${index})"
                            ${currentLevel <= 1 ? 'disabled' : ''}>
                        ${t('ui', 'downgrade', 'Downgrade')}
                    </button>
                    <button class="tooltip-action-btn tooltip-remove-btn"
                            onclick="event.stopPropagation(); window.SpellBookManager.removeSpell(${index})"
                            ${isStarting ? 'disabled' : ''}>
                        ${t('ui', 'remove', 'Remove')}
                    </button>
                </div>
            </div>
        `;

        // Add click handler for spell replacement
        slotDiv.addEventListener('click', () => this.openSpellPicker(index));

        // Insert before the "+" add button (which should always be last)
        const addButton = grid.querySelector('.spell-slot-add');
        if (addButton) {
            grid.insertBefore(slotDiv, addButton);
        } else {
            grid.appendChild(slotDiv);
        }
    },

    // Update a single slot's UI to show equipped spell or empty state
    updateSlot(index) {
        const slotElement = document.querySelector(`.spell-slot[data-slot-index="${index}"]`);
        if (!slotElement) return;

        const equipped = this.equippedSpells[index];

        if (equipped === null) {
            // Empty slot
            slotElement.innerHTML = '<span class="add-text">+</span>';
            slotElement.classList.remove('equipped');
        } else {
            // Filled slot with spell
            const spell = equipped.spell;
            const description = this.formatSpellDescription(spell, equipped.upgradeLevel);
            const maxLevel = spell.max_upgrade_level || 3;
            const currentLevel = equipped.upgradeLevel;
            const isStarting = equipped.isStartingSpell;

            slotElement.classList.add('has-tooltip');
            slotElement.dataset.tooltipPlacement = 'left';
            slotElement.innerHTML = `
                <img src="/media/gamedata/spells/${spell.icon || spell.id_key || spell.id}.webp"
                     alt="${spell.id_key || spell.id}"
                     class="spell-icon"
                     onerror="window.SpellBookManager.handleSpellIconError(this, '${spell.icon || spell.id_key || spell.id}')">
                <button class="spell-slot-remove" onclick="event.stopPropagation(); window.SpellBookManager.removeSpell(${index})" ${isStarting ? 'disabled' : ''}>×</button>
                ${isStarting ? `<div class="spell-starting-badge">${t('ui', 'starting_badge', 'Starting')}</div>` : ''}
                <div class="spell-level-badge">${currentLevel}</div>
                <div class="tooltip tooltip-spell">
                    <div class="tooltip-title tooltip-title--blue">${spell.name || this.formatSpellName(spell.id_key || spell.id)}</div>
                    <div class="tooltip-subtitle">${spell.school_display}</div>
                    <div class="tooltip-meta">${spell.spell_type === 'global' ? t('ui', 'global_spell', 'Global Spell') : t('ui', 'combat_spell', 'Combat Spell')}</div>
                    <div class="tooltip-meta">${t('unitTypes', 'tier', 'Tier')} ${spell.level}</div>
                    <div class="tooltip-highlight tooltip-level">${t('ui', 'level', 'Level')} ${currentLevel}/${maxLevel}</div>
                    <div class="tooltip-section">
                        <div class="tooltip-text">${description}</div>
                    </div>
                    <div class="tooltip-actions">
                        <button class="tooltip-action-btn"
                                onclick="event.stopPropagation(); window.SpellBookManager.upgradeSpell(${index})"
                                ${currentLevel >= maxLevel ? 'disabled' : ''}>
                            ${t('ui', 'upgrade', 'Upgrade')}
                        </button>
                        <button class="tooltip-action-btn"
                                onclick="event.stopPropagation(); window.SpellBookManager.downgradeSpell(${index})"
                                ${currentLevel <= 1 ? 'disabled' : ''}>
                            ${t('ui', 'downgrade', 'Downgrade')}
                        </button>
                        <button class="tooltip-action-btn tooltip-remove-btn"
                                onclick="event.stopPropagation(); window.SpellBookManager.removeSpell(${index})"
                                ${isStarting ? 'disabled' : ''}>
                            ${t('ui', 'remove', 'Remove')}
                        </button>
                    </div>
                </div>
            `;
            slotElement.classList.add('equipped');
        }

        // Reapply all filters
        this.applyAllFilters();
    },

    // Upgrade spell to next level
    upgradeSpell(index, isSkillGranted = false) {
        const spellArray = isSkillGranted ? this.skillGrantedSpells : this.equippedSpells;
        const equipped = spellArray[index];
        if (!equipped) return;

        const maxLevel = equipped.spell.max_upgrade_level || 3;
        if (equipped.upgradeLevel >= maxLevel) return;

        equipped.upgradeLevel++;
        Debug.log(`[SpellBookManager] Upgraded spell to level ${equipped.upgradeLevel}`);

        this.updateSlotInPlace(index, isSkillGranted);
    },

    // Downgrade spell to previous level
    downgradeSpell(index, isSkillGranted = false) {
        const spellArray = isSkillGranted ? this.skillGrantedSpells : this.equippedSpells;
        const equipped = spellArray[index];
        if (!equipped) return;

        if (equipped.upgradeLevel <= 1) return;

        equipped.upgradeLevel--;
        Debug.log(`[SpellBookManager] Downgraded spell to level ${equipped.upgradeLevel}`);

        this.updateSlotInPlace(index, isSkillGranted);
    },

    // Update a slot in place without rebuilding the grid
    updateSlotInPlace(index, isSkillGranted = false) {
        const selector = isSkillGranted
            ? `.spell-slot.skill-granted[data-slot-index="${index}"]`
            : `.spell-slot[data-slot-index="${index}"]:not(.skill-granted)`;
        const slotElement = document.querySelector(selector);
        if (!slotElement) return;

        const spellArray = isSkillGranted ? this.skillGrantedSpells : this.equippedSpells;
        const equipped = spellArray[index];
        const spell = equipped.spell;
        const description = this.formatSpellDescription(spell, equipped.upgradeLevel);
        const maxLevel = spell.max_upgrade_level || 4;
        const currentLevel = equipped.upgradeLevel;

        // Update level badge (always in slot)
        const levelBadge = slotElement.querySelector('.spell-level-badge');
        if (levelBadge) levelBadge.textContent = currentLevel;

        // Helper to find tooltip elements - check slot first, then active tooltip in body
        // (Tooltip system moves tooltips to document.body when visible)
        const findTooltipElement = (selector) => {
            // Try slot first (tooltip not visible or not moved yet)
            let el = slotElement.querySelector(selector);
            if (el) return el;
            // Try active tooltip in document.body (tooltip is visible and was moved)
            const activeTooltip = document.body.querySelector('.tooltip[style*="display: block"]');
            if (activeTooltip) {
                el = activeTooltip.querySelector(selector);
            }
            return el;
        };

        // Update tooltip level
        const tooltipLevel = findTooltipElement('.tooltip-level');
        if (tooltipLevel) tooltipLevel.textContent = `Level ${currentLevel}/${maxLevel}`;

        // Update tooltip description
        const tooltipDesc = findTooltipElement('.tooltip-text');
        if (tooltipDesc) tooltipDesc.innerHTML = description;

        // Update button states
        const upgradeBtn = findTooltipElement('.tooltip-action-btn:first-child');
        const downgradeBtn = findTooltipElement('.tooltip-action-btn:nth-child(2)');
        if (upgradeBtn) upgradeBtn.disabled = currentLevel >= maxLevel;
        if (downgradeBtn) downgradeBtn.disabled = currentLevel <= 1;
    },

    // Remove spell from slot
    removeSpell(index) {
        const equipped = this.equippedSpells[index];
        if (!equipped) return;

        // Cannot remove starting spells
        if (equipped.isStartingSpell) {
            Debug.log(`[SpellBookManager] Cannot remove starting spell`);
            return;
        }

        const spellName = this.formatSpellName(equipped.spell.id_key || equipped.spell.id);
        Debug.log(`[SpellBookManager] Removing spell ${spellName} from slot ${index}`);

        // Remove the spell and shift remaining spells up
        this.equippedSpells.splice(index, 1);
        this.rebuildSpellGrid();
    },

    // Max all equipped spells
    maxAllSpells() {
        let upgraded = 0;
        this.equippedSpells.forEach((equipped, index) => {
            if (equipped !== null) {
                const maxLevel = equipped.spell.max_upgrade_level || 3;
                if (equipped.upgradeLevel < maxLevel) {
                    equipped.upgradeLevel = maxLevel;
                    upgraded++;
                }
            }
        });

        if (upgraded > 0) {
            Debug.log(`[SpellBookManager] Maxed ${upgraded} spells`);
            this.rebuildSpellGrid();
        }
    },

    // Reset all equipped spells to level 1
    resetAllSpells() {
        let reset = 0;
        this.equippedSpells.forEach((equipped, index) => {
            if (equipped !== null && equipped.upgradeLevel > 1) {
                equipped.upgradeLevel = 1;
                reset++;
            }
        });

        if (reset > 0) {
            Debug.log(`[SpellBookManager] Reset ${reset} spells to level 1`);
            this.rebuildSpellGrid();
        }
    },

    // Rebuild the entire grid - shows filled spells + one "+" button to add more
    rebuildSpellGrid() {
        const grid = document.getElementById('spell-grid');
        grid.innerHTML = '';

        // Remove any null entries (clean up the array)
        this.equippedSpells = this.equippedSpells.filter(e => e !== null);

        // Helper to render a spell slot
        const renderSpellSlot = (equipped, index, isSkillGranted = false) => {
            const slotDiv = document.createElement('div');
            slotDiv.className = 'spell-slot equipped has-tooltip' + (isSkillGranted ? ' skill-granted' : '');
            slotDiv.dataset.slotIndex = index;
            slotDiv.dataset.tooltipPlacement = 'left';
            if (isSkillGranted) {
                slotDiv.dataset.skillGranted = 'true';
            }

            const spell = equipped.spell;
            const description = this.formatSpellDescription(spell, equipped.upgradeLevel);
            const maxLevel = spell.max_upgrade_level || 4;
            const currentLevel = equipped.upgradeLevel;
            const isStarting = equipped.isStartingSpell;
            const isLocked = isStarting || isSkillGranted;

            // Badge text based on spell source
            let badgeHtml = '';
            if (isStarting) {
                badgeHtml = `<div class="spell-starting-badge">${t('ui', 'starting_badge', 'Starting')}</div>`;
            } else if (isSkillGranted) {
                let source = t('ui', 'skill_badge', 'Skill');
                if (equipped.grantingSource === 'item') source = t('ui', 'scroll_badge', 'Scroll');
                else if (equipped.grantingSource === 'subskill') source = t('ui', 'subskill_badge', 'Subskill');
                badgeHtml = `<div class="spell-skill-badge">${source}</div>`;
            }

            slotDiv.innerHTML = `
                <img src="/media/gamedata/spells/${spell.icon || spell.id_key || spell.id}.webp"
                     alt="${spell.id_key || spell.id}"
                     class="spell-icon"
                     onerror="window.SpellBookManager.handleSpellIconError(this, '${spell.icon || spell.id_key || spell.id}')">
                ${!isLocked ? `<button class="spell-slot-remove" onclick="event.stopPropagation(); window.SpellBookManager.removeSpell(${index})">×</button>` : ''}
                ${badgeHtml}
                <div class="spell-level-badge">${currentLevel}</div>
                <div class="tooltip tooltip-spell">
                    <div class="tooltip-title tooltip-title--blue">${spell.name || this.formatSpellName(spell.id_key || spell.id)}</div>
                    <div class="tooltip-subtitle">${spell.school_display}</div>
                    <div class="tooltip-meta">${spell.spell_type === 'global' ? t('ui', 'global_spell', 'Global Spell') : t('ui', 'combat_spell', 'Combat Spell')}</div>
                    <div class="tooltip-meta">${t('unitTypes', 'tier', 'Tier')} ${spell.level}</div>
                    <div class="tooltip-highlight tooltip-level">${t('ui', 'level', 'Level')} ${currentLevel}/${maxLevel}</div>
                    <div class="tooltip-section">
                        <div class="tooltip-text">${description}</div>
                    </div>
                    <div class="tooltip-actions">
                        <button class="tooltip-action-btn"
                                onclick="event.stopPropagation(); window.SpellBookManager.upgradeSpell(${index}, ${isSkillGranted})"
                                ${currentLevel >= maxLevel ? 'disabled' : ''}>${t('ui', 'upgrade', 'Upgrade')}</button>
                        <button class="tooltip-action-btn"
                                onclick="event.stopPropagation(); window.SpellBookManager.downgradeSpell(${index}, ${isSkillGranted})"
                                ${currentLevel <= 1 ? 'disabled' : ''}>${t('ui', 'downgrade', 'Downgrade')}</button>
                        ${!isLocked ? `<button class="tooltip-action-btn tooltip-remove-btn"
                                onclick="event.stopPropagation(); window.SpellBookManager.removeSpell(${index})">${t('ui', 'remove', 'Remove')}</button>` : ''}
                    </div>
                </div>
            `;

            // Click to replace this spell (only for non-locked spells)
            if (!isLocked) {
                slotDiv.addEventListener('click', () => this.openSpellPicker(index));
            }
            grid.appendChild(slotDiv);
        };

        // Render all equipped spells (user-selected)
        this.equippedSpells.forEach((equipped, index) => {
            renderSpellSlot(equipped, index, false);
        });

        // Render skill-granted spells (from skills)
        this.skillGrantedSpells.forEach((equipped, index) => {
            renderSpellSlot(equipped, index, true);
        });

        // Add the "+" button at the end to add new spells
        const addSlot = document.createElement('div');
        addSlot.className = 'spell-slot spell-slot-add';
        addSlot.innerHTML = '<span class="add-text">+</span>';
        addSlot.addEventListener('click', () => this.addNewSpell());
        grid.appendChild(addSlot);

        this.applyAllFilters();
    },

    // Update all spell descriptions (called when hero stats change)
    updateAllDescriptions() {
        Debug.log('[SpellBookManager] Updating all spell descriptions');

        // Rebuild the grid to recalculate all descriptions
        this.rebuildSpellGrid();
    },

    // Close the modal
    closeSpellPicker() {
        this.currentSlotIndex = null;
        this.isAddingNewSlot = false;
        document.getElementById('skill-modal-container').innerHTML = '';
    }
};

// Expose to window for cross-module access and inline onclick handlers
window.SpellBookManager = SpellBookManager;
