import { BaseError } from './base-error';
import type { ErrorPayloadType } from '../types';

class UploadStalled extends BaseError {
  constructor(message = 'connection stalled', payload: ErrorPayloadType = {}) {
    super(message, 'UPLOAD_STALLED', payload);
  }
}

export { UploadStalled };
