export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface RequestOptions {
  params?: Record<string, string | number | boolean | undefined | null>;
  data?: any;
  headers?: Record<string, string>;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
  meta?: any;
  errors?: Record<string, string[]>;
}
