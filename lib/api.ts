async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api/proxy${path}`, {
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

  return (await res.json()) as T;
}

// ---- Minimal types (replace with real fields later) ----
export type Organization = { id: number; name?: string };
export type Post = { id: number; title?: string };
export type OrganizationEvent = { id: number };
export type UserOrganizationBinding = { id: number };

// ---- API surface matching your backend routes ----
export const api = {
  // posts
  getPosts: () => request<Post[]>("/posts"),
  getPostsByOrganization: (organizationId: number) =>
    request<Post[]>(`/posts/${organizationId}`),

  // organizations
  getOrganizations: () => request<Organization[]>("/organizations"),
  getOrganizationById: (id: number) => request<Organization>(`/organizations/${id}`),
  deleteOrganization: (id: number) =>
    request<boolean>(`/organizations/${id}`, { method: "DELETE" }),

  // bindings
  getUserOrganizationBindings: (organizationId: number) =>
    request<UserOrganizationBinding[]>(
      `/UserOrganizationBinding/${organizationId}`
    ),

  // events
  getOrganizationEvents: (organizationId: number) =>
    request<OrganizationEvent[]>(`/OrganizationEvents/${organizationId}`),
};