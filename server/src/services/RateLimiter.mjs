// server/services/RateLimiter.mjs
/**
 * Rate limiter with exponential backoff
 */

import logger from '../logger.mjs';

export class RateLimiter {
  constructor(minDelay = 500, maxRetries = 3) {
    this.minDelay = minDelay;
    this.maxRetries = maxRetries;
    this.lastRequestTime = 0;
  }

  async throttle() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;

    if (timeSinceLastRequest < this.minDelay) {
      await this.sleep(this.minDelay - timeSinceLastRequest);
    }

    this.lastRequestTime = Date.now();
  }

  async executeWithRetry(fn, context = '') {
    let lastError;

    for (let attempt = 0; attempt < this.maxRetries; attempt++) {
      try {
        await this.throttle();
        return await fn();
      } catch (error) {
        lastError = error;

        // Check if it's a rate limit error (429)
        if ((error.message && error.message.includes('429')) || error.status === 429) {
          const waitTime =
            attempt === 0 ? 60000 : Math.min(60000 * Math.pow(2, attempt), 300000);
          logger.log(
            `Rate limit hit for ${context}, waiting ${waitTime}ms before retry ${attempt +
              1}/${this.maxRetries}`,
          );
          await this.sleep(waitTime);
        } else {
          // For non-429 errors, use exponential backoff
          await this.sleep(1000 * Math.pow(2, attempt));
        }
      }
    }

    throw lastError;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
