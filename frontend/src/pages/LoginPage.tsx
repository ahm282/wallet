import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { GiWallet } from "react-icons/gi";
import { useAuthStore } from "@/store/authStore";
import { jwtDecode } from "jwt-decode";
import AuthForm from "@/components/AuthForm";
import { ScaleLoader } from "react-spinners";

const LoginPage: React.FC = () => {
    const [error, setError] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const setAuth = useAuthStore((state) => state.setAuth);

    const handleGoogleSuccess = (credentialResponse: any): void => {
        setIsLoading(true);
        setError("");

        try {
            const token: string = credentialResponse.credential;

            const user = jwtDecode(token);
            setAuth(token, user);

            navigate("/dashboard");
        } catch (err) {
            console.error("Login error:", err);
            setError("Login failed. Please try again.");
            setIsLoading(false);
        }
    };

    const handleGoogleError = (): void => {
        setError("Google login failed. Please try again.");
        setIsLoading(false);
    };

    return (
        <div className='mt-16 lg:mt-36 items-center flex flex-col'>
            <div className='hero flex flex-col justify-center mb-10'>
                <h1 className='font-primary text-5xl font-extralight text-blue-900 uppercase'>
                    <GiWallet className='size-12 inline mb-3 -ms-4 me-4' />
                    Wallet
                </h1>
                <h2 className='font-primary font-medium text-lg text-blue-900'>Your personal finance assistant</h2>
            </div>

            <div className='w-80 flex justify-center flex-col items-center'>
                <div className='w-full flex flex-col items-center rounded-xl shadow-lg bg-gray-100 px-8 py-10'>
                    {error && <div className='w-full mb-4 p-3 bg-red-100 text-red-700 rounded-md'>{error}</div>}

                    {isLoading ? (
                        <ScaleLoader color={"#1e3a8a"} />
                    ) : (
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={handleGoogleError}
                            useOneTap
                        />
                    )}

                    <div className='w-full flex justify-center items-center mt-4'>
                        <div className='h-0 w-5/12 border border-slate-300' />
                        <span className='mx-2 text-sm text-slate-500'>or</span>
                        <div className='h-0 w-5/12 border border-slate-300' />
                    </div>

                    <div className='flex flex-col mt-4 mb-8 gap-y-4'>
                        <h2 className='font-light text-3xl'>Login</h2>
                        <h2 className='text-sm text-slate-600'>Enter your credentials to continue</h2>
                    </div>

                    <AuthForm />
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
