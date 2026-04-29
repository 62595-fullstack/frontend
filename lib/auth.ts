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
