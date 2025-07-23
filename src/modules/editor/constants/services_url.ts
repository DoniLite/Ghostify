import { ensureUrlEnd } from '@/utils/shared.helpers';

export const WEBSOCKET_BASE_URL = `${ensureUrlEnd(process.env.WEBSOCKET_BASE_URL ?? '')}document`;
export const API_BASE_URL = ensureUrlEnd(process.env.API_BASE_URL ?? '');
