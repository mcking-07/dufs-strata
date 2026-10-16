type ErrorCodeType = 'REQUEST_FAILED' | 'NETWORK_FAILED' | 'UPLOAD_CANCELLED' | 'UPLOAD_STALLED' | 'COPY_FAILED' | 'INVALID_CONFIG' | 'READ_ONLY_CREDENTIALS';

type ErrorPayloadType = Record<string, unknown>;

export type { ErrorCodeType, ErrorPayloadType };
