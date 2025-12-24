/**
 * Equipment Manager - Handles item equipping, upgrades, and description formatting
 */

import { heroBuild, getHeroLevel } from './state.js';
import { buildUrl, Debug, t } from './utils.js';

export const EquipmentManager = {
    /**
     * Calculate bonuses for an item at a specific level
     * @param {Array} bonuses_raw - Raw bonus data with base, increment, levelStep
     * @param {number} level - Current upgrade level (0-based)
     * @returns {Array} Array of formatted bonus strings
     */
    // Friendly names for boolean stats
    BOOLEAN_STAT_NAMES: {
        'enableSquadReactionType': 'Shows Unit Initiative',
        'enableSquadCounts': 'Shows Unit Stack Counts',
        'enableEnemyHeroInfo': 'Shows Enemy Hero Info',
        'enableEnemyCityInfo': 'Shows Enemy City Info',
        'enableBansEvasion': 'Can Evade Bans',
        'enableBansEvasionBattle': 'Can Evade Bans in Battle',
        'enableSaveHeroByKill': 'Hero Survives Defeat',
        'enableSavePartyByEscape': 'Party Can Escape',
    },

    // Friendly names for complex stats
    STAT_DISPLAY_NAMES: {
        'finalHealingBonusPercent': 'Healing',
        'finalAbilityDamageBonusPercent': 'Ability Damage',
        'finalSummonBonusPercent': 'Summoning',
        'diplomacyEfficiencyPerBonus': 'Diplomacy',
        'landscapePenaltyPerBonus': 'Terrain Penalty',
        'flyMotionPerBonus': 'Flying Speed',
        'hp': 'HP',
        'offence': 'Offence',
        'defence': 'Defence',
    },

    // Convert camelCase to Title Case
    _camelToTitle(text) {
        const spaced = text.replace(/([A-Z])/g, ' $1');
        return spaced.trim().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
    },

    // Calculate bonus value with upgrade scaling
    _calculateBonusValue(baseValue, upgrade, level) {
        if (upgrade && level > 0) {
            const increment = upgrade.increment || 0;
            const levelStep = upgrade.levelStep || 1;
            if (levelStep > 0) {
                return baseValue + (increment * Math.floor(level / levelStep));
            }
        }
        return baseValue;
    },

    calculateBonusesForLevel(bonuses_raw, level) {
        if (!bonuses_raw || bonuses_raw.length === 0) {
            return ['No bonuses'];
        }

        const results = [];
        for (const bonus of bonuses_raw) {
            // If bonus is already a formatted string, use it as-is
            if (typeof bonus === 'string') {
                results.push(bonus);
                continue;
            }

            const bonusType = bonus.type;
            const parameters = bonus.parameters || [];
            const upgrade = bonus.upgrade || {};

            // Check activation level (level is 0-based, activationLevel is 1-based)
            const activationLevel = bonus.activationLevel || 1;
            if ((level + 1) < activationLevel) continue;

            if (bonusType === 'heroStat') {
                if (parameters.length < 2) continue;

                const statName = parameters[0];

                // Special handling for magicSchoolSet: [statName, school, "0", value]
                if (statName === 'magicSchoolSet' && parameters.length >= 4) {
                    const school = parameters[1].charAt(0).toUpperCase() + parameters[1].slice(1);
                    const baseValue = parseFloat(parameters[3]) || 1;
                    const value = Math.round(this._calculateBonusValue(baseValue, upgrade, level));
                    const sign = value >= 0 ? '+' : '';
                    results.push(`${sign}${value} ${school} Magic`);
                    continue;
                }

                const baseValueStr = parameters[1];

                // Handle boolean stats
                if (baseValueStr === 'true' || baseValueStr === 'false' || baseValueStr === true || baseValueStr === false) {
                    if (this.BOOLEAN_STAT_NAMES[statName]) {
                        results.push(this.BOOLEAN_STAT_NAMES[statName]);
                    } else {
                        const displayName = this._camelToTitle(statName.replace('enable', ''));
                        results.push(`Enables ${displayName}`);
                    }
                    continue;
                }

                // Handle numeric stats
                const baseValue = parseFloat(baseValueStr) || 0;
                const value = this._calculateBonusValue(baseValue, upgrade, level);
                const displayName = this.STAT_DISPLAY_NAMES[statName] || this._camelToTitle(statName);

                // Detect percentage stats (includes "Percent", "PerBonus", etc.)
                const isPercent = statName.toLowerCase().includes('percent') || statName.toLowerCase().includes('perbonus');
                const intValue = isPercent && Math.abs(value) < 1 ? Math.round(value * 100) : Math.round(value);
                const sign = intValue >= 0 ? '+' : '';

                if (isPercent) {
                    results.push(`${sign}${intValue}% ${displayName}`);
                } else {
                    results.push(`${sign}${intValue} ${displayName}`);
                }
            } else if (bonusType === 'unitStat') {
                if (parameters.length < 2) continue;
                const statName = parameters[0];
                const baseValue = parseFloat(parameters[1]) || 0;
                const value = this._calculateBonusValue(baseValue, upgrade, level);
                const displayName = this.STAT_DISPLAY_NAMES[statName] || this._camelToTitle(statName);

                const allegiance = bonus.receiverAllegiance || 'ally';
                const prefix = allegiance === 'enemy' ? 'Enemy units: ' : 'Units: ';

                // Detect percentage stats (includes "Percent", "PerBonus", etc.)
                const isPercent = statName.toLowerCase().includes('percent') || statName.toLowerCase().includes('perbonus');
                const intValue = isPercent && Math.abs(value) < 1 ? Math.round(value * 100) : Math.round(value);
                const sign = intValue >= 0 ? '+' : '';

                if (isPercent) {
                    results.push(`${prefix}${sign}${intValue}% ${displayName}`);
                } else {
                    results.push(`${prefix}${sign}${intValue} ${displayName}`);
                }
            } else if (bonusType === 'sideRes') {
                if (parameters.length < 2) continue;
                const resource = parameters[0].charAt(0).toUpperCase() + parameters[0].slice(1);
                const baseValue = parseFloat(parameters[1]) || 0;
                const value = Math.round(this._calculateBonusValue(baseValue, upgrade, level));
                results.push(`+${value} ${resource}/day`);
            } else if (bonusType === 'heroMagicAdditionMass') {
                if (parameters.length >= 3) {
                    const tier = parameters[2];
                    if (tier === 'any' || tier === null) {
                        results.push('Unlocks all spells');
                    } else {
                        results.push(`Unlocks all Tier ${tier} spells`);
                    }
                }
            } else if (bonusType === 'heroMagicAddition') {
                results.push('Grants spell');
            } else if (bonusType === 'battleSubskillBonus') {
                results.push('Grants battle skill');
            } else if (bonusType === 'unitBoolStat') {
                if (parameters.length >= 1) {
                    const statName = this._camelToTitle(parameters[0]);
                    results.push(`Units: ${statName}`);
                }
            } else if (bonusType === 'magicSchoolSet') {
                if (parameters.length >= 2) {
                    const school = parameters[0].charAt(0).toUpperCase() + parameters[0].slice(1);
                    const baseValue = parseInt(parameters[1]) || 1;
                    const value = Math.round(this._calculateBonusValue(baseValue, upgrade, level));
                    const sign = value >= 0 ? '+' : '';
                    results.push(`${sign}${value} ${school} Magic`);
                }
            } else if (bonusType === 'heroAbility') {
                if (parameters.length >= 1) {
                    const abilityName = this._camelToTitle(parameters[0]);
                    results.push(`Grants: ${abilityName}`);
                }
            }
        }

        return results.length > 0 ? results : ['No bonuses'];
    },

    /**
     * Calculate dust cost for upgrading to a specific level
     * @param {Object} itemData - Item data with cost_base and cost_per_level
     * @param {number} level - Target upgrade level (1-based, where 1 = base item)
     * @returns {number} Dust cost
     */
    calculateDustCost(itemData, level) {
        if (!itemData || level <= 1) {
            return 0;
        }

        const costBase = itemData.cost_base || 0;
        const costPerLevel = itemData.cost_per_level || 0;

        return costBase + costPerLevel * (level - 1);
    },

    /**
     * Get total dust cost for all equipped items
     * @returns {number} Total dust cost
     */
    getTotalDustCost() {
        let total = 0;
        for (const itemData of Object.values(heroBuild.equipment.slots)) {
            if (itemData) {
                total += this.calculateDustCost(itemData, itemData.level);
            }
        }
        return total;
    },

    /**
     * Update the dust cost display element
     */
    updateDustDisplay() {
        const displayElement = document.getElementById('total-equipment-dust');
        if (displayElement) {
            const totalDust = this.getTotalDustCost();
            const dustValue = displayElement.querySelector('.dust-value');
            if (dustValue) {
                dustValue.textContent = totalDust;
            }
        }
    },

    /**
     * Get effective hero stats including base stats and all equipment bonuses
     * @returns {Object} Hero stats object e.g., {viewRadius: 8, offence: 5, ...}
     */
    getEffectiveHeroStats() {
        // Start with base hero stats
        const stats = {
            viewRadius: heroBuild.heroViewRadius,
            offence: parseInt(document.querySelector('[data-stat="offence"] .stat-value')?.textContent || '0'),
            defence: parseInt(document.querySelector('[data-stat="defence"] .stat-value')?.textContent || '0'),
            spellPower: parseInt(document.querySelector('[data-stat="spell-power"] .stat-value')?.textContent || '0'),
            intelligence: parseInt(document.querySelector('[data-stat="intelligence"] .stat-value')?.textContent || '0'),
            luck: parseInt(document.querySelector('[data-stat="luck"] .stat-value')?.textContent || '0'),
            moral: parseInt(document.querySelector('[data-stat="moral"] .stat-value')?.textContent || '0'),
        };

        // Add bonuses from all equipped items
        for (const itemData of Object.values(heroBuild.equipment.slots)) {
            const bonuses = itemData?.raw_data?.bonuses;
            if (!bonuses) continue;
            const level = itemData.level || 1;

            for (const bonus of bonuses) {
                if (bonus.type !== 'heroStat') continue;
                const params = bonus.parameters || [];
                if (params.length < 2) continue;

                const statName = params[0];
                const baseValue = parseFloat(params[1]);
                if (isNaN(baseValue)) continue;

                const upgrade = bonus.upgrade || {};
                const value = this._calculateBonusValue(baseValue, upgrade, level - 1);

                // Map game stat names to our stat object keys
                const statMap = {
                    'viewRadius': 'viewRadius',
                    'offence': 'offence',
                    'defence': 'defence',
                    'spellPower': 'spellPower',
                    'intelligence': 'intelligence',
                    'luck': 'luck',
                    'moral': 'moral',
                };
                const key = statMap[statName];
                if (key) {
                    stats[key] = (stats[key] || 0) + value;
                }
            }
        }

        // Add bonuses from equipped skills
        for (const skillData of heroBuild.skills) {
            if (!skillData || !skillData.raw_data) continue;
            const level = skillData.level || 1;
            const levelData = skillData.raw_data.parametersPerLevel?.[level - 1];
            if (!levelData?.bonuses) continue;

            for (const bonus of levelData.bonuses) {
                if (bonus.type !== 'heroStat') continue;
                const params = bonus.parameters || [];
                if (params.length < 2) continue;

                const statName = params[0];
                const value = parseFloat(params[1]);
                if (isNaN(value)) continue;

                // Map game stat names to our stat object keys
                const statMap = {
                    'viewRadius': 'viewRadius',
                    'offence': 'offence',
                    'defence': 'defence',
                    'spellPower': 'spellPower',
                    'intelligence': 'intelligence',
                    'luck': 'luck',
                    'moral': 'moral',
                };
                const key = statMap[statName];
                if (key) {
                    stats[key] = (stats[key] || 0) + value;
                }
            }
        }

        // Add bonuses from subskills
        for (const skillData of heroBuild.skills) {
            if (!skillData) continue;

            for (let i = 0; i < 2; i++) {
                const subskillRawData = skillData.subskillRawData?.[i];
                if (!subskillRawData?.bonuses) continue;

                for (const bonus of subskillRawData.bonuses) {
                    if (bonus.type !== 'heroStat') continue;
                    const params = bonus.parameters || [];
                    if (params.length < 2) continue;

                    const statName = params[0];
                    const value = parseFloat(params[1]);
                    if (isNaN(value)) continue;

                    // Map game stat names to our stat object keys
                    const statMap = {
                        'viewRadius': 'viewRadius',
                        'offence': 'offence',
                        'defence': 'defence',
                        'spellPower': 'spellPower',
                        'intelligence': 'intelligence',
                        'luck': 'luck',
                        'moral': 'moral',
                    };
                    const key = statMap[statName];
                    if (key) {
                        stats[key] = (stats[key] || 0) + value;
                    }
                }
            }
        }

        // Add bonuses from hero specialization
        const spec = heroBuild.heroSpecialization;
        if (spec?.bonuses) {
            const heroLevel = getHeroLevel();
            for (const bonus of spec.bonuses) {
                // Skip bonuses that require a higher activation level
                if (bonus.activationLevel && bonus.activationLevel > heroLevel) continue;

                if (bonus.type !== 'heroStat') continue;
                const params = bonus.parameters || [];
                if (params.length < 2) continue;

                const statName = params[0];
                const baseValue = parseFloat(params[1]);
                if (isNaN(baseValue)) continue;

                // Calculate level-based upgrades (triggers at 5, 10, 15, etc.)
                let value = baseValue;
                const upgrade = bonus.upgrade;
                if (upgrade && upgrade.increment && upgrade.levelStep) {
                    const upgradeCount = Math.floor(heroLevel / upgrade.levelStep);
                    value += upgrade.increment * upgradeCount;
                }

                // Map game stat names to our stat object keys
                const statMap = {
                    'viewRadius': 'viewRadius',
                    'offence': 'offence',
                    'defence': 'defence',
                    'spellPower': 'spellPower',
                    'intelligence': 'intelligence',
                    'luck': 'luck',
                    'moral': 'moral',
                    'morale': 'moral',
                };
                const key = statMap[statName];
                if (key) {
                    stats[key] = (stats[key] || 0) + value;
                }
            }
        }

        // Add bonuses from unlocked advanced class (subclass)
        if (typeof window.AdvancedClassManager !== 'undefined') {
            const unlockedClass = window.AdvancedClassManager.checkEligibility();
            if (unlockedClass?.bonuses) {
                for (const bonus of unlockedClass.bonuses) {
                    if (bonus.type !== 'heroStat') continue;
                    const params = bonus.parameters || [];
                    if (params.length < 2) continue;

                    const statName = params[0];
                    const value = parseFloat(params[1]);
                    if (isNaN(value)) continue;

                    // Map game stat names to our stat object keys
                    // Note: percentage stats like 'offencePer' multiply base stat
                    const statMap = {
                        'viewRadius': 'viewRadius',
                        'offence': 'offence',
                        'defence': 'defence',
                        'spellPower': 'spellPower',
                        'intelligence': 'intelligence',
                        'luck': 'luck',
                        'moral': 'moral',
                        'morale': 'moral',
                    };

                    // Handle percentage bonuses (e.g., offencePer, defencePer)
                    if (statName.endsWith('Per')) {
                        const baseStat = statName.slice(0, -3);
                        const key = statMap[baseStat];
                        if (key && stats[key]) {
                            stats[key] = stats[key] * (1 + value);
                        }
                    } else {
                        const key = statMap[statName];
                        if (key) {
                            stats[key] = (stats[key] || 0) + value;
                        }
                    }
                }
            }
        }

        // Add bonuses from active item sets
        if (typeof window.ItemSetManager !== 'undefined' && window.ItemSetManager.itemSets.length > 0) {
            const setStatBonuses = window.ItemSetManager.getActiveSetStatBonuses();
            const statMap = {
                'viewRadius': 'viewRadius',
                'offence': 'offence',
                'defence': 'defence',
                'spellPower': 'spellPower',
                'intelligence': 'intelligence',
                'luck': 'luck',
                'moral': 'moral',
                'morale': 'moral',
            };

            for (const [statName, value] of Object.entries(setStatBonuses)) {
                const key = statMap[statName];
                if (key) {
                    stats[key] = (stats[key] || 0) + value;
                }
            }
        }

        return stats;
    },

    /**
     * Format an item's description using current effective hero stats
     * @param {Object} itemData - Item data with description_template and description_args/description_values
     * @param {number} level - Current upgrade level (1-based)
     * @returns {string} Formatted description
     */
    formatItemDescription(itemData, level = null) {
        if (!itemData.description_template) {
            return itemData.description || '';
        }

        level = level || itemData.level || 1;

        // Try using transpiled functions first (new system)
        if (itemData.description_args && itemData.description_args.length > 0 &&
            typeof window.DescriptionRuntime !== 'undefined' && typeof window.DescriptionFunctions !== 'undefined') {
            try {
                const effectiveStats = this.getEffectiveHeroStats();

                // Create context for the transpiled functions
                const ctx = {
                    currentItem: {
                        id: itemData.id,
                        level: level,
                        config: itemData.raw_data || { bonuses: [] }
                    },
                    currentHero: {
                        heroStat: effectiveStats
                    }
                };

                // Use DescriptionRuntime to format
                let result = window.DescriptionRuntime.formatDescription(
                    itemData.description_template,
                    itemData.description_args,
                    ctx
                );

                // Append upgrade description only if it adds new functionality (no computed args)
                // If upgrade has computed args, those values are already reflected in main description
                if (level > 1 && itemData.upgrade_description_template &&
                    (!itemData.upgrade_description_args || itemData.upgrade_description_args.length === 0)) {
                    result += ' ' + this.formatUpgradeDescription(itemData);
                }

                return result;
            } catch (e) {
                Debug.warn('[EquipmentManager] Transpiled function error, falling back:', e);
            }
        }

        // Fallback to legacy system using description_values
        if (!itemData.description_values || itemData.description_values.length === 0) {
            return itemData.description || itemData.description_template || '';
        }

        const effectiveStats = this.getEffectiveHeroStats();
        const resolvedValues = [];

        for (const valueInfo of itemData.description_values) {
            if (valueInfo.type === 'static') {
                resolvedValues.push(valueInfo.value);
            } else if (valueInfo.type === 'item_param') {
                const base = valueInfo.base || 0;
                const increment = valueInfo.increment || 0;
                const levelStep = valueInfo.levelStep || 1;
                let value = base;
                if (level > 1 && increment && levelStep > 0) {
                    value = base + increment * Math.floor((level - 1) / levelStep);
                }
                if (valueInfo.isPercent && Math.abs(value) < 1) {
                    value = value * 100;
                }
                resolvedValues.push(String(Math.floor(value)));
            } else if (valueInfo.type === 'hero_stat_multiplier') {
                const stat = valueInfo.stat;
                const multiplier = valueInfo.multiplier || 1;
                const statValue = effectiveStats[stat] || 6; // Default viewRadius = 6
                resolvedValues.push(String(Math.floor(statValue * multiplier)));
            } else {
                resolvedValues.push('?');
            }
        }

        // Replace {0}, {1}, etc. in template
        let result = itemData.description_template;
        for (let i = 0; i < resolvedValues.length; i++) {
            result = result.replace(`{${i}}`, resolvedValues[i]);
        }

        // Append upgrade description only if it adds new functionality (no computed args)
        // If upgrade has computed args, those values are already reflected in main description
        if (level > 1 && itemData.upgrade_description_template &&
            (!itemData.upgrade_description_args || itemData.upgrade_description_args.length === 0)) {
            result += ' ' + this.formatUpgradeDescription(itemData);
        }

        return result;
    },

    /**
     * Format an item's upgrade description.
     * @param {Object} itemData - Item data with upgrade_description_template and upgrade_description_args
     * @returns {string} Formatted upgrade description
     */
    formatUpgradeDescription(itemData) {
        if (!itemData.upgrade_description_template) {
            return itemData.upgrade_description || '';
        }

        // Try using transpiled functions
        if (itemData.upgrade_description_args && itemData.upgrade_description_args.length > 0 &&
            typeof window.DescriptionRuntime !== 'undefined' && typeof window.DescriptionFunctions !== 'undefined') {
            try {
                const effectiveStats = this.getEffectiveHeroStats();
                const ctx = {
                    currentItem: {
                        id: itemData.id,
                        level: itemData.level || 1,
                        config: itemData.raw_data || { bonuses: [] }
                    },
                    currentHero: {
                        heroStat: effectiveStats
                    }
                };

                return window.DescriptionRuntime.formatDescription(
                    itemData.upgrade_description_template,
                    itemData.upgrade_description_args,
                    ctx
                );
            } catch (e) {
                Debug.warn('[EquipmentManager] Upgrade description error, falling back:', e);
            }
        }

        // Fallback to pre-formatted
        return itemData.upgrade_description || itemData.upgrade_description_template || '';
    },

    /**
     * Format a skill description using the transpiled description pipeline.
     * @param {Object} skillData - Skill data with description_template and description_args
     * @param {number} level - Skill level (1-based, default 1)
     * @returns {string} Formatted description
     */
    formatSkillDescription(skillData, level = 1) {
        // If no args, return template as-is (no placeholders to fill)
        if (!skillData.description_args || skillData.description_args.length === 0) {
            return skillData.description_template || '';
        }

        // Use transpiled functions - no fallback, errors should be visible
        if (typeof window.DescriptionRuntime === 'undefined' || typeof window.DescriptionFunctions === 'undefined') {
            console.error('[EquipmentManager] DescriptionRuntime or DescriptionFunctions not loaded');
            return '';
        }

        // Get level-specific parameters from raw_data
        const params = skillData.raw_data?.parametersPerLevel || [];
        const levelData = params[level - 1] || params[0] || {};

        // Create context for the transpiled functions
        // Note: skill functions expect bonuses directly on currentSkill (not in config)
        const ctx = {
            currentSkill: {
                id: skillData.skillId || skillData.id,
                level: level,
                ...levelData  // Spread levelData so bonuses are directly accessible
            },
            currentHero: {
                heroStat: this.getEffectiveHeroStats()
            }
        };

        return window.DescriptionRuntime.formatDescription(
            skillData.description_template,
            skillData.description_args,
            ctx
        );
    },

    /**
     * Format a subskill description using the transpiled description pipeline.
     * @param {Object} subskillData - Subskill data with description_template and description_args
     * @returns {string} Formatted description
     */
    formatSubskillDescription(subskillData) {
        // If no args, return template as-is (no placeholders to fill)
        if (!subskillData.description_args || subskillData.description_args.length === 0) {
            return subskillData.description_template || '';
        }

        // Use transpiled functions - no fallback, errors should be visible
        if (typeof window.DescriptionRuntime === 'undefined' || typeof window.DescriptionFunctions === 'undefined') {
            console.error('[EquipmentManager] DescriptionRuntime or DescriptionFunctions not loaded');
            return '';
        }

        // Create context for the transpiled functions
        // Subskills use currentSubSkill context (not currentSkill)
        const ctx = {
            currentSubSkill: {
                id: subskillData.id,
                ...subskillData.raw_data  // Spread raw_data so bonuses are accessible
            },
            currentHero: {
                heroStat: this.getEffectiveHeroStats()
            }
        };

        return window.DescriptionRuntime.formatDescription(
            subskillData.description_template,
            subskillData.description_args,
            ctx
        );
    },

    /**
     * Format a spell description using the transpiled description pipeline.
     * @param {Object} spellData - Spell data with description_template and description_args
     * @param {number} level - Spell level (1-based, default 1)
     * @returns {string} Formatted description
     */
    formatSpellDescription(spellData, level = 1) {
        // Prefer computed description if no args
        if (!spellData.description_args || spellData.description_args.length === 0) {
            return spellData.description || spellData.description_template || '';
        }

        // Use transpiled functions
        if (typeof window.DescriptionRuntime !== 'undefined' && typeof window.DescriptionFunctions !== 'undefined') {
            try {
                // Create context for the transpiled functions
                const ctx = {
                    currentMagic: {
                        id: spellData.id,
                        level: level,
                        school: spellData.school,
                        config: spellData.raw_data || {}
                    },
                    currentHero: {
                        stats: this.getEffectiveHeroStats()
                    }
                };

                return window.DescriptionRuntime.formatDescription(
                    spellData.description_template,
                    spellData.description_args,
                    ctx
                );
            } catch (e) {
                Debug.warn('[EquipmentManager] Spell description error, falling back:', e);
            }
        }

        // Fallback to pre-computed description
        return spellData.description || spellData.description_template || '';
    },

    /**
     * Update all equipped items' descriptions based on current effective stats
     */
    updateAllDescriptions() {
        for (const [slotId, itemData] of Object.entries(heroBuild.equipment.slots)) {
            if (itemData && (
                (itemData.description_args && itemData.description_args.length > 0) ||
                (itemData.description_values && itemData.description_values.length > 0)
            )) {
                itemData.description = this.formatItemDescription(itemData);
            }
        }
        // Re-render equipment UI to show updated descriptions
        this.updateUI();

        // Also update spell descriptions (hero stats may affect spell calculations)
        if (typeof window.SpellBookManager !== 'undefined') {
            window.SpellBookManager.updateAllDescriptions();
        }
    },

    maxAllUpgrades() {
        for (const [slotId, itemData] of Object.entries(heroBuild.equipment.slots)) {
            if (itemData && itemData.max_level > 1) {
                itemData.level = itemData.max_level;
                const rawBonuses = itemData.raw_data?.bonuses || [];
                itemData.bonuses = this.calculateBonusesForLevel(rawBonuses, itemData.max_level - 1);
            }
        }
        this.updateAllDescriptions();
        this.updateUI();
        this.updateDustDisplay();
    },

    resetAllUpgrades() {
        for (const [slotId, itemData] of Object.entries(heroBuild.equipment.slots)) {
            if (itemData) {
                itemData.level = 1;
                const rawBonuses = itemData.raw_data?.bonuses || [];
                itemData.bonuses = this.calculateBonusesForLevel(rawBonuses, 0);
            }
        }
        this.updateAllDescriptions();
        this.updateUI();
        this.updateDustDisplay();
    },

    /**
     * Set the upgrade level of an equipped item
     * @param {string} slotId - Slot identifier (e.g., 'weapon', 'ring-1')
     * @param {number} newLevel - New upgrade level (1-based)
     */
    setItemLevel(slotId, newLevel) {
        const itemData = heroBuild.equipment.slots[slotId];
        if (!itemData) return;

        // Clamp level between 1 and max_level
        const maxLevel = itemData.max_level || 1;
        const clampedLevel = Math.max(1, Math.min(newLevel, maxLevel));

        // Update the level
        itemData.level = clampedLevel;

        // Recalculate bonuses based on new level
        // Note: level is 1-based, but calculation uses 0-based (level - 1)
        const rawBonuses = itemData.raw_data?.bonuses || [];
        itemData.bonuses = this.calculateBonusesForLevel(rawBonuses, clampedLevel - 1);

        // Update all descriptions (hero stats and item levels may affect them)
        this.updateAllDescriptions();

        // Update UI to reflect changes (updateUI handles hiding active tooltip)
        this.updateUI();
        this.updateDustDisplay();

        // Re-show tooltip for the same slot so user sees updated content immediately
        const slotElement = document.getElementById(`slot-${slotId}`);
        if (slotElement && typeof window.Tooltip !== 'undefined') {
            window.Tooltip.show(slotElement);
        }
    },

    init() {
        // Setup click handlers for all equipment slots
        const equipSlots = document.querySelectorAll('.equip-slot[data-slot-type]');
        equipSlots.forEach(slot => {
            const slotId = slot.id.replace('slot-', '');
            const slotType = slot.dataset.slotType;

            slot.onclick = () => {
                window.ItemSelectionModal.open(slotId, slotType);
            };
        });

        // Initial UI update to show any pre-equipped items
        this.updateUI();
        this.updateDustDisplay();
    },

    equipItem(slotId, itemData) {
        // Initialize level (defaults to 1 if not provided)
        const initialLevel = itemData.level || 1;

        // Get bonuses from raw_data (API format) or bonuses_raw (legacy)
        const rawBonuses = itemData.raw_data?.bonuses || itemData.bonuses_raw || itemData.bonuses || [];

        // Calculate initial bonuses based on level
        const calculatedBonuses = this.calculateBonusesForLevel(
            rawBonuses,
            initialLevel - 1  // Convert 1-based to 0-based
        );

        // Update heroBuild state
        heroBuild.equipment.slots[slotId] = {
            id: itemData.id,
            name: itemData.name,
            icon: itemData.icon,
            slot: itemData.slot,
            rarity: itemData.rarity,
            bonuses: calculatedBonuses,
            item_set: itemData.item_set,
            max_level: itemData.max_level || 1,
            cost_base: itemData.cost_base || 0,
            cost_per_level: itemData.cost_per_level || 0,
            description: itemData.description,
            description_template: itemData.description_template,
            description_values: itemData.description_values,
            description_args: itemData.description_args || [],
            upgrade_description: itemData.upgrade_description || '',
            upgrade_description_template: itemData.upgrade_description_template || '',
            upgrade_description_args: itemData.upgrade_description_args || [],
            narrative_description: itemData.narrative_description || '',
            raw_data: itemData.raw_data,
            level: initialLevel
        };

        // Update all descriptions (hero stats may have changed)
        this.updateAllDescriptions();

        // Update UI
        this.updateUI();
        this.updateDustDisplay();

        // Update item-granted spells (magic scrolls grant spells)
        if (typeof window.SpellBookManager !== 'undefined') {
            window.SpellBookManager.updateSkillGrantedSpells();
        }
    },

    unequipItem(slotId) {
        // Remove from heroBuild state
        heroBuild.equipment.slots[slotId] = null;

        // Update all descriptions (hero stats may have changed)
        this.updateAllDescriptions();

        // Update UI
        this.updateUI();
        this.updateDustDisplay();

        // Update item-granted spells (removed item's spells should disappear)
        if (typeof window.SpellBookManager !== 'undefined') {
            window.SpellBookManager.updateSkillGrantedSpells();
        }
    },

    updateUI() {
        // Hide active tooltip before regenerating DOM content
        // (Tooltip system moves tooltips to document.body; if we regenerate the slot's
        // innerHTML, the old tooltip stays orphaned in body showing stale content)
        if (typeof window.Tooltip !== 'undefined') {
            window.Tooltip.hideActive();
        }

        // Update all equipment slots to show equipped items or empty state
        for (const [slotId, itemData] of Object.entries(heroBuild.equipment.slots)) {
            const slotElement = document.getElementById(`slot-${slotId}`);
            if (!slotElement) continue;

            if (itemData) {
                // Show equipped item with tooltip
                const rarityColor = window.ItemSelectionModal.rarityColors[itemData.rarity] || '#ffffff';

                // Get current level and max level
                const currentLevel = itemData.level || 1;
                const maxLevel = itemData.max_level || 1;

                // Always calculate description dynamically using formatItemDescription
                const descriptionText = this.formatItemDescription(itemData, currentLevel) ||
                                       (itemData.bonuses || []).join(', ') ||
                                       'No description';
                const bonusesHTML = `<div class="bonus-line">${descriptionText}</div>`;

                // Calculate dust costs
                const canLevelUp = currentLevel < maxLevel;
                const canLevelDown = currentLevel > 1;
                const upgradeCost = canLevelUp ? this.calculateDustCost(itemData, currentLevel + 1) - this.calculateDustCost(itemData, currentLevel) : 0;
                const downgradeSavings = canLevelDown ? this.calculateDustCost(itemData, currentLevel) - this.calculateDustCost(itemData, currentLevel - 1) : 0;

                const upgradeControlsHTML = `
                    <div class="tooltip-level">${t('ui', 'level', 'Level')} ${currentLevel}/${maxLevel}</div>
                    <div class="tooltip-upgrade-row">
                        <button class="tooltip-upgrade-btn ${!canLevelUp ? 'disabled' : ''}"
                                onclick="event.stopPropagation(); if (${canLevelUp}) window.EquipmentManager.setItemLevel('${slotId}', ${currentLevel + 1});">
                            ⏫ ${upgradeCost} <img src="/media/gamedata/resources/dust.webp" class="dust-icon-small" alt="dust">
                        </button>
                        <button class="tooltip-upgrade-btn ${!canLevelDown ? 'disabled' : ''}"
                                onclick="event.stopPropagation(); if (${canLevelDown}) window.EquipmentManager.setItemLevel('${slotId}', ${currentLevel - 1});">
                            ⏬ ${downgradeSavings} <img src="/media/gamedata/resources/dust.webp" class="dust-icon-small" alt="dust">
                        </button>
                    </div>
                    <button class="tooltip-remove-btn" onclick="event.stopPropagation(); window.EquipmentManager.unequipItem('${slotId}');">
                        ${t('ui', 'remove_item', 'Remove Item')}
                    </button>
                `;

                // Add narrative description (flavor text) if available
                const narrativeHTML = itemData.narrative_description
                    ? `<div class="tooltip-narrative">${itemData.narrative_description}</div>`
                    : '';

                // Generate set bonus section if item belongs to a set
                let setHTML = '';
                if (itemData.item_set) {
                    const setData = window.ItemSetManager.getSetForItem(itemData.id);
                    if (setData) {
                        const equippedCount = window.ItemSetManager.getEquippedSetItemCount(itemData.item_set);
                        const totalItems = setData.items.length;

                        // Build bonus list with active/inactive styling
                        const bonusListHTML = setData.bonuses.map(bonus => {
                            const isActive = equippedCount >= bonus.requiredItemsAmount;
                            const description = window.ItemSetManager.formatBonusDescription(setData, bonus);
                            const activeClass = isActive ? 'set-bonus-active' : 'set-bonus-inactive';
                            return `
                                <div class="set-bonus-item ${activeClass}">
                                    <span class="set-bonus-req">(${bonus.requiredItemsAmount})</span>
                                    <span class="set-bonus-desc">${description}</span>
                                </div>
                            `;
                        }).join('');

                        setHTML = `
                            <div class="tooltip-set-section">
                                <div class="set-header">
                                    <span class="set-name">${setData.name}</span>
                                    <span class="set-progress">(${equippedCount}/${totalItems})</span>
                                </div>
                                <div class="set-bonus-list">
                                    ${bonusListHTML}
                                </div>
                            </div>
                        `;
                    }
                }

                slotElement.classList.add('has-tooltip');
                slotElement.dataset.tooltipPlacement = 'right';
                slotElement.innerHTML = `
                    <img src="/media/gamedata/items/${itemData.icon}.webp"
                         alt="${itemData.name}"
                         style="opacity: 1; width: 90%; height: 90%;">
                    <div class="tooltip tooltip-item">
                        <div class="tooltip-header">
                            <span class="item-name" style="color: ${rarityColor}">${itemData.name}</span>
                            <span class="item-rarity">${window.i18n?.rarityLabels?.[itemData.rarity] || itemData.rarity}</span>
                        </div>
                        <div class="tooltip-bonuses">
                            ${bonusesHTML}
                        </div>
                        ${narrativeHTML}
                        ${setHTML}
                        ${upgradeControlsHTML}
                    </div>
                `;
                slotElement.style.borderColor = rarityColor;

                // Add/remove upgrade glow class based on level
                if (currentLevel > 1) {
                    slotElement.classList.add('item-upgraded');
                } else {
                    slotElement.classList.remove('item-upgraded');
                }
            } else {
                // Show empty slot with default icon
                slotElement.classList.remove('has-tooltip');
                delete slotElement.dataset.tooltipPlacement;
                const slotType = slotElement.dataset.slotType;
                const defaultIcons = {
                    'unique': 'slot_unique.webp',
                    'head': 'slot_head.webp',
                    'back': 'slot_cloak.webp',
                    'armor': 'slot_armor.webp',
                    'weapon': 'slot_right_hand.webp',
                    'shield': 'slot_left_hand.webp',
                    'belt': 'slot_belt.webp',
                    'boots': 'slot_boots.webp',
                    'ring': 'slot_ring.webp',
                    'accessory': 'slot_item.webp'
                };

                const defaultIcon = defaultIcons[slotType] || 'slot_item.webp';

                slotElement.innerHTML = `
                    <img src="/media/gamedata/ui/${defaultIcon}" alt="${slotType}">
                `;
                slotElement.style.borderColor = '#3a4555';
                slotElement.classList.remove('item-upgraded');
            }
        }
    }
};

// Expose to window for inline onclick handlers (will be removed once those are refactored)
window.EquipmentManager = EquipmentManager;
