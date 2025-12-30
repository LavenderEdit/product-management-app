import { CONFIG } from '../config.js';
import { UI } from '../components/ui.js';

export const API = {
    async request(endpoint, method = 'GET', body = null) {
        try {
            const headers = {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true',
                'User-Agent': 'KardexApp/1.0'
            };
            const config = { method, headers };

            if (body) config.body = JSON.stringify(body);

            const response = await fetch(`${CONFIG.API_BASE_URL}${endpoint}`, config);

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `Error ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            UI.showToast(error.message, 'error');
            return null;
        }
    },

    get(endpoint) { return this.request(endpoint, 'GET'); },
    post(endpoint, data) { return this.request(endpoint, 'POST', data); },
    put(endpoint) { return this.request(endpoint, 'PUT'); }
};