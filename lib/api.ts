// API Configuration
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Types
export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ContactData {
  name: string;
  email: string;
  message: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  token?: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  errors?: Array<{ msg: string; param: string }>;
}

// Helper function to handle API calls
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'An error occurred',
        errors: data.errors,
      };
    }

    return data;
  } catch (error: any) {
    console.error('API call error:', error);
    return {
      success: false,
      message: error.message || 'Network error. Please try again.',
    };
  }
}

// Auth API functions
export const authAPI = {
  register: async (data: RegisterData): Promise<ApiResponse> => {
    return apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  login: async (data: LoginData): Promise<ApiResponse> => {
    return apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getMe: async (token: string): Promise<ApiResponse> => {
    return apiCall('/auth/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

// Contact API functions
export const contactAPI = {
  submit: async (data: ContactData): Promise<ApiResponse> => {
    return apiCall('/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// Token management
export const tokenManager = {
  set: (token: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  },

  get: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  },

  remove: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  },
};






