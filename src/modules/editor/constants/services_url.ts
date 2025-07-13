import { getEnvConfig } from '../../../config/client/env';
import { ensureUrlEnd } from '../../../utils/shared.helpers';

const config = getEnvConfig();

export const WEBSOCKET_BASE_URL = `${ensureUrlEnd(config.WEBSOCKET_BASE_URL)}document`;
export const API_BASE_URL = ensureUrlEnd(config.API_BASE_URL);
