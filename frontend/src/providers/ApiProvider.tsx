import React, { createContext, useContext } from "react";
import { useNavigate } from "react-router";
import { ApiUtil, instantiateAPI } from "@/lib/api_utils";

const ApiContext = createContext<ApiUtil | undefined>(undefined);

export function ApiProvider({ baseURL, children }: { baseURL?: string; children: React.ReactNode }) {
    const navigate = useNavigate();
    const api = instantiateAPI(navigate, baseURL);
    console.log("an API instance has been created - ApiContext Provider works!");
    return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>;
}

export function useApi(): ApiUtil {
    const context = useContext(ApiContext);
    if (!context) {
        throw new Error("useApi must be used within an ApiProvider!");
    }
    return context;
}
