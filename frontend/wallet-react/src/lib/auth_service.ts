import axios from "axios";

class AuthService {
    private apiEndpoint = "http://localhost:8083/api/auth/google-login";

    private getConfig(token?: string) {
        return {
            headers: {
                "Content-Type": "application/json",
                ...(token && { Authorization: `Bearer ${token}` }),
            },
        };
    }

    async post(data: any, token?: string) {
        try {
            const response = await axios.post(this.apiEndpoint, data, this.getConfig(token));
            return response.data; // JWT token
        } catch (error) {
            console.error("Login Error:", error);
            throw error;
        }
    }
}

export default new AuthService();
