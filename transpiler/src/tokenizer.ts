/**
 * Tokenizer for Olden Era .script files
 *
 * Script syntax:
 *   [return_type] [function_name]
 *   {
 *       [operation] ( [result_var], [args...] )
 *       Text( return, [final_result] )
 *   }
 */

export type TokenType =
  | 'RETURN_TYPE'   // modInt, string, modPercentNumeric, etc.
  | 'IDENTIFIER'    // function names, variable names
  | 'LBRACE'        // {
  | 'RBRACE'        // }
  | 'LPAREN'        // (
  | 'RPAREN'        // )
  | 'COMMA'         // ,
  | 'STRING'        // "quoted string"
  | 'NUMBER'        // numeric literal
  | 'NEWLINE'       // end of line
  | 'EOF';          // end of file

export interface Token {
  type: TokenType;
  value: string;
  line: number;
  column: number;
}

// Known return types in the script language
const RETURN_TYPES = new Set([
  'modInt',
  'modPercentNumeric',
  'modFloatPercentF1Numeric',
  'string',
  'int',
  'float',
  'Percent',
  'ModPercent',
  'CurrentHeroAbility',
]);

export class Tokenizer {
  private source: string;
  private pos: number = 0;
  private line: number = 1;
  private column: number = 1;
  private tokens: Token[] = [];

  constructor(source: string) {
    // Normalize line endings and remove BOM
    this.source = source.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
  }

  tokenize(): Token[] {
    while (this.pos < this.source.length) {
      this.skipWhitespace();

      if (this.pos >= this.source.length) break;

      const char = this.source[this.pos];

      // Skip comments
      if (char === '/' && this.peek(1) === '/') {
        this.skipComment();
        continue;
      }

      // Newline
      if (char === '\n') {
        this.addToken('NEWLINE', '\n');
        this.advance();
        this.line++;
        this.column = 1;
        continue;
      }

      // Single character tokens
      if (char === '{') {
        this.addToken('LBRACE', '{');
        this.advance();
        continue;
      }

      if (char === '}') {
        this.addToken('RBRACE', '}');
        this.advance();
        continue;
      }

      if (char === '(') {
        this.addToken('LPAREN', '(');
        this.advance();
        continue;
      }

      if (char === ')') {
        this.addToken('RPAREN', ')');
        this.advance();
        continue;
      }

      if (char === ',') {
        this.addToken('COMMA', ',');
        this.advance();
        continue;
      }

      // String literal
      if (char === '"') {
        this.readString();
        continue;
      }

      // Number (including negative)
      if (this.isDigit(char) || (char === '-' && this.isDigit(this.peek(1)))) {
        this.readNumber();
        continue;
      }

      // Identifier or return type
      if (this.isIdentifierStart(char)) {
        this.readIdentifier();
        continue;
      }

      // Unknown character - skip it
      this.advance();
    }

    this.addToken('EOF', '');
    return this.tokens;
  }

  private skipWhitespace(): void {
    while (this.pos < this.source.length) {
      const char = this.source[this.pos];
      if (char === ' ' || char === '\t') {
        this.advance();
      } else {
        break;
      }
    }
  }

  private skipComment(): void {
    // Skip until end of line
    while (this.pos < this.source.length && this.source[this.pos] !== '\n') {
      this.advance();
    }
  }

  private readString(): void {
    const startColumn = this.column;
    this.advance(); // Skip opening quote

    let value = '';
    while (this.pos < this.source.length && this.source[this.pos] !== '"') {
      if (this.source[this.pos] === '\n') {
        throw new Error(`Unterminated string at line ${this.line}, column ${startColumn}`);
      }
      value += this.source[this.pos];
      this.advance();
    }

    if (this.pos >= this.source.length) {
      throw new Error(`Unterminated string at line ${this.line}, column ${startColumn}`);
    }

    this.advance(); // Skip closing quote
    this.addToken('STRING', value, startColumn);
  }

  private readNumber(): void {
    const startColumn = this.column;
    let value = '';

    // Handle negative sign
    if (this.source[this.pos] === '-') {
      value += '-';
      this.advance();
    }

    // Read integer part
    while (this.pos < this.source.length && this.isDigit(this.source[this.pos])) {
      value += this.source[this.pos];
      this.advance();
    }

    // Read decimal part if present
    if (this.pos < this.source.length && this.source[this.pos] === '.') {
      value += '.';
      this.advance();
      while (this.pos < this.source.length && this.isDigit(this.source[this.pos])) {
        value += this.source[this.pos];
        this.advance();
      }
    }

    this.addToken('NUMBER', value, startColumn);
  }

  private readIdentifier(): void {
    const startColumn = this.column;
    let value = '';

    while (this.pos < this.source.length && this.isIdentifierChar(this.source[this.pos])) {
      value += this.source[this.pos];
      this.advance();
    }

    // Check if it's a return type
    if (RETURN_TYPES.has(value)) {
      this.addToken('RETURN_TYPE', value, startColumn);
    } else {
      this.addToken('IDENTIFIER', value, startColumn);
    }
  }

  private addToken(type: TokenType, value: string, column?: number): void {
    this.tokens.push({
      type,
      value,
      line: this.line,
      column: column ?? this.column,
    });
  }

  private advance(): void {
    this.pos++;
    this.column++;
  }

  private peek(offset: number = 0): string {
    const pos = this.pos + offset;
    return pos < this.source.length ? this.source[pos] : '';
  }

  private isDigit(char: string): boolean {
    return char >= '0' && char <= '9';
  }

  private isIdentifierStart(char: string): boolean {
    return (char >= 'a' && char <= 'z') ||
           (char >= 'A' && char <= 'Z') ||
           char === '_';
  }

  private isIdentifierChar(char: string): boolean {
    return this.isIdentifierStart(char) || this.isDigit(char);
  }
}

export function tokenize(source: string): Token[] {
  const tokenizer = new Tokenizer(source);
  return tokenizer.tokenize();
}
