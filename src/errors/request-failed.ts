import { BaseError } from './base-error';
import type { ErrorPayloadType } from '../types';

class RequestFailed extends BaseError {
  public readonly status: number;
  constructor(message: string, status: number, payload: ErrorPayloadType = {}) {
    super(message, 'REQUEST_FAILED', { ...payload, status });
    this.status = status;
  }
}

export { RequestFailed };
