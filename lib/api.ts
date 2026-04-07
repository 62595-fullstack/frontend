export const API_BASE = process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, '');

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api/proxy${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

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
  try { return JSON.parse(body) as T; } catch { return body as T; }
}

export type Organization = { id: number; name: string; description: string };

export type Post = {
  id: number;
  title?: string;
  createdDate?: string;
  organizationId?: number;
  bodytext?: string;
};
export type Attachment = {
  id?: number;
  fileName: string;
  fileType: string;
  content: string; // base64-encoded binary
  createdDate?: string;
};

export type OrganizationEvent = {
  id: number;
  organizationId: number;
  userOrganizationBindingId: number;
  title: string;
  description: string;
  attachment: Attachment | null;
  createdDate?: string;
  startDate?: string;
  ageLimit?: number;
  creatorName?: string;
};
export type UserOrganizationBinding = { id: number };
export type GdprDeleteResult = boolean;

type RawPost = {
  Id?: number;
  Title?: string;
  BodyText?: string;
  CreatedDate?: string;
  OrganizationId?: number;
  OrganizationEventId?: number;
};

type RawPostsEnvelope = {
  Result?: RawPost[] | string;
};

function normalizePost(raw: RawPost): Post {
  return {
    id: raw.Id ?? 0,
    title: raw.Title ?? "",
    createdDate: raw.CreatedDate ?? "",
    organizationId: raw.OrganizationId ?? raw.OrganizationEventId ?? 0,
    bodytext: raw.BodyText ?? "",
  };
}

function parsePostsResponse(data: unknown): Post[] {
  let payload = data;

  // If whole payload is stringified JSON
  if (typeof payload === "string") {
    try {
      payload = JSON.parse(payload);
    } catch {
      return [];
    }
  }

  // Case 1: direct array
  if (Array.isArray(payload)) {
    return payload.map((item) => normalizePost(item as RawPost));
  }

  // Case 2: { Result: [...] } or { Result: "..." }
  if (payload && typeof payload === "object" && "Result" in payload) {
    let result = (payload as RawPostsEnvelope).Result;

    if (typeof result === "string") {
      try {
        result = JSON.parse(result);
      } catch {
        return [];
      }
    }

    if (Array.isArray(result)) {
      return result.map((item) => normalizePost(item as RawPost));
    }
  }

  return [];
}

export const api = {
  // posts
  getPosts: async (): Promise<Post[]> => {
    const data = await request<unknown>("/posts");
    return parsePostsResponse(data);
  },

  getPostsByOrganization: async (organizationsId: number): Promise<Post[]> => {
    const data = await request<unknown>(`/posts/${organizationsId}`);
    return parsePostsResponse(data);
  },

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
  getUserOrganizationBindingForCurrentUser: (organizationId: number) =>
    request<UserOrganizationBinding>(
      `/UserOrganizationBinding/${organizationId}/me`
    ),

  // events
  getOrganizationEvents: (organizationId: number) =>
    request<OrganizationEvent[]>(`/OrganizationEvents/${organizationId}`),
  createOrganizationEvent: (event: OrganizationEvent) =>
    request<string>(`/OrganizationEvents`, {
      method: "POST",
      body: JSON.stringify(event),
    }),
  deleteOrganizationEvent: (id: number) =>
    request<void>(`/OrganizationEvents/${id}`, { method: "DELETE" }),

  // GDPR
  deleteGdprByUserId: (userId: number) =>
    request<GdprDeleteResult>(`/GDPR/${userId}`, { method: "DELETE" }),
};

export async function getEventById(eventId: number): Promise<OrganizationEvent | null> {
  return request<OrganizationEvent | null>(`/OrganizationEvents/event/${eventId}`);
}