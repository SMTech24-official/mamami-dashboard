/* eslint-disable @typescript-eslint/no-explicit-any */

import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  exp: number; // Expiry timestamp (in seconds)
  iat?: number;
  [key: string]: any;
}

export const isTokenValid = (token: string): boolean => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    if (!decoded.exp) return false;

    const currentTime = Date.now() / 1000; // in seconds
    // console.log(decoded);
    return decoded.exp > currentTime;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return false; // Invalid JWT structure
  }
};
