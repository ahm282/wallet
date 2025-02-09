import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface AuthState {
    token: string | null;
    user: any;
    setAuth: (token: string, user: any) => void;
    clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            user: null,
            setAuth: (token: string, user: any) => set({ token, user }),
            clearAuth: () => set({ token: null, user: null }),
        }),
        { name: "auth-storage", storage: createJSONStorage(() => sessionStorage) }
    )
);

export default useAuthStore;
