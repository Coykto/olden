/**
 * Data Extractor for Olden Era game data
 *
 * Extracts buff, ability, obstacle, and trap definitions
 * for embedding in generated JavaScript.
 */

import AdmZip from 'adm-zip';

export interface GameDataLookups {
  buffs: Record<string, any>;
  abilities: Record<string, any>;
  obstacles: Record<string, any>;
  traps: Record<string, any>;
  skills: Record<string, any>;
  buffAliases: Record<string, string>;  // Maps referenced ID -> actual buff ID
  passiveBuffLinks: Record<string, any>;  // Maps passive/ability name keys to their linked buff data
  unitAbilityData: Record<string, any>;  // Maps buff.sid -> ability data (duration, etc.) from unit files
}

export class DataExtractor {
  private zip: AdmZip;

  constructor(coreZipPath: string) {
    this.zip = new AdmZip(coreZipPath);
  }

  extract(): GameDataLookups {
    const data: GameDataLookups = {
      buffs: {},
      abilities: {},
      obstacles: {},
      traps: {},
      skills: {},
      buffAliases: {},
      passiveBuffLinks: {},
      unitAbilityData: {},
    };

    // Extract buffs from DB/buffs/
    this.extractBuffs(data);

    // Extract abilities from DB/heroes_abilities/
    this.extractAbilities(data);

    // Extract obstacles from DB/field_objects/obstacles/
    this.extractObstacles(data);

    // Extract traps from DB/field_objects/traps/
    this.extractTraps(data);

    // Extract skills from DB/heroes_skills/skills/
    this.extractSkills(data);

    // Build buff aliases by comparing skill references to actual buffs
    this.buildBuffAliases(data);

    // Extract unit ability data (duration, etc.) from unit logic files
    // This must run before buildPassiveBuffLinks so we can enrich the links
    this.extractUnitAbilityData(data);

    // Build passive/ability to buff links (from unit buff files)
    this.buildPassiveBuffLinks(data);

    return data;
  }

  /**
   * Extract items from an array-wrapped JSON structure.
   * Game data files use { "array": [...] } or direct arrays.
   */
  private extractArrayItems(content: string): any[] {
    try {
      const parsed = JSON.parse(content);

      // Handle { "array": [...] } wrapper
      if (parsed.array && Array.isArray(parsed.array)) {
        return parsed.array;
      }

      // Handle direct array
      if (Array.isArray(parsed)) {
        return parsed;
      }

      // Single object with id
      if (parsed.id) {
        return [parsed];
      }

      return [];
    } catch {
      return [];
    }
  }

  private extractBuffs(data: GameDataLookups): void {
    // Buff files are in DB/buffs/
    const buffsDirs = ['DB/buffs/', 'DB/heroes_buffs/'];

    try {
      const entries = this.zip.getEntries();
      for (const entry of entries) {
        const matchesDir = buffsDirs.some(dir => entry.entryName.startsWith(dir));
        if (matchesDir && entry.entryName.endsWith('.json')) {
          const content = entry.getData().toString('utf-8');
          const items = this.extractArrayItems(content);

          for (const item of items) {
            if (item.id) {
              data.buffs[item.id] = this.extractBuffFields(item);
            }
          }
        }
      }
    } catch (e) {
      console.warn('Error extracting buffs:', e);
    }

    console.log(`[DataExtractor] Extracted ${Object.keys(data.buffs).length} buffs`);
  }

  private extractBuffFields(buffData: any): any {
    // Extract relevant fields for description lookups
    return {
      id: buffData.id,
      data: buffData.data,
      config: buffData.config,
      // Include stats directly if present
      stats: buffData.data?.stats,
      // Include actions for sidebuff lookups (formation skills, etc.)
      actions: buffData.actions,
      // Include name_ for linking buffs to passives/abilities
      name_: buffData.name_,
    };
  }

  private extractAbilities(data: GameDataLookups): void {
    // Abilities are in DB/heroes_abilities/heroes_abilities_base/
    const abilitiesDirs = [
      'DB/heroes_abilities/heroes_abilities_base/',
      'DB/battle_abilities/',
    ];

    try {
      const entries = this.zip.getEntries();
      for (const entry of entries) {
        const matchesDir = abilitiesDirs.some(dir => entry.entryName.startsWith(dir));
        if (matchesDir && entry.entryName.endsWith('.json')) {
          const content = entry.getData().toString('utf-8');
          const items = this.extractArrayItems(content);

          for (const item of items) {
            if (item.id) {
              data.abilities[item.id] = this.extractAbilityFields(item);
            }
          }
        }
      }
    } catch (e) {
      console.warn('Error extracting abilities:', e);
    }

    console.log(`[DataExtractor] Extracted ${Object.keys(data.abilities).length} abilities`);
  }

  private extractAbilityFields(abilityData: any): any {
    return {
      id: abilityData.id,
      levels: abilityData.levels,
      config: abilityData.config,
      data: abilityData.data,
    };
  }

  private extractObstacles(data: GameDataLookups): void {
    const obstaclesDir = 'DB/field_objects/obstacles/';

    try {
      const entries = this.zip.getEntries();
      for (const entry of entries) {
        if (entry.entryName.startsWith(obstaclesDir) && entry.entryName.endsWith('.json')) {
          const content = entry.getData().toString('utf-8');
          const items = this.extractArrayItems(content);

          for (const item of items) {
            if (item.id) {
              data.obstacles[item.id] = {
                id: item.id,
                config: item.config,
                data: item.data,
              };
            }
          }
        }
      }
    } catch (e) {
      console.warn('Error extracting obstacles:', e);
    }

    console.log(`[DataExtractor] Extracted ${Object.keys(data.obstacles).length} obstacles`);
  }

  private extractTraps(data: GameDataLookups): void {
    const trapsDir = 'DB/field_objects/traps/';

    try {
      const entries = this.zip.getEntries();
      for (const entry of entries) {
        if (entry.entryName.startsWith(trapsDir) && entry.entryName.endsWith('.json')) {
          const content = entry.getData().toString('utf-8');
          const items = this.extractArrayItems(content);

          for (const item of items) {
            if (item.id) {
              data.traps[item.id] = {
                id: item.id,
                config: item.config,
                data: item.data,
              };
            }
          }
        }
      }
    } catch (e) {
      console.warn('Error extracting traps:', e);
    }

    console.log(`[DataExtractor] Extracted ${Object.keys(data.traps).length} traps`);
  }

  private extractSkills(data: GameDataLookups): void {
    const skillsDir = 'DB/heroes_skills/skills/';

    try {
      const entries = this.zip.getEntries();
      for (const entry of entries) {
        if (entry.entryName.startsWith(skillsDir) && entry.entryName.endsWith('.json')) {
          const content = entry.getData().toString('utf-8');
          const items = this.extractArrayItems(content);

          for (const item of items) {
            if (item.id) {
              data.skills[item.id] = item;
            }
          }
        }
      }
    } catch (e) {
      console.warn('Error extracting skills:', e);
    }

    console.log(`[DataExtractor] Extracted ${Object.keys(data.skills).length} skills`);
  }

  /**
   * Extract unit ability data from unit logic files.
   * This captures ability-specific data (like duration) that's not in the buff definitions.
   *
   * Creates a mapping: buff.sid -> ability data (duration, damage, etc.)
   *
   * This is needed because:
   * - Buff definitions have buff stats (damage bonuses, etc.)
   * - But ability duration is defined in the unit's ability definition
   * - Description functions need both: buff stats AND ability duration
   */
  private extractUnitAbilityData(data: GameDataLookups): void {
    const unitLogicsDir = 'DB/units/units_logics/';

    try {
      const entries = this.zip.getEntries();
      for (const entry of entries) {
        if (entry.entryName.startsWith(unitLogicsDir) && entry.entryName.endsWith('.json')) {
          let content = entry.getData().toString('utf-8');

          // Handle UTF-8 BOM
          if (content.charCodeAt(0) === 0xFEFF) {
            content = content.substring(1);
          }

          const items = this.extractArrayItems(content);

          for (const unit of items) {
            if (!unit.id) continue;

            // Process abilities
            const abilities = unit.abilities || [];
            for (const ability of abilities) {
              if (ability?.damageDealer?.buff?.sid) {
                const buffSid = ability.damageDealer.buff.sid;
                const duration = ability.damageDealer.buff.duration;

                // Only store if we have meaningful data
                if (duration !== undefined) {
                  // Use the first found duration (don't overwrite with later entries)
                  // This handles cases where different unit variants have the same buff
                  if (!data.unitAbilityData[buffSid]) {
                    data.unitAbilityData[buffSid] = {
                      duration: duration,
                      unitId: unit.id,
                    };
                  }
                }
              }
            }

            // Also process passives that might have abilities with buffs
            const passives = unit.passives || [];
            for (const passive of passives) {
              // Check if passive has actions with buffs
              const actions = passive?.actions || [];
              for (const action of actions) {
                if (action?.damageDealer?.buff?.sid) {
                  const buffSid = action.damageDealer.buff.sid;
                  const duration = action.damageDealer.buff.duration;

                  if (duration !== undefined && !data.unitAbilityData[buffSid]) {
                    data.unitAbilityData[buffSid] = {
                      duration: duration,
                      unitId: unit.id,
                    };
                  }
                }
              }
            }
          }
        }
      }
    } catch (e) {
      console.warn('Error extracting unit ability data:', e);
    }

    console.log(`[DataExtractor] Extracted ${Object.keys(data.unitAbilityData).length} unit ability data entries`);
  }

  /**
   * Build buff aliases by finding buff references in skills that don't exist
   * in the extracted buffs, then trying to match them to actual buffs.
   *
   * This handles cases like:
   * - Skill references "skill_formation_1_bonus"
   * - Actual buff is "skill_formation_1_unit_bonus"
   */
  private buildBuffAliases(data: GameDataLookups): void {
    const buffRefs = new Set<string>();
    const existingBuffIds = new Set(Object.keys(data.buffs));

    // Collect all buff references from skills
    for (const skill of Object.values(data.skills)) {
      for (const level of (skill as any).parametersPerLevel || []) {
        for (const bonus of level.bonuses || []) {
          if (bonus.type === 'battleSubskillBonus') {
            const params = bonus.parameters || [];
            if (params.length >= 2) {
              const buffType = params[0];  // e.g., "unit_buff", "hero_ability"
              const buffRef = params[1];   // e.g., "skill_formation_1_bonus"

              // If the reference doesn't exist directly, we need to find it
              if (!existingBuffIds.has(buffRef)) {
                buffRefs.add(buffRef);
              }
            }
          }
        }
      }
    }

    // Try to find actual buffs for each missing reference
    let aliasCount = 0;
    for (const ref of buffRefs) {
      const actualId = this.findActualBuffId(ref, existingBuffIds);
      if (actualId) {
        data.buffAliases[ref] = actualId;
        aliasCount++;
      } else {
        console.warn(`[DataExtractor] Could not find buff for reference: ${ref}`);
      }
    }

    console.log(`[DataExtractor] Built ${aliasCount} buff aliases from ${buffRefs.size} missing references`);
  }

  /**
   * Try to find the actual buff ID for a given reference.
   * Applies known naming transformations.
   */
  private findActualBuffId(ref: string, existingBuffIds: Set<string>): string | null {
    // Transformation 1: unit_buff type uses _unit_bonus suffix
    // Reference: "skill_formation_1_bonus" -> Actual: "skill_formation_1_unit_bonus"
    if (ref.endsWith('_bonus')) {
      const transformed = ref.replace(/_bonus$/, '_unit_bonus');
      if (existingBuffIds.has(transformed)) {
        return transformed;
      }
    }

    // Transformation 2: Try adding _unit suffix before the last word
    // This handles more general cases
    const parts = ref.split('_');
    if (parts.length >= 2) {
      const lastPart = parts.pop()!;
      const withUnit = [...parts, 'unit', lastPart].join('_');
      if (existingBuffIds.has(withUnit)) {
        return withUnit;
      }
    }

    // Add more transformations here as patterns are discovered
    // ...

    return null;
  }

  /**
   * Build passive/ability to buff links by finding buffs that have a name_ field
   * pointing to a passive or ability name key.
   *
   * For example:
   * - Buff "esquire_additionbuff" has name_: "esquire_passive_1_name"
   * - This creates a link: "esquire_passive_1" -> { buffId: "esquire_additionbuff", buffData: {...} }
   *
   * This allows description functions to look up buff data when the normal
   * passives[n].actions[m].damageDealer.buff.sid path doesn't exist.
   */
  private buildPassiveBuffLinks(data: GameDataLookups): void {
    let linkCount = 0;

    for (const [buffId, buffData] of Object.entries(data.buffs)) {
      const nameKey = (buffData as any).name_;
      if (!nameKey) continue;

      // Check if this is a passive or ability name key
      // Format: "{unit}_passive_{n}_name" or "{unit}_ability_{n}_name"
      const passiveMatch = nameKey.match(/^(.+)_(passive|ability)_(\d+)_name$/);
      if (passiveMatch) {
        const unitId = passiveMatch[1];
        const type = passiveMatch[2];  // "passive" or "ability"
        const index = parseInt(passiveMatch[3], 10);

        // Create a key for this passive/ability: "unitId_passive_N" or "unitId_ability_N"
        const linkKey = `${unitId}_${type}_${index}`;

        // Look up ability-specific data (like duration) from unit ability data
        const abilityData = data.unitAbilityData[buffId] || {};

        data.passiveBuffLinks[linkKey] = {
          buffId: buffId,
          buffData: (buffData as any).data || {},
          stats: (buffData as any).stats || (buffData as any).data?.stats || {},
          // Include duration from unit ability data if available
          duration: abilityData.duration,
        };
        linkCount++;
      }
    }

    console.log(`[DataExtractor] Built ${linkCount} passive/ability buff links`);
  }

  generateGameDataJs(data: GameDataLookups): string {
    const output: string[] = [];

    output.push('/**');
    output.push(' * Auto-generated game data lookups for description functions');
    output.push(` * Generated at: ${new Date().toISOString()}`);
    output.push(' * DO NOT EDIT - This file is regenerated during import_gamedata');
    output.push(' */');
    output.push('');
    output.push('// @ts-nocheck');
    output.push('/* eslint-disable */');
    output.push('');
    output.push('const GameData = {');
    output.push(`  buffs: ${JSON.stringify(data.buffs, null, 2).split('\n').join('\n  ')},`);
    output.push(`  abilities: ${JSON.stringify(data.abilities, null, 2).split('\n').join('\n  ')},`);
    output.push(`  obstacles: ${JSON.stringify(data.obstacles, null, 2).split('\n').join('\n  ')},`);
    output.push(`  traps: ${JSON.stringify(data.traps, null, 2).split('\n').join('\n  ')},`);
    output.push(`  passiveBuffLinks: ${JSON.stringify(data.passiveBuffLinks, null, 2).split('\n').join('\n  ')},`);
    output.push('};');
    output.push('');
    output.push('// Alias for description functions that use "sidebuffs" lookup');
    output.push('GameData.sidebuffs = GameData.buffs;');
    output.push('');
    output.push('// Apply pre-computed buff aliases (discovered by analyzing skill references vs actual buffs)');
    output.push('// This handles cases where skills reference buffs by a different ID than they are stored');
    if (Object.keys(data.buffAliases).length > 0) {
      output.push('(function() {');
      output.push('  const buffAliases = ' + JSON.stringify(data.buffAliases) + ';');
      output.push('  for (const [aliasId, actualId] of Object.entries(buffAliases)) {');
      output.push('    if (GameData.buffs[actualId] && !GameData.buffs[aliasId]) {');
      output.push('      GameData.buffs[aliasId] = GameData.buffs[actualId];');
      output.push('      GameData.sidebuffs[aliasId] = GameData.buffs[actualId];');
      output.push('    }');
      output.push('  }');
      output.push('})();');
    } else {
      output.push('// No buff aliases needed');
    }
    output.push('');
    output.push('// Export for use in browser and Node.js');
    output.push('if (typeof module !== "undefined" && module.exports) {');
    output.push('  module.exports = { GameData };');
    output.push('}');

    return output.join('\n');
  }
}

export function extractGameData(coreZipPath: string): { data: GameDataLookups; js: string } {
  const extractor = new DataExtractor(coreZipPath);
  const data = extractor.extract();
  const js = extractor.generateGameDataJs(data);
  return { data, js };
}
