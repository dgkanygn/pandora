import { apiRequest } from './client';
import type { AboutInfo } from './types';

export const aboutApi = {
    // Get about page info
    getAboutInfo: () => apiRequest<AboutInfo>('/about'),
};
