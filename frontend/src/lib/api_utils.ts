import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { useAuthStore } from "@/store/authStore";

export type NavigateFunction = (path: string) => void;

export class ApiUtil {
    private readonly api: AxiosInstance;
    private readonly navigate: NavigateFunction;

    constructor(navigate: NavigateFunction, baseURL?: string) {
        const api_endpoint =
            baseURL ||
            (import.meta.env.VITE_ENV_NAME === "dev" ? "http://localhost:8080/api/v1" : "https://walletapp.top/api/v1");

        this.navigate = navigate;

        this.api = axios.create({
            baseURL: api_endpoint,
            timeout: 10000,
            headers: {
                "Content-Type": "application/json",
            },
        });

        this.api.interceptors.response.use(
            (response) => response,
            async (error) => {
                if (error.response?.status === 401) {
                    useAuthStore.getState().clearAuth();
                    this.navigate("/login");
                }
                return Promise.reject(error);
            }
        );
    }

    private getConfig(): AxiosRequestConfig {
        const { token } = useAuthStore.getState();

        return {
            headers: {
                ...(token && { Authorization: `Bearer ${token}` }),
            },
        };
    }

    async get<T>(path: string = ""): Promise<T> {
        const response = await this.api.get<T>(path, this.getConfig());
        return response.data;
    }

    async put<T>(path: string = "", data?: unknown): Promise<T> {
        const response = await this.api.put<T>(path, data, this.getConfig());
        return response.data;
    }

    async patch<T>(path: string = "", data?: unknown): Promise<T> {
        const response = await this.api.patch<T>(path, data, this.getConfig());
        return response.data;
    }

    async post<T>(path: string = "", data?: unknown): Promise<T> {
        const response = await this.api.post<T>(path, data, this.getConfig());
        return response.data;
    }

    async delete<T>(path: string): Promise<T> {
        const response = await this.api.delete<T>(path, this.getConfig());
        return response.data;
    }

    async login<T>(path: string = "", token: string, data?: unknown): Promise<T> {
        const response = await this.api.post<T>(path, data, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        return response.data;
    }
}

export const instantiateAPI = (navigate: NavigateFunction, baseURL?: string) => new ApiUtil(navigate, baseURL);
