export type LoginFormInputs = {
  email: string;
  password: string;
};

// Enum for user roles
export type UserRole = "SUPER_ADMIN" | "ADMIN" | "USER";

// Enum for feelings
// export type Feeling =
//   | "HAPPY"
//   | "SAD"
//   | "FRUSTRATED"
//   | "GRATEFUL"
//   | "ANGRY"
//   | "ANXIOUS";

// User model
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  isProfileVerified: boolean;
  feelingToday: string[];
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

// API response for getting all users
export interface GetAllUsersResponse {
  success: boolean;
  message: string;
  data: User[];
}



export interface Circle {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GetCirclesResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Circle[];
}