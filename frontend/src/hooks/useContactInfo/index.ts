import { useState, useEffect } from 'react';
import type { ContactInfo } from '../../services/api';
import api from '../../services/api';

export const useContactInfo = () => {
    const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchContactInfo = async () => {
            try {
                setLoading(true);
                const response = await api.contactInfo.getContactInfo();
                setContactInfo(response);
                setError(null);
            } catch (err) {
                console.error('Error fetching contact info:', err);
                setError('İletişim bilgileri alınamadı.');
            } finally {
                setLoading(false);
            }
        };

        fetchContactInfo();
    }, []);

    return { contactInfo, loading, error };
};
