import { UserResponse } from "@/types/user.types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface AuthState {
    token: string | undefined;
    user: UserResponse | undefined;
    isLogged: boolean;
    setAuth: (token: string, user: UserResponse) => void;
    clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: undefined,
            user: undefined,
            isLogged: false,
            setAuth: (token, user) => set({ token, user, isLogged: true }),
            clearAuth: () => set({ token: undefined, user: undefined, isLogged: false }),
        }),
        { name: "auth-storage", storage: createJSONStorage(() => sessionStorage) }
    )
);

export default useAuthStore;
