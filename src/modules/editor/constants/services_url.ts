import { getEnvConfig } from '../../../config/client/env';

const config = getEnvConfig();

export const WEBSOCKET_BASE_URL = config.WEBSOCKET_BASE_URL;
export const API_BASE_URL = config.API_BASE_URL;
