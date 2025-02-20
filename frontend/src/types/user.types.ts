// Define Google user data.
export interface GoogleUser {
    email: string;
    given_name: string;
    family_name: string;
    picture: string;
}

// Define user payload.
export interface UserPayload {
    firstName: string;
    lastName: string;
    email: string;
    imageUrl: string;
}

// Define backend's user response.
export interface UserResponse {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    imageUrl: string;
    lastLogin?: string;
}
