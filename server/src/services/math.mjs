import Big from 'big.js';

import logger from '../logger.mjs';

class MathOp {
  constructor(x) {
    this.value = !isNaN(+x) ? x : 0;
  }

  abs() {
    try {
      return Big(this.value).abs();
    } catch (err) {
      logger.error(err);
      return this.value < 0 ? this.value * -1 : this.value;
    }
  }

  add(x) {
    try {
      this.value = Big(this.value).plus(x);
    } catch (err) {
      logger.error(err);
    }
    return this;
  }

  sub(x) {
    try {
      this.value = Big(this.value).minus(x);
    } catch (err) {
      logger.error(err);
    }
    return this;
  }

  mul(x) {
    try {
      this.value = Big(this.value).times(x);
    } catch (err) {
      logger.error(err);
    }
    return this;
  }

  div(x) {
    try {
      this.value = Big(this.value).div(x);
    } catch (err) {
      logger.error(err);
    }
    return this;
  }

  sum(...args) {
    try {
      this.value = args.reduce((sum, current) => Big(sum).plus(current), 0);
    } catch (err) {
      logger.error(err);
    }
    return this;
  }

  mod(modDigit) {
    try {
      this.value = Big(this.value).mod(modDigit);
    } catch (err) {
      logger.error(err);
    }
    return this;
  }

  round(decimalPlaces, roundingMode) {
    try {
      this.value = Big(this.value).round(decimalPlaces, roundingMode);
    } catch (err) {
      logger.error(err);
    }
    return this;
  }

  eq(x) {
    try {
      return Big(this.value).eq(x);
    } catch (err) {
      logger.error(err);
      return this.value === x;
    }
  }

  gt(x) {
    try {
      return Big(this.value).gt(x);
    } catch (err) {
      logger.error(err);
      return this.value > x;
    }
  }

  gte(x) {
    try {
      return Big(this.value).gte(x);
    } catch (err) {
      logger.error(err);
      return this.value >= x;
    }
  }

  lt(x) {
    try {
      return Big(this.value).lt(x);
    } catch (err) {
      logger.error(err);
      return this.value < x;
    }
  }

  lte(x) {
    try {
      return Big(this.value).lte(x);
    } catch (err) {
      logger.error(err);
      return this.value <= x;
    }
  }

  toNumber() {
    try {
      return Big(this.value).toNumber();
    } catch (err) {
      logger.error(err);
    }
  }

  toString() {
    try {
      return Big(this.value).toString();
    } catch (err) {
      logger.error(err);
    }
  }

  toFixed(toFixedDigit) {
    try {
      return Big(this.value).toFixed(toFixedDigit);
    } catch (err) {
      logger.error(err);
      return this.value;
    }
  }
}

export default MathOp;
