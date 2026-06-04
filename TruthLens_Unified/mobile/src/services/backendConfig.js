import Constants from 'expo-constants';

const FALLBACK_BACKEND_HOST = '10.62.93.14';
const BACKEND_PORT = '5000';

const sanitizeHost = (value) => {
  if (!value || typeof value !== 'string') return null;
  return value.trim().replace(/^https?:\/\//, '').split(':')[0] || null;
};

const getExpoHost = () => {
  const hostUri =
    Constants.expoConfig?.hostUri ||
    Constants.manifest2?.extra?.expoClient?.hostUri ||
    Constants.manifest?.debuggerHost;

  return sanitizeHost(hostUri);
};

const resolvedHost =
  sanitizeHost(process.env.EXPO_PUBLIC_BACKEND_HOST) ||
  getExpoHost() ||
  FALLBACK_BACKEND_HOST;

export const BACKEND_URL = `http://${resolvedHost}:${BACKEND_PORT}`;
