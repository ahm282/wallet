import { GoogleOAuthProvider } from "@react-oauth/google";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PublicRoute, ProtectedRoute } from "@/components/RouteGuards";
import { ThemeProvider } from "./components/ThemeProvider";
import Layout from "@/components/MainLayout";
import LoginPage from "@/pages/Login/LoginPage";
import DashboardPage from "@/pages/Dashboard/DashboardPage";
import ProfilePage from "@/pages/Profile/ProfilePage";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "CLIENT_ID_NOT_FOUND";

function App() {
    return (
        <GoogleOAuthProvider clientId={CLIENT_ID}>
            <ThemeProvider
                defaultTheme='dark'
                storageKey='vite-ui-theme'>
                <BrowserRouter>
                    <Routes>
                        {/* Public route for Login */}
                        <Route
                            path='/'
                            element={
                                <PublicRoute>
                                    <LoginPage />
                                </PublicRoute>
                            }
                        />
                        {/* Protected layout for nested routes */}
                        <Route
                            path='/'
                            element={<Layout />}>
                            <Route
                                path='dashboard'
                                element={
                                    <ProtectedRoute>
                                        <DashboardPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path='profile'
                                element={
                                    <ProtectedRoute>
                                        <ProfilePage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path='budget'
                                element={
                                    <ProtectedRoute>
                                        <DashboardPage />
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path='/goals'
                                element={
                                    <ProtectedRoute>
                                        <DashboardPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path='/transactions'
                                element={
                                    <ProtectedRoute>
                                        <DashboardPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path='/accounts'
                                element={
                                    <ProtectedRoute>
                                        <DashboardPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path='/bills'
                                element={
                                    <ProtectedRoute>
                                        <DashboardPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path='/reports'
                                element={
                                    <ProtectedRoute>
                                        <DashboardPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path='/insights'
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
    );
}

export default App;
