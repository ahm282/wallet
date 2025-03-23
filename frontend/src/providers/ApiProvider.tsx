import React, { createContext, useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import { ApiUtil, instantiateAPI } from "@/lib/api_utils";
import { registerContextApi } from "@/lib/api_adapter";

const ApiContext = createContext<ApiUtil | undefined>(undefined);

export function ApiProvider({ baseURL, children }: { baseURL?: string; children: React.ReactNode }) {
    const navigate = useNavigate();
    const api = instantiateAPI(navigate, baseURL);

    // Register the API instance so it can be accessed outside of React components
    useEffect(() => {
        registerContextApi(api);
        return () => {
            // Cleanup function
            registerContextApi(null as unknown as ApiUtil);
        };
    }, [api]);
    return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>;
}

export function useApi(): ApiUtil {
    const context = useContext(ApiContext);
    if (!context) {
        throw new Error("useApi must be used within an ApiProvider!");
    }
    return context;
}
