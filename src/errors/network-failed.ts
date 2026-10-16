import { BaseError } from './base-error';
import type { ErrorPayloadType } from '../types';

class NetworkFailed extends BaseError {
  constructor(message = 'network error', payload: ErrorPayloadType = {}) {
    super(message, 'NETWORK_FAILED', payload);
  }
}

export { NetworkFailed };
