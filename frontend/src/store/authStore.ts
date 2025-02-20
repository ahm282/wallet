import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface AuthState {
    token: string | null;
    user: any;
    userId: string | null;
    isLogged: boolean;
    setAuth: (token: string, user: any, userId: string | null) => void;
    clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            user: null,
            userId: null,
            isLogged: false,
            setAuth: (token, user, userId) => set({ token, user, userId, isLogged: true }),
            clearAuth: () => set({ token: null, user: null, userId: null, isLogged: false }),
        }),
        { name: "auth-storage", storage: createJSONStorage(() => sessionStorage) }
    )
);

export default useAuthStore;
