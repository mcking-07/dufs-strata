import { BaseError } from './base-error';
import type { ErrorPayloadType } from '../types';

class ReadOnlyCredentials extends BaseError {
  constructor(message = "these credentials don't grant write access", payload: ErrorPayloadType = {}) {
    super(message, 'READ_ONLY_CREDENTIALS', payload);
  }
}

export { ReadOnlyCredentials };
