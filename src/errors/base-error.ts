import type { ErrorCodeType, ErrorPayloadType } from '../types';

class BaseError extends Error {
  public readonly code: ErrorCodeType;
  public readonly payload: ErrorPayloadType;
  constructor(message: string, code: ErrorCodeType, payload: ErrorPayloadType = {}) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.payload = payload;
  }
}

export { BaseError };
