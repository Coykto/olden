/**
 * Hero State Model - Client-side hero state for dynamic description computation
 *
 * Tracks:
 * - Hero base stats (from heroClass, specialization)
 * - Equipment (slot -> item)
 * - Spells known
 * - Skills and levels
 * - Active effects (stables, buffs, etc.)
 *
 * Provides computed effective stats that account for all bonuses.
 */

// @ts-nocheck
/* eslint-disable */

const HeroState = {
  // Hero identity
  heroId: null,
  heroClass: null,
  faction: null,

  // Base stats (from class/specialization)
  baseStats: {
    offence: 0,
    defence: 0,
    spellPower: 0,
    knowledge: 0,
    viewRadius: 6,
    movement: 15,
    initiative: 10,
    luck: 0,
    morale: 0,
  },

  // Equipment: slot -> item data
  equipment: {},

  // Known spells: spell id -> spell data
  spells: {},

  // Skills: skill id -> { level, subSkills: [...] }
  skills: {},

  // Active effects (stables, buffs, etc.): effect id -> effect data
  effects: {},

  // Item sets: set id -> { items: [...], activeCount: number }
  itemSets: {},

  /**
   * Initialize hero state from API data
   */
  init(heroData) {
    if (!heroData) return this;

    this.heroId = heroData.id || heroData.slug;
    this.heroClass = heroData.hero_class;
    this.faction = heroData.faction;

    // Set base stats
    if (heroData.stats) {
      Object.assign(this.baseStats, heroData.stats);
    }

    // Set equipment
    if (heroData.equipment) {
      this.equipment = { ...heroData.equipment };
    }

    // Set spells
    if (heroData.spells) {
      this.spells = { ...heroData.spells };
    }

    // Set skills
    if (heroData.skills) {
      this.skills = { ...heroData.skills };
    }

    return this;
  },

  /**
   * Get effective stats (base + equipment bonuses + effect bonuses)
   */
  get effectiveStats() {
    const stats = { ...this.baseStats };

    // Add equipment bonuses
    for (const [slot, item] of Object.entries(this.equipment)) {
      if (!item || !item.config || !item.config.bonuses) continue;

      for (const bonus of item.config.bonuses) {
        if (bonus.type === 'hero_stat' && bonus.stat && bonus.parameters) {
          const statName = bonus.stat;
          const baseValue = bonus.parameters[1] || 0;
          const level = item.level || 1;
          const increment = bonus.upgrade?.increment || 0;
          const value = baseValue + (increment * (level - 1));

          if (stats[statName] !== undefined) {
            stats[statName] += value;
          }
        }
      }
    }

    // Add effect bonuses
    for (const [effectId, effect] of Object.entries(this.effects)) {
      if (effect.stats) {
        for (const [statName, value] of Object.entries(effect.stats)) {
          if (stats[statName] !== undefined) {
            stats[statName] += value;
          }
        }
      }
    }

    return stats;
  },

  /**
   * Equip an item
   */
  equipItem(slot, item) {
    this.equipment[slot] = item;
    this.updateItemSets();
  },

  /**
   * Unequip an item
   */
  unequipItem(slot) {
    delete this.equipment[slot];
    this.updateItemSets();
  },

  /**
   * Update item set tracking after equipment change
   */
  updateItemSets() {
    this.itemSets = {};

    for (const [slot, item] of Object.entries(this.equipment)) {
      if (item && item.setId) {
        if (!this.itemSets[item.setId]) {
          this.itemSets[item.setId] = { items: [], activeCount: 0 };
        }
        this.itemSets[item.setId].items.push(item);
        this.itemSets[item.setId].activeCount++;
      }
    }
  },

  /**
   * Create a context object for an item description
   */
  createItemContext(item) {
    return {
      currentItem: item,
      currentHero: {
        stats: this.effectiveStats,
        heroClass: this.heroClass,
        faction: this.faction,
        getSpellPower: (school) => this.effectiveStats.spellPower,
      },
      currentItemSet: item.setId ? this.itemSets[item.setId] : null,
    };
  },

  /**
   * Create a context object for a spell description
   */
  createSpellContext(spell) {
    return {
      currentMagic: spell,
      currentHero: {
        stats: this.effectiveStats,
        heroClass: this.heroClass,
        faction: this.faction,
        getSpellPower: (school) => {
          // Base spell power + school-specific bonuses
          let sp = this.effectiveStats.spellPower || 0;
          // Could add school-specific bonuses here
          return sp;
        },
      },
    };
  },

  /**
   * Create a context object for a skill description
   */
  createSkillContext(skill) {
    return {
      currentSkill: skill,
      currentSubSkill: skill.currentSubSkill,
      currentHero: {
        stats: this.effectiveStats,
        heroClass: this.heroClass,
        faction: this.faction,
      },
    };
  },

  /**
   * Create a context object for a buff description
   */
  createBuffContext(buff, options = {}) {
    return {
      currentBuff: {
        ...buff,
        getSpellPower: () => options.spellPower || this.effectiveStats.spellPower || 0,
        getStacks: () => options.stacks || 1,
        getSumMinDmg: () => options.sumMinDmg || 0,
        getSumMaxDmg: () => options.sumMaxDmg || 0,
      },
      currentHero: {
        stats: this.effectiveStats,
        heroClass: this.heroClass,
        faction: this.faction,
      },
    };
  },

  /**
   * Create a context object for a unit description
   */
  createUnitContext(unit) {
    return {
      currentUnit: unit,
      currentHero: {
        stats: this.effectiveStats,
        heroClass: this.heroClass,
        faction: this.faction,
      },
    };
  },

  /**
   * Format an item description with all placeholders resolved
   * @param {Object} item - The item data
   * @param {string} template - Description template with {0}, {1}, etc.
   * @param {Array<string>} argFunctions - Function names from Lang/args/artifacts.json
   * @returns {string} Formatted description
   */
  formatItemDescription(item, template, argFunctions) {
    const ctx = this.createItemContext(item);
    return DescriptionRuntime.formatDescription(template, argFunctions, ctx);
  },

  /**
   * Format a spell description
   */
  formatSpellDescription(spell, template, argFunctions) {
    const ctx = this.createSpellContext(spell);
    return DescriptionRuntime.formatDescription(template, argFunctions, ctx);
  },

  /**
   * Format a skill description
   */
  formatSkillDescription(skill, template, argFunctions) {
    const ctx = this.createSkillContext(skill);
    return DescriptionRuntime.formatDescription(template, argFunctions, ctx);
  },

  /**
   * Format a buff description
   */
  formatBuffDescription(buff, template, argFunctions, options = {}) {
    const ctx = this.createBuffContext(buff, options);
    return DescriptionRuntime.formatDescription(template, argFunctions, ctx);
  },

  /**
   * Format a unit description
   */
  formatUnitDescription(unit, template, argFunctions) {
    const ctx = this.createUnitContext(unit);
    return DescriptionRuntime.formatDescription(template, argFunctions, ctx);
  },

  /**
   * Update all visible descriptions in the DOM
   * Called after equipment changes, level ups, etc.
   */
  updateAllDescriptions() {
    // Find all elements with data-description attributes
    const elements = document.querySelectorAll('[data-description-template]');

    for (const el of elements) {
      const template = el.dataset.descriptionTemplate;
      const argsJson = el.dataset.descriptionArgs;
      const itemJson = el.dataset.descriptionItem;
      const type = el.dataset.descriptionType || 'item';

      if (!template || !argsJson) continue;

      try {
        const args = JSON.parse(argsJson);
        const item = itemJson ? JSON.parse(itemJson) : null;

        let formatted;
        switch (type) {
          case 'spell':
            formatted = this.formatSpellDescription(item, template, args);
            break;
          case 'skill':
            formatted = this.formatSkillDescription(item, template, args);
            break;
          case 'buff':
            formatted = this.formatBuffDescription(item, template, args);
            break;
          case 'unit':
            formatted = this.formatUnitDescription(item, template, args);
            break;
          default:
            formatted = this.formatItemDescription(item, template, args);
        }

        el.textContent = formatted;
      } catch (e) {
        console.error('[HeroState] Error updating description:', e);
      }
    }
  }
};

// Export for use in browser and Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { HeroState };
}
