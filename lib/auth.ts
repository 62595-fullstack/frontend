import { cookies } from "next/headers";
import { todo } from "node:test";

export type CheckLoginResult = {
  isLoggedIn: boolean
  user?: Promise<void> // Skal senere være en "User" type som vi definerer
  error?: unknown
}

export async function checkIfLoggedIn(): Promise<CheckLoginResult> {
  const cookieStore = await cookies()
  if (!cookieStore.has('JSESSIONID') || !cookieStore.has('XSRF-TOKEN')) {
    return { isLoggedIn: false }
  }

  try {
    const user = todo()
    return { isLoggedIn: true, user }
  } catch (err) {
    return { isLoggedIn: false, error: err }
  }
}
