import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

export class ApiUtil {
  private readonly api: AxiosInstance;

  constructor(baseURL: string = "https://api.walletapp.top/api") {
    this.api = axios.create({
      baseURL,
      timeout: 5000,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  private getConfig(token?: string): AxiosRequestConfig {
    return {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    };
  }

  async get<T>(path: string = "", token?: string): Promise<T> {
    const response = await this.api.get<T>(path, this.getConfig(token));
    return response.data;
  }

  async put<T>(path: string = "", data?: unknown, token?: string): Promise<T> {
    const response = await this.api.put<T>(path, data, this.getConfig(token));
    return response.data;
  }

  async post<T>(path: string = "", data?: unknown, token?: string): Promise<T> {
    const response = await this.api.post<T>(path, data, this.getConfig(token));
    return response.data;
  }

  async delete<T>(path: string, token?: string): Promise<T> {
    const response = await this.api.delete<T>(path, this.getConfig(token));
    return response.data;
  }
}
