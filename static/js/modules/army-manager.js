/**
 * Army Manager - Manages hero's army units, stack counts, and unit selection
 */

import { heroBuild } from './state.js';
import { buildUrl, Debug, t } from './utils.js';

export const ArmyManager = {
    currentSlotIndex: null,
    currentFactionTab: null,  // Currently selected faction in picker
    allFactions: [],  // All factions data from API

    // Initialize the army panel
    async init() {
        Debug.log('[ArmyManager] Initializing...');

        // Get hero faction from heroBuild (already set by SkillManager)
        const faction = heroBuild.heroFaction;
        if (!faction) {
            console.error('[ArmyManager] No faction found');
            return;
        }

        // Load ALL units from all factions
        await this.loadAllUnits();

        // Set default faction tab to hero's faction
        this.currentFactionTab = faction;

        // Get starting squad from hero card
        const heroCard = document.querySelector('[data-hero-faction]');
        const startSquadData = heroCard?.dataset.heroStartSquad;

        if (startSquadData) {
            try {
                const startSquad = JSON.parse(startSquadData);
                this.populateStartingArmy(startSquad);
            } catch (error) {
                console.error('[ArmyManager] Error parsing start squad:', error);
            }
        }

        // Bind click events on unit slots - always open picker to select/replace unit
        document.querySelectorAll('.unit-slot').forEach(slot => {
            slot.addEventListener('click', () => {
                const slotIndex = parseInt(slot.dataset.slotIndex, 10);
                this.openUnitPicker(slotIndex);
            });
        });

        // Set up tooltip callbacks for unit tooltips
        this.setupTooltipCallbacks();

        this.render();
    },

    // Setup tooltip callbacks for auto-focus and save on close
    setupTooltipCallbacks() {
        // Skip if Tooltip is not available
        if (!window.Tooltip || typeof window.Tooltip.setOnShow !== 'function') {
            Debug.warn('[ArmyManager] Tooltip not available, skipping tooltip callbacks');
            return;
        }

        const self = this;

        // On tooltip show: focus the stack input if it's a unit tooltip
        window.Tooltip.setOnShow((tooltip, trigger) => {
            if (!tooltip.classList.contains('tooltip-unit')) return;

            const stackInput = tooltip.querySelector('.unit-stack-input');
            if (stackInput) {
                // Small delay to ensure tooltip is fully visible
                setTimeout(() => {
                    stackInput.focus();
                    stackInput.select();
                }, 50);

                // Handle Enter key to save and update descriptions (without closing)
                stackInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        self.saveAndUpdateTooltip(tooltip, stackInput);
                    }
                });
            }
        });

        // On tooltip hide: save the stack count if valid
        window.Tooltip.setOnHide((tooltip, trigger) => {
            if (!tooltip.classList.contains('tooltip-unit')) return;

            const slotIndex = parseInt(tooltip.dataset.unitSlotIndex, 10);
            if (isNaN(slotIndex)) return;

            const stackInput = tooltip.querySelector('.unit-stack-input');
            if (!stackInput) return;

            const newCount = parseInt(stackInput.value, 10);
            const armySlot = heroBuild.army[slotIndex];

            // Only update if valid positive integer and different from current
            if (!isNaN(newCount) && newCount > 0 && armySlot && armySlot.count !== newCount) {
                armySlot.count = newCount;
                self.render();
                Debug.log(`[ArmyManager] Updated stack count for slot ${slotIndex} to ${newCount}`);
            }
        });
    },

    // Save stack count and update tooltip descriptions in-place (without closing)
    saveAndUpdateTooltip(tooltip, stackInput) {
        const slotIndex = parseInt(tooltip.dataset.unitSlotIndex, 10);
        if (isNaN(slotIndex)) return;

        const newCount = parseInt(stackInput.value, 10);
        const armySlot = heroBuild.army[slotIndex];

        // Validate: must be a positive integer
        if (isNaN(newCount) || newCount <= 0) {
            // Reset to current value if invalid
            stackInput.value = armySlot?.count || 1;
            return;
        }

        if (!armySlot) return;

        // Update the count in the data model
        armySlot.count = newCount;

        // Update the slot display (the badge showing count)
        const slots = document.querySelectorAll('.unit-slot');
        const slot = slots[slotIndex];
        if (slot) {
            const countBadge = slot.querySelector('.unit-count');
            if (countBadge) {
                countBadge.textContent = newCount;
            }
        }

        // Update army value display
        this.updateArmyValue();

        // Update the abilities section in the tooltip with new stack count
        const abilitiesRow = tooltip.querySelector('.tooltip-abilities-row');
        if (abilitiesRow && armySlot.unitData) {
            abilitiesRow.outerHTML = this.buildTooltipAbilitiesHtml(armySlot.unitData, newCount);
        }

        Debug.log(`[ArmyManager] Updated stack count for slot ${slotIndex} to ${newCount}`);

        // Keep focus on the input and select the text
        stackInput.focus();
        stackInput.select();
    },

    // Fetch all units from all factions
    async loadAllUnits() {
        try {
            const response = await fetch(buildUrl('/api/units/all/'));
            const data = await response.json();
            this.allFactions = data.factions || [];

            // Also maintain backwards-compatible factionUnits for hero's faction
            const heroFaction = this.allFactions.find(f => f.slug === heroBuild.heroFaction);
            if (heroFaction) {
                heroBuild.factionUnits = heroFaction.units_by_tier || {};
            }

            Debug.log(`[ArmyManager] Loaded ${this.allFactions.length} factions with units`);
        } catch (error) {
            console.error('[ArmyManager] Failed to load units:', error);
            this.allFactions = [];
            heroBuild.factionUnits = {};
        }
    },

    // Helper: Find unit by ID across ALL factions
    findUnitById(unitId) {
        for (const faction of this.allFactions) {
            for (const tier of Object.keys(faction.units_by_tier || {})) {
                const units = faction.units_by_tier[tier];
                const unit = units.find(u => u.id === unitId);
                if (unit) return unit;
            }
        }
        return null;
    },

    // Helper: Get units for a specific faction
    getFactionUnits(factionSlug) {
        const faction = this.allFactions.find(f => f.slug === factionSlug);
        return faction ? faction.units_by_tier : {};
    },

    // Helper: Get all units as flat array
    getAllUnits() {
        const allUnits = [];
        for (const faction of this.allFactions) {
            for (const tier of Object.keys(faction.units_by_tier || {})) {
                allUnits.push(...faction.units_by_tier[tier]);
            }
        }
        return allUnits;
    },

    // Populate starting army from startSquad data
    populateStartingArmy(startSquad) {
        Debug.log('[ArmyManager] Populating starting army:', startSquad);

        startSquad.forEach((entry, index) => {
            if (index >= 7) return; // Only 7 slots

            const unitId = entry.sid;
            const minCount = entry.min || 0;
            const maxCount = entry.max || minCount;
            const count = Math.floor((minCount + maxCount) / 2); // Use average

            // Find unit data
            const unitData = this.findUnitById(unitId);
            if (unitData) {
                heroBuild.army[index] = {
                    unitId: unitId,
                    count: count,
                    unitData: unitData,
                    isStartingUnit: true
                };
                Debug.log(`[ArmyManager] Added starting unit: ${unitData.name} x${count}`);
            }
        });

        this.render();
    },

    // Render the army slots
    render() {
        const slots = document.querySelectorAll('.unit-slot');

        slots.forEach((slot, index) => {
            const armySlot = heroBuild.army[index];

            // Clear previous content
            slot.innerHTML = '';
            slot.classList.remove('filled');

            if (armySlot && armySlot.unitData) {
                // Filled slot
                slot.classList.add('filled', 'has-tooltip');
                slot.dataset.tooltipPlacement = 'top';

                const unit = armySlot.unitData;

                slot.innerHTML = `
                    <img src="${unit.icon_url}" alt="${unit.name}" class="unit-icon" onerror="this.src='/media/gamedata/ui/unit_placeholder.webp'">
                    <span class="unit-count">${armySlot.count}</span>
                    <button class="unit-remove-btn" onclick="event.stopPropagation(); window.ArmyManager.removeUnitFromSlot(${slot.dataset.slotIndex});" title="Remove unit">&times;</button>
                    <div class="tooltip tooltip-unit" data-unit-slot-index="${index}">
                        <div class="tooltip-header">
                            <span class="tooltip-title">${unit.name}</span>
                            <input type="number" class="unit-stack-input" value="${armySlot.count}" min="1" step="1" title="Stack size">
                        </div>
                        <div class="tooltip-tier">${t('unitTypes', 'tier', 'Tier')} ${unit.tier} · ${this.formatUnitType(unit)}</div>
                        <div class="unit-stat-bar tooltip-stat-bar">${this.buildStatBar(unit.stats)}</div>
                        ${this.buildTooltipAbilitiesHtml(unit, armySlot.count)}
                        <div class="tooltip-value">${unit.squad_value} gold</div>
                        ${unit.description ? `<div class="tooltip-description">${unit.description}</div>` : ''}
                    </div>
                `;
            } else {
                // Empty slot
                slot.classList.remove('has-tooltip');
                delete slot.dataset.tooltipPlacement;
                slot.innerHTML = '<span class="add-text">+</span>';
            }
        });

        this.updateArmyValue();
    },

    // Format unit type display
    formatUnitType(unit) {
        const types = [];
        if (unit.attack_type === 'ranged') types.push(t('unitTypes', 'ranged', 'Ranged'));
        else if (unit.attack_type === 'long_reach') types.push(t('unitTypes', 'long_reach', 'Long Reach'));
        else if (unit.attack_type === 'magic') types.push(t('unitTypes', 'magic', 'Magic'));
        else types.push(t('unitTypes', 'melee', 'Melee'));
        if (unit.move_type === 'fly') types.push(t('unitTypes', 'flying', 'Flying'));
        return types.join(', ');
    },

    // Stat icons SVGs (inline for reliability)
    statIcons: {
        hp: `<img src="/media/gamedata/ui/unit_health.webp" alt="HP" style="width: 18px; height: 18px; vertical-align: middle;">`,
        damage: `<img src="/media/gamedata/ui/unit_damage.webp" alt="Damage" style="width: 18px; height: 18px; vertical-align: middle;">`,
        offence: `<img src="/media/gamedata/ui/unit_attack.webp" alt="Attack" style="width: 18px; height: 18px; vertical-align: middle;">`,
        defence: `<img src="/media/gamedata/ui/unit_defence.webp" alt="Defence" style="width: 18px; height: 18px; vertical-align: middle;">`,
        luck: `<img src="/media/gamedata/ui/unit_luck.webp" alt="Luck" style="width: 18px; height: 18px; vertical-align: middle;">`,
        morale: `<img src="/media/gamedata/ui/unit_moral.webp" alt="Morale" style="width: 18px; height: 18px; vertical-align: middle;">`,
        speed: `<img src="/media/gamedata/ui/unit_speed.webp" alt="Speed" style="width: 18px; height: 18px; vertical-align: middle;">`,
        initiative: `<img src="/media/gamedata/ui/unit_init.webp" alt="Initiative" style="width: 18px; height: 18px; vertical-align: middle;">`,
    },

    // Get stat icon HTML
    getStatIcon(stat) {
        return this.statIcons[stat] || '';
    },

    // Build stat bar HTML for unit card
    buildStatBar(stats) {
        const statOrder = ['hp', 'damage', 'offence', 'defence', 'luck', 'morale', 'speed', 'initiative'];
        const statLabels = {
            hp: t('unitStats', 'hp', 'Health'),
            damage: t('unitStats', 'damage', 'Damage'),
            offence: t('unitStats', 'offence', 'Attack'),
            defence: t('unitStats', 'defence', 'Defence'),
            luck: t('unitStats', 'luck', 'Luck'),
            morale: t('unitStats', 'morale', 'Morale'),
            speed: t('unitStats', 'speed', 'Speed'),
            initiative: t('unitStats', 'initiative', 'Initiative'),
        };
        const statDescriptions = {
            hp: t('unitStats', 'hp_desc', 'Hit points per creature'),
            damage: t('unitStats', 'damage_desc', 'Base damage dealt per attack'),
            offence: t('unitStats', 'offence_desc', 'Increases damage dealt'),
            defence: t('unitStats', 'defence_desc', 'Reduces damage taken'),
            luck: t('unitStats', 'luck_desc', 'Chance for critical hits'),
            morale: t('unitStats', 'morale_desc', 'Chance for extra actions'),
            speed: t('unitStats', 'speed_desc', 'Movement range in combat'),
            initiative: t('unitStats', 'initiative_desc', 'Determines turn order'),
        };

        // Format damage as range
        const damageValue = stats.damage_min === stats.damage_max
            ? stats.damage_min
            : `${stats.damage_min}-${stats.damage_max}`;

        const statValues = {
            hp: stats.hp,
            damage: damageValue,
            offence: stats.offence,
            defence: stats.defence,
            luck: stats.luck || 0,
            morale: stats.morale || 0,
            speed: stats.speed,
            initiative: stats.initiative,
        };

        return statOrder.map(stat => `
            <div class="unit-stat has-tooltip" data-tooltip-placement="top">
                <span class="unit-stat-icon">${this.getStatIcon(stat)}</span>
                <span class="unit-stat-value">${statValues[stat]}</span>
                <div class="tooltip">
                    <div class="tooltip-title">${statLabels[stat]}: ${statValues[stat]}</div>
                    <div class="tooltip-text">${statDescriptions[stat]}</div>
                </div>
            </div>
        `).join('');
    },

    // Extract raw ability data from unit's raw_data based on ability ID
    getRawAbilityData(abilityId, rawData) {
        if (!rawData || !abilityId) return null;

        // Parse ability ID format: unitId_type_index (e.g., "crossbowman_ability_0", "esquire_passive_0", "unit_aura")
        const passiveMatch = abilityId.match(/_passive_(\d+)$/);
        if (passiveMatch) {
            const index = parseInt(passiveMatch[1], 10);
            return rawData.passives?.[index] || null;
        }

        const abilityMatch = abilityId.match(/_ability_(\d+)$/);
        if (abilityMatch) {
            const index = parseInt(abilityMatch[1], 10);
            return rawData.abilities?.[index] || null;
        }

        if (abilityId.endsWith('_aura')) {
            return rawData.aura || null;
        }

        return null;
    },

    // Check if a description has failed resolutions (contains obvious "0" placeholders)
    hasFailedResolution(text) {
        if (!text) return false;
        // Patterns that indicate failed resolution: +0, -0, 0%, 0–0, etc.
        // Be careful not to flag valid ranges like "0 to 5" or "–5 to 0"
        const failurePatterns = [
            /[+\-–]\s*0\s*(?:%|$|[,\.])/,     // +0, -0, +0%, -0% (not followed by space/word)
            /\b0[–-]0\b/,                      // 0-0, 0–0 (damage ranges of zero)
            /\bby\s+0\b/,                      // "by 0", "increases by 0"
            /:\s*0\s+(?:round|turn|second)/i,  // ": 0 round(s)" (zero duration)
        ];
        return failurePatterns.some(pattern => pattern.test(text));
    },

    // Format ability description using DescriptionRuntime
    formatAbilityDescription(ability, unitData, stackCount = 1) {
        if (!ability.description_template) {
            return ability.name || '';
        }

        if (!ability.description_args || ability.description_args.length === 0) {
            return ability.description_template;
        }

        try {
            const rawData = unitData?.raw_data || {};
            const unitId = rawData.id || unitData?.id || '';

            // Use raw ability data from backend if available (includes upgrade variant fallback)
            // Otherwise fall back to index-based lookup for backwards compatibility
            let rawAbility = ability.raw_data || this.getRawAbilityData(ability.id, rawData);

            // Inject buff data into ability if missing (for functions like current_unit_ability_buff_duration)
            rawAbility = this.injectBuffDataIntoAbility(rawAbility, ability, unitId);

            // Deep clone passives and inject buff links so description functions can find them
            // Functions access paths like passives[0].actions[0].damageDealer.buff.sid
            const passives = this.injectBuffLinksIntoPassives(
                rawData.passives || [],
                ability.description_args,
                unitId
            );

            // Flatten stats to top level for description functions that expect ctx.currentUnit.damageMin
            // fullStacks is the actual stack count (defaults to 1 if not provided)
            // Note: Game uses fullStacks - 1 internally, so we pass count - 1 to match game behavior
            const currentUnit = {
                ...rawData,
                ...rawData.stats,  // Flatten stats (damageMin, damageMax, etc.) to top level
                passives: passives,  // Use enriched passives with buff links
                fullStacks: stackCount - 1,  // Game script adds 1 to this value
                startBattleFullStacks: stackCount - 1,
            };

            const ctx = {
                currentUnit: currentUnit,
                currentAbility: rawAbility || ability,
            };

            const resolved = window.DescriptionRuntime.formatDescription(
                ability.description_template,
                ability.description_args,
                ctx
            );

            // Debug logging for cavalry
            if (rawData.id && rawData.id.includes('cavalry')) {
                Debug.log('[DEBUG] Description resolved:', {
                    abilityId: ability.id,
                    template: ability.description_template?.substring(0, 50),
                    resolved: resolved?.substring(0, 100),
                    passivesLength: passives.length,
                    passive2HasBuff: passives[2]?.actions?.[0]?.damageDealer?.buff?.sid
                });
            }

            // If resolution produced obvious "0" placeholders, fall back to template
            // (This happens when base units lack the data structure that upgraded units have)
            if (this.hasFailedResolution(resolved)) {
                // Return template with placeholders stripped for cleaner display
                return ability.description_template.replace(/\{(\d+)\}/g, '?');
            }

            return resolved;
        } catch (e) {
            Debug.warn('[ArmyManager] Error formatting ability description:', e);
            return ability.description_template;
        }
    },

    /**
     * Inject buff links into passives so description functions can find them.
     * Description functions access paths like passives[n].actions[0].damageDealer.buff.sid
     * but our static data doesn't have this structure. This method creates it using
     * GameData.passiveBuffLinks which maps passive name keys to their linked buffs.
     *
     * Also handles cases where an ability exists in the ability list but its raw_data
     * passive doesn't exist (e.g., upgrade-only abilities shown on base units).
     */
    injectBuffLinksIntoPassives(passives, descriptionArgs, unitId) {
        if (!descriptionArgs) {
            return passives || [];
        }

        // Debug logging
        if (unitId && unitId.includes('cavalry')) {
            Debug.log('[DEBUG] injectBuffLinksIntoPassives:', {
                unitId,
                passivesCount: passives?.length,
                descriptionArgs,
                hasGameData: typeof window.GameData !== 'undefined',
                hasPassiveBuffLinks: typeof window.GameData !== 'undefined' && !!window.GameData.passiveBuffLinks
            });
        }

        // Extract base unit ID (remove _upg, _upg_alt suffixes)
        const baseUnitId = unitId ? unitId.replace(/_upg(_alt)?$/, '') : '';

        // Deep clone passives to avoid modifying original data
        const enrichedPassives = (passives || []).map(passive =>
            JSON.parse(JSON.stringify(passive))
        );

        // Find the maximum passive index referenced by description functions
        // Function names are like "unic_unit_{unitId}_passive_{N}"
        let maxPassiveIndex = enrichedPassives.length - 1;
        for (const funcName of descriptionArgs) {
            const match = funcName.match(/unic_unit_([^_]+(?:_[^_]+)*)_passive_(\d+)/);
            if (match) {
                const passiveNum = parseInt(match[2], 10);  // 1-based
                const passiveIndex = passiveNum - 1;  // 0-based
                if (passiveIndex > maxPassiveIndex) {
                    maxPassiveIndex = passiveIndex;
                }
            }
        }

        // Extend passives array if needed (for upgrade-only abilities on base units)
        while (enrichedPassives.length <= maxPassiveIndex) {
            enrichedPassives.push({ data: {} });
        }

        // Find ALL buff links for this unit (any passive index)
        // Different unit variants may have the same logical passive at different array indices
        // So we collect all buff links and inject them into ALL passives
        const allBuffLinks = [];
        if (typeof window.GameData !== 'undefined' && window.GameData.passiveBuffLinks) {
            for (let n = 1; n <= 10; n++) {
                const passiveKey = `${baseUnitId}_passive_${n}`;
                const buffLink = window.GameData.passiveBuffLinks[passiveKey];
                if (buffLink) {
                    allBuffLinks.push(buffLink);
                }
            }
        }

        // Debug logging for cavalry
        if (unitId && unitId.includes('cavalry')) {
            Debug.log(`[DEBUG] Found ${allBuffLinks.length} buff links for ${baseUnitId}:`,
                allBuffLinks.map(b => b.buffId));
        }

        // Inject ALL buff links into EVERY passive
        // This ensures the description function finds the data regardless of which index it checks
        for (let index = 0; index < enrichedPassives.length; index++) {
            const enriched = enrichedPassives[index];

            // Inject all buff links so functions can find them at any index
            for (const buffLink of allBuffLinks) {
                if (!enriched.actions) {
                    enriched.actions = [];
                }
                if (!enriched.actions[0]) {
                    enriched.actions[0] = {};
                }
                if (!enriched.actions[0].damageDealer) {
                    enriched.actions[0].damageDealer = {};
                }
                // Use the first buff link (most specific to this passive type)
                if (!enriched.actions[0].damageDealer.buff) {
                    enriched.actions[0].damageDealer.buff = {
                        sid: buffLink.buffId,
                        ...buffLink.buffData,
                        // Include duration at the buff level
                        ...(buffLink.duration !== undefined ? { duration: buffLink.duration } : {})
                    };
                }
            }
        }

        return enrichedPassives;
    },

    /**
     * Inject buff data into ability if missing.
     * For functions like current_unit_ability_buff_duration that access currentAbility.damageDealer.buff.duration
     */
    injectBuffDataIntoAbility(rawAbility, ability, unitId) {
        // If rawAbility already has complete buff data, return as-is
        if (rawAbility?.damageDealer?.buff?.duration !== undefined) {
            return rawAbility;
        }

        // Extract base unit ID and ability index from ability.id
        // Format: {unitId}_ability_{N} (0-based)
        const match = ability.id?.match(/^(.+?)(?:_upg(?:_alt)?)?_ability_(\d+)$/);
        if (!match) {
            return rawAbility || ability;
        }

        const baseUnitId = match[1].replace(/_upg(_alt)?$/, '');
        const abilityIndex = parseInt(match[2], 10);
        const abilityKey = `${baseUnitId}_ability_${abilityIndex + 1}`;  // Convert to 1-based for lookup

        // Look up buff link for this ability
        const buffLink = typeof window.GameData !== 'undefined' && window.GameData.passiveBuffLinks
            ? window.GameData.passiveBuffLinks[abilityKey]
            : null;

        if (!buffLink) {
            return rawAbility || ability;
        }

        // Clone and inject buff data
        const enriched = rawAbility ? JSON.parse(JSON.stringify(rawAbility)) : {};
        if (!enriched.damageDealer) {
            enriched.damageDealer = {};
        }
        if (!enriched.damageDealer.buff) {
            enriched.damageDealer.buff = {};
        }

        // Inject buff data from the link
        // Include duration at the buff level (this is where description functions expect it)
        enriched.damageDealer.buff = {
            ...enriched.damageDealer.buff,
            sid: buffLink.buffId,
            ...buffLink.buffData,
            // Duration is at the top level of buffLink, not inside buffData
            ...(buffLink.duration !== undefined ? { duration: buffLink.duration } : {})
        };

        return enriched;
    },

    // Build abilities row for tooltip (with nested tooltips for each ability)
    buildTooltipAbilitiesHtml(unit, stackCount = 1) {
        const allAbilities = [
            ...(unit.passives || []),
            ...(unit.actives || [])
        ];

        if (allAbilities.length === 0) return '';

        const abilitiesHtml = allAbilities.map(ability => {
            const iconHtml = ability.icon_url
                ? `<img src="${ability.icon_url}" alt="${ability.name}" class="tooltip-ability-icon">`
                : `<span class="tooltip-ability-placeholder">${ability.name.charAt(0)}</span>`;
            const description = this.formatAbilityDescription(ability, unit, stackCount) || '';
            const baseClass = ability.is_base_passive ? ' base-passive' : '';
            const typeClass = (unit.actives || []).includes(ability) ? 'active' : 'passive';

            return `
                <div class="tooltip-ability-item ${typeClass}${baseClass} has-tooltip" data-tooltip-placement="top">
                    ${iconHtml}
                    <div class="tooltip">
                        <div class="tooltip-title">${ability.name}</div>
                        ${description ? `<div class="tooltip-text">${description}</div>` : ''}
                    </div>
                </div>
            `;
        }).join('');

        return `<div class="tooltip-abilities-row">${abilitiesHtml}</div>`;
    },

    // Build side abilities HTML for new card layout (vertical column)
    buildSideAbilitiesHtml(abilities, type, unitData) {
        const self = this;
        if (!abilities || abilities.length === 0) return '';

        return abilities.map(ability => {
            const iconContent = ability.icon_url
                ? `<img src="${ability.icon_url}" alt="${ability.name}" class="ability-icon-img">`
                : '';
            const basePassiveClass = ability.is_base_passive ? ' base-passive' : '';

            return `
            <div class="ability-icon ${type}${basePassiveClass} has-tooltip" data-tooltip-placement="${type === 'passive' ? 'left' : 'right'}">
                ${iconContent}
                <div class="tooltip">
                    <div class="tooltip-title">${ability.name}</div>
                    <div class="tooltip-text">${self.formatAbilityDescription(ability, unitData) || (type === 'passive' ? 'Passive ability' : 'Active ability')}</div>
                </div>
            </div>
        `}).join('');
    },

    // Build abilities HTML for unit card (legacy row layout for editor modal)
    buildAbilitiesHtml(passives, actives, unitData) {
        const self = this;
        const passiveHtml = passives && passives.length > 0
            ? `<div class="unit-abilities-column passives">
                ${passives.map(p => {
                    const iconContent = p.icon_url
                        ? `<img src="${p.icon_url}" alt="${p.name}" class="ability-icon-img">`
                        : '';
                    const basePassiveClass = p.is_base_passive ? ' base-passive' : '';
                    return `
                    <div class="ability-icon passive${basePassiveClass} has-tooltip" data-tooltip-placement="top">
                        ${iconContent}
                        <div class="tooltip">
                            <div class="tooltip-title">${p.name}</div>
                            <div class="tooltip-text">${self.formatAbilityDescription(p, unitData) || 'Passive ability'}</div>
                        </div>
                    </div>
                `}).join('')}
               </div>`
            : '';

        const activeHtml = actives && actives.length > 0
            ? `<div class="unit-abilities-column actives">
                ${actives.map(a => {
                    const iconContent = a.icon_url
                        ? `<img src="${a.icon_url}" alt="${a.name}" class="ability-icon-img">`
                        : '';
                    return `
                    <div class="ability-icon active has-tooltip" data-tooltip-placement="top">
                        ${iconContent}
                        <div class="tooltip">
                            <div class="tooltip-title">${a.name}</div>
                            <div class="tooltip-text">${self.formatAbilityDescription(a, unitData) || 'Active ability'}</div>
                        </div>
                    </div>
                `}).join('')}
               </div>`
            : '';

        if (!passiveHtml && !activeHtml) return '';

        return `<div class="unit-abilities-row">${passiveHtml}${activeHtml}</div>`;
    },

    // Calculate and display total army value
    updateArmyValue() {
        const totalValue = this.getTotalArmyValue();
        const valueElement = document.getElementById('army-value');
        if (valueElement) {
            valueElement.textContent = `${t('ui', 'value', 'Value:')} ${totalValue}`;
        }
    },

    // Get total army value
    getTotalArmyValue() {
        return heroBuild.army.reduce((total, slot) => {
            if (slot && slot.unitData && slot.count) {
                return total + (slot.unitData.squad_value * slot.count);
            }
            return total;
        }, 0);
    },

    // Open unit picker modal with faction tabs
    openUnitPicker(slotIndex) {
        this.currentSlotIndex = slotIndex;

        if (!this.allFactions || this.allFactions.length === 0) {
            console.error('[ArmyManager] No factions available');
            return;
        }

        // Default to hero's faction tab
        if (!this.currentFactionTab) {
            this.currentFactionTab = heroBuild.heroFaction;
        }

        this.renderUnitPickerModal();
    },

    // Render the unit picker modal
    renderUnitPickerModal() {
        const unitsByTier = this.getFactionUnits(this.currentFactionTab);

        // Build faction tabs HTML
        const factionTabsHtml = this.allFactions.map(faction => `
            <button class="faction-tab ${faction.slug === this.currentFactionTab ? 'active' : ''}"
                    onclick="window.ArmyManager.switchFactionTab('${faction.slug}')"
                    title="${faction.name}">
                <img src="${faction.icon_url}" alt="${faction.name}" class="faction-tab-icon"
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='inline'">
                <span class="faction-tab-name" style="display:none">${faction.name}</span>
            </button>
        `).join('');

        // Build units grid HTML with game-style card layout
        const unitsGridHtml = Object.keys(unitsByTier).sort((a, b) => a - b).map(tier => `
            <div class="unit-tier-group">
                <h3 class="unit-tier-header">${t('unitTypes', 'tier', 'Tier')} ${tier}</h3>
                <div class="unit-picker-grid">
                    ${unitsByTier[tier].map(unit => {
                        const statBarHtml = this.buildStatBar(unit.stats);
                        const passivesHtml = this.buildSideAbilitiesHtml(unit.passives, 'passive', unit);
                        const activesHtml = this.buildSideAbilitiesHtml(unit.actives, 'active', unit);

                        return `
                        <div class="unit-card" onclick="window.ArmyManager.selectUnit('${unit.id}')">
                            <div class="unit-card-header">
                                <div class="unit-card-name">${unit.name}</div>
                            </div>
                            <div class="unit-stat-bar">${statBarHtml}</div>
                            <div class="unit-card-portrait-section">
                                <div class="unit-abilities-side left">${passivesHtml}</div>
                                <img src="${unit.icon_url}" alt="${unit.name}" class="unit-card-portrait"
                                     onerror="this.src='/media/gamedata/ui/unit_placeholder.webp'">
                                <div class="unit-abilities-side right">${activesHtml}</div>
                            </div>
                            <div class="unit-card-footer">${unit.squad_value} gold</div>
                        </div>
                    `}).join('')}
                </div>
            </div>
        `).join('');

        const modalHtml = `
            <div class="modal-overlay" onclick="window.ArmyManager.closeUnitPicker()">
                <div class="skill-modal unit-picker-modal" onclick="event.stopPropagation()">
                    <div class="faction-tabs">
                        ${factionTabsHtml}
                    </div>
                    <div class="skill-list unit-list">
                        ${unitsGridHtml}
                    </div>
                </div>
            </div>
        `;

        document.getElementById('skill-modal-container').innerHTML = modalHtml;
    },

    // Switch faction tab in unit picker
    switchFactionTab(factionSlug) {
        this.currentFactionTab = factionSlug;
        this.renderUnitPickerModal();
    },

    // Select a unit from picker
    selectUnit(unitId) {
        const unitData = this.findUnitById(unitId);
        if (!unitData) return;

        // Default count based on tier (higher tier = fewer units)
        const defaultCount = Math.max(1, Math.floor(20 / (unitData.tier || 1)));

        heroBuild.army[this.currentSlotIndex] = {
            unitId: unitId,
            count: defaultCount,
            unitData: unitData,
            isStartingUnit: false
        };

        this.render();
        this.closeUnitPicker();
    },

    // Open unit editor for existing unit
    openUnitEditor(slotIndex) {
        this.currentSlotIndex = slotIndex;
        const armySlot = heroBuild.army[slotIndex];

        if (!armySlot || !armySlot.unitData) return;

        const unit = armySlot.unitData;

        // Build stats object from unit data (handle both old and new property names)
        const stats = unit.stats || {
            hp: unit.health || unit.hp,
            offence: unit.attack || unit.offence,
            defence: unit.defence,
            damage_min: unit.damage_min,
            damage_max: unit.damage_max,
            initiative: unit.initiative,
            speed: unit.speed,
            luck: unit.luck || 0,
            morale: unit.morale || unit.moral || 0,
        };

        const statBarHtml = this.buildStatBar(stats);
        const abilitiesHtml = this.buildAbilitiesHtml(unit.passives, unit.actives, unit);

        const modalHtml = `
            <div class="modal-overlay" onclick="window.ArmyManager.closeUnitEditor()">
                <div class="modal-content unit-editor-modal" onclick="event.stopPropagation()">
                    <div class="modal-body">
                        <div class="unit-editor-content">
                            <div class="unit-editor-header">
                                <img src="${unit.icon_url || '/media/gamedata/units/' + (unit.icon || unit.id) + '.webp'}"
                                     alt="${unit.name}" class="unit-editor-icon"
                                     onerror="this.src='/media/gamedata/ui/unit_placeholder.webp'">
                                <div class="unit-editor-info">
                                    <span class="unit-editor-tier">Tier ${unit.tier || unit.level}</span>
                                    <span class="unit-editor-type">${this.formatUnitType(unit)}</span>
                                </div>
                            </div>
                            <div class="unit-stat-bar editor-stat-bar">${statBarHtml}</div>
                            ${abilitiesHtml}
                            ${unit.description ? `<div class="unit-description">${unit.description}</div>` : ''}
                            <div class="unit-editor-value">${unit.squad_value} gold per unit</div>
                            <div class="unit-count-control">
                                <label>Stack Size:</label>
                                <input type="number" id="unit-count-input" value="${armySlot.count}" min="1" max="9999">
                                <span class="unit-stack-value">= ${armySlot.count * unit.squad_value} gold</span>
                            </div>
                            <div class="unit-editor-actions">
                                <button class="btn btn-primary" onclick="window.ArmyManager.updateUnitCount()">Update</button>
                                <button class="btn btn-danger" onclick="window.ArmyManager.removeUnit()">Remove</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('skill-modal-container').innerHTML = modalHtml;

        // Focus the input and update stack value on change
        setTimeout(() => {
            const input = document.getElementById('unit-count-input');
            if (input) {
                input.focus();
                input.select();
                input.addEventListener('input', () => {
                    const stackValueEl = document.querySelector('.unit-stack-value');
                    if (stackValueEl) {
                        const count = parseInt(input.value) || 0;
                        stackValueEl.textContent = `= ${count * unit.squad_value} gold`;
                    }
                });
            }
        }, 50);
    },

    // Update unit count
    updateUnitCount() {
        const input = document.getElementById('unit-count-input');
        const newCount = parseInt(input?.value || '1', 10);

        if (newCount > 0 && heroBuild.army[this.currentSlotIndex]) {
            heroBuild.army[this.currentSlotIndex].count = newCount;
            this.render();
            this.closeUnitEditor();
        }
    },

    // Remove unit from slot (used by editor modal)
    removeUnit() {
        if (this.currentSlotIndex !== null) {
            heroBuild.army[this.currentSlotIndex] = null;
            this.render();
            this.closeUnitEditor();
        }
    },

    // Remove unit from slot by index (used by remove button on slot)
    removeUnitFromSlot(slotIndex) {
        if (slotIndex !== undefined && heroBuild.army[slotIndex]) {
            heroBuild.army[slotIndex] = null;
            this.render();
        }
    },

    // Close unit picker
    closeUnitPicker() {
        this.currentSlotIndex = null;
        document.getElementById('skill-modal-container').innerHTML = '';
    },

    // Close unit editor
    closeUnitEditor() {
        this.currentSlotIndex = null;
        document.getElementById('skill-modal-container').innerHTML = '';
    }
};

// Expose to window for cross-module access and inline onclick handlers
window.ArmyManager = ArmyManager;
