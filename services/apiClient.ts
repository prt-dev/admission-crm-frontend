import { APP_CONFIG } from "@/config/appConfig";

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
  meta?: any;
  errors?: Record<string, string[]>;
}

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = APP_CONFIG.backendApiUrl) {
    this.baseUrl = baseUrl.replace(/\/+$/, "");
  }

  private getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    if (typeof window !== "undefined") {
      const token = localStorage.getItem("nleta_auth_token");
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  public async get<T = any>(endpoint: string, params?: Record<string, string | number | boolean>): Promise<ApiResponse<T>> {
    let url = `${this.baseUrl}/${endpoint.replace(/^\/+/, "")}`;
    if (params) {
      const query = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query.append(key, String(value));
        }
      });
      const queryString = query.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    const res = await fetch(url, {
      method: "GET",
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse<T>(res);
  }

  public async post<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}/${endpoint.replace(/^\/+/, "")}`;
    const res = await fetch(url, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(res);
  }

  public async put<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}/${endpoint.replace(/^\/+/, "")}`;
    const res = await fetch(url, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(res);
  }

  public async delete<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}/${endpoint.replace(/^\/+/, "")}`;
    const res = await fetch(url, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse<T>(res);
  }

  private async handleResponse<T>(res: Response): Promise<ApiResponse<T>> {
    let responseData: any;
    try {
      responseData = await res.json();
    } catch {
      responseData = null;
    }

    if (!res.ok) {
      const errorMsg = responseData?.message || `Request failed with status ${res.status}`;
      return {
        success: false,
        message: errorMsg,
        data: responseData?.data ?? (null as any),
        errors: responseData?.errors,
      };
    }

    return {
      success: true,
      message: responseData?.message,
      data: responseData?.data ?? responseData,
      meta: responseData?.meta,
    };
  }
}

export const apiClient = new ApiClient();
