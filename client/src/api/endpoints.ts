const API_BASE = 'http://127.0.0.1:8000/api/';

export const api = {
    auth: {
        register: API_BASE + 'auth/register',
        logIn: API_BASE + 'auth/login',
        refresh: API_BASE + 'auth/refresh',
    },
};
