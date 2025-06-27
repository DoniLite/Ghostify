import type { EnvConfig } from '../../@types'

export const getEnvConfig = (): EnvConfig => ({
  WEBSOCKET_BASE_URL:
    globalThis.__ENV?.WEBSOCKET_BASE_URL || 'ws://localhost:8787/ws/document/',
  API_BASE_URL: globalThis.__ENV?.API_BASE_URL || 'http://localhost:8787/api'
})
