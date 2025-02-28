import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import "@fontsource/poppins/index.css";
import "@fontsource-variable/inter/index.css";
import "@fontsource-variable/raleway/index.css";
import { QueryProvider } from "./providers/QueryProvider.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <QueryProvider>
            <App />
        </QueryProvider>
    </StrictMode>
);
