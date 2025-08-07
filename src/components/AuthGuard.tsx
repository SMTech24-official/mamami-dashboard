import { useEffect } from "react";
import {
  getAccessToken,
  getCurrentUser,
  getRefreshToken,
  logout,
} from "../utils/auth";
import { isTokenValid } from "../utils/token";

interface Props {
  children: React.ReactNode;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isUserValid = (user: any): boolean => {
  return (
    typeof user === "object" &&
    user?.id &&
    user?.email &&
    user?.name &&
    ["SUPER_ADMIN", "ADMIN", "USER"].includes(user.role)
  );
};

const AuthGuard = ({ children }: Props) => {
  const validateAuth = () => {
    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken();
    const user = getCurrentUser();

    if (
      !accessToken ||
      !refreshToken ||
      !user ||
      !isUserValid(user) ||
      !isTokenValid(accessToken)
    ) {
      logout();
    }
  };

  useEffect(() => {
    // Validate once on mount
    validateAuth();

    // Validate regularly every 5 seconds
    const interval = setInterval(() => {
      validateAuth();
    }, 5000); // every 5 seconds

    // Listen for localStorage changes from other tabs in the website
    const handleStorageChange = () => {
      validateAuth();
    };
    window.addEventListener("storage", handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return <>{children}</>;
};

export default AuthGuard;
