/**
 * Code Generator for Olden Era .script files
 *
 * Generates JavaScript code from the parsed AST.
 */

import { ScriptFile, ScriptFunction, Operation, OperationArg } from './parser';

// JavaScript reserved keywords that cannot be used as variable names
const JS_RESERVED_KEYWORDS = new Set([
  'return', 'const', 'let', 'var', 'function', 'if', 'else',
  'for', 'while', 'do', 'switch', 'case', 'break', 'continue',
  'class', 'extends', 'import', 'export', 'default', 'new',
  'this', 'typeof', 'void', 'delete', 'in', 'instanceof',
  'try', 'catch', 'finally', 'throw', 'with', 'yield', 'await',
  'null', 'undefined', 'true', 'false', 'debugger',
]);

/**
 * Sanitize variable names to avoid JS reserved keywords.
 */
function sanitizeVarName(name: string): string {
  if (JS_RESERVED_KEYWORDS.has(name)) {
    return `_${name}`;
  }
  return name;
}

// Map return types to formatter function names
const RETURN_TYPE_FORMATTERS: Record<string, string> = {
  'modInt': 'formatModInt',
  'modPercentNumeric': 'formatModPercentNumeric',
  'modFloatPercentF1Numeric': 'formatModFloatPercentF1',
  'string': 'formatString',
  'int': 'formatInt',
  'float': 'formatFloat',
  'Percent': 'formatPercent',
  'ModPercent': 'formatModPercent',
  'CurrentHeroAbility': 'formatString',
};

// Context accessor operations
const CONTEXT_OPERATIONS: Record<string, { contextPath: string; hasPath: boolean }> = {
  'CurrentItem': { contextPath: 'ctx.currentItem', hasPath: true },
  'CurrentHero': { contextPath: 'ctx.currentHero', hasPath: true },
  'CurrentSkillParameter': { contextPath: 'ctx.currentSkill', hasPath: true },
  'CurrentSubSkill': { contextPath: 'ctx.currentSubSkill', hasPath: true },
  'CurrentAbility': { contextPath: 'ctx.currentAbility', hasPath: true },
  'CurrentBuff': { contextPath: 'ctx.currentBuff', hasPath: true },
  'CurrentBuffSP': { contextPath: 'ctx.currentBuff', hasPath: false },
  'CurrentBuffStacks': { contextPath: 'ctx.currentBuff', hasPath: false },
  'CurrentBuffSumMinDmg': { contextPath: 'ctx.currentBuff', hasPath: false },
  'CurrentBuffSumMaxDmg': { contextPath: 'ctx.currentBuff', hasPath: false },
  'CurrentUnitData': { contextPath: 'ctx.currentUnit', hasPath: true },
  'CurrentUnitConfig': { contextPath: 'ctx.currentUnit', hasPath: true },
  'CurrentUnitStats': { contextPath: 'ctx.currentUnit', hasPath: true },
  'CurrentUnitStat': { contextPath: 'ctx.currentUnit', hasPath: true },
  'CurrentMagicBattle': { contextPath: 'ctx.currentMagic', hasPath: true },
  'CurrentMagicBattleRoot': { contextPath: 'ctx.currentMagic', hasPath: true },
  'CurrentMagicWorld': { contextPath: 'ctx.currentMagic', hasPath: true },
  'CurrentMagicLevel': { contextPath: 'ctx.currentMagic', hasPath: true },
  'CurrentFractionLawConfig': { contextPath: 'ctx.currentLaw', hasPath: true },
  'CurrentItemSet': { contextPath: 'ctx.currentItemSet', hasPath: true },
  'CurrentHeroSpecializationConfig': { contextPath: 'ctx.currentSpecialization', hasPath: true },
  'CurrentSentry': { contextPath: 'ctx.currentSentry', hasPath: true },
  // Quest/event context operations
  'CurrentSubQuestParam': { contextPath: 'ctx.currentQuest', hasPath: true },
  'CurrentSubQuestCounter': { contextPath: 'ctx.currentQuest', hasPath: true },
  'CurrentSideRes': { contextPath: 'ctx.currentSide', hasPath: true },
  'EventBankCurrentVariant': { contextPath: 'ctx.eventBank', hasPath: true },
};

// Database lookup operations
const DB_OPERATIONS = new Set([
  'DbBuff',
  'DbSideBuff',
  'DbObstacle',
  'DbAbility',
  'DbTrap',
]);

// Arithmetic operations
const ARITHMETIC_OPS: Record<string, string> = {
  'Add': '+',
  'Plus': '+',
  'Sub': '-',
  'Mul': '*',
  'Multiply': '*',
  'Div': '/',
};

export interface GeneratorOptions {
  memoizeSize?: number;
  includeSourceComments?: boolean;
}

export class CodeGenerator {
  private options: GeneratorOptions;
  private generatedFunctions: Set<string> = new Set();
  private functionDependencies: Map<string, Set<string>> = new Map();

  constructor(options: GeneratorOptions = {}) {
    this.options = {
      memoizeSize: 5,
      includeSourceComments: true,
      ...options,
    };
  }

  generate(files: ScriptFile[]): string {
    const output: string[] = [];

    // Header
    output.push('/**');
    output.push(' * Auto-generated description functions from Olden Era .script files');
    output.push(` * Generated at: ${new Date().toISOString()}`);
    output.push(' * DO NOT EDIT - This file is regenerated during import_gamedata');
    output.push(' */');
    output.push('');
    output.push('// @ts-nocheck');
    output.push('/* eslint-disable */');
    output.push('');
    output.push('const DescriptionFunctions = {};');
    output.push('');

    // Collect all functions and their dependencies
    for (const file of files) {
      for (const func of file.functions) {
        this.analyzeDependencies(func);
      }
    }

    // Sort functions by dependencies (topological sort)
    const sortedFunctions = this.topologicalSort(files);

    // Generate each function
    for (const { func, file } of sortedFunctions) {
      const funcCode = this.generateFunction(func, file.sourceFile);
      if (funcCode) {
        output.push(funcCode);
        output.push('');
      }
    }

    // Export
    output.push('// Export for use in browser and Node.js');
    output.push('if (typeof module !== "undefined" && module.exports) {');
    output.push('  module.exports = { DescriptionFunctions };');
    output.push('}');

    return output.join('\n');
  }

  private analyzeDependencies(func: ScriptFunction): void {
    const deps = new Set<string>();

    for (const op of func.operations) {
      if (op.name === 'Invoke' && op.args.length > 0) {
        const arg = op.args[0];
        if (arg.type === 'string') {
          deps.add(arg.value);
        }
      }
    }

    this.functionDependencies.set(func.name, deps);
  }

  private topologicalSort(files: ScriptFile[]): Array<{ func: ScriptFunction; file: ScriptFile }> {
    const allFuncs: Array<{ func: ScriptFunction; file: ScriptFile }> = [];
    const funcMap = new Map<string, { func: ScriptFunction; file: ScriptFile }>();

    for (const file of files) {
      for (const func of file.functions) {
        const entry = { func, file };
        allFuncs.push(entry);
        funcMap.set(func.name, entry);
      }
    }

    // Simple topological sort
    const visited = new Set<string>();
    const result: Array<{ func: ScriptFunction; file: ScriptFile }> = [];

    const visit = (name: string) => {
      if (visited.has(name)) return;
      visited.add(name);

      const deps = this.functionDependencies.get(name);
      if (deps) {
        for (const dep of deps) {
          visit(dep);
        }
      }

      const entry = funcMap.get(name);
      if (entry) {
        result.push(entry);
      }
    };

    for (const { func } of allFuncs) {
      visit(func.name);
    }

    return result;
  }

  private generateFunction(func: ScriptFunction, sourceFile: string): string | null {
    if (this.generatedFunctions.has(func.name)) {
      return null; // Already generated
    }
    this.generatedFunctions.add(func.name);

    const lines: string[] = [];
    const declaredVars = new Set<string>();  // Track declared variables

    // Source comment
    if (this.options.includeSourceComments) {
      lines.push(`// Source: ${sourceFile}:${func.line}`);
    }

    // Function wrapper with memoization
    lines.push(`DescriptionFunctions["${func.name}"] = DescriptionRuntime.memoize(function(ctx) {`);

    // Generate operation code
    for (const op of func.operations) {
      const opCode = this.generateOperation(op, func.returnType, declaredVars);
      if (opCode) {
        lines.push(`  ${opCode}`);
      }
    }

    lines.push(`}, ${this.options.memoizeSize});`);

    return lines.join('\n');
  }

  private generateOperation(op: Operation, returnType: string, declaredVars: Set<string>): string | null {
    const { name, resultVar, args } = op;
    const safeVar = sanitizeVarName(resultVar);

    // Helper to declare or assign a variable
    const declareOrAssign = (varName: string, value: string): string => {
      if (declaredVars.has(varName)) {
        return `${varName} = ${value};`;
      } else {
        declaredVars.add(varName);
        return `let ${varName} = ${value};`;
      }
    };

    // Text (return/assignment)
    if (name === 'Text') {
      if (resultVar === 'return') {
        // Return statement - apply formatter
        const formatter = RETURN_TYPE_FORMATTERS[returnType] || 'formatString';
        const value = this.argToJs(args[0]) || 'null';
        return `return DescriptionRuntime.${formatter}(${value});`;
      } else {
        // Assignment
        const value = this.argToJs(args[0]) || 'null';
        return declareOrAssign(safeVar, value);
      }
    }

    // Context accessor operations
    if (name in CONTEXT_OPERATIONS) {
      const config = CONTEXT_OPERATIONS[name];

      // Special cases for parameterless operations
      if (!config.hasPath) {
        if (name === 'CurrentBuffSP') {
          return declareOrAssign(safeVar, `${config.contextPath}.getSpellPower?.() ?? 0`);
        }
        if (name === 'CurrentBuffStacks') {
          return declareOrAssign(safeVar, `${config.contextPath}.getStacks?.() ?? 1`);
        }
        if (name === 'CurrentBuffSumMinDmg') {
          return declareOrAssign(safeVar, `${config.contextPath}.getSumMinDmg?.() ?? 0`);
        }
        if (name === 'CurrentBuffSumMaxDmg') {
          return declareOrAssign(safeVar, `${config.contextPath}.getSumMaxDmg?.() ?? 0`);
        }
      }

      // Path-based accessor
      if (args.length > 0) {
        const path = args[0].type === 'string' ? args[0].value : '';
        return declareOrAssign(safeVar, `DescriptionRuntime.get(${config.contextPath}, "${path}")`);
      }
      return null;
    }

    // Database lookups
    if (DB_OPERATIONS.has(name)) {
      if (args.length >= 2) {
        const dbType = name.replace('Db', '').toLowerCase() + 's';
        const id = this.argToJs(args[0]);
        const path = args[1].type === 'string' ? args[1].value : '';
        return declareOrAssign(safeVar, `DescriptionRuntime.get(GameData.${dbType}?.[${id}], "${path}")`);
      }
      return null;
    }

    // Arithmetic operations
    if (name in ARITHMETIC_OPS) {
      const operator = ARITHMETIC_OPS[name];
      const operands = args.map(a => this.argToJs(a)).filter(Boolean);

      if (operands.length === 0) return null;
      if (operands.length === 1) {
        return declareOrAssign(safeVar, `Number(${operands[0]}) || 0`);
      }

      const expr = operands.map(o => `(Number(${o}) || 0)`).join(` ${operator} `);
      return declareOrAssign(safeVar, expr);
    }

    // Avg (average)
    if (name === 'Avg') {
      const operands = args.map(a => this.argToJs(a)).filter(Boolean);
      if (operands.length === 0) return null;
      const sum = operands.map(o => `(Number(${o}) || 0)`).join(' + ');
      return declareOrAssign(safeVar, `(${sum}) / ${operands.length}`);
    }

    // Floor
    if (name === 'Floor') {
      if (args.length > 0) {
        const value = this.argToJs(args[0]);
        return declareOrAssign(safeVar, `Math.floor(Number(${value}) || 0)`);
      }
      return null;
    }

    // Invoke (call another function)
    if (name === 'Invoke') {
      if (args.length > 0 && args[0].type === 'string') {
        const funcName = args[0].value;
        return declareOrAssign(safeVar, `DescriptionFunctions["${funcName}"]?.(ctx) ?? null`);
      }
      return null;
    }

    // SpellpowerForCurrentMagic
    if (name === 'SpellpowerForCurrentMagic') {
      return declareOrAssign(safeVar, `ctx.currentHero?.getSpellPower?.(ctx.currentMagic?.school) ?? 0`);
    }

    // BuildingsCount
    if (name === 'BuildingsCount') {
      return declareOrAssign(safeVar, `ctx.currentCity?.buildingsCount ?? 0`);
    }

    // QuestCounter
    if (name === 'QuestCounter') {
      if (args.length > 0) {
        const counterId = this.argToJs(args[0]);
        return declareOrAssign(safeVar, `ctx.questCounters?.[${counterId}] ?? 0`);
      }
      return null;
    }

    // Ability lookup (similar to DbAbility but from context)
    if (name === 'Ability') {
      if (args.length >= 2) {
        const abilityId = this.argToJs(args[0]);
        const path = args[1].type === 'string' ? args[1].value : '';
        return declareOrAssign(safeVar, `DescriptionRuntime.get(GameData.abilities?.[${abilityId}], "${path}")`);
      }
      return null;
    }

    // Unit lookup
    if (name === 'Unit') {
      if (args.length >= 2) {
        const unitId = this.argToJs(args[0]);
        const path = args[1].type === 'string' ? args[1].value : '';
        return declareOrAssign(safeVar, `DescriptionRuntime.get(GameData.units?.[${unitId}], "${path}")`);
      }
      return null;
    }

    // Hero lookup
    if (name === 'Hero') {
      if (args.length >= 2) {
        const heroId = this.argToJs(args[0]);
        const path = args[1].type === 'string' ? args[1].value : '';
        return declareOrAssign(safeVar, `DescriptionRuntime.get(GameData.heroes?.[${heroId}], "${path}")`);
      }
      return null;
    }

    // Call (similar to Invoke)
    if (name === 'Call') {
      if (args.length > 0 && args[0].type === 'string') {
        const funcName = args[0].value;
        return declareOrAssign(safeVar, `DescriptionFunctions["${funcName}"]?.(ctx) ?? null`);
      }
      return null;
    }

    // Return (direct return with value)
    if (name === 'Return') {
      if (args.length > 0) {
        const value = this.argToJs(args[0]) || 'null';
        return `return ${value};`;
      }
      return `return null;`;
    }

    // EgorInt (debug/test operation - treat as identity)
    if (name === 'EgorInt') {
      if (args.length > 0) {
        const value = this.argToJs(args[0]);
        return declareOrAssign(safeVar, `Number(${value}) || 0`);
      }
      return declareOrAssign(safeVar, '0');
    }

    // Unknown operation - log warning
    console.warn(`Unknown operation: ${name}`);
    return declareOrAssign(safeVar, `null /* Unknown operation: ${name} */`);
  }

  private argToJs(arg: OperationArg | undefined): string | null {
    if (!arg) return null;

    switch (arg.type) {
      case 'identifier':
        // Sanitize identifier references to match sanitized variable declarations
        return sanitizeVarName(arg.value);
      case 'string':
        return `"${arg.value.replace(/"/g, '\\"')}"`;
      case 'number':
        return String(arg.value);
      default:
        return null;
    }
  }
}

export function generateCode(files: ScriptFile[], options?: GeneratorOptions): string {
  const generator = new CodeGenerator(options);
  return generator.generate(files);
}
