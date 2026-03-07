import { useState, useEffect } from 'react';
import api from '@/services/api';
import type { AboutInfo } from '@/services/api/types';

export const useAbout = () => {
    const [data, setData] = useState<AboutInfo | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAboutData = async () => {
            try {
                setIsLoading(true);
                const response = await api.about.getAboutInfo();
                setData(response);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setIsLoading(false);
            }
        };

        fetchAboutData();
    }, []);

    return { data, isLoading, error };
};
