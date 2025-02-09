import LoginPage from "@/pages/Login/LoginPage";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardPage from "@/pages/Dashboard/DashboardPage";
import { PublicRoute, ProtectedRoute } from "@/components/RouteGuards";
import MainLayout from "@/components/MainLayout";
import { ThemeProvider } from "./components/ThemeProvider";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "CLIENT_ID_NOT_FOUND";

function App() {
    return (
        <>
            <GoogleOAuthProvider clientId={CLIENT_ID}>
                <ThemeProvider
                    defaultTheme='dark'
                    storageKey='vite-ui-theme'>
                    <BrowserRouter>
                        <Routes>
                            <Route
                                path='/'
                                element={
                                    <PublicRoute>
                                        <LoginPage />
                                    </PublicRoute>
                                }
                            />
                            <Route
                                path='/'
                                element={<MainLayout />}>
                                <Route
                                    path='/dashboard'
                                    element={
                                        <ProtectedRoute>
                                            <DashboardPage />
                                        </ProtectedRoute>
                                    }
                                />
                            </Route>
                        </Routes>
                    </BrowserRouter>
                </ThemeProvider>
            </GoogleOAuthProvider>
        </>
    );
}

export default App;
