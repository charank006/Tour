import axios, { AxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export interface CreateTripPayload {
  destination: string;
  startLocation?: string;
  startDate?: string;
  endDate?: string;
  travelers?: number | string;
  mood?: string;
  pace?: string;
  budget?: number | string;
}

export interface ActivityItem {
  time: string;
  title: string;
  description: string;
  duration?: string;
  cost?: number;
  type?: string;
}

export interface DayPlan {
  day: number;
  theme?: string;
  date?: string;
  activities: ActivityItem[];
  optionalActivities?: ActivityItem[];
}

export interface TransportOption {
  type: string;
  operator: string;
  duration: string;
  departure: string;
  cost: number;
  badge?: 'cheapest' | 'fastest' | 'recommended';
}

export interface StayOption {
  type: string;
  name: string;
  rating: number;
  amenities: string[];
  pricePerNight: number;
  image: string;
  area?: string;
}

export interface BudgetBreakdown {
  total: number;
  travel: number;
  stay: number;
  food: number;
  activities: number;
  misc: number;
  perPerson?: number;
}

export interface ServerTripPlan {
  planSummary: string;
  whyThisDestination?: string;
  budgetReasoning?: string;
  stayReasoning?: string;
  weather?: {
    temp: number;
    feelsLike?: number;
    humidity?: number;
    description: string;
    rain?: boolean;
    meta?: { source: string; degraded: boolean };
  };
  route?: {
    start: string;
    end: string;
    distanceKm: number;
    duration: string;
    meta?: { source: string; degraded: boolean };
  };
  estimatedCost?: BudgetBreakdown & {
    transport?: number;
    stay?: number;
    accommodation?: number;
    food?: number;
    activities?: number;
    buffer?: number;
    misc?: number;
    total: number;
  };
  stay?: {
    type: string;
    area: string;
    estimatedCostPerNight: number;
    nights: number;
  };
  transportOptions?: TransportOption[];
  places?: Array<{
    name: string;
    category?: string;
    rating?: number;
    cost?: number;
    score?: number;
    matchPercent?: number;
    reasons?: string[];
  }>;
  dayPlans: DayPlan[];
  meta?: {
    recommenderProvider?: string;
    fallbackApplied?: boolean;
    degraded?: boolean;
    source?: string;
  };
}

export interface ServerTripResponse {
  _id: string;
  id?: string;
  shareId?: string;
  destination: string;
  startLocation: string;
  startDate: string;
  endDate: string;
  durationDays?: number;
  travelers: number | string;
  mood: string;
  pace: string;
  budget: number;
  plan: ServerTripPlan;
  createdAt?: string;
}

export interface ReviewPayload {
  placeId?: string;
  destination?: string;
  author: string;
  rating?: number;
  worthIt?: boolean;
  actualCost?: number;
  timeSpent?: string;
  crowdLevel?: string;
  comment: string;
}

export interface ServerReview {
  _id: string;
  id?: string;
  placeId?: string;
  destination?: string;
  author: string;
  rating: number;
  worthIt: boolean;
  actualCost: number;
  timeSpent: string;
  crowdLevel: string;
  comment: string;
  createdAt: string;
}

// Axios instance with 8s default timeout
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor: inject auth token if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
});

export const tripApi = {
  createTrip: async (payload: CreateTripPayload, config?: AxiosRequestConfig): Promise<ServerTripResponse> => {
    const response = await apiClient.post<ServerTripResponse>('/trip/create', payload, config);
    return response.data;
  },

  saveTrip: async (tripData: Partial<ServerTripResponse>): Promise<{ success: boolean; trip: ServerTripResponse }> => {
    const response = await apiClient.post<{ success: boolean; trip: ServerTripResponse }>('/trip/save', tripData);
    return response.data;
  },

  getMyTrips: async (): Promise<ServerTripResponse[]> => {
    const response = await apiClient.get<ServerTripResponse[]>('/trip/my-trips');
    return response.data;
  },

  getTripById: async (id: string): Promise<ServerTripResponse> => {
    const response = await apiClient.get<ServerTripResponse>(`/trip/${id}`);
    return response.data;
  },

  deleteTrip: async (id: string): Promise<{ success: boolean }> => {
    const response = await apiClient.delete<{ success: boolean }>(`/trip/${id}`);
    return response.data;
  },

  checkWeather: async (city: string) => {
    const response = await apiClient.get(`/weather/current?city=${encodeURIComponent(city)}`);
    return response.data;
  },

  searchPlaces: async (city: string, mood?: string) => {
    const response = await apiClient.get(`/places/search?city=${encodeURIComponent(city)}&mood=${encodeURIComponent(mood || '')}`);
    return response.data;
  }
};

export const reviewsApi = {
  getReviews: async (params?: { destination?: string; placeId?: string }): Promise<ServerReview[]> => {
    const response = await apiClient.get<ServerReview[]>('/reviews', { params });
    return response.data;
  },

  createReview: async (review: ReviewPayload): Promise<{ success: boolean; review: ServerReview }> => {
    const response = await apiClient.post<{ success: boolean; review: ServerReview }>('/reviews', review);
    return response.data;
  }
};

export const healthApi = {
  check: async () => {
    const response = await apiClient.get('/health');
    return response.data;
  }
};

export default apiClient;
