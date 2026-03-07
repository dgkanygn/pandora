import { apiRequest } from './client';
import type { ContactInfo } from './types';

export const contactApi = {
    getContactInfo: () => apiRequest<ContactInfo>('/contact-info'),
};
