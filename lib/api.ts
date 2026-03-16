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

  const contentType = res.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return (await res.text()) as T;
  }

  return (await res.json()) as T;
}

export type Organization = { id: number; name?: string };
export type Post = { id: number; title?: string };
export type OrganizationEvent = {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
};
export type UserOrganizationBinding = { id: number };

export type GdprDeleteResult = boolean;


export const api = {
  // posts
  getPosts: () => request<Post[]>("/posts"),
  getPostsByOrganization: (organizationsId: number) =>
    request<Post[]>(`/posts/${organizationsId}`),

  // organizations
  getOrganizations: () => request<Organization[]>("/organizations"),
  getOrganizationById: (id: number) =>
    request<Organization>(`/organizations/${id}`),
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
  createOrganizationEvent: (event: OrganizationEvent) =>
    request<string>(
      `/OrganizationEvents?organizationEvent=${encodeURIComponent(JSON.stringify(event))}`,
      { method: "POST" }
    ),

  // GDPR
  deleteGdprByUserId: (userId: number) =>
    request<GdprDeleteResult>(`/GDPR/${userId}`, { method: "DELETE" }),
};