// API Configuration
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
  ? process.env.NEXT_PUBLIC_API_URL.replace('/api', '')
  : "http://localhost:5000";

// Helper to get full avatar URL
export const getAvatarUrl = (avatar: string | null | undefined): string => {
  if (!avatar) return "/default-avatar.png";
  if (avatar.startsWith('http')) return avatar;
  if (avatar.startsWith('/uploads')) return `${API_BASE_URL}${avatar}`;
  if (avatar.startsWith('/')) return avatar;
  return `${API_BASE_URL}${avatar}`;
};

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

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  token?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    avatar?: string | null;
  };
  errors?: Array<{ msg: string; param: string }>;
}

// Generic API function
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Request failed",
        errors: data.errors,
      };
    }

    return data;
  } catch (error: any) {
    console.error("API call error:", error);
    return {
      success: false,
      message: error.message || "Network error. Please try again.",
    };
  }
}

// Auth APIs
// Auth APIs
export const authAPI = {
  register: (data: RegisterData) =>
    apiCall("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  login: (data: LoginData) =>
    apiCall("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // 🔥 Add this part
  getMe: (token: string) =>
    apiCall("/auth/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};

// Profile APIs
export const profileAPI = {
  uploadAvatar: async (file: File, token: string): Promise<ApiResponse> => {
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const response = await fetch(`${API_URL}/profile/avatar`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Upload failed",
        };
      }

      return data;
    } catch (error: any) {
      console.error("Avatar upload error:", error);
      return {
        success: false,
        message: error.message || "Network error. Please try again.",
      };
    }
  },
};

// ...existing code...
export const tokenManager = {
  set(token: string) {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
      // notify same-tab listeners
      window.dispatchEvent(new CustomEvent("auth", { detail: { token } }));
    }
  },
  get(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  },
  remove() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      window.dispatchEvent(new CustomEvent("auth", { detail: { token: null } }));
    }
  },
};
// ...existing code...