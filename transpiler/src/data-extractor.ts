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
