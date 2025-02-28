import { googleLogout } from "@react-oauth/google";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";

export const useLogout = () => {
    const logout = useAuthStore((state) => state.clearAuth);
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear zustand auth state
        logout();
        googleLogout();
        navigate("/");
    };

    return { handleLogout };
};

export default useLogout;
