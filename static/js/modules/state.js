/**
 * Global state for hero build configuration.
 * This is the central data model shared by all managers.
 */
export const heroBuild = {
    heroId: '',
    heroFaction: '',
    heroViewRadius: 6,  // Hero's view radius for item description calculations
    baseHeroLevel: 1,   // Starting hero level from DOM
    heroSpecialization: null,  // Raw specialization data with bonuses
    skills: [],  // Array of 8 slots: {skillId, level, subskills} or null
    startingSkillIds: [],
    startingSkillLevels: {},  // Map of skillId -> starting level, to track upgrades
    // Equipment state
    equipment: {
        slots: {
            'unique': null,      // { id, name, icon, level, maxLevel, ... }
            'head': null,
            'back': null,
            'armor': null,
            'weapon': null,      // right_hand (hero's perspective)
            'shield': null,      // left_hand (hero's perspective)
            'belt': null,
            'boots': null,
            'ring-1': null,
            'ring-2': null,
            'accessory-1': null, // item_slot
            'accessory-2': null,
            'accessory-3': null,
            'accessory-4': null
        },
        backpack: new Array(24).fill(null)  // 4x6 grid
    },
    // Army state
    army: Array(7).fill(null),  // Array of 7 slots: {unitId, count, unitData} or null
    factionUnits: null  // Cached faction units from API
};

/**
 * Calculate current hero level based on skill changes.
 * Hero level = base level + new skills acquired + skill upgrades
 * @returns {number} Current hero level
 */
export function getHeroLevel() {
    let level = heroBuild.baseHeroLevel;

    for (const skill of heroBuild.skills) {
        if (!skill) continue;

        const startingLevel = heroBuild.startingSkillLevels[skill.skillId];

        if (startingLevel === undefined) {
            // New skill (not in starting skills) - +1 for acquiring at Basic
            level += 1;
            // Plus any upgrades from Basic (level 1)
            level += (skill.level - 1);
        } else {
            // Starting skill - count only the upgrades from starting level
            level += (skill.level - startingLevel);
        }
    }

    return level;
}
