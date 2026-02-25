const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

if (!API_BASE) {
  throw new Error(
    "NEXT_PUBLIC_API_BASE is not defined. Check your .env.local file."
  );
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${res.statusText}: ${text}`);
  }

  return res.json() as Promise<T>;
}

export type User = {
  id: number;
  email: string;
  username: string;
};

export const usersApi = {
  getAll: () => request<User[]>("/users"),
  getByEmail: (email: string) =>
    request<User>(`/users/by-email/${encodeURIComponent(email)}`),
  getByUsername: (username: string) =>
    request<User>(`/users/by-username/${encodeURIComponent(username)}`),
  create: (user: Omit<User, "id">) =>
    request<User>("/users", {
      method: "POST",
      body: JSON.stringify(user),
    }),
};