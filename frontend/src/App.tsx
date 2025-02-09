import LoginPage from "./pages/LoginPage";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "CLIENT_ID_NOT_FOUND";

function App() {
    return (
        <>
            <GoogleOAuthProvider clientId={CLIENT_ID}>
                <BrowserRouter>
                    <Routes>
                        <Route
                            path='/'
                            element={<LoginPage />}
                        />
                        <Route
                            path='/dashboard'
                            element={<DashboardPage />}
                        />
                    </Routes>
                </BrowserRouter>
            </GoogleOAuthProvider>
        </>
    );
}

export default App;
