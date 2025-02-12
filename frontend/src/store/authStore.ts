import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface AuthState {
  token: string | null;
  user: any;
  isLogged: boolean;
  setAuth: (token: string, user: any) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isLogged: false,
      setAuth: (token: string, user: any) =>
        set({ token, user, isLogged: true }),
      clearAuth: () => set({ token: null, user: null, isLogged: false }),
    }),
    { name: "auth-storage", storage: createJSONStorage(() => sessionStorage) },
  ),
);

export default useAuthStore;
