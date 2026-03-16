async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api/proxy${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  const contentType = res.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  const body = await res.text();

  if (!res.ok) {
    let message = `${res.status} ${res.statusText}`;
    if (body) {
      try {
        const parsed = JSON.parse(body);
        // ASP.NET Core ProblemDetails
        if (parsed?.detail) message = parsed.detail;
        else if (parsed?.title) message = parsed.title;
        // Plain JSON string e.g. "Organization with ID 15 does not exist."
        else if (typeof parsed === "string") message = parsed;
        else message = body;
      } catch {
        message = body;
      }
    }
    throw new Error(message);
  }

  if (!body) return undefined as T;
  if (!isJson) return body as T;
  return JSON.parse(body) as T;
}

export type Organization = { id: number; name: string; description: string };
export type Post = { id: number; title?: string };
export type OrganizationEvent = {
  id: number;
  organizationId: number;
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
  createOrganization: (org: { name: string; description: string }) =>
    request<string>(`/organizations`, {
      method: "POST",
      body: JSON.stringify({ id: 0, name: org.name, description: org.description, createdDate: new Date().toISOString() }),
    }),
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
    request<string>(`/OrganizationEvents`, {
      method: "POST",
      body: JSON.stringify(event),
    }),

  // GDPR
  deleteGdprByUserId: (userId: number) =>
    request<GdprDeleteResult>(`/GDPR/${userId}`, { method: "DELETE" }),
};