import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { GiWallet } from "react-icons/gi";
import { useAuthStore } from "@/store/authStore";
import { jwtDecode } from "jwt-decode";
import { ApiUtil } from "@/lib/api_utils";
import { ScaleLoader } from "react-spinners";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn } from "lucide-react";
import { ModeSwitch } from "@/components/ModeSwitch";
import { BackgroundPaths } from "@/components/BackgroundPaths";
import { GoogleUser, UserResponse } from "@/types/user.types";

/**
 * Decodes the Google JWT and returns a typed GoogleUser.
 */
const decodeGoogleUser = (token: string): GoogleUser => {
    return jwtDecode<GoogleUser>(token);
};

/**
 * Creates the payload that your backend API expects.
 */
const createUserPayload = (googleUser: GoogleUser) => {
    return {
        firstName: googleUser.given_name,
        lastName: googleUser.family_name,
        email: googleUser.email,
        imageUrl: googleUser.picture,
    };
};

/**
 * Posts the user payload to the backend and returns the response.
 */
const postUserData = async (payload: object, token: string): Promise<UserResponse> => {
    console.log("payload", payload);
    console.log("token", token);
    const api = import.meta.env.VITE_ENV_NAME === "dev" ? new ApiUtil("http://localhost:8080/api") : new ApiUtil();
    const user = api.post<UserResponse>("/user", payload, token);
    console.log("user", user);
    return user;
};

const LoginPage: React.FC = () => {
    const [error, setError] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.setAuth);

    /**
     * Sets the page title to "Login | Wallet" on component mount.
     */
    useEffect(() => {
        document.title = "Login | Wallet";
    }, []);

    /**
     * Handles the Google login success event:
     * - Decodes the token,
     * - Prepares the payload,
     * - Sends the payload to the backend,
     * - Updates the auth store,
     * - And navigates to the dashboard.
     */
    const handleGoogleSuccess = async (credentialResponse: any): Promise<void> => {
        setIsLoading(true);
        setError("");

        try {
            // Extract and decode the Google token
            const token: string = credentialResponse.credential;
            const googleUser = decodeGoogleUser(token);

            // Prepare the payload for the backend
            const userPayload = createUserPayload(googleUser);

            // Send the payload to the backend
            const userServiceResponse: UserResponse = await postUserData(userPayload, token);

            // Update the auth store with the token and the backend's response data
            setAuth(token, googleUser, userServiceResponse.id);

            // Navigate to the dashboard upon successful login
            navigate("/dashboard");
        } catch (err) {
            console.error("Login error:", err);
            setError("Login failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleError = (): void => {
        setError("Google login failed. Please try again.");
        setIsLoading(false);
    };

    return (
        <div className='min-h-dvh flex flex-col items-center justify-center bg-gray-200 dark:bg-dark'>
            <Card className='w-11/12 md:w-6/12 lg:w-4/12 xl:w-3/12 px-8 py-10 flex flex-col justify-center items-center rounded-xl shadow-lg bg-gray-100 dark:bg-darkElement z-50'>
                <CardTitle className='flex flex-row items-center justify-center font-secondary font-light text-5xl uppercase text-blue-900 dark:text-gray-100'>
                    <GiWallet className='size-12 inline mb-3 -ms-4 me-4' />
                    Wallet
                </CardTitle>
                <CardHeader className='pt-6 pb-4 px-3 font-primary font-bold text-lg text-blue-900 dark:text-gray-100'>
                    Your personal finance assistant
                </CardHeader>
                <CardContent className='w-full min-h-28 flex flex-col items-center justify-center'>
                    {error && <div className='w-full mb-4 p-3 bg-red-100 text-red-700 rounded-md'>{error}</div>}
                    {isLoading ? (
                        <ScaleLoader color={"#1e3a8a"} />
                    ) : (
                        <div className='pt-4 w-full flex flex-col justify-center md:items-center'>
                            <p className='flex items-center justify-center gap-x-1 pb-4 font-primary text-sm font-medium leading-none text-accent-foreground dark:text-muted-foreground'>
                                <LogIn className='size-4 me-1' />
                                Login with Google to continue
                            </p>
                            <div className='flex items-center justify-center my-2'>
                                <GoogleLogin
                                    onSuccess={handleGoogleSuccess}
                                    onError={handleGoogleError}
                                />
                            </div>
                        </div>
                    )}

                    {/* <div className='w-full flex justify-center items-center mt-4'>
                        <div className='h-0 w-5/12 border border-slate-300' />
                        <span className='mx-2 text-sm text-slate-500'>or</span>
                        <div className='h-0 w-5/12 border border-slate-300' />
                    </div>

                    <div className='flex flex-col mt-4 mb-8 gap-y-4'>
                        <h2 className='font-light text-3xl'>Login</h2>
                        <h2 className='text-sm text-slate-600'>Enter your credentials to continue</h2>
                    </div> */}
                </CardContent>
            </Card>
            <BackgroundPaths />
            <div className='absolute bottom-4 right-4'>
                <ModeSwitch />
            </div>
        </div>
    );
};

export default LoginPage;
