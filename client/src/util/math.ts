import Big, { BigSource, RoundingMode } from 'big.js';

import { log } from './general';

class MathOp {
  value: BigSource;

  constructor(x: BigSource) {
    this.value = !isNaN(+x) ? x : 0;
  }

  add(x: BigSource): MathOp {
    try {
      this.value = Big(this.value).plus(x);
    } catch (err) {
      log.error(err);
    }
    return this;
  }

  sub(x: BigSource): MathOp {
    try {
      this.value = Big(this.value).minus(x);
    } catch (err) {
      log.error(err);
    }
    return this;
  }

  mul(x: BigSource): MathOp {
    try {
      this.value = Big(this.value).times(x);
    } catch (err) {
      log.error(err);
    }
    return this;
  }

  div(x: BigSource): MathOp {
    try {
      this.value = Big(this.value).div(x);
    } catch (err) {
      log.error(err);
    }
    return this;
  }

  sum(...args: BigSource[]): MathOp {
    try {
      this.value = args.reduce((sum, current) => Big(sum).plus(current), 0);
    } catch (err) {
      log.error(err);
    }
    return this;
  }

  mod(modDigit: number): MathOp {
    try {
      this.value = Big(this.value).mod(modDigit);
    } catch (err) {
      log.error(err);
    }
    return this;
  }

  round(decimalPlaces?: number, roundingMode?: RoundingMode): MathOp {
    try {
      this.value = Big(this.value).round(decimalPlaces, roundingMode);
    } catch (err) {
      log.error(err);
    }
    return this;
  }

  eq(x: BigSource): boolean {
    try {
      return Big(this.value).eq(x);
    } catch (err) {
      log.error(err);
      return this.value === x;
    }
  }

  gt(x: BigSource): boolean {
    try {
      return Big(this.value).gt(x);
    } catch (err) {
      log.error(err);
      return this.value > x;
    }
  }

  gte(x: BigSource): boolean {
    try {
      return Big(this.value).gte(x);
    } catch (err) {
      log.error(err);
      return this.value >= x;
    }
  }

  lt(x: BigSource): boolean {
    try {
      return Big(this.value).lt(x);
    } catch (err) {
      log.error(err);
      return this.value < x;
    }
  }

  lte(x: BigSource): boolean {
    try {
      return Big(this.value).lte(x);
    } catch (err) {
      log.error(err);
      return this.value <= x;
    }
  }

  toNumber(): number {
    try {
      return Big(this.value).toNumber();
    } catch (err) {
      log.error(err);
      return +this.value;
    }
  }

  toString(): string {
    try {
      return Big(this.value).toString();
    } catch (err) {
      log.error(err);
      return '-';
    }
  }

  toFixed(toFixedDigit: number): string {
    try {
      return Big(this.value).toFixed(toFixedDigit);
    } catch (err) {
      log.error(err);
      return this.value.toString();
    }
  }
}

export default MathOp;
