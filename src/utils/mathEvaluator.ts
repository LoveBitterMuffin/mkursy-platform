type TokenType = 'num' | 'id' | 'op' | 'lp' | 'rp';
interface Token { type: TokenType; val: string; }

const MATH_FUNCS = new Set(['sin', 'cos', 'tan', 'sqrt', 'abs']);

function shouldInsertMultiply(prev: Token, next: Token): boolean {
  if (prev.type === 'id' && MATH_FUNCS.has(prev.val.toLowerCase()) && next.type === 'lp') {
    return false;
  }
  const prevEnd = prev.type === 'num' || prev.type === 'id' || prev.type === 'rp';
  const nextStart = next.type === 'id' || next.type === 'lp';
  return prevEnd && nextStart;
}

function tokenize(expr: string): Token[] {
  const tokens: Token[] = [];
  const regex = /\s*([0-9]+(?:\.[0-9]+)?|[a-zA-Z_]\w*|[\+\-\*\/\^]|[\(\)])\s*/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(expr)) !== null) {
    const raw = match[1];
    let type: TokenType = 'op';
    if (/^[0-9]/.test(raw)) type = 'num';
    else if (/^[a-zA-Z_]/.test(raw)) type = 'id';
    else if (raw === '(') type = 'lp';
    else if (raw === ')') type = 'rp';
    const tok: Token = { type, val: raw };
    const prev = tokens[tokens.length - 1];
    if (prev && shouldInsertMultiply(prev, tok)) tokens.push({ type: 'op', val: '*' });
    tokens.push(tok);
  }
  return tokens;
}

class Parser {
  private pos = 0;
  constructor(private tokens: Token[], private x: number, private p: Record<string, number>) {}
  private peek(): Token | undefined { return this.tokens[this.pos]; }
  private consume(): Token { return this.tokens[this.pos++]; }

  parse(): number {
    const val = this.parseExpr();
    return this.pos < this.tokens.length ? NaN : val;
  }

  private parseExpr(): number {
    let val = this.parseTerm();
    while (this.peek()?.type === 'op' && (this.peek()?.val === '+' || this.peek()?.val === '-')) {
      const op = this.consume().val;
      val = op === '+' ? val + this.parseTerm() : val - this.parseTerm();
    }
    return val;
  }

  private parseTerm(): number {
    let val = this.parseUnary();
    while (this.peek()?.type === 'op' && (this.peek()?.val === '*' || this.peek()?.val === '/')) {
      const op = this.consume().val;
      val = op === '*' ? val * this.parseUnary() : val / this.parseUnary();
    }
    return val;
  }

  private parseUnary(): number {
    if (this.peek()?.type === 'op' && this.peek()?.val === '-') {
      this.consume();
      return -this.parseUnary();
    }
    if (this.peek()?.type === 'op' && this.peek()?.val === '+') {
      this.consume();
      return this.parseUnary();
    }
    return this.parsePower();
  }

  private parsePower(): number {
    const base = this.parsePrimary();
    if (this.peek()?.type === 'op' && this.peek()?.val === '^') {
      this.consume();
      return Math.pow(base, this.parseUnary());
    }
    return base;
  }

  private parsePrimary(): number {
    const tok = this.peek();
    if (!tok) return NaN;
    if (tok.type === 'num') return Number(this.consume().val);
    if (tok.type === 'id') return this.parseId(this.consume().val);
    if (tok.type === 'lp') {
      this.consume();
      const val = this.parseExpr();
      if (this.peek()?.type === 'rp') { this.consume(); return val; }
      return NaN;
    }
    return NaN;
  }

  private parseId(id: string): number {
    const lower = id.toLowerCase();
    if (lower === 'x') return this.x;
    if (lower === 'pi') return Math.PI;
    if (lower === 'e') return Math.E;
    if (MATH_FUNCS.has(lower) && this.peek()?.type === 'lp') {
      this.consume();
      const arg = this.parseExpr();
      if (this.peek()?.type === 'rp') {
        this.consume();
        return this.evalFunc(lower, arg);
      }
      return NaN;
    }
    return this.p[id] ?? this.p[lower] ?? NaN;
  }

  private evalFunc(name: string, a: number): number {
    if (name === 'sin') return Math.sin(a);
    if (name === 'cos') return Math.cos(a);
    if (name === 'tan') return Math.tan(a);
    if (name === 'sqrt') return Math.sqrt(a);
    if (name === 'abs') return Math.abs(a);
    return NaN;
  }
}

export function evaluateMathFunction(
  fnExpression: string,
  x: number,
  params: Record<string, number> = {}
): number {
  if (!fnExpression || !fnExpression.trim()) return NaN;
  try {
    const tokens = tokenize(fnExpression);
    if (tokens.length === 0) return NaN;
    const res = new Parser(tokens, x, params).parse();
    return Number.isFinite(res) || res === Infinity || res === -Infinity ? res : NaN;
  } catch {
    return NaN;
  }
}
