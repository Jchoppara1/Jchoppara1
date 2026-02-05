import { cookies } from "next/headers";
import { sign, verify } from "jsonwebtoken";

const JWT_SECRET = process.env.SESSION_SECRET || "default-session-secret-change-in-production";
const SESSION_COOKIE = "admin_session";
const SESSION_EXPIRY = 60 * 60 * 24; // 24 hours

export interface AdminSession {
  adminId: string;
  email: string;
}

export async function createSession(adminId: string, email: string): Promise<string> {
  const token = sign(
    { adminId, email } as AdminSession,
    JWT_SECRET,
    { expiresIn: SESSION_EXPIRY }
  );
  
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_EXPIRY,
    path: "/",
  });
  
  return token;
}

export async function verifySession(): Promise<AdminSession | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    
    if (!token) {
      return null;
    }
    
    const decoded = verify(token, JWT_SECRET) as AdminSession;
    return decoded;
  } catch {
    return null;
  }
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function requireAuth(): Promise<AdminSession> {
  const session = await verifySession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}
