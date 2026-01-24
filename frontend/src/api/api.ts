import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

// Create pure axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add auth token if available (simple implementation)
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['x-auth-token'] = token;
    }
    return config;
});

export const tripApi = {
    // Trip
    createTrip: async (tripData: any) => {
        const response = await api.post('/trip/create', tripData);
        return response.data;
    },
    getMyTrips: async () => {
        const response = await api.get('/trip/my-trips');
        return response.data;
    },
    // Context
    checkWeather: async (city: string) => {
        const response = await api.get(`/weather/current?city=${city}`);
        return response.data;
    },
    searchPlaces: async (city: string, mood?: string) => {
        const response = await api.get(`/places/search?city=${city}&mood=${mood || ''}`);
        return response.data;
    }
};

export const authApi = {
    login: async (credentials: any) => {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    },
    register: async (userData: any) => {
        const response = await api.post('/auth/register', userData);
        return response.data;
    }
};

export default api;
