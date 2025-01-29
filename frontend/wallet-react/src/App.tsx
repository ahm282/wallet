import "./App.css";
import LoginPage from "./pages/LoginPage";
import { GoogleOAuthProvider } from "@react-oauth/google";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "CLIENT_ID_NOT_FOUND";

function App() {
    console.log(CLIENT_ID);

    return (
        <>
            <GoogleOAuthProvider clientId={CLIENT_ID}>
                <LoginPage />
            </GoogleOAuthProvider>
        </>
    );
}

export default App;
