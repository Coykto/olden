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
    };

    // Extract buffs from DB/buffs/
    this.extractBuffs(data);

    // Extract abilities from DB/heroes_abilities/
    this.extractAbilities(data);

    // Extract obstacles from DB/field_objects/obstacles/
    this.extractObstacles(data);

    // Extract traps from DB/field_objects/traps/
    this.extractTraps(data);

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
