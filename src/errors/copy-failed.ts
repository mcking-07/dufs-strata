import { BaseError } from './base-error';
import type { ErrorPayloadType } from '../types';

class CopyFailed extends BaseError {
  constructor(message = 'copy failed', payload: ErrorPayloadType = {}) {
    super(message, 'COPY_FAILED', payload);
  }
}

export { CopyFailed };
