const API_BASE_URL = import.meta.env.VITE_API_URL;

// Handle 401 Unauthorized - clear token and redirect to login
function handle401(): void {
    localStorage.removeItem('token');
    // Avoid redirect loop if already on login page
    if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
    }
}

// Generic fetch wrapper with error handling
export async function apiRequest<T>(
    endpoint: string,
    options?: RequestInit
): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
    });

    if (!response.ok) {
        if (response.status === 401) {
            handle401();
        }
        const error = await response.json().catch(() => ({ error: 'An error occurred' }));
        throw new Error(error.error || 'An error occurred');
    }

    return response.json();
}

