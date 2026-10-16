import { BaseError } from './base-error';
import type { ErrorPayloadType } from '../types';

class InvalidConfig extends BaseError {
  constructor(message: string, payload: ErrorPayloadType = {}) {
    super(message, 'INVALID_CONFIG', payload);
  }
}

export { InvalidConfig };
