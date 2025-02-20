// Define Google user data.
export interface GoogleUser {
  email: string;
  given_name: string;
  family_name: string;
  picture: string;
}

// Define backend's user response.
export interface UserResponse {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
  createdAt: string;
}
