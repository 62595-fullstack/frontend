import { cookies } from "next/headers";

export type CheckLoginResult = {
  isLoggedIn: boolean
  error?: unknown
}

export async function checkIfLoggedIn(): Promise<CheckLoginResult> {
  const cookieStore = await cookies()
  if (!cookieStore.has('token')) {
    return { isLoggedIn: false }
  }
  return { isLoggedIn: true }
}

// Returns true if the JWT is missing, malformed, or past its `exp`. A 401 from
// the backend only means the user's session is dead when this is true —
// otherwise the 401 is about the specific request (wrong password verify,
// missing role, etc.) and the session should be left alone.
export function isJwtExpired(token: string | undefined): boolean {
  if (!token) return true;
  const parts = token.split(".");
  if (parts.length !== 3) return true;
  try {
    const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = payload + "=".repeat((4 - (payload.length % 4)) % 4);
    const decoded = JSON.parse(Buffer.from(padded, "base64").toString("utf8"));
    if (typeof decoded.exp !== "number") return false;
    return decoded.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
}
