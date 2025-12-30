const env = window.__ENV__ || {};

export const CONFIG = {
    API_BASE_URL: env.API_URL,
    APP_NAME: env.APP_NAME || 'Sistema Kardex TKOH',
    VERSION: '1.2.0'
};