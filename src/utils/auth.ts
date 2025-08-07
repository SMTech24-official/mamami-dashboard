export const getAccessToken = (): string | null => {
  return localStorage.getItem("accessToken");
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem("refreshToken");
};

// Get current user details from localStorage
// Returns null if user data is not available
export const getCurrentUser = (): {
  email: string;
  id: string;
  name: string;
  role: "SUPER_ADMIN" | "ADMIN" | "USER";
} | null => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

// Get all users from the API
// Returns a promise that resolves to GetAllUsersResponse
// export const getAllUsers = async (): Promise<GetAllUsersResponse> => {
//   const res = await axios.get<GetAllUsersResponse>(
//     "http://172.252.13.69:1007/api/v1/admin/users",
//     {
//       headers: {
//         Authorization: `Bearer ${getAccessToken()}`,
//       },
//     }
//   );
//   return res.data;
// };

export const isAuthenticated = (): boolean => {
  return !!getAccessToken();
};

export const logout = (): void => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
  window.location.href = "/login"; // Force full page reload
};
