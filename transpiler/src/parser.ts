/**
 * Parser for Olden Era .script files
 *
 * Produces an AST of script functions with their operations.
 */

import { Token, TokenType, tokenize } from './tokenizer';

// AST Types

export interface ScriptFile {
  functions: ScriptFunction[];
  sourceFile: string;
}

export interface ScriptFunction {
  name: string;
  returnType: string;
  operations: Operation[];
  line: number;
}

export interface Operation {
  name: string;           // Operation name: CurrentItem, Add, Text, etc.
  resultVar: string;      // Variable to store result (or 'return' for output)
  args: OperationArg[];   // Arguments
  line: number;
}

export type OperationArg = {
  type: 'identifier';
  value: string;
} | {
  type: 'string';
  value: string;
} | {
  type: 'number';
  value: number;
};

export class Parser {
  private tokens: Token[];
  private pos: number = 0;
  private sourceFile: string;

  constructor(tokens: Token[], sourceFile: string = '<unknown>') {
    // Filter out newlines for easier parsing
    this.tokens = tokens.filter(t => t.type !== 'NEWLINE');
    this.sourceFile = sourceFile;
  }

  parse(): ScriptFile {
    const functions: ScriptFunction[] = [];

    while (!this.isAtEnd()) {
      // Skip any leading content until we find a return type
      if (this.check('RETURN_TYPE')) {
        const func = this.parseFunction();
        if (func) {
          functions.push(func);
        }
      } else {
        // Skip unknown token
        this.advance();
      }
    }

    return {
      functions,
      sourceFile: this.sourceFile,
    };
  }

  private parseFunction(): ScriptFunction | null {
    // Return type
    const returnTypeToken = this.consume('RETURN_TYPE', 'Expected return type');
    if (!returnTypeToken) return null;

    // Function name
    const nameToken = this.consume('IDENTIFIER', 'Expected function name');
    if (!nameToken) return null;

    // Opening brace
    if (!this.consume('LBRACE', 'Expected {')) return null;

    // Parse operations until closing brace
    const operations: Operation[] = [];
    while (!this.check('RBRACE') && !this.isAtEnd()) {
      const op = this.parseOperation();
      if (op) {
        operations.push(op);
      }
    }

    // Closing brace
    if (!this.consume('RBRACE', 'Expected }')) return null;

    return {
      name: nameToken.value,
      returnType: returnTypeToken.value,
      operations,
      line: returnTypeToken.line,
    };
  }

  private parseOperation(): Operation | null {
    // Operation name (identifier)
    if (!this.check('IDENTIFIER')) {
      this.advance();
      return null;
    }

    const opNameToken = this.advance()!;
    const operationName = opNameToken.value;

    // Opening paren
    if (!this.consume('LPAREN', `Expected ( after ${operationName}`)) return null;

    // First argument is the result variable
    const resultArg = this.parseArg();
    if (!resultArg) return null;

    // Result var should be identifier (or 'return')
    const resultVar = resultArg.type === 'identifier' ? resultArg.value : 'return';

    // Parse remaining arguments
    const args: OperationArg[] = [];

    while (this.check('COMMA')) {
      this.advance(); // consume comma
      const arg = this.parseArg();
      if (arg) {
        args.push(arg);
      }
    }

    // Closing paren
    if (!this.consume('RPAREN', `Expected ) after ${operationName} arguments`)) return null;

    return {
      name: operationName,
      resultVar,
      args,
      line: opNameToken.line,
    };
  }

  private parseArg(): OperationArg | null {
    const token = this.peek();
    if (!token) return null;

    if (token.type === 'IDENTIFIER') {
      this.advance();
      return { type: 'identifier', value: token.value };
    }

    if (token.type === 'STRING') {
      this.advance();
      return { type: 'string', value: token.value };
    }

    if (token.type === 'NUMBER') {
      this.advance();
      return { type: 'number', value: parseFloat(token.value) };
    }

    return null;
  }

  // Helper methods

  private peek(): Token | null {
    if (this.isAtEnd()) return null;
    return this.tokens[this.pos];
  }

  private advance(): Token | null {
    if (!this.isAtEnd()) {
      return this.tokens[this.pos++];
    }
    return null;
  }

  private check(type: TokenType): boolean {
    if (this.isAtEnd()) return false;
    return this.tokens[this.pos].type === type;
  }

  private consume(type: TokenType, message: string): Token | null {
    if (this.check(type)) {
      return this.advance();
    }

    const current = this.peek();
    console.warn(`${this.sourceFile}:${current?.line ?? '?'}: ${message}, got ${current?.type ?? 'EOF'}`);
    return null;
  }

  private isAtEnd(): boolean {
    return this.pos >= this.tokens.length || this.tokens[this.pos].type === 'EOF';
  }
}

export function parseScript(source: string, sourceFile: string = '<unknown>'): ScriptFile {
  const tokens = tokenize(source);
  const parser = new Parser(tokens, sourceFile);
  return parser.parse();
}
