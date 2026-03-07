const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Get token from localStorage
export const getToken = (): string | null => {
    return localStorage.getItem('admin_token');
};

// Handle 401 Unauthorized - clear token and redirect to login
function handle401(): void {
    localStorage.removeItem('admin_token');
    // Avoid redirect loop if already on login page
    if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
    }
}

// API request helper
export async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const token = getToken();

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    const data = await response.json();

    if (!response.ok) {
        if (response.status === 401) {
            handle401();
        }
        throw new Error(data.error || 'Request failed');
    }

    return data;
}

// FormData API request helper (for file uploads)
// Note: PHP doesn't populate $_POST and $_FILES for PUT/PATCH requests
// So we use POST with _method field for method override
export async function apiFormDataRequest<T>(
    endpoint: string,
    formData: FormData,
    method: 'POST' | 'PUT' = 'POST'
): Promise<T> {
    const token = getToken();

    // For PUT requests, use POST with _method override (PHP limitation)
    if (method === 'PUT') {
        formData.append('_method', 'PUT');
    }

    const headers: HeadersInit = {
        ...(token && { Authorization: `Bearer ${token}` }),
        // Note: Don't set Content-Type for FormData, browser sets it with boundary
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST', // Always use POST for FormData due to PHP limitation
        headers,
        body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
        if (response.status === 401) {
            handle401();
        }
        throw new Error(data.error || 'Request failed');
    }

    return data;
}
