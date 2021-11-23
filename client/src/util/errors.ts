import { ERROR_TYPES } from '../constants/errors';

export class RegisterAddressError extends Error {
  errorType: string;
  constructor({ errorType, message }: { errorType: string; message: string }) {
    super();

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RegisterAddressError);
    }

    this.name = 'RegiterAddressError';
    this.errorType = errorType || ERROR_TYPES.default;
    this.message = message;
  }
}
