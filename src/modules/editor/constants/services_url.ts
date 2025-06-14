export const WEBSOCKET_BASE_URL = Deno.env.get('WEBSOCKET_BASE_URL') ||
  'ws://localhost:8787/ws/document/';
export const API_BASE_URL = Deno.env.get('API_BASE_URL') ||
  'http://localhost:8787/api';
