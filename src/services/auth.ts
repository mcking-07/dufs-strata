const CREDENTIALS_KEY = 'strata-auth';

const get_credentials = () => sessionStorage.getItem(CREDENTIALS_KEY);

const set_credentials = (credentials: string) => sessionStorage.setItem(CREDENTIALS_KEY, credentials);

const clear_credentials = () => sessionStorage.removeItem(CREDENTIALS_KEY);

const encode_credentials = (user: string, pass: string) => btoa(String.fromCharCode(...new TextEncoder().encode(`${user}:${pass}`)));

const auth_headers = (credentials = get_credentials()): Record<string, string> => (credentials ? { Authorization: `Basic ${credentials}` } : {});

const auth_fetch = (url: string, init: RequestInit = {}, credentials = get_credentials()) =>
  fetch(url, { ...init, headers: { ...(init.headers as Record<string, string>), ...auth_headers(credentials) } });

export { auth_fetch, auth_headers, clear_credentials, encode_credentials, get_credentials, set_credentials };
