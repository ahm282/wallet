import { create } from "zustand";

export interface AuthState {
    token: string | null;
    user: any;
    setAuth: (token: string, user: any) => void;
    clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
    token: null,
    user: null,
    setAuth: (token: string, user: any) => set({ token, user }),
    clearAuth: () => set({ token: null, user: null }),
}));

export default useAuthStore;
