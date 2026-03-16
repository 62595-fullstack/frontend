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

  let data: unknown;

  if (contentType.includes("application/json")) {
    data = await res.json();
  } else {
    data = await res.text();
  }

  // Some backends return JSON as a string. Parse it if possible.
  if (typeof data === "string") {
    try {
      data = JSON.parse(data);
    } catch {
      // leave as plain text
    }
  }

  return data as T;
}

export type Organization = {
  id: number;
  name?: string;
};

export type Post = {
  id: number;
  title?: string;
  createdDate?: string;
  organizationId?: number;
  bodytext?: string;
};

export type OrganizationEvent = { id: number };
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

  // GDPR
  deleteGdprByUserId: (userId: number) =>
    request<GdprDeleteResult>(`/GDPR/${userId}`, { method: "DELETE" }),
};