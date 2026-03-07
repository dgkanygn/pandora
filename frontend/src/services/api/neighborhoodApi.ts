import { apiRequest } from './client';
import type { Neighborhood } from './types';

export const neighborhoodApi = {
    getAll: () => apiRequest<Neighborhood[]>('/neighborhoods'),
};
