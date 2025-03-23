import { ApiUtil } from "@/lib/api_utils";

// This will hold the current API instance from the context
let currentApiInstance: ApiUtil | null = null;

// This is called by the ApiProvider to register the current context API
export function registerContextApi(apiInstance: ApiUtil): void {
    currentApiInstance = apiInstance;
}

// This is used by the standalone functions to get the API instance
export function getContextApi(): ApiUtil {
    if (!currentApiInstance) {
        throw new Error("API instance not available. Make sure your component is wrapped in an ApiProvider.");
    }
    return currentApiInstance;
}
