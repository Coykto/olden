/**
 * Olden Era Script Transpiler
 *
 * Parses .script files from Core.zip and generates JavaScript functions
 * for client-side description computation.
 *
 * Usage:
 *   npx ts-node src/index.ts <core-zip-path> <output-dir>
 */

import * as fs from 'fs';
import * as path from 'path';
import AdmZip from 'adm-zip';
import { parseScript, ScriptFile } from './parser';
import { generateCode } from './codegen';
import { extractGameData } from './data-extractor';

// All script file paths within Core.zip
const SCRIPT_PATHS = [
  // Items
  'DB/info/info_item/item.script',
  'DB/info/info_item/items_set.script',

  // Hero skills
  'DB/info/info_hero_skills/hero_skill.script',
  'DB/info/info_hero_skills/hero_skill_faction.script',
  'DB/info/info_hero_skills/hero_classes.script',
  'DB/info/info_hero_skills/hero_specialization.script',
  'DB/info/info_hero_skills/hero_specialization_demon.script',
  'DB/info/info_hero_skills/hero_specialization_dungeon.script',
  'DB/info/info_hero_skills/hero_specialization_human.script',
  'DB/info/info_hero_skills/hero_specialization_nature.script',
  'DB/info/info_hero_skills/hero_specialization_undead.script',
  'DB/info/info_hero_skills/hero_specialization_unfrozen.script',

  // Magic
  'DB/info/info_script_magic/magic_info.script',
  'DB/info/info_script_magic/magic_battle.script',
  'DB/info/info_script_magic/magic_battle_alts.script',
  'DB/info/info_script_magic/magic_battle_day.script',
  'DB/info/info_script_magic/magic_battle_night.script',
  'DB/info/info_script_magic/magic_battle_neutral.script',
  'DB/info/info_script_magic/magic_battle_primal.script',
  'DB/info/info_script_magic/magic_battle_space.script',
  'DB/info/info_script_magic/magic_world_day.script',
  'DB/info/info_script_magic/magic_world_neutral.script',
  'DB/info/info_script_magic/magic_world_night.script',
  'DB/info/info_script_magic/magic_world_primal.script',
  'DB/info/info_script_magic/magic_world_space.script',

  // Units
  'DB/info/info_script_unit/units.script',
  'DB/info/info_script_unit/units_alts.script',
  'DB/info/info_script_unit/units_demon.script',
  'DB/info/info_script_unit/units_dungeon.script',
  'DB/info/info_script_unit/units_human.script',
  'DB/info/info_script_unit/units_nature.script',
  'DB/info/info_script_unit/units_neutral.script',
  'DB/info/info_script_unit/units_undead.script',
  'DB/info/info_script_unit/units_unfrozen.script',

  // Buffs
  'DB/info/info_script_buffs/buffs.script',

  // Hero abilities
  'DB/info/info_hero_ability/hero_ability.script',

  // Laws
  'DB/info/info_laws/laws.script',

  // City buildings
  'DB/info/info_city/city_building.script',

  // Map objects
  'DB/info/info_map_object/map_object.script',

  // Quests & Tutorial
  'DB/info/quests.script',
  'DB/info/tutorial.script',
  'DB/info/concept.script',
];

interface TranspilerResult {
  functionsGenerated: number;
  filesProcessed: number;
  errors: string[];
  warnings: string[];
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.error('Usage: npx ts-node src/index.ts <core-zip-path> <output-dir>');
    console.error('');
    console.error('Example:');
    console.error('  npx ts-node src/index.ts /path/to/Core.zip /path/to/static/js/generated/');
    process.exit(1);
  }

  const coreZipPath = args[0];
  const outputDir = args[1];

  console.log('');
  console.log('='.repeat(60));
  console.log('Olden Era Script Transpiler');
  console.log('='.repeat(60));
  console.log('');

  // Validate inputs
  if (!fs.existsSync(coreZipPath)) {
    console.error(`[ERROR] Core.zip not found: ${coreZipPath}`);
    process.exit(1);
  }

  // Create output directory if needed
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`[INFO] Created output directory: ${outputDir}`);
  }

  const result = await transpile(coreZipPath, outputDir);

  // Print summary
  console.log('');
  console.log('-'.repeat(60));
  console.log('Summary');
  console.log('-'.repeat(60));
  console.log(`  Files processed: ${result.filesProcessed}`);
  console.log(`  Functions generated: ${result.functionsGenerated}`);
  console.log(`  Errors: ${result.errors.length}`);
  console.log(`  Warnings: ${result.warnings.length}`);
  console.log('');

  if (result.errors.length > 0) {
    console.log('Errors:');
    for (const error of result.errors) {
      console.log(`  - ${error}`);
    }
    console.log('');
  }

  if (result.warnings.length > 0 && result.warnings.length <= 10) {
    console.log('Warnings:');
    for (const warning of result.warnings) {
      console.log(`  - ${warning}`);
    }
    console.log('');
  } else if (result.warnings.length > 10) {
    console.log(`Warnings: ${result.warnings.length} (showing first 10)`);
    for (const warning of result.warnings.slice(0, 10)) {
      console.log(`  - ${warning}`);
    }
    console.log('');
  }

  console.log('='.repeat(60));
  console.log('Transpilation complete!');
  console.log('='.repeat(60));
  console.log('');
}

async function transpile(coreZipPath: string, outputDir: string): Promise<TranspilerResult> {
  const result: TranspilerResult = {
    functionsGenerated: 0,
    filesProcessed: 0,
    errors: [],
    warnings: [],
  };

  // Open Core.zip
  console.log(`[INFO] Reading Core.zip from: ${coreZipPath}`);
  const zip = new AdmZip(coreZipPath);

  // Parse all script files
  const scriptFiles: ScriptFile[] = [];

  console.log('');
  console.log('[INFO] Parsing script files...');

  for (const scriptPath of SCRIPT_PATHS) {
    const entry = zip.getEntry(scriptPath);

    if (!entry) {
      result.warnings.push(`Script file not found: ${scriptPath}`);
      continue;
    }

    try {
      const source = entry.getData().toString('utf-8');
      const parsed = parseScript(source, scriptPath);

      scriptFiles.push(parsed);
      result.filesProcessed++;

      console.log(`  [OK] ${scriptPath} (${parsed.functions.length} functions)`);
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : String(e);
      result.errors.push(`Failed to parse ${scriptPath}: ${errorMsg}`);
      console.log(`  [ERROR] ${scriptPath}: ${errorMsg}`);
    }
  }

  // Count total functions
  let totalFunctions = 0;
  for (const file of scriptFiles) {
    totalFunctions += file.functions.length;
  }

  console.log('');
  console.log(`[INFO] Parsed ${totalFunctions} functions from ${result.filesProcessed} files`);

  // Generate JavaScript code
  console.log('');
  console.log('[INFO] Generating JavaScript code...');

  const jsCode = generateCode(scriptFiles);
  result.functionsGenerated = totalFunctions;

  // Write description_functions.js
  const functionsPath = path.join(outputDir, 'description_functions.js');
  fs.writeFileSync(functionsPath, jsCode);
  console.log(`  [OK] Written: ${functionsPath}`);

  // Extract and generate game data lookups
  console.log('');
  console.log('[INFO] Extracting game data lookups...');

  try {
    const { js: gameDataJs } = extractGameData(coreZipPath);
    const gameDataPath = path.join(outputDir, 'game_data.js');
    fs.writeFileSync(gameDataPath, gameDataJs);
    console.log(`  [OK] Written: ${gameDataPath}`);
  } catch (e) {
    const errorMsg = e instanceof Error ? e.message : String(e);
    result.errors.push(`Failed to extract game data: ${errorMsg}`);
    console.log(`  [ERROR] Failed to extract game data: ${errorMsg}`);
  }

  return result;
}

// Run main
main().catch(e => {
  console.error('Transpiler failed:', e);
  process.exit(1);
});
