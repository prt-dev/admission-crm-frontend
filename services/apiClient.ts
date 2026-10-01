import { APP_CONFIG } from "@/config/appConfig";
import { ApiResponse, HttpMethod, RequestOptions } from "@/types/api";

export type { ApiResponse, HttpMethod, RequestOptions };

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = APP_CONFIG.backendApiUrl) {
    this.baseUrl = baseUrl.replace(/\/+$/, "");
  }

  private getDefaultHeaders(): Record<string, string> {
    return {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
  }

  /**
   * Unified request dispatcher eliminating duplicate fetch logic.
   * Uses method as argument and automatically supports HttpOnly cookie sessions.
   */
  public async request<T = any>(
    method: HttpMethod,
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const { params, data, headers } = options;
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
      method,
      headers: {
        ...this.getDefaultHeaders(),
        ...headers,
      },
      credentials: "include",
      body:
        data !== undefined
          ? data instanceof FormData
            ? data
            : JSON.stringify(data)
          : undefined,
    });

    return this.handleResponse<T>(res);
  }

  public async get<T = any>(
    endpoint: string,
    params?: Record<string, string | number | boolean | undefined | null>
  ): Promise<ApiResponse<T>> {
    return this.request<T>("GET", endpoint, { params });
  }

  public async post<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>("POST", endpoint, { data });
  }

  public async put<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>("PUT", endpoint, { data });
  }

  public async patch<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>("PATCH", endpoint, { data });
  }

  public async delete<T = any>(
    endpoint: string,
    params?: Record<string, string | number | boolean | undefined | null>
  ): Promise<ApiResponse<T>> {
    return this.request<T>("DELETE", endpoint, { params });
  }

  private async handleResponse<T>(res: Response): Promise<ApiResponse<T>> {
    let responseData: any;
    try {
      responseData = await res.json();
    } catch {
      responseData = null;
    }

    if (!res.ok) {
      const errorMsg =
        responseData?.message || `Request failed with status ${res.status}`;
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
