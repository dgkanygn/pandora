import { apiRequest } from './client';
import type { HomepageSlide } from './types';

export const homepageApi = {
    getSlides: () => apiRequest<{ slides: HomepageSlide[] }>('/homepage-slides'),
};
