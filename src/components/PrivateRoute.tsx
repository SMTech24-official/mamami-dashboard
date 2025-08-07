// src/components/PrivateRoute.tsx
import { Navigate } from "react-router";
import { getAccessToken, getCurrentUser } from "../utils/auth";
import { isTokenValid } from "../utils/token";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isAdminUser = (user: any): boolean => {
  return user && ["ADMIN", "SUPER_ADMIN"].includes(user.role);
};

interface Props {
  children: React.ReactNode;
}

const PrivateRoute = ({ children }: Props) => {
  const accessToken = getAccessToken();
  const user = getCurrentUser();

  if (!accessToken || !isTokenValid(accessToken) || !user || !isAdminUser(user)) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
