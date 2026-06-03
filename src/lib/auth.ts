import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export interface SessionUser {
  id: string;
  email: string;
  username: string;
}

export async function getSessionUser(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return null;

    const jwtSecret = process.env.JWT_SECRET || "fallback-secret-for-dev";
    const decoded = jwt.verify(token, jwtSecret) as { userId: string; email: string };

    if (!decoded.userId || !decoded.email) {
      return null;
    }

    const username = decoded.email.split("@")[0];

    return {
      id: decoded.userId,
      email: decoded.email,
      username,
    };
  } catch (error) {
    return null;
  }
}
