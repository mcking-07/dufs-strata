import { BaseError } from './base-error';
import type { ErrorPayloadType } from '../types';

class UploadCancelled extends BaseError {
  constructor(message = 'cancelled', payload: ErrorPayloadType = {}) {
    super(message, 'UPLOAD_CANCELLED', payload);
  }
}

export { UploadCancelled };
