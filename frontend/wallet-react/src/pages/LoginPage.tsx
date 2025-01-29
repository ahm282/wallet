import { AuthForm } from "@/components/AuthForm";
import { GiWallet } from "react-icons/gi";
import { GoogleLogin } from "@react-oauth/google";
import ApiUtil  from "@/lib/api_utils";
import auth_service from "@/lib/auth_service" ;

const LoginPage = () => {
    return (
        <div className='mt-16 lg:mt-36 items-center flex flex-col'>
            <div className='hero flex flex-col justify-center mb-10'>
                <h1 className='font-primary text-5xl font-extralight text-blue-900 uppercase'>
                    <GiWallet className='size-12 inline mb-3 -ms-4 me-4' />
                    Wallet
                </h1>
                <h2 className='font-primary font-medium text-lg text-blue-950'>Your personal finance manager</h2>
            </div>

            {/* <!-- Login form --> */}
            <div className='w-80 flex justify-center flex-col items-center'>
                <div className='w-full flex flex-col items-center rounded-xl shadow-lg bg-gray-100 px-8 py-10'>
                    <GoogleLogin
                        onSuccess={(credentialResponse) => {
        console.log("Google Token:", credentialResponse.credential);
        
        try {
            const data = await auth_service.post({ token: credentialResponse.credential });
            console.log("Backend Response:", data);

            // Store JWT
            localStorage.setItem("authToken", data.jwt);
        } catch (error) {
            console.error("Login failed", error);
        }
    }}
                        onError={() => {
                            console.log("Login Failed");
                        }}
                        useOneTap
                    />
                    <div className='w-full flex justify-center items-center mt-4'>
                        <div className='h-0 w-5/12 border border-slate-300'></div>
                        <span className='mx-2 text-sm text-slate-500'>or</span>
                        <div className='h-0 w-5/12 border border-slate-300'></div>
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

// function  (credentialResponse: string) {
//     console.log(credentialResponse);

//     const api = new ApiUtil("http://localhost:8030/api/auth/google");
//     api.post(credentialResponse);

// 

export default LoginPage;
